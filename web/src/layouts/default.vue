<template>
  <div>
    <nuxt />
    <Footer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Footer from "@/components/Footer.vue";

@Component({
  components: {
    Footer,
  },
})
export default class Default extends Vue {}
</script>

<style scoped>
::-webkit-scrollbar{
  width: 4px;
}
::-webkit-scrollbar-track{
  background: #F0F0F0;
}
::-webkit-scrollbar-thumb{
  background: #ccc;
  border-radius: 0px;
}
html, body {
  margin: 0;
  padding: 0;
  font-family: YakuHanJP, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif;
}
nav {
  position: absolute;
  padding: 10px;
  width: 100%;
  z-index: 3;
}
</style>
