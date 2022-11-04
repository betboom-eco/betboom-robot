import { BigNumber, ethers } from 'ethers';
import create from 'zustand';
import contract from '@/contract';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import * as msgs from '@/messages';
import { useWalletStore } from './wallet';

export enum GameType {
  bigSmall = 1,
  oddEven = 2,
  // 10/16
  random = 3,
}

export enum TxSpeed {
  slow = 'safeLow',
  fast = 'fast',
  mid = 'standard',
}

export function getMessageForTxSpeed($t: any, speed?: TxSpeed) {
  switch (speed) {
    case TxSpeed.slow:
      return $t(msgs.strategy.speedSlow);
    case TxSpeed.fast:
      return $t(msgs.strategy.speedFast);
    case TxSpeed.mid:
    default:
      return $t(msgs.strategy.speedStandard);
  }
}

export function getMessageForGemeType($t: any, type: GameType) {
  switch (type) {
    case GameType.oddEven:
      return $t(msgs.strategy.randomOddOrEven);
    case GameType.random:
      return $t(msgs.strategy.randomPickTenInSixteen);
    case GameType.bigSmall:
    default:
      return $t(msgs.strategy.randomBigOrSmall);
  }
}

export type PlayStrategy = {
  type: GameType;
  amount: BigNumber;
  loops: number;
  speed?: TxSpeed;
  claimRound: 1 | 2 | 3 | 4 | 5;
};

type PlanState = {
  strategy?: PlayStrategy;
  setStrategy(s: PlayStrategy): void;
  minBetAmount: BigNumber;
  maxBetAmount: BigNumber;
};

const STORE_KEY = 'stra';

export const useStrategyStore = create<PlanState>((set, get) => {
  let strategy;
  let str = localStorage.getItem(STORE_KEY);
  if (str?.startsWith('{')) {
    strategy = JSON.parse(str);
  }

  useWalletStore.subscribe((curr, prev) => {
    if (prev.wallet && !curr.wallet) {
      set({ strategy: undefined });
      localStorage.removeItem(STORE_KEY);
    }
  });

  async function loadMinMaxAmount() {
    const [min, max] = await Promise.all([
      contract.luckyGame.minBetAmount(),
      contract.luckyGame.maxBetAmount(),
    ]);

    const { minBetAmount, maxBetAmount } = get();
    if (!min.eq(minBetAmount) || !max.eq(maxBetAmount)) {
      set({ minBetAmount: min, maxBetAmount: max });
    }
  }

  loadMinMaxAmount();

  return {
    strategy,
    minBetAmount: parseUnits('1', 6),
    maxBetAmount: parseUnits('50', 6),
    setStrategy(strategy: PlayStrategy) {
      localStorage.setItem(STORE_KEY, JSON.stringify(strategy));
      set({ strategy });
    },
  };
});
