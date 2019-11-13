<template>
  <div class="container">
    <p>{{ hello }}</p>
    <div
      v-for="v in timeline"
    >
      <p>{{ v }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { vxm } from "@/store/store";
import {PointSummary} from "~/proto/siiid_service_pb";

@Component
export default class Index extends Vue {
  mounted() {
    vxm.menu.timelineActive();
    vxm.point.fetchListAsync(this.$http);
  }

  get hello(): string {
    return "timeline"
  }

  get timeline(): PointSummary[] {
    return vxm.point.pointSummaryList;
  }
}
</script>
