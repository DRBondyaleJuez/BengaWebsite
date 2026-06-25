<template>
  <footer class="footer">
    <div class="footer__container">
      <!-- Main Footer Content -->
      <div class="footer__content">
        <!-- About Section -->
        <div class="footer__section footer__about">
          <h3 class="footer__title">{{ $t('app.title') }}</h3>
          <p class="footer__description">
            {{ $t('footer.basedOn') }}
          </p>
          <div class="footer__metadata">
            <span class="footer__year">{{ currentYear }}</span>
          </div>
        </div>

        <!-- Links Section -->
        <div class="footer__section footer__links">
          <h4 class="footer__subtitle">{{ $t('nav.chapters') }}</h4>
          <ul class="footer__list">
            <li>
              <router-link to="/" class="footer__link">
                {{ $t('nav.home') }}
              </router-link>
            </li>
            <li>
              <router-link to="/sobre-el-autor" class="footer__link">
                {{ $t('nav.about') }}
              </router-link>
            </li>
            <li>
              <router-link to="/recursos" class="footer__link">
                {{ $t('nav.resources') }}
              </router-link>
            </li>
            <li>
              <a 
                href="/downloads/salvado-y-cos-gramatica-benga.pdf"
                class="footer__link"
                download
              >
                {{ $t('nav.download') }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Community Section -->
        <div class="footer__section footer__community">
          <h4 class="footer__subtitle">{{ $t('footer.community') }}</h4>
          <ul class="footer__list">
            <li>
              <a 
                href="https://www.livingdictionary.com/" 
                class="footer__link footer__link--external"
                target="_blank"
                rel="noopener noreferrer"
              >
                Living Dictionary
              </a>
            </li>
            <li>
              <a 
                href="https://www.sil.org/" 
                class="footer__link footer__link--external"
                target="_blank"
                rel="noopener noreferrer"
              >
                SIL International
              </a>
            </li>
            <li>
              <router-link to="/" class="footer__link">
                {{ $t('footer.contribute') }}
              </router-link>
            </li>
            <li>
              <router-link to="/" class="footer__link">
                {{ $t('footer.contact') }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Resources Section -->
        <div class="footer__section footer__resources">
          <h4 class="footer__subtitle">{{ $t('nav.resources') }}</h4>
          <ul class="footer__list">
            <li>
              <a 
                href="https://commons.wikimedia.org/" 
                class="footer__link footer__link--external"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wikimedia Commons
              </a>
            </li>
            <li>
              <a 
                href="https://www.equatorialguinea.org/" 
                class="footer__link footer__link--external"
                target="_blank"
                rel="noopener noreferrer"
              >
                Guinea Ecuatorial
              </a>
            </li>
            <li>
              <a 
                href="https://en.wikipedia.org/wiki/Ndowe_languages" 
                class="footer__link footer__link--external"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lenguas Ndowe
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer__bottom">
        <div class="footer__copyright">
          <p>{{ $t('footer.copyright', { year: currentYear }) }}</p>
        </div>
        <div class="footer__attribution">
          <p class="footer__text-small">
            Built with <span class="footer__heart">♥</span> for language preservation
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      currentYear: new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.footer {
  background: $color-primary;
  color: $color-text-inverse;
  margin-top: 3rem;
  border-top: 4px solid $color-accent;

  &__container {
    max-width: $max-page-width;
    margin: 0 auto;
    padding: $spacing-xl;

    @include respond-below('md') {
      padding: $spacing-lg;
    }
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-xl;
    margin-bottom: $spacing-xl;

    @include respond-below('sm') {
      grid-template-columns: 1fr;
      gap: $spacing-lg;
    }
  }

  &__section {
    &:first-child {
      grid-column: 1;
    }
  }

  &__about {
    @include respond-below('md') {
      grid-column: 1 / -1;
    }
  }

  &__title {
    font-family: $font-family-heading;
    font-size: $font-size-xl;
    font-weight: 600;
    margin-bottom: $spacing-md;
    color: $color-accent-light;
  }

  &__subtitle {
    font-family: $font-family-heading;
    font-size: $font-size-base;
    font-weight: 600;
    margin-bottom: $spacing-md;
    color: $color-accent-light;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__description {
    font-size: $font-size-sm;
    line-height: $line-height-base;
    color: rgba($color-text-inverse, 0.9);
    margin-bottom: $spacing-md;
  }

  &__metadata {
    font-size: $font-size-xs;
    color: rgba($color-text-inverse, 0.7);
  }

  &__year {
    display: inline-block;
    padding: $spacing-xs $spacing-sm;
    background: rgba($color-secondary, 0.3);
    border-radius: 4px;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__link {
    display: inline-block;
    color: rgba($color-text-inverse, 0.85);
    text-decoration: none;
    font-size: $font-size-sm;
    padding: $spacing-xs 0;
    transition: all $transition-base;
    border-bottom: 2px solid transparent;

    &:hover {
      color: $color-accent-light;
      border-bottom-color: $color-accent;
      padding-left: $spacing-xs;
    }

    &--external {
      position: relative;
      padding-right: 1.25rem;

      &::after {
        content: '↗';
        position: absolute;
        right: 0;
        opacity: 0.6;
        transition: opacity $transition-base;
      }

      &:hover::after {
        opacity: 1;
      }
    }
  }

  &__bottom {
    border-top: 1px solid rgba($color-secondary, 0.3);
    padding-top: $spacing-lg;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-lg;
    align-items: center;

    @include respond-below('sm') {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }

  &__copyright {
    font-size: $font-size-xs;
    color: rgba($color-text-inverse, 0.75);

    p {
      margin: 0;
    }
  }

  &__attribution {
    text-align: right;
    font-size: $font-size-xs;
    color: rgba($color-text-inverse, 0.75);

    @include respond-below('sm') {
      text-align: center;
    }

    p {
      margin: 0;
    }
  }

  &__text-small {
    font-size: $font-size-xs;
    margin: 0;
  }

  &__heart {
    color: $color-accent;
    margin: 0 $spacing-xs;
  }
}
</style>
