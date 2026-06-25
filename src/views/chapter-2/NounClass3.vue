<template>
  <div class="noun-class-3">
    <div class="header">
      <h1>Tercera Clase Nominal</h1>
      <p>u/mú → me/mi</p>
    </div>
    <div class="pattern-box">
      <div><strong>Singular:</strong> u- / mú-</div>
      <div>→</div>
      <div><strong>Plural:</strong> me / mi-</div>
    </div>
    <section>
      <h2>Ejemplos (Comenzando con u/w)</h2>
      <div class="examples-grid">
        <div class="ex" v-for="(ex, i) in uExamples" :key="`u-${i}`">
          <strong>{{ ex.s }} → {{ ex.p }}</strong><br>{{ ex.m }}
        </div>
      </div>
    </section>
    <section>
      <h2>Ejemplos (Comenzando con mú/mu)</h2>
      <div class="examples-grid">
        <div class="ex" v-for="(ex, i) in muExamples" :key="`mu-${i}`">
          <strong>{{ ex.s }} → {{ ex.p }}</strong><br>{{ ex.m }}
        </div>
      </div>
    </section>
    <section style="margin-top: 2rem;">
      <router-link to="/capitulo-2/clase-2" class="btn">← Clase 2</router-link>
      <router-link to="/capitulo-2/clase-4" class="btn">Clase 4 →</router-link>
    </section>
  </div>
</template>
<script>
export default {
  name: 'NounClass3',
  data() {
    return {
      uExamples: [
        { s: 'Woaha', p: 'Mebaha', m: 'Costado' },
        { s: 'Woanga', p: 'Mebanga', m: 'Nuez' },
        { s: 'Wháki', p: 'Mebáki', m: 'Hacha' },
        { s: 'Whéngé', p: 'Mehéngé', m: 'Calle' },
        { s: 'Whingi', p: 'Mehingi', m: 'Gato salvaje' }
      ],
      muExamples: [
        { s: 'Múadi', p: 'Miadi', m: 'Hembra' },
        { s: 'Múako', p: 'Miako', m: 'Confianza' },
        { s: 'Maalika', p: 'Mialika', m: 'Vihuela' },
        { s: 'Maanga', p: 'Mianga', m: 'Rebaño' },
        { s: 'Múéngi', p: 'Miéngi', m: 'Extranjero' }
      ]
    };
  },
  created() { document.title = 'Tercera Clase Nominal | Portal Benga'; }
};
</script>
<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';
.noun-class-3 {
  max-width: 1000px; margin: 0 auto; padding: $spacing-lg;
  .header { background: linear-gradient(135deg, #2D5A27, #4A7C4E); color: white; padding: 2rem; border-radius: $border-radius; text-align: center; margin-bottom: 2rem;
    h1 { margin: 0; font-size: 2rem; }
    p { margin: 0.5rem 0 0; opacity: 0.9; }
  }
  .pattern-box { display: flex; justify-content: center; gap: 1rem; align-items: center; background: #f5f5f5; padding: 1.5rem; border-radius: $border-radius; margin-bottom: 2rem; font-weight: bold; }
  section { margin-bottom: 2rem;
    h2 { color: $color-primary; border-bottom: 2px solid $color-accent; padding-bottom: 0.5rem; }
    .examples-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .ex { background: white; border: 1px solid #e0e0e0; padding: 1rem; border-radius: $border-radius; text-align: center; min-height: 80px; display: flex; flex-direction: column; justify-content: center; }
    .btn { display: inline-block; background: $color-primary; color: white; padding: 0.7rem 1.5rem; border-radius: $border-radius; text-decoration: none; margin-right: 1rem; margin-top: 1rem; transition: all 0.3s;
      &:hover { background: darken($color-primary, 10%); transform: translateY(-2px); }
    }
  }
}
</style>
