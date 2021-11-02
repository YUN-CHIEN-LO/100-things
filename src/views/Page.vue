<template>
  <div class="page">
    <Item />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Item from "@/components/Item.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    Item,
  },
});
</script>
