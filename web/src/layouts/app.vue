<template>
  <div>
    <Sidebar />
    <nuxt />
    <GMap />
    <Footer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Footer from "@/components/Footer.vue";
import Sidebar from "@/components/Sidebar.vue";
import GMap from "~/components/GMap.vue";
import { vxm } from "@/store/store";

@Component({
  components: {
    GMap,
    Footer,
    Sidebar,
  },
})
export default class App extends Vue {
  mounted() {
    vxm.point.fetchListAsync(this.$http);
    vxm.heatmap.initialize("map");

    const latLngList = vxm.point.pointSummaryList.map(summary => {
      return new google.maps.LatLng(summary.getLatitude(), summary.getLongitude());
    });
    vxm.heatmap.pushWeightedLocationList(latLngList);
  }
}
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
