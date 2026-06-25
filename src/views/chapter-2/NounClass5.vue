<template>
  <div class="nc">
    <div class="h">
      <h1>Quinta Clase</h1>
      <p>mo → ba</p>
    </div>
    <div class="pb">
      <div><strong>Singular:</strong> mo-</div>
      <div>→</div>
      <div><strong>Plural:</strong> ba-</div>
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
      <router-link to="/capitulo-2/clase-4" class="b">← C4</router-link
      ><router-link to="/capitulo-2/clase-6" class="b">C6 →</router-link>
    </section>
  </div>
</template>
<script>
export default {
  name: "NounClass5",
  data() {
    return {
      ex: [
        { s: "Mohano", p: "Bahano", m: "Promesa" },
        { s: "Momo", p: "Bamo", m: "Hombre" },
        { s: "Moto", p: "Bato", m: "Persona" },
        { s: "Monda", p: "Banda", m: "Invitación" },
        { s: "Motoba", p: "Batoba", m: "Caracol" },
        { s: "Mongolu", p: "Bangolu", m: "Escarabajo" },
      ],
    };
  },
  created() {
    document.title = "Quinta Clase | Portal Benga";
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
    background: linear-gradient(135deg, #daa520, #f0e68c);
    color: #333;
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
    background: #fffacd;
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
      background: #daa520;
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      text-decoration: none;
      margin-right: 0.8rem;
      margin-top: 1rem;
      font-size: 0.9rem;
      transition: all 0.3s;
      &:hover {
        background: darken(#daa520, 10%);
      }
    }
  }
}
</style>
