<template>
  <div>
    <GMap/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { vxm } from "@/store/store";
import GMap from "~/components/GMap.vue";

@Component({
  components: { GMap },
  layout: "app",
})
export default class Heatmap extends Vue {
  mounted() {
    vxm.menu.topActive();
  }
}
</script>

<style scoped>
</style>
