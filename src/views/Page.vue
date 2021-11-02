<template>
  <div class="page">
    <div class="page__items">
      <Item v-for="item in list.data" :key="item" :url="item" />
      <Item @click="drawer = true" />
    </div>

    <el-drawer
      v-model="drawer"
      title="Add Item"
      :direction="'btt'"
      :before-close="handleClose"
      :size="'100%'"
    >
      <Loader :max-num="30" @select="handleSelect" />
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import Loader from "@/components/load-image/Loader.vue";
import Item from "@/components/Item.vue";
import { ElMessageBox } from "element-plus";

export default defineComponent({
  name: "Home",
  components: {
    Loader,
    Item,
  },
  setup() {
    const drawer = ref(false);
    let list = reactive({ data: [] as any[] });
    const handleClose = (done: any) => {
      ElMessageBox.confirm("Are you sure you want to close this?")
        .then(() => {
          done();
        })
        .catch(() => {
          // catch error
        });
    };
    return { list, drawer, handleClose };
  },
  methods: {
    handleSelect(data: string[]) {
      this.list.data = data;
      console.log(this.list.data);
    },
  },
});
</script>

<style lang="scss" scoped>
.page {
  &__items {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
}
::v-deep .el-drawer__body {
  overflow-y: auto;
}
</style>
