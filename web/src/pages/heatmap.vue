<template>
  <div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { vxm } from "@/store/store";

@Component({
  layout: "app",
})
export default class Heatmap extends Vue {
  mounted() {
    vxm.menu.heatmapActive();
    const latLngList = vxm.point.pointSummaryList.map(summary => {
      return new google.maps.LatLng(summary.getLatitude(), summary.getLongitude());
    });
    vxm.heatmap.pushWeightedLocationList(latLngList);
    vxm.heatmap.initializeCenter();
    vxm.heatmap.zoomOut();
  }
}
</script>

<style scoped>
</style>
