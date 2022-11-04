import create from 'zustand';
import { BigNumber, constants, Wallet } from 'ethers';
import contract from '@/contract';
import { catchable } from '@/utils/catchable';
import config from '@/config';
import { IUniswapV2Pair } from 'contract/types/IUniswapV2Pair';
import { formatEther, formatUnits } from 'ethers/lib/utils';

const { Zero } = constants;

function createWallet(pk: string) {
  // const provider = new ethers.providers.JsonRpcProvider(config.network.rpc);
  return new Wallet(pk as string, contract.provider);
}

const PK_STORE_KEY = 'pk';
const USER_TOKEN_ID_KEY = 'utid';

export interface WalletState {
  wallet?: Wallet;
  betPrice: number;
  boomPrice: number;
  // balances
  assets: {
    eth: BigNumber;
    usdt: BigNumber;
    boom: BigNumber;
    bet: BigNumber;
  };
  feeData: {
    gasPrice: BigNumber;
    lastBaseFeePerGas: BigNumber;
    maxFeePerGas: BigNumber;
    maxPriorityFeePerGas: BigNumber;
  };
  setPrivateKey(pk?: string): void;
  loadBalance(): Promise<void>;
  loadFeeData(): Promise<void>;
  balanceLoading: boolean;
}

let timer: any;

export const useWalletStore = create<WalletState>((set, get) => {
  let wallet: Wallet | undefined;

  let userTokenId: BigNumber | undefined;
  const _utid = localStorage.getItem(USER_TOKEN_ID_KEY);
  if (_utid?.startsWith('0x')) {
    userTokenId = BigNumber.from(_utid);
  }

  const pk = localStorage.getItem(PK_STORE_KEY);

  if (pk) {
    wallet = createWallet(pk);
  }

  if (timer) {
    clearInterval(timer);
  }

  async function loadFeeData() {
    const fd = await contract.provider.getFeeData();
    set({
      feeData: {
        gasPrice: fd.gasPrice || Zero,
        lastBaseFeePerGas: fd.lastBaseFeePerGas || Zero,
        maxFeePerGas: fd.maxFeePerGas || Zero,
        maxPriorityFeePerGas: fd.maxPriorityFeePerGas || Zero,
      },
    });
  }

  const loadBalance = catchable(async function loadBalance() {
    const wallet = get()?.wallet;
    if (wallet) {
      set({ balanceLoading: true });
      try {
        const [eb, ub, usrInfo] = await Promise.all([
          wallet.getBalance(),
          contract.usdt.balanceOf(wallet.address),
          contract.nftPool.userInfo(wallet.address),
        ]);
        set({
          assets: {
            eth: eb,
            usdt: ub,
            bet: usrInfo.amount,
            boom: usrInfo.letAmount,
          },
        });
      } finally {
        set({ balanceLoading: false });
      }
    }
  });

  const loadPricesFromUniswap = catchable(async function () {
    const [betPrice, boomPrice] = await Promise.all([
      loadPriceByPairContarct(contract.betUsdt),
      loadPriceByPairContarct(contract.boomUsdt),
    ]);

    const price = {
      betPrice,
      boomPrice,
    };

    set(price);
  });

  async function loadPriceByPairContarct(contract: IUniswapV2Pair) {
    const [reserves, token0] = await Promise.all([
      contract.getReserves(),
      contract.token0(),
    ]);

    const [token, usdt] =
      config.network.addresses.usdt.toLowerCase() == token0.toLowerCase()
        ? [reserves.reserve1, reserves.reserve0]
        : [reserves.reserve0, reserves.reserve1];

    if (token.eq(Zero)) {
      return 0;
    } else {
      return Number(formatUnits(usdt, 6)) / Number(formatEther(token));
    }
  }

  async function getUserTokenId(address: string) {
    if (!userTokenId) {
      const _utid = await contract.nftPool.userToTokenID(address);
      if (_utid) {
        localStorage.setItem(USER_TOKEN_ID_KEY, _utid._hex);
        userTokenId = _utid;
      }
    }
    return userTokenId;
  }

  loadFeeData();
  loadBalance();

  return {
    wallet,
    betPrice: 0,
    boomPrice: 0,
    assets: {
      eth: Zero,
      usdt: Zero,
      boom: Zero,
      bet: Zero,
    },
    feeData: {
      gasPrice: Zero,
      lastBaseFeePerGas: Zero,
      maxFeePerGas: Zero,
      maxPriorityFeePerGas: Zero,
    },
    loadFeeData,
    loadBalance,
    loadPricesFromUniswap,
    balanceLoading: false,
    setPrivateKey(pk?: string) {
      if (pk) {
        const wallet = createWallet(pk);
        set({ wallet });
        localStorage.setItem(PK_STORE_KEY, pk);
        loadBalance();
      } else {
        set({ wallet: undefined });
        localStorage.removeItem(PK_STORE_KEY);
        localStorage.removeItem(USER_TOKEN_ID_KEY);
      }
    },
  };
});
