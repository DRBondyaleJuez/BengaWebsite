/**
 * App entry point: creates the Vue app, adds the router and the translations, and shows it
 * inside <div id="app"> of index.html.
 */
import { createApp, watch } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { localized } from './utils/localized'
import es from './locales/es.json'
import en from './locales/en.json'
import fr from './locales/fr.json'

import './styles/main.scss'

/** Languages of the site: Spanish first (the language of the book), then English and French. */
const LANGUAGES = ['es', 'en', 'fr']
const LANGUAGE_KEY = 'app-language' // where the visitor's choice is remembered (this browser only)

/** The language chosen on an earlier visit, or Spanish. */
function savedLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY)
    return LANGUAGES.includes(saved) ? saved : 'es'
  } catch {
    return 'es' // storage blocked (private mode…): just start in Spanish
  }
}

const i18n = createI18n({
  // Composition mode (legacy: false) is the current vue-i18n style. `globalInjection` keeps
  // `$t('key')` and `$i18n.locale` working in every component exactly as before.
  legacy: false,
  globalInjection: true,
  locale: savedLanguage(), // read before the first page is drawn: no flash of Spanish
  // Messages may contain a little HTML (<strong>, <em>) shown with v-html; all of them come
  // from our own locale files, so the warning about HTML in messages is switched off.
  warnHtmlMessage: false,
  fallbackLocale: 'es',
  messages: { es, en, fr }
})

const app = createApp(App)

// `$localized(text)` in any template: shows a translated text { es, en, fr } in the visitor's
// language, falling back to Spanish (src/utils/localized.js). Reading `locale.value` here makes
// the page update by itself when the visitor switches language.
app.config.globalProperties.$localized = (text) => localized(text, i18n.global.locale.value)

// When the language changes (LanguageSwitcher): remember it, and tell the browser and screen
// readers which language the page is in (<html lang="en">).
watch(
  i18n.global.locale,
  (language) => {
    document.documentElement.lang = language
    try {
      localStorage.setItem(LANGUAGE_KEY, language)
    } catch {
      // storage blocked: the choice only lasts until the page is closed
    }
  },
  { immediate: true }
)

app.use(router).use(i18n).mount('#app')
