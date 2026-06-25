<template>
  <div class="nc">
    <div class="h">
      <h1>Sexta Clase: v → l</h1>
      <p>Cambio consonantal volátil</p>
    </div>
    <div class="pb">
      <div><strong>Singular:</strong> v-</div>
      <div>→</div>
      <div><strong>Plural:</strong> l-</div>
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
      <router-link to="/capitulo-2/clase-5" class="b">← C5</router-link
      ><router-link to="/capitulo-2/clase-7" class="b">C7 →</router-link>
    </section>
  </div>
</template>
<script>
export default {
  name: "NounClass6",
  data() {
    return {
      ex: [
        { s: "Veya", p: "Leya", m: "Fuego" },
        { s: "Vio", p: "Lijo", m: "Nariz" },
        { s: "Vid", p: "Lid", m: "Sueño" },
        { s: "Viho", p: "Liho", m: "Río" },
        { s: "Vitña", p: "Litña", m: "Vela" },
        { s: "Viyonda", p: "Loyonda", m: "Estación seca" },
        { s: "Viyembo", p: "Lembo", m: "Himno" },
      ],
    };
  },
  created() {
    document.title = "Sexta Clase | Portal Benga";
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
    background: linear-gradient(135deg, #e67e22, #f39c12);
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
    background: #ffe8cc;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-weight: bold;
  }
  section {
    margin-bottom: 1.5rem;
    h2 {
      color: #2d5a27;
      border-bottom: 2px solid #e67e22;
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
      background: #e67e22;
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      text-decoration: none;
      margin-right: 0.8rem;
      margin-top: 1rem;
      font-size: 0.9rem;
      transition: all 0.3s;
      &:hover {
        background: darken(#e67e22, 10%);
      }
    }
  }
}
</style>
