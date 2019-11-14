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
    this.$nextTick(function () {
      vxm.heatmap.initializeCenter();
      vxm.heatmap.zoomOut();
    });
  }
}
</script>

<style scoped>
</style>
