<template>
  <div class="page">
    <div class="page__items">
      <Item
        v-for="item in list.data"
        :key="item.id"
        :title="item.title"
        :url="item.img"
      />
      <Item @click="drawer = true" />
    </div>

    <el-drawer
      v-model="drawer"
      title="Add Item"
      :direction="'btt'"
      :before-close="handleClose"
      :size="'100%'"
    >
      <Slider @slider:submit="handleSubmit">
        <SliderItem class="page__form__title" :title="'Insert A Title'">
          <el-input
            v-model="form.title"
            :input-style="inputStyle"
            maxlength="30"
            show-word-limit
          ></el-input>
        </SliderItem>
        <SliderItem>
          <Loader ref="loader" :max-num="1" @select="handleSelect" />
        </SliderItem>
        <SliderItem>sd</SliderItem>
      </Slider>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from "vue";
import Loader from "@/components/load-image/Loader.vue";
import Item from "@/components/Item.vue";
import Slider from "@/components/slider/Slider.vue";
import SliderItem from "@/components/slider/SliderItem.vue";
import { ElMessageBox, ElInput } from "element-plus";
import { cloneDeep } from "lodash";
export default defineComponent({
  name: "Home",
  components: {
    Loader,
    Item,
    Slider,
    SliderItem,
    ElInput,
  },
  setup() {
    const drawer = ref(false);
    let list = reactive({ data: [] as any[] });
    let form = reactive({
      id: 0 as number,
      title: "" as string,
      img: "" as string,
    });
    const handleClose = (done: any) => {
      ElMessageBox.confirm("Are you sure you want to close this?")
        .then(() => {
          done();
        })
        .catch(() => {
          // catch error
        });
    };
    const inputStyle = computed(() => {
      return {
        textAlign: "center",
        fontSize: "32px",
        padding: "20px",
      };
    });
    return { list, drawer, form, handleClose, inputStyle };
  },
  methods: {
    handleSelect(data: string[]) {
      this.form.img = data[0];
    },
    handleSubmit() {
      this.drawer = false;
      this.list.data.push(cloneDeep(this.form));

      this.resetForm();
    },
    resetForm() {
      this.$nextTick(() => {
        this.form.id++;
        this.form.title = "";
        this.form.img = "";
      });
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
  &__form {
    &__title {
      text-align: center;
    }
  }
}
::v-deep .el-input__inner {
  height: auto;
}
::v-deep .el-drawer__body {
  overflow-y: auto;
}
</style>
