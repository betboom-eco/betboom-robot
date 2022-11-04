import { Contract, providers, Wallet } from 'ethers';
import config from '@/config';
import { LuckyGame } from './types/LuckyGame';
import { ERC20 } from './types/ERC20';
import { catchable } from '@/utils/catchable';
import { NFTPool } from './types/NFTPool';
import { IUniswapV2Pair } from './types/IUniswapV2Pair';

function buildContract() {
  const { network } = config;
  const abi = require('./abi/LuckyGame.json');
  const erc20abi = require('./abi/ERC20.json');
  const nftPoolAbi = require('./abi/NFTPool.json');
  const pairAbi = require('./abi/IUniswapV2Pair.json');

  let provider: any;
  let luckygame: LuckyGame;
  let usdt: ERC20;
  let nftPool: NFTPool;
  let betUsdt: IUniswapV2Pair;
  let boomUsdt: IUniswapV2Pair;

  const changeRpcUrl = catchable((url: string) => {
    if (url) {
      provider = new providers.JsonRpcBatchProvider(url);
    } else {
      provider = providers.getDefaultProvider(config.defaultNetwork);
    }
    luckygame = new Contract(network.addresses.luckygame, abi, provider) as any;
    usdt = new Contract(network.addresses.usdt, erc20abi, provider) as any;
    nftPool = new Contract(
      network.addresses.nftPool,
      nftPoolAbi,
      provider
    ) as any;
    betUsdt = new Contract(network.addresses.betUsdt, pairAbi, provider) as any;
    boomUsdt = new Contract(
      network.addresses.boomUsdt,
      pairAbi,
      provider
    ) as any;
  });

  changeRpcUrl(network.rpc);

  return {
    provider,
    luckyGame: luckygame!,
    usdt: usdt!,
    changeRpcUrl,
    nftPool: nftPool!,
    betUsdt: betUsdt!,
    boomUsdt: boomUsdt!,
  };
}

export default buildContract();
