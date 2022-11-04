require('dotenv').config();

export default {
  brand: 'BetBOOM Robot',
  defaultNetwork:
    process.env.NODE_ENV === 'development' ? 'polygon_test' : 'polygon',
  networks: {
    polygon: {
      rpc: 'https://polygon-rpc.com',
      chain: 137,
      symbol: 'MATIC',
      explorer: 'https://polygonscan.com',
      addresses: {
        luckygame: '0x4b0E4c1ae1f75Ee076d6ceE739a848A88bd94419',
        usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        nftPool: '0x39194e1e5B54983e343Cc8C938cC2472d22eCED0',
        boomUsdt: '0xAc9eC8dcca5F52Ce4c8266444b0033bEBb474D21',
        betUsdt: '0xd9d16a9aBFc254112e18dBE1ea761F4b4Eb233e3',
      },
    },
    polygon_test: {
      rpc: 'https://polygon-rpc.com',
      chainId: 137,
      explorer: 'https://polygonscan.com',
      symbol: 'MATIC',
      addresses: {
        luckygame: '0x74FAD53598a98B95e9C2EA081B880c7E8192D901',
        usdt: '0x8f50296220417f6E159092248993e225a6c495eD',
        nftPool: '0x087B9787CaE6DE227beA3A3fb3c939E7c953DEA7',
        boomUsdt: '0xe66942367728e3F65600CCFF1e453281Be51913E',
        betUsdt: '0x5aEA215E32bb25977Ee0A31a96014caccA835B85',
      },
    },
    local: {
      rpc: 'http://127.0.0.1:8545',
      chainId: 31337,
      symbol: 'tMATIC',
      explorer: 'https://goerli.etherscan.io',
      addresses: {
        usdt: process.env.USDT_ADDR,
        luckygame: process.env.LUCY_GAME_ADDR,
        nftPool: process.env.NFT_POOL_ADDR,
        boomUsdt: process.env.BOOM_USDT_ADDR,
        betUsdt: process.env.BET_USDT_ADDR,
      },
    },
  },
};
