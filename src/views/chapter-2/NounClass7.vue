<template><div class="nc"><div class="h"><h1>Séptima Clase: Invariables</h1><p>Singular y plural tienen la misma forma (100+ palabras)</p></div><div class="pb"><div><strong>Singular = Plural</strong></div><div>(Invariable)</div></div><section><h2>Características</h2><p>La mayoría de palabras que comienzan con consonante y casi todas las que comienzan con doble consonante pertenecen a esta clase. El número se conoce por los adjuntos que las acompañan.</p></section><section><h2>Ejemplos (Algunos de 100+)</h2><div class="eg"><div v-for="(w,i) in words" :key="i">{{ w }}</div></div></section><section style="margin-top: 2rem;"><router-link to="/capitulo-2/clase-6" class="b">← C6</router-link><router-link to="/capitulo-2/irregulares" class="b">Irregulares →</router-link></section></div></template>
<script>
export default {
  name: 'NounClass7',
  data() {
    return {
      words: ['Fala', 'Fato', 'Fula', 'Jangá', 'Jonda', 'Jumba', 'Kabala', 'Kata', 'Kono', 'Kuma', 'Paha', 'Panga', 'Tagulu', 'Tina', 'Tito', 'Toko', 'Tolongo', 'Tombo', 'Tongo', 'Tudi', 'Tuma', 'Penge', 'Pani', 'Paro', 'Sago', 'Sango', 'Sikulu', 'Ngabo', 'Ngaho', 'Ngama', 'Ngandi', 'Ngani', 'Ngúmbi', 'Njadi', 'Ndabo', 'Ndaga', 'Ndolo', 'Mora', 'Mbanja', 'Mbángá', 'Mota', 'Hapi', 'Hoñe', 'Poke', 'Poti', 'Pudi', 'Páisi']
    };
  },
  created() { document.title = 'Séptima Clase | Portal Benga'; }
};
</script>
<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';
.nc { max-width: 900px; margin: 0 auto; padding: $spacing-lg;
  .h { background: linear-gradient(135deg, #10B981, #34D399); color: white; padding: 1.5rem; border-radius: 8px; text-align: center; margin-bottom: 1.5rem;
    h1 { margin: 0; font-size: 1.8rem; }
    p { margin: 0.5rem 0 0; }
  }
  .pb { display: flex; justify-content: center; gap: 1rem; background: #d1fae5; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; font-weight: bold; color: #047857; }
  section { margin-bottom: 1.5rem;
    h2 { color: #2D5A27; border-bottom: 2px solid #10B981; padding-bottom: 0.5rem; }
    p { color: #555; line-height: 1.6; }
    .eg { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.7rem; margin-top: 1rem;
      div { background: white; border: 1px solid #e0e0e0; padding: 0.8rem; border-radius: 6px; text-align: center; font-size: 0.95rem; font-weight: bold; color: $color-primary; }
    }
    .b { display: inline-block; background: #2D5A27; color: white; padding: 0.6rem 1.2rem; border-radius: 6px; text-decoration: none; margin-right: 0.8rem; margin-top: 1rem; font-size: 0.9rem; transition: all 0.3s;
      &:hover { background: darken(#2D5A27, 10%); }
    }
  }
}
</style>
