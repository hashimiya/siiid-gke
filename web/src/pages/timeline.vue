<template>
  <div class="container">
    <p>{{ hello }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { vxm } from "@/store/store";

@Component
export default class Index extends Vue {
  mounted() {
    vxm.menu.timelineActive()
  }

  get hello(): string {
    return "timeline"
  }
}
</script>
