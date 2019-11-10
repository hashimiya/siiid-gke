<template>
  <div class="container">
    <p>{{ hello }}</p>
    <button @click="send">
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

  get hello(): string {
    return vxm.hello.message
  }

  send() {
    vxm.hello.helloAsync()
  }
}
</script>
