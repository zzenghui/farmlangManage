import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'


import eleEnLocale from 'ele-admin/packages/lang/en';
import eleZhCNLocale from 'ele-admin/packages/lang/zh-CN';

// import ugLocale from './ug-CN'
import zhLocale from './zh-CN/index.js'
import enLocale from './en/index.js'

Vue.use(VueI18n)
const messages = {
  // ug: {
  //   ...ugLocale,
  // },
  zh: {
    ...zhLocale,
    ...eleZhCNLocale,
  },
  en: {
    ...enLocale,
    ...eleEnLocale
  }
}
export function getLanguage() {
  const chooseLanguage = Cookies.get('language');
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  console.log('language',language)
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'zh'
}
const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage(),
  // set locale messages
  messages,
  silentTranslationWarn: true,
})

export default i18n