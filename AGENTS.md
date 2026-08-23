# instructions.md - Benga Language Learning Portal

## Project Overview
A Vue 2 educational website teaching the Benga language (Ndowe language family) based on Salvado y Cos's historical grammar book. The platform transforms 19th-century linguistic documentation into an interactive digital learning experience with audio pronunciation support.

## Tech Stack
- **Framework**: Vue 2 (Options API)
- **Styling**: SCSS with BEM methodology, common imports
- **IDE**: VSCode with GitHub Copilot
- **Media Storage**: Cloudinary (audio files)
- **Images**: Wikimedia Commons, Unsplash
- **Internationalization**: vue-i18n (Spanish first, then French/English)

## Architecture Principles

### Component Structure
- Use Single File Components (.vue) with `<template>`, `<script>`, `<style scoped>`
- Prefer Options API (data, methods, computed, props)
- Extract reusable patterns into generic components with slots
- Keep components focused: one primary responsibility per component

### Noun Class Page Format
- All noun-class view pages should follow the same structural pattern as the first reference component: a root container using the `noun-class` BEM block, then sections ordered as `__header`, `__pattern`, `__examples`, `__variants`, `__concepts`, `__practice`, and `__nav`.
- The class pages should remain visually aligned with `NounClass1.vue` as the reference standard: green gradient header, centered pattern transformation box, example cards with a singular/plural split, clearly styled section headings, and a consistent two-button navigation footer.
- Reuse the same SCSS patterns from the first noun-class component: `@import '@/styles/variables'; @import '@/styles/mixins';`, BEM naming, `pattern-box`, `example-card`, `concept-item`, and responsive layout rules via `@include respond-below('md')`.
- Avoid the old shorthand classes like `nc`, `h`, `pb`, `eg`, `b` and instead use the full `noun-class` BEM naming system across all noun-class pages. This keeps them consistent and easier to maintain.
- The goal is visual similarity across all chapter-2 nominal-class views, so changes to spacing, color, typography, and card styling should be applied uniformly rather than re-designed per page.

### File Naming Conventions
- **Components**: PascalCase (e.g., `AudioPlayer.vue`, `ChapterNav.vue`)
- **Views/Pages**: PascalCase with descriptive names (e.g., `ChapterAlphabet.vue`)
- **Composables/Utilities**: camelCase (e.g., `useAudio.js`, `formatWord.js`)
- **SCSS**: kebab-case partials with underscore prefix (e.g., `_variables.scss`)
- **Data files**: kebab-case JSON (e.g., `chapter-1-alphabet.json`)

### SCSS Guidelines
```scss
// Use BEM naming
.block {
  &__element {
    &--modifier {}
  }
}

// Import order in components
@import '@/styles/variables';
@import '@/styles/mixins';
```

## Project Structure
benga-learning-portal/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── downloads/
│       └── salvado-y-cos-gramatica-benga.pdf
├── src/
│   ├── main.js                  # App entry point
│   ├── App.vue                  # Main application wrapper
│   ├── router/
│   │   └── index.js             # Route definitions
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── salvado-y-cos-portrait.jpg
│   │   │   └── equatorial-guinea-map.png
│   │   ├── icons/
│   │   │   ├── audio-play.svg
│   │   │   ├── audio-pause.svg
│   │   │   └── external-link.svg
│   │   └── styles/
│   │       ├── main.scss        # Global styles & imports
│   │       ├── _variables.scss  # Colors, fonts, spacing
│   │       ├── _mixins.scss     # Reusable SCSS logic
│   │       ├── _typography.scss # Font rules
│   │       ├── _reset.scss      # CSS normalization
│   │       ├── _layout.scss     # Grid & containers
│   │       └── _components.scss # Shared element styles
│   ├── locales/
│   │   ├── es.json              # Spanish (Primary)
│   │   ├── en.json              # English
│   │   └── fr.json              # French
│   ├── data/
│   │   ├── chapters-index.json  # Metadata for sidebar/navigation
│   │   ├── chapter-1/
│   │   │   ├── alphabet.json
│   │   │   ├── vowels.json
│   │   │   └── ...consonants.json
│   │   ├── chapter-2/
│   │   │   ├── nouns-intro.json
│   │   │   ├── class-1.json to class-7.json
│   │   │   └── verbal-nouns.json
│   │   └── vocabulary/
│   │       └── master-wordlist.json
│   ├── components/
│   │   ├── common/              # Atomic UI components
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseCard.vue
│   │   │   └── BaseIcon.vue
│   │   ├── layout/              # Structural components
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   ├── AppSidebar.vue
│   │   │   └── PageLayout.vue
│   │   ├── navigation/          # Navigation logic
│   │   │   ├── ChapterNav.vue
│   │   │   ├── SectionNav.vue
│   │   │   └── LanguageSwitcher.vue
│   │   ├── content/             # Didactic components
│   │   │   ├── BengaWord.vue    # Audio + Dictionary trigger
│   │   │   ├── AudioPlayer.vue
│   │   │   ├── ExampleTable.vue
│   │   │   └── NounClassCard.vue
│   │   └── interactive/         # Exercises
│   │       ├── QuizCard.vue
│   │       └── FlashCard.vue
│   └── views/                   # Full page components
│       ├── HomePage.vue
│       ├── AboutAuthor.vue
│       ├── Resources.vue
│       ├── chapter-1/
│       │   ├── ChapterOneIndex.vue
│       │   └── AlphabetSection.vue
│       ├── chapter-2/
│       │   ├── ChapterTwoIndex.vue
│       │   └── NounClass1.vue
│       └── chapter-3/
│           └── ChapterThreeIndex.vue
├── package.json
├── vue.config.js
├── babel.config.js
├── .eslintrc.js
├── README.md
└── instructions.md              # Instructions for Copilot/AI

## 3. Implementation Plan
### Phase 1: Foundation (Week 1)
**Goal**: Project scaffolding, core infrastructure
| Task | Files to Create | Priority |
|------|-----------------|----------|
| Initialize Vue 2 project | `package.json`, config files | P0 |
| Set up SCSS architecture | All `_*.scss` files | P0 |
| Configure vue-router | `router/index.js` | P0 |
| Configure vue-i18n | `locales/*.json` | P0 |
| Create layout components | `PageLayout`, `AppHeader`, `AppFooter`, `AppSidebar` | P0 |
| Create navigation components | `ChapterNav`, `LanguageSwitcher` | P0 |
### Phase 2: Core Components (Week 2)
**Goal**: Reusable components for linguistic content
| Task | Files to Create | Priority |
|------|-----------------|----------|
| BengaWord component | `BengaWord.vue` | P0 |
| AudioPlayer component | `AudioPlayer.vue` | P0 |
| ExampleTable component | `ExampleTable.vue` | P0 |
| ContentSection component | `ContentSection.vue` | P0 |
| Base UI components | `BaseButton`, `BaseCard`, `BaseIcon` | P1 |
### Phase 3: Chapter 1 Content (Week 3)
**Goal**: Complete first chapter as template
| Task | Files to Create | Priority |
|------|-----------------|----------|
| Structure chapter 1 data | `data/chapter-1/*.json` | P0 |
| Alphabet section view | `AlphabetSection.vue` | P0 |
| Diphthongs section view | `DiphthongsSection.vue` | P1 |
| Consonants section view | `ConsonantsSection.vue` | P1 |
| VowelChart interactive | `VowelChart.vue` | P2 |
### Phase 4: Chapter 2 Content (Week 4)
**Goal**: Noun classification system
| Task | Files to Create | Priority |
|------|-----------------|----------|
| Structure chapter 2 data | `data/chapter-2/*.json` | P0 |
| NounClassCard component | `NounClassCard.vue` | P0 |
| All 7 noun class views | `NounClass1-7.vue` | P0 |
| Irregular nouns view | `IrregularNouns.vue` | P1 |
| Verbal nouns view | `VerbalNouns.vue` | P1 |
### Phase 5: Supporting Pages (Week 5)
**Goal**: Non-chapter content
| Task | Files to Create | Priority |
|------|-----------------|----------|
| Home page | `HomePage.vue` | P0 |
| About author page | `AboutAuthor.vue` | P0 |
| Resources page | `Resources.vue` | P1 |
| Chapter index pages | `ChapterOneIndex.vue`, etc. | P1 |
### Phase 6: Polish & Audio (Week 6)
**Goal**: Media integration, refinement
| Task | Priority |
|------|----------|
| Integrate Cloudinary audio | P0 |
| Add sample audio files | P0 |
| Mobile responsiveness | P0 |
| Accessibility audit | P1 |
| Performance optimization | P1 |
### Future Phases (Post-MVP)
- Chapters 3-10 content
- Interactive exercises
- Community audio contributions
- French and English translations
- Search functionality
---
## 4. Key Implementation Files
### 4.1 `package.json`
```json
{
  "name": "benga-learning-portal",
  "version": "1.0.0",
  "description": "Interactive Benga language learning platform based on Salvado y Cos",
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "vue": "^2.7.14",
    "vue-router": "^3.6.5",
    "vue-i18n": "^8.28.2"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "^5.0.8",
    "@vue/cli-plugin-eslint": "^5.0.8",
    "@vue/cli-plugin-router": "^5.0.8",
    "@vue/cli-service": "^5.0.8",
    "sass": "^1.69.5",
    "sass-loader": "^13.3.2",
    "eslint": "^8.54.0",
    "eslint-plugin-vue": "^9.18.1"
  }
}