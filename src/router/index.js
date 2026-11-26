import { createRouter, createWebHistory } from 'vue-router'
import chaptersIndex from '@/data/chapters-index.json'

/** Every page in src/views, loaded only when visited: { '/src/views/chapter-1/AlphabetSection.vue': () => import(...) } */
// The developer pages in views/admin are left out: they must never reach the published site
const VIEWS = import.meta.glob(['../views/**/*.vue', '!../views/admin/**'])
/** Section files, read now (they are small) to know which page draws them. */
const SECTION_FILES = import.meta.glob('../data/sections/**/*.json', {
  eager: true,
  import: 'default'
})

function view(component) {
  const loader = VIEWS[`../views/${component}`]
  if (!loader) throw new Error(`chapters-index.json: page src/views/${component} doesn't exist`)
  return loader
}

/**
 * Routes of the chapters, built from src/data/chapters-index.json — the same list as the sidebar
 * and the previous/next buttons, so a new section is added in ONE place:
 *
 *   { "id": "alphabet", "path": "/capitulo-1/alfabeto", "titleKey": "…",
 *     "component": "chapter-1/AlphabetSection.vue" }          → that page
 *   { "id": "class1", "path": "/capitulo-2/clase-1", "titleKey": "…",
 *     "sectionFile": "sections/ch-2/class-1.json" }           → SectionPage, or NounClassPage
 *                                                               when the file says "layout": "noun-class"
 *
 * Each chapter's index page (chapter.component) shows its sections inside its <router-view>.
 * meta.titleKey gives the browser-tab title when the page doesn't set one (App.vue).
 */
function chapterRoutes() {
  return chaptersIndex.chapters.map((chapter) => ({
    path: chapter.path,
    name: `Chapter${chapter.number}Index`,
    component: view(chapter.component),
    meta: { titleKey: chapter.titleKey },
    children: chapter.sections.map((section) => {
      const route = {
        path: section.path.slice(chapter.path.length + 1), // '/capitulo-1/alfabeto' → 'alfabeto'
        name: `${chapter.id}-${section.id}`,
        meta: { titleKey: section.titleKey }
      }
      if (section.component) return { ...route, component: view(section.component) }
      const name = section.sectionFile.replace(/^sections\//, '').replace(/\.json$/, '')
      const file = SECTION_FILES[`../data/${section.sectionFile}`]
      if (!file)
        throw new Error(`chapters-index.json: src/data/${section.sectionFile} doesn't exist`)
      return file.layout === 'noun-class'
        ? {
            ...route,
            component: view('chapter-2/NounClassPage.vue'),
            props: { section: name.split('/').pop() }
          }
        : { ...route, component: view('SectionPage.vue'), props: { section: name } }
    })
  }))
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/sobre-el-autor',
    name: 'AboutAuthor',
    component: () => import('@/views/AboutAuthor.vue')
  },
  {
    path: '/recursos',
    name: 'Resources',
    component: () => import('@/views/ResourcesPage.vue')
  },
  // Chapters and their sections: generated from src/data/chapters-index.json (chapterRoutes above)
  ...chapterRoutes(),
  // Developer tools: these routes exist ONLY while running `npm run serve`.
  // In `npm run build` the condition is false, so the pages are not even included in the site.
  ...(import.meta.env.DEV
    ? [
        {
          path: '/admin/palabras',
          name: 'WordRegistryAdmin',
          component: () => import('@/views/admin/WordRegistryAdmin.vue')
        },
        {
          path: '/admin/ocr',
          name: 'OcrReviewAdmin',
          component: () => import('@/views/admin/OcrReviewAdmin.vue')
        },
        {
          path: '/admin/translations',
          name: 'TranslationsAdmin',
          component: () => import('@/views/admin/TranslationsAdmin.vue')
        },
        {
          path: '/admin/audios',
          name: 'AudiosAdmin',
          component: () => import('@/views/admin/AudiosAdmin.vue')
        },
        {
          // Living Dictionary bridge (docs/LD-ROADMAP.md): frame with tabs + one page per tab
          path: '/admin/living-dictionary',
          component: () => import('@/views/admin/ld/LdLayout.vue'),
          children: [
            {
              path: '',
              name: 'LdPanel',
              component: () => import('@/views/admin/ld/LdPanel.vue'),
              meta: { title: 'Living Dictionary · Panel' }
            },
            {
              path: 'entradas',
              name: 'LdEntries',
              component: () => import('@/views/admin/ld/LdEntries.vue'),
              meta: { title: 'Living Dictionary · Entradas' }
            },
            {
              path: 'oraciones',
              name: 'LdSentences',
              component: () => import('@/views/admin/ld/LdSentences.vue'),
              meta: { title: 'Living Dictionary · Oraciones' }
            },
            {
              path: 'entrada/:id',
              name: 'LdEntry',
              component: () => import('@/views/admin/ld/EntryForm.vue'),
              props: true,
              meta: { title: 'Living Dictionary · Ficha de palabra' }
            },
            {
              path: 'oracion/:id',
              name: 'LdSentence',
              component: () => import('@/views/admin/ld/SentenceForm.vue'),
              props: true,
              meta: { title: 'Living Dictionary · Ficha de oración' }
            },
            {
              path: 'kit',
              name: 'LdUiKit',
              component: () => import('@/views/admin/ld/UiKitDemo.vue')
            }
          ]
        }
      ]
    : []),
  // Catch-all: any unknown address goes to the home page
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  // Clean URLs (/capitulo-1/alfabeto, no #), relative to the folder the site is published in
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Back/forward buttons return to where you were; any other navigation starts at the top
    return savedPosition || { top: 0 }
  }
})

export default router
