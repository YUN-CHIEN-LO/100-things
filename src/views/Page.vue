<template>
  <div class="page">
    <Image />
    <Item />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Item from "@/components/Item.vue";
import Image from "@/components/load-image/Image.vue";

export default defineComponent({
  name: "Home",
  components: {
    Item,
    Image,
  },
});
</script>
