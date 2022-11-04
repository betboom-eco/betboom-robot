import create from 'zustand';

interface I18nState {
  messages: any;
  locale: string;
  langs: Array<{ key: string; title: string }>;
  changeLocale: (locale: string) => void;
}

export const useI18nStore = create<I18nState>((set) => {
  const langs = [
    {
      key: 'zh-cn',
      title: '中文',
    },
    { key: 'en', title: 'English' },
  ];

  const changeLocale = async function (locale: string) {
    set({ locale: locale.toLowerCase() });
  };

  const locale: string = localStorage.getItem('lang') || 'en';

  return {
    messages: {
      ['zh-cn']: require(`@/locale/lang/zh-cn.json`),
      en: require('@/locale/lang/en.json'),
    } as any,
    locale,
    langs,
    changeLocale,
  };
});
