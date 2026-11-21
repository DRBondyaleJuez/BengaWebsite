/**
 * App entry point: creates the Vue app, adds the router and the translations, and shows it
 * inside <div id="app"> of index.html.
 */
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { localized } from './utils/localized'
import es from './locales/es.json'
import en from './locales/en.json'
import fr from './locales/fr.json'

import './styles/main.scss'

const i18n = createI18n({
  // Composition mode (legacy: false) is the current vue-i18n style. `globalInjection` keeps
  // `$t('key')` and `$i18n.locale` working in every component exactly as before.
  legacy: false,
  globalInjection: true,
  locale: 'es',
  fallbackLocale: 'es',
  messages: { es, en, fr }
})

const app = createApp(App)

// `$localized(text)` in any template: shows a translated text { es, en, fr } in the visitor's
// language, falling back to Spanish (src/utils/localized.js). Reading `locale.value` here makes
// the page update by itself when the visitor switches language.
app.config.globalProperties.$localized = (text) => localized(text, i18n.global.locale.value)

app.use(router).use(i18n).mount('#app')
