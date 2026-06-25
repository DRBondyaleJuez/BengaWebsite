import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

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
  // Chapter 1: Preliminary Lessons
  {
    path: '/capitulo-1',
    name: 'Chapter1Index',
    component: () => import('@/views/chapter-1/ChapterOneIndex.vue'),
    children: [
      {
        path: 'alfabeto',
        name: 'Alphabet',
        component: () => import('@/views/chapter-1/AlphabetSection.vue')
      },
      {
        path: 'diptongos',
        name: 'Diphthongs',
        component: () => import('@/views/chapter-1/DipthongsSection.vue')
      },
      {
        path: 'triptongos',
        name: 'Triphthongs',
        component: () => import('@/views/chapter-1/TripthongsSection.vue')
      },
      {
        path: 'consonantes',
        name: 'Consonants',
        component: () => import('@/views/chapter-1/ConsonantsSections.vue')
      }
    ]
  },
  // Chapter 2: Nouns
  {
    path: '/capitulo-2',
    name: 'Chapter2Index',
    component: () => import('@/views/chapter-2/ChapterTwoIndex.vue'),
    children: [
      {
        path: 'introduccion',
        name: 'NounsIntro',
        component: () => import('@/views/chapter-2/NounsIntro.vue')
      },
      {
        path: 'clase-1',
        name: 'NounClass1',
        component: () => import('@/views/chapter-2/NounClass1.vue')
      },
      {
        path: 'clase-2',
        name: 'NounClass2',
        component: () => import('@/views/chapter-2/NounClass2.vue')
      },
      {
        path: 'clase-3',
        name: 'NounClass3',
        component: () => import('@/views/chapter-2/NounClass3.vue')
      },
      {
        path: 'clase-4',
        name: 'NounClass4',
        component: () => import('@/views/chapter-2/NounClass4.vue')
      },
      {
        path: 'clase-5',
        name: 'NounClass5',
        component: () => import('@/views/chapter-2/NounClass5.vue')
      },
      {
        path: 'clase-6',
        name: 'NounClass6',
        component: () => import('@/views/chapter-2/NounClass6.vue')
      },
      {
        path: 'clase-7',
        name: 'NounClass7',
        component: () => import('@/views/chapter-2/NounClass7.vue')
      },
      {
        path: 'irregulares',
        name: 'IrregularNouns',
        component: () => import('@/views/chapter-2/IrregularNouns.vue')
      },
      {
        path: 'verbales',
        name: 'VerbalNouns',
        component: () => import('@/views/chapter-2/VerbalNouns.vue')
      }
    ]
  },
  // Chapter 3: Adjectives
  {
    path: '/capitulo-3',
    name: 'Chapter3Index',
    component: () => import('@/views/chapter-3/ChapterThreeIndex.vue'),
    children: [
      {
        path: 'introduccion',
        name: 'AdjectivesIntro',
        component: () => import('@/views/chapter-3/AdjectivesIntro.vue')
      },
      {
        path: 'adjetivos-regulares',
        name: 'RegularAdjectives',
        component: () => import('@/views/chapter-3/RegularAdjectivesSection.vue')
      },
      {
        path: 'adjetivos-invariables',
        name: 'InvariableAdjectives',
        component: () => import('@/views/chapter-3/IrregularAdjectivesSection.vue')
      },
      {
        path: 'comparativos-superlativos',
        name: 'ComparativesSuperlatives',
        component: () => import('@/views/chapter-3/ComparativesSuperlativesSection.vue')
      },
      {
        path: 'numerales-ordinales',
        name: 'NumeralOrdinalAdjectives',
        component: () => import('@/views/chapter-3/NumeralOrdinalAdjectivesSection.vue')
      }
    ]
  },
  // Catch-all redirect
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  }
})

export default router
