import { BigNumber, BigNumberish, Wallet } from 'ethers';
import { delay, pick, range } from '../utils';
import create from 'zustand';
import shallow from 'zustand/shallow';
import { persist } from 'zustand/middleware';
import contract from '@/contract';
import { GameType, PlayStrategy, TxSpeed, useStrategyStore } from './strategy';
import { useWalletStore } from './wallet';
import { parseUnits } from 'ethers/lib/utils';
import config from '@/config';

export interface RunnerState {
  // odds every round
  radios: number[];
  status: RunnerStatus;
  loopIndex: number;
  roundIndex: number;
  loops: Loop[];
  bets: {
    [loopIndex: number]: {
      [betIndex: number]: Bet;
    };
  };
  start(): Promise<void>;
  pause(): Promise<void>;
}

export interface Bet {
  // 0: pendding, 1: runing; 2: complete
  status: 0 | 1 | 2;
  round: number;
  type?: GameType;
  option: number[];
  tx?: string;
  result?: {
    [key: string]: any;
    blockNumber: number;
    hash: string;
    winNum: number;
    isWin: boolean;
    /** let token bonus */
    lAmount: BigNumber;
    /** bet token bonus */
    bAmount: BigNumber;
    round: number;
  };
  gasPrice?: BigNumber;
  gasUsed?: BigNumber;
}

export interface Loop {
  type: GameType;
  // bet amount
  amount: BigNumberish;
}

export enum RunnerStatus {
  pending = 0,
  running = 1,
  pausing = 2,
}

function gwei(num: number) {
  return parseUnits(Math.ceil(num).toString(), 'gwei');
}

const STORE_KEY = 'runner';

const storeFunc = (set: any, get: any) => {
  useStrategyStore.subscribe((s, ps) => {
    if (s.strategy && !shallow(s.strategy, ps.strategy)) {
      init(s.strategy);
    }
  });

  useWalletStore.subscribe((curr, prev) => {
    if (prev.wallet && !curr.wallet) {
      set({
        loopIndex: 0,
        roundIndex: 0,
        loops: [],
        status: RunnerStatus.pending,
        bets: {},
      });
      localStorage.removeItem(STORE_KEY);
    }
  });

  function init(strategy: PlayStrategy) {
    set({
      loopIndex: 0,
      roundIndex: 0,
      loops: getLoopsFromStrategy(strategy),
      bets: {},
    });
  }

  const loops = getLoopsFromStrategy(useStrategyStore.getState().strategy);

  const overrides = {
    gasLimit: 4000000,
    maxFeePerGas: gwei(40),
    maxPriorityFeePerGas: gwei(10),
  };

  function createRunTx(speed = TxSpeed.mid) {
    return async function runTx(name: string, mth: any, ...args: any[]) {
      const gd = await getGasData();
      if (gd) {
        const gases = gd[speed];
        Object.assign(overrides, {
          maxFeePerGas: gwei(gases.maxFee),
          maxPriorityFeePerGas: gwei(gases.maxPriorityFee),
        });
      }
      const tx = await mth(...args, overrides);
      const res = await tx.wait();
      return res;
    };
  }

  async function approve(
    runTx: any,
    ownerAddress: string,
    usdt: any,
    luckygame: any,
    needed: BigNumber
  ) {
    const allowance = await usdt.allowance(ownerAddress, luckygame.address);
    if (allowance.lt(needed)) {
      return runTx(
        'usdt.approve',
        usdt.approve,
        luckygame.address,
        needed.mul(10)
      );
    }
  }

  async function checkLastBet({ get, luckygame, wallet, runTx }: any) {
    const { loopIndex, roundIndex } = get();
    if (loopIndex == 0 && roundIndex == 0) {
      const lastBet = await runWaitTooLong(
        luckygame.getUserInfo,
        wallet.address
      );
      if (
        lastBet.quser.typeGame !== 0 &&
        lastBet.quser.isWin &&
        !lastBet.quser.isClaim
      ) {
        await runTx('luckygame.claim', luckygame.claim);
      }
    }
  }

  return {
    loopIndex: 0,
    roundIndex: 0,
    loops,
    gasStation: {
      fast: { maxFee: 0, maxPriorityFee: 0 },
      safeLow: { maxFee: 0, maxPriorityFee: 0 },
      standard: { maxFee: 0, maxPriorityFee: 0 },
    },
    bets: {},
    // decimals 4
    radios: [7500, 9000, 9300, 9650, 9900],
    status: RunnerStatus.pending,
    async start() {
      try {
        set({ status: RunnerStatus.running });

        const wallet: Wallet = useWalletStore.getState().wallet as any;
        if (!wallet._isSigner) {
          throw 'no signer';
        }
        const { strategy } = useStrategyStore.getState();
        if (!strategy) throw `no strategy`;

        const luckygame = contract.luckyGame.connect(wallet);
        const usdt = contract.usdt.connect(wallet);
        const loops = get().loops;
        let loopIndex = get().loopIndex;
        if (loopIndex >= loops.length) {
          init(strategy);
        }
        const runTx = createRunTx(strategy.speed);

        await checkLastBet({
          get,
          wallet,
          luckygame,
          runTx,
        });

        const maxAmount = useStrategyStore.getState().maxBetAmount;

        const neededAllowance = maxAmount.mul(loops.length);
        await approve(runTx, wallet.address, usdt, luckygame, neededAllowance);

        while (loopIndex < loops.length) {
          const loop = loops[loopIndex];

          let roundIndex = get().roundIndex;

          while (roundIndex < 5) {
            if (get().status !== RunnerStatus.running) {
              set({ status: RunnerStatus.pending });
              return;
            }

            const option = getRandomOptionByGameType(loop.type);
            let currentBets = get().bets;

            set({
              bets: {
                ...currentBets,
                [loopIndex]: {
                  ...currentBets[loopIndex],
                  [roundIndex]: {
                    round: roundIndex + 1,
                    status: 1,
                    option,
                  },
                },
              },
            });

            let res: any;
            if (roundIndex == 0) {
              res = await runTx(
                'luckygame.bet',
                luckygame.bet,
                loop.amount,
                loop.type,
                option
              );
            } else {
              res = await runTx(
                'luckygame.betNextRound',
                luckygame.betNextRound,
                loop.type,
                option
              );
            }
            await waitForNextBlock(res.blockNumber);
            const userInfo = await runWaitTooLong(
              luckygame.getUserInfo,
              wallet.address
            );

            currentBets = get().bets;
            set({
              bets: {
                ...currentBets,
                [loopIndex]: {
                  ...currentBets[loopIndex],
                  [roundIndex]: {
                    ...currentBets[loopIndex][roundIndex],
                    tx: res.transactionHash,
                    status: 2,
                    result: {
                      ...pick(
                        userInfo.quser,
                        'amount',
                        'bAmount',
                        'blockNum',
                        'hash',
                        'isClaim',
                        'isWin',
                        'lAmount',
                        'oNum',
                        'paid',
                        'round',
                        'size',
                        'typeGame',
                        'winNum'
                      ),
                      winNum: userInfo.quser.winNum.toNumber(),
                    },
                    gasPrice: res.effectiveGasPrice,
                    gasUsed: res.gasUsed,
                  },
                },
              } as any,
            });

            roundIndex++;

            if (!userInfo.quser.isWin) {
              set({ roundIndex: 0 });
              break;
            } else {
              if (roundIndex >= strategy.claimRound) {
                await runTx('luckygame.claim', luckygame.claim);
                window.notify(
                  `Bouns issued with ${strategy.claimRound} rounds won`,
                  {
                    variant: 'success',
                  }
                );
                set({ roundIndex: 0 });
                break;
              } else {
                set({ roundIndex });
              }
            }
          }
          loopIndex++;
          set({ loopIndex });
        }
      } finally {
        set({ status: RunnerStatus.pending });
      }
    },
    async pause() {
      const curr = get().status;
      if (curr !== RunnerStatus.running) return;
      set({ status: RunnerStatus.pausing });
    },
    async loadInfo() {
      await delay(Math.random() * 5 * 1000);
      const radios = await Promise.all(
        range(5).map((i) =>
          contract.luckyGame.radio(i + 1).then((v) => v.toNumber())
        )
      );
      set({ radios });
    },
  };
};

function desBigNumbers(obj: any) {
  for (const key in obj) {
    const val = obj[key];
    if (val.type === 'BigNumber') {
      obj[key] = BigNumber.from(val.hex);
    } else if ('object' === typeof val) {
      obj[key] = desBigNumbers(val);
    }
  }
  return obj;
}

export const useRunnerStore = create<RunnerState>(
  persist(storeFunc as any, {
    name: STORE_KEY,
    serialize: (s: any) => {
      delete s.state.status;
      return JSON.stringify(s);
    },
    deserialize: function deserialize(str: string) {
      const out = JSON.parse(str);
      out.state.bets = desBigNumbers(out.state.bets);
      return out;
    },
  }) as any
);

async function runWaitTooLong<T extends (...args: any) => any>(
  func: T,
  ...args: any[]
): Promise<ReturnType<T>> {
  let i = 0;
  while (i++ < 5) {
    try {
      const tx = await func(...args);
      if (tx.wait) {
        const res = await tx.wait();
        return res;
      } else {
        return tx;
      }
    } catch (err) {
      const msg = (err as any).message || '';
      if (msg.match(/too long/)) {
        await delay(i * 5000);
      } else {
        throw err;
      }
    }
  }
  throw new Error('overtime');
}

function getLoopsFromStrategy(strategy?: PlayStrategy) {
  if (strategy) {
    return range(strategy.loops).map((i) => ({
      type: strategy.type,
      amount: strategy.amount,
    }));
  }
  return [];
}

function getRandomOptionByGameType(type: GameType) {
  switch (type) {
    case GameType.bigSmall:
      const option = range(8);
      return Math.random() < 0.5 ? option : option.map((i) => i + 8);
    case GameType.oddEven:
      const opt2 = range(8).map((i) => i * 2);
      return Math.random() < 0.5 ? opt2 : opt2.map((i) => i + 1);
    case GameType.random:
      // pick 10 in 16
      return pickList(10, 16);
    default:
      throw `unimplement type:${GameType[type]}`;
  }
}

function pickList(fact: number, base: number) {
  const all = range(base);
  if (fact >= base) return all;
  const selectCount = fact < base / 2 ? fact : base - fact;
  const select: number[] = [];
  for (let i = 0; i < selectCount; i++) {
    const idx = Math.floor(all.length * Math.random());
    select.push(all[idx]);
    all.splice(idx, 1);
  }
  const out = fact < base / 2 ? select : all;
  if (out.length !== fact) throw 'pick list length invalid';
  return out;
}

async function waitForNextBlock(bln: number) {
  while (true) {
    await delay(process.env.NODE_ENV === 'development' ? 3000 : 6000);
    try {
      const blocknumber = await contract.provider.getBlockNumber();
      if (bln < blocknumber) return blocknumber;
    } catch {
      // do nothing, just skip it
    }
  }
}

async function getGasData() {
  if (config.defaultNetwork.match(/polygon/)) {
    const resp = await fetch(`https://gasstation-mainnet.matic.network/v2`);
    return resp.json();
  }
}
