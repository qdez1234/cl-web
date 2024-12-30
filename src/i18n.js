import { createI18n } from 'vue-i18n';

// 导入语言包
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';
import vi from '@/locales/vi.json';

// 创建 i18n 实例并配置
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: 'zh', // 默认语言
  fallbackLocale: 'zh', // 回退语言
  messages: {
    en,
    zh,
    vi
  },
});

export default i18n;
