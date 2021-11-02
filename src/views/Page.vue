<template>
  <div class="page">
    <Loader :max-num="3" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Loader from "@/components/load-image/Loader.vue";

export default defineComponent({
  name: "Home",
  components: {
    Loader,
  },
});
</script>
