import { defineMessages } from 'react-intl';

export default defineMessages({
  proudctIntro1: {
    id: 'home.proudctIntro1',
    defaultMessage:
      '{productName} is a automatic betting script with {highlight} and not uploaded to the cloud. There are no security risks',
    description:
      '{productName} 是一款全自动投注脚本程序，项目{highlight}，本地运行无需担心安全问题',
  },
  safePromise: {
    id: 'home.safePromise',
    defaultMessage:
      'Open Source, Security Audit. The private keys are saved locally',
    description: '代码开源、安全审计、私钥本地保存不上传云端',
  },
  productIntro2: {
    id: 'home.productIntro2',
    defaultMessage:
      'Users need to import a wallet private key for {brand}, and transfer {symbol} and USDT into the wallet. {productName} will automatically run the betting strategy set by users.',
    description:
      '用户需要导入一个用于{brand}的钱包私钥，并将{symbol}和USDT转入钱包，{productName}将自动运行，用户设定的投注策略。',
  },
  getStart: {
    id: 'home.getStart',
    defaultMessage: 'Start to experience',
    description: '开始体验',
  },
  safeAudit: {
    id: 'home.safeAudit',
    defaultMessage: 'Security Audit ',
    description: '安全审计',
  },
  openSource: {
    id: 'home.openSource',
    defaultMessage: 'Open Source',
    description: '开源',
  },
  keepInLocal: {
    id: 'home.keepInLocal',
    defaultMessage: 'Local Storage Private Keys',
    description: '私钥本地保存',
  },
});
