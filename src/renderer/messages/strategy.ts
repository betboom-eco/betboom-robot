import { defineMessages } from 'react-intl';

export default defineMessages({
  myStrategy: {
    id: 'strategy.myStrategy',
    defaultMessage: 'My strategy',
    description: '我的策略',
  },
  strategy: {
    id: 'strategy.strategy',
    defaultMessage: 'Strategy',
    description: '策略',
  },
  createStrategy: {
    id: 'strategy.createStrategy',
    defaultMessage: 'Create Your strategy',
    description: '创建策略',
  },
  createStrategyHint: {
    id: 'strategy.createStrategyHint',
    defaultMessage:
      'Please create your own strategy to bet the amount in your wallet multiple times. That will choose to continue betting every time you win, which will maximize your mining income.',
    description:
      '请创建自己的策略，将钱包中的金额分多次进行投注，并且每次赢了选择继续下注，将会使您的挖矿收益最大化。',
  },
  updateStrategySuccess: {
    id: 'strategy.updateStrategySuccess',
    defaultMessage: 'Successfully updated the strategy',
    description: '更新策略成功',
  },
  gameType: {
    id: 'strategy.gameType',
    defaultMessage: 'Gameplay',
    description: '玩法',
  },
  claimOnRoundHint: {
    id: 'strategy.claimOnRoundHint',
    defaultMessage: 'Round for Withdrawal',
    description: '提现轮次',
  },
  claimOnRound: {
    id: 'strategy.claimOnRound',
    defaultMessage: 'Withdraw Tokens After Winning the {round} Round',
    description: '赢{round}轮提现',
  },
  continueNextRoundOnWin: {
    id: 'strategy.continueNextRoundOnWin',
    defaultMessage: 'Continue to the next round every time you win',
    description: '每次获胜继续下一轮',
  },
  betAmount: {
    id: 'strategy.betAmount',
    defaultMessage: 'Betting amount',
    description: '投注金额',
  },
  betTimes: {
    id: 'strategy.betTimes',
    defaultMessage: 'Number of Betting Times',
    description: '投注次数',
  },
  atLeastToBet: {
    id: 'strategy.atLeastToBet',
    defaultMessage: 'not less then {value} to bet',
    description: '最少{value}起投',
  },
  shouldNotGreatThanValue: {
    id: 'strategy.shouldNotGreatThanValue',
    defaultMessage: `maximum {value}`,
    description: '最大{value}',
  },
  inputAmountEveryBet: {
    id: 'strategy.inputAmountEveryBet',
    defaultMessage: 'Please enter the amount of each bet',
    description: '请输入每次投注金额',
  },
  transactionSpeed: {
    id: 'strategy.transactionSpeed',
    defaultMessage: 'Transaction speed',
    description: '交易速度',
  },
  moreFastMoreExpensive: {
    id: 'strategy.moreFastMoreExpensive',
    defaultMessage: 'The faster the processing, the higher the gas fee',
    description: '处理越快，Gas费越高',
  },
  saveStrategy: {
    id: 'strategy.confirmCreateStrategy',
    defaultMessage: 'Save Strategy',
    description: '保存策略',
  },
  randomBigOrSmall: {
    id: 'strategy.randomBigOrSmall',
    defaultMessage: 'Random number - "Big or Small"',
    description: '随机大小',
  },
  randomOddOrEven: {
    id: 'strategy.randomOddOrEven',
    defaultMessage: 'Random odd or even number - "Odd or Even"',
    description: '随机单双',
  },
  randomPickTenInSixteen: {
    id: 'strategy.randomPickTenInSixteen',
    defaultMessage: 'Random 10 out of 16 Numbers - "Lucky Hash"',
    description: '随机16选10',
  },
  speedSlow: {
    id: 'strategy.speedSlow',
    defaultMessage: 'Slow',
    description: '慢速',
  },
  speedStandard: {
    id: 'strategy.speedStandard',
    defaultMessage: 'Standard',
    description: '正常',
  },
  speedFast: {
    id: 'strategy.speedFast',
    defaultMessage: 'Fast',
    description: '快速',
  },
  instruction: {
    id: 'strategy.instruction',
    defaultMessage: 'Note',
    description: '说明',
  },
  instructionDesc1: {
    id: 'strategy.instructionDesc1',
    defaultMessage:
      '1. After the strategy is executed, bets will continue to be placed according to the strategy, until the set number of betting times is reached.',
    description: '1.普通策略将根据策略方案持续投注，直至达到投注次数上限停止；',
  },
  instructionDesc2: {
    id: 'strategy.instructionDesc2',
    defaultMessage:
      '2. Reasonably allocate the wallet amount for multiple bets, which will maximize your mining income.',
    description: '2.合理分配钱包金额进行多次投注，将会使您的挖矿收益最大化。',
  },
  strategyLogs: {
    id: 'strategy.strategyLogs',
    defaultMessage: 'Strategy history',
    description: '策略记录',
  },
  startStrategy: {
    id: 'strategy.startStrategy',
    defaultMessage: 'Start strategy',
    description: '开始策略',
  },
  betContent: {
    id: 'strategy.betContent',
    defaultMessage: 'Betting content',
    description: '投注内容',
  },
  odds: {
    id: 'strategy.odds',
    defaultMessage: 'Odds',
    description: '赔率',
  },
  continueStrategy: {
    id: 'strategy.continueStrategy',
    defaultMessage: 'Continue strategy',
    description: '继续策略',
  },
  pausing: {
    id: 'strategy.pausing',
    defaultMessage: 'Stopping',
    description: '正在停止',
  },
  pause: {
    id: 'strategy.pause',
    defaultMessage: 'Pause strategy',
    description: '暂停策略',
  },
  restart: {
    id: 'strategy.restart',
    defaultMessage: 'Restart',
    description: '重新开始',
  },
  finished: {
    id: 'strategy.finished',
    defaultMessage: 'Completed',
    description: '已完成',
  },
  executeStatus: {
    id: 'strategy.executeStatus',
    defaultMessage: 'Current running: ',
    description: '当前运行：',
  },
  blockNumber: {
    id: 'strategy.blockNumber',
    defaultMessage: 'Block number',
    description: '区块编号',
  },
  transactionHash: {
    id: 'strategy.transactionHash',
    defaultMessage: 'Transaction hash',
    description: '交易哈希',
  },
  blockHash: {
    id: 'strategy.blockHash',
    defaultMessage: 'Block hash',
    description: '区块哈希',
  },
  betResult: {
    id: 'strategy.betResult',
    defaultMessage: 'Lottery result',
    description: '开奖结果',
  },
  bouns: {
    id: 'strategy.bouns',
    defaultMessage: 'Bonus',
    description: '奖金',
  },
  miningIncome: {
    id: 'strategy.miningIncome',
    defaultMessage: 'Mining income',
    description: '挖矿收益',
  },
  betInformation: {
    id: 'strategy.betInformation',
    defaultMessage: 'Betting information',
    description: '投注信息',
  },
  link: {
    id: 'strategy.link',
    defaultMessage: 'Check',
    description: '核实',
  },
});
