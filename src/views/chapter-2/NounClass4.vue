<template>
  <div class="nc">
    <div class="h">
      <h1>Cuarta Clase</h1>
      <p>bo/ba → mi</p>
    </div>
    <div class="pb">
      <div><strong>Singular:</strong> bo- / ba-</div>
      <div>→</div>
      <div><strong>Plural:</strong> mi-</div>
    </div>
    <section>
      <h2>Ejemplos</h2>
      <div class="eg">
        <div v-for="(e, i) in ex" :key="i">
          <strong>{{ e.s }} → {{ e.p }}</strong
          ><br />{{ e.m }}
        </div>
      </div>
    </section>
    <section style="margin-top: 2rem">
      <router-link to="/capitulo-2/clase-3" class="b">← C3</router-link
      ><router-link to="/capitulo-2/clase-5" class="b">C5 →</router-link>
    </section>
  </div>
</template>
<script>
export default {
  name: "NounClass4",
  data() {
    return {
      ex: [
        { s: "Bobako", p: "Mibako", m: "Vaina" },
        { s: "Boho", p: "Mioho", m: "Cara" },
        { s: "Bojona", p: "Mijona", m: "Mentira" },
        { s: "Bongo", p: "Miongo", m: "Espina" },
        { s: "Bova", p: "Mira", m: "Don" },
        { s: "Baalo", p: "Mialo", m: "Canoas" },
        { s: "Bue", p: "Mie", m: "Luz" },
      ],
    };
  },
  created() {
    document.title = "Cuarta Clase | Portal Benga";
  },
};
</script>
<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/mixins";
.nc {
  max-width: 900px;
  margin: 0 auto;
  padding: $spacing-lg;
  .h {
    background: linear-gradient(135deg, #8b4513, #a0522d);
    color: white;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 1.5rem;
    h1 {
      margin: 0;
      font-size: 1.8rem;
    }
    p {
      margin: 0.5rem 0 0;
    }
  }
  .pb {
    display: flex;
    justify-content: center;
    gap: 1rem;
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-weight: bold;
  }
  section {
    margin-bottom: 1.5rem;
    h2 {
      color: #2d5a27;
      border-bottom: 2px solid #daa520;
      padding-bottom: 0.5rem;
    }
    .eg {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 0.8rem;
      margin-top: 1rem;
      div {
        background: white;
        border: 1px solid #e0e0e0;
        padding: 0.8rem;
        border-radius: 6px;
        text-align: center;
        font-size: 0.9rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 70px;
      }
    }
    .b {
      display: inline-block;
      background: #2d5a27;
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      text-decoration: none;
      margin-right: 0.8rem;
      margin-top: 1rem;
      font-size: 0.9rem;
      transition: all 0.3s;
      &:hover {
        background: darken(#2d5a27, 10%);
      }
    }
  }
}
</style>
