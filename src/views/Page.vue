<template>
  <div class="page">
    <div class="page__tool">
      <div class="page__tool__lock">
        <el-switch
          v-model="lock"
          :active-icon="active"
          :inactive-icon="inactive"
          size="large"
        >
        </el-switch>
      </div>
    </div>
    <div class="page__items">
      <Item
        v-for="item in list.data"
        :key="item.id"
        :title="item.title"
        :url="item.img"
      />
      <Item v-show="!lock" @click="drawer = true" />
    </div>

    <el-drawer
      v-model="drawer"
      title="Add Item"
      :direction="'btt'"
      :before-close="handleClose"
      :size="'100%'"
    >
      <Slider
        ref="slider"
        :disable-next="disableNext"
        @slider:submit="handleSubmit"
        @slider="handleSlide"
      >
        <SliderItem class="page__form__title" :title="'Insert A Title'">
          <el-input
            v-model="form.title"
            v-focus
            :input-style="inputStyle"
            maxlength="30"
            show-word-limit
            @input="handleInput"
          ></el-input>
        </SliderItem>
        <SliderItem :title="'Select a Cover'">
          <Loader ref="loader" :max-num="1" @select="handleSelect" />
        </SliderItem>
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
import { Plus, Lock } from "@element-plus/icons";
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
    const loader = ref(null as any);
    const loaderReset = () => {
      loader.value?.reset();
    };
    const slider = ref(null as any);
    const sliderReset = () => {
      slider.value?.reset();
    };
    let disableNext = ref(true);
    let list = reactive({ data: [] as any[] });
    let form = reactive({
      id: 0 as number,
      title: "" as string,
      img: "" as string,
    });
    const inputStyle = computed(() => {
      return {
        textAlign: "center",
        fontSize: "32px",
        padding: "20px",
        marginTop: "20px",
      };
    });

    let lock = ref(false);
    const active = ref(Lock);
    const inactive = ref(Plus);

    return {
      list,
      drawer,
      form,
      inputStyle,
      disableNext,
      loader,
      loaderReset,
      slider,
      sliderReset,
      lock,
      active,
      inactive,
    };
  },
  directives: {
    focus: {
      // directive definition
      mounted: (el) => {
        el.focus();
      },
    },
  },
  mounted() {
    this.lock = Boolean(this.list.data.length > 0);
  },
  methods: {
    handleClose(done: any) {
      ElMessageBox.confirm("Are you sure you want to close this?")
        .then(() => {
          done();
          this.loaderReset();
          this.sliderReset();
        })
        .catch(() => {
          // catch error
        });
    },
    handleInput(val: [string, number]) {
      this.disableNext = Boolean(val.toString().length === 0);
    },
    handleSelect(data: string[]) {
      this.form.img = data[0] ? data[0] : "";
      this.disableNext = Boolean(data.length === 0);
    },
    handleSlide(num: any) {
      this.disableNext = Boolean(num !== "end");
      if (num === 0) {
        this.disableNext = Boolean(this.form.title.length === 0);
      }
      if (num === 1) {
        this.disableNext = Boolean(this.form.img.length === 0);
      }
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
      this.loaderReset();
    },
  },
});
</script>

<style lang="scss" scoped>
.page {
  position: relative;
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
  &__tool {
    background-color: #fff;
    position: sticky;
    top: 0;
    overflow: hidden;
    display: flex;
    z-index: 20;
    &__lock {
      margin-left: auto;
      height: 50px;
      padding: 10px;
      width: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      & * {
        transform: scale(2);
      }
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
