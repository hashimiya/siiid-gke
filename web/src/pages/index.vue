<template>
  <div class="container">
    <p>{{ message }}</p>
    <button @click="sendAsync">
      send
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { vxm } from "@/store/store";

@Component
export default class Index extends Vue {
  mounted() {
    vxm.menu.topActive()
  }

  get message(): string {
    return vxm.hello.message
  }

  async sendAsync() {
    await vxm.hello.helloAsync(this.$http)
  }
}
</script>
