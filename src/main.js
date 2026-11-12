/**
 * App entry point: creates the Vue app, adds the router and the translations, and shows it
 * inside <div id="app"> of index.html.
 */
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
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

createApp(App).use(router).use(i18n).mount('#app')
