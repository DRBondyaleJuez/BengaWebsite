<template>
  <div class="noun-class-2">
    <div class="header">
      <h1>Segunda Clase Nominal</h1>
      <p>i/di → ma</p>
    </div>
    <div class="pattern-box">
      <div><strong>Singular:</strong> i- / di-</div>
      <div>→</div>
      <div><strong>Plural:</strong> ma-</div>
    </div>
    <section>
      <h2>Ejemplos (Comenzando con i)</h2>
      <div class="examples-grid">
        <div class="ex" v-for="(ex, i) in iExamples" :key="`i-${i}`">
          <strong>{{ ex.s }} → {{ ex.p }}</strong><br>{{ ex.m }}
        </div>
      </div>
    </section>
    <section>
      <h2>Ejemplos (Comenzando con di)</h2>
      <div class="examples-grid">
        <div class="ex" v-for="(ex, i) in diExamples" :key="`di-${i}`">
          <strong>{{ ex.s }} → {{ ex.p }}</strong><br>{{ ex.m }}
        </div>
      </div>
    </section>
    <section style="margin-top: 2rem;">
      <router-link to="/capitulo-2/clase-1" class="btn">← Clase 1</router-link>
      <router-link to="/capitulo-2/clase-3" class="btn">Clase 3 →</router-link>
    </section>
  </div>
</template>
<script>
export default {
  name: 'NounClass2',
  data() {
    return {
      iExamples: [
        { s: 'Ibaké', p: 'Mabaké', m: 'Cuidado' },
        { s: 'Ibala', p: 'Mabala', m: 'Victoria' },
        { s: 'Ibálu', p: 'Mabálu', m: 'Cuello' },
        { s: 'Ibánga', p: 'Mabánga', m: 'Rodilla' },
        { s: 'Ibátá', p: 'Mabátá', m: 'Bendición' }
      ],
      diExamples: [
        { s: 'Diba', p: 'Maba', m: 'Casamiento' },
        { s: 'Dibé', p: 'Mabé', m: 'Ubre' },
        { s: 'Diké', p: 'Make', m: 'Huevo' },
        { s: 'Dimya', p: 'Mumya', m: 'Torpedo' },
        { s: 'Diso', p: 'Muso', m: 'Nigua' }
      ]
    };
  },
  created() {
    document.title = 'Segunda Clase Nominal | Portal Benga';
  }
};
</script>
<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';
.noun-class-2 {
  max-width: 1000px; margin: 0 auto; padding: $spacing-lg;
  .header { background: linear-gradient(135deg, #2D5A27, #4A7C4E); color: white; padding: 2rem; border-radius: $border-radius; text-align: center; margin-bottom: 2rem;
    h1 { margin: 0; font-size: 2rem; }
    p { margin: 0.5rem 0 0; opacity: 0.9; }
  }
  .pattern-box { display: flex; justify-content: center; gap: 1rem; align-items: center; background: #f5f5f5; padding: 1.5rem; border-radius: $border-radius; margin-bottom: 2rem; font-weight: bold; }
  section { margin-bottom: 2rem;
    h2 { color: $color-primary; border-bottom: 2px solid $color-accent; padding-bottom: 0.5rem; }
    .examples-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .ex { background: white; border: 1px solid #e0e0e0; padding: 1rem; border-radius: $border-radius; text-align: center; min-height: 80px; display: flex; flex-direction: column; justify-content: center;
      strong { color: $color-primary; font-family: monospace; }
    }
    .btn { display: inline-block; background: $color-primary; color: white; padding: 0.7rem 1.5rem; border-radius: $border-radius; text-decoration: none; margin-right: 1rem; margin-top: 1rem; transition: all 0.3s;
      &:hover { background: darken($color-primary, 10%); transform: translateY(-2px); }
    }
  }
}
</style>
