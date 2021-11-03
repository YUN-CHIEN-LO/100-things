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
        :color="item.complete"
        :complete="item.complete"
        :lock="lock"
        @click="handleItem(item)"
      />
      <Item v-show="!lock" :lock="true" @click="handleAdd" />
    </div>
    <!-- 新增項目 -->
    <el-drawer
      v-model="drawer"
      :title="drawerTitle"
      :direction="'btt'"
      :before-close="handleClose"
      :size="'100%'"
    >
      <Slider
        ref="slider"
        :disable-next="disableNextAdd"
        @slider:submit="handleSubmit"
        @slider="handleSlide"
      >
        <SliderItem
          v-if="mode === 'add' || mode === 'edit'"
          class="page__form__title"
          :title="'Insert A Title'"
        >
          <el-input
            v-model="form.title"
            :input-style="inputStyle"
            maxlength="30"
            show-word-limit
            @input="handleInput"
          ></el-input>
        </SliderItem>
        <SliderItem
          v-if="mode === 'add' || mode === 'edit'"
          :title="'Select a Cover'"
        >
          <Loader
            ref="loader"
            :value="[form.img]"
            :max-num="1"
            @select="handleSelect"
          />
        </SliderItem>
        <SliderItem v-if="mode === 'complete'" class="page__complete">
          <h1>
            {{ form.title }}
            <i
              v-show="form.complete"
              class="el-icon"
              data-v-394d1fd8=""
              style="--font-size: 42px; margin-left: 10px"
              @click="form.complete = !form.complete"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                data-v-394d1fd8=""
              >
                <path
                  fill="currentColor"
                  d="M832 512a32 32 0 1 1 64 0v352a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H192v640h640V512z"
                ></path>
                <path
                  fill="currentColor"
                  d="m469.952 554.24 52.8-7.552L847.104 222.4a32 32 0 1 0-45.248-45.248L477.44 501.44l-7.552 52.8zm422.4-422.4a96 96 0 0 1 0 135.808l-331.84 331.84a32 32 0 0 1-18.112 9.088L436.8 623.68a32 32 0 0 1-36.224-36.224l15.104-105.6a32 32 0 0 1 9.024-18.112l331.904-331.84a96 96 0 0 1 135.744 0z"
                ></path></svg
            ></i>
          </h1>
          <div class="page__complete__form">
            <div class="page__complete__form__block">
              <el-date-picker
                v-model="form.date"
                type="date"
                placeholder="Pick a day"
                :disabled-date="disabledDate"
                :shortcuts="shortcuts"
                :style="{ width: '100%' }"
                @change="handleInput"
                :readonly="form.complete"
              >
              </el-date-picker>
            </div>
            <div class="page__complete__form__block">
              <el-input
                v-model="form.detail"
                :rows="20"
                type="textarea"
                placeholder="What happened ..."
                :readonly="form.complete"
              />
            </div>
          </div>
        </SliderItem>
      </Slider>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, toRefs } from "vue";
import Loader from "@/components/load-image/Loader.vue";
import Item from "@/components/Item.vue";
import Slider from "@/components/slider/Slider.vue";
import SliderItem from "@/components/slider/SliderItem.vue";
import { ElMessageBox, ElInput } from "element-plus";
import { Plus, Lock, Edit } from "@element-plus/icons";
import { cloneDeep, findIndex } from "lodash";
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
    const drawerTitle = ref("");
    const loader = ref(null as any);
    const loaderReset = () => {
      loader.value?.reset();
    };
    const slider = ref(null as any);
    const sliderReset = () => {
      slider.value?.reset();
    };
    let disableNextAdd = ref(true);
    let list = reactive({
      data: [
        {
          id: 0,
          title: "hello world",
          img: "https://picsum.photos/id/0/300/180",
          complete: false,
          date: null,
          detail: "",
        },
      ] as any[],
    });
    const idx = list.data.length > 0 ? list.data[list.data.length - 1].id : 0;
    let form = reactive({
      id: idx as number,
      title: "" as string,
      img: "" as string,
      complete: false as boolean,
      date: null as any,
      detail: "" as string,
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

    let mode = ref("");
    const state = reactive({
      disabledDate(time: any) {
        return time.getTime() > Date.now();
      },
      shortcuts: [
        {
          text: "Today",
          value: new Date(),
        },
        {
          text: "Yesterday",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            return date;
          },
        },
        {
          text: "A week ago",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            return date;
          },
        },
      ],
    });

    return {
      list,
      drawer,
      drawerTitle,
      form,
      inputStyle,
      disableNextAdd,
      loader,
      loaderReset,
      slider,
      sliderReset,
      lock,
      active,
      inactive,
      mode,
      Edit,
      ...toRefs(state),
    };
  },
  mounted() {
    this.lock = Boolean(this.list.data.length > 0);
  },
  methods: {
    setDrawer(mode: string, title: string) {
      this.drawerTitle = title;
      this.drawer = true;
      this.mode = mode;
    },
    setForm(item: any) {
      const { id, title, date, detail, complete, img } = item;
      this.form.id = id;
      this.form.title = title;
      this.form.date = date;
      this.form.detail = detail;
      this.form.complete = complete;
      this.form.img = img;
    },
    handleComplete(item: any) {
      this.setForm(item);
      this.setDrawer("complete", `Complete Item: ${item.title}`);
    },
    handleView(item: any) {
      this.setForm(item);
      this.setDrawer("complete", `View Item: ${item.title}`);
    },
    handleAdd() {
      this.resetForm();
      this.setDrawer("add", "Add Item");
    },
    handleEdit(item: any) {
      this.setForm(item);
      this.setDrawer("edit", "Edit Item Setting");
    },
    handleItem(item: any) {
      if (this.lock) {
        if (item.complete) {
          this.handleView(item);
        } else {
          this.handleComplete(item);
        }
      } else {
        this.handleEdit(item);
      }
    },
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
      this.disableNextAdd = Boolean(val.toString().length === 0);
    },
    handleSelect(data: string[]) {
      this.form.img = data[0] ? data[0] : "";
      this.disableNextAdd = Boolean(data.length === 0);
    },
    handleSlide(num: any) {
      this.disableNextAdd = Boolean(num !== "end");
      if (num === 0 || num === "start") {
        if (this.mode === "add" || this.mode === "edit")
          this.disableNextAdd = Boolean(this.form.title.length === 0);
        if (this.mode === "complete")
          this.disableNextAdd = Boolean(this.form.date.length === 0);
      }
      if (num === 1) {
        this.disableNextAdd = Boolean(this.form.img.length === 0);
      }
    },
    handleSubmit() {
      this.drawer = false;
      const item = cloneDeep(this.form);
      const idx = findIndex(this.list.data, (x) => x.id === item.id);
      console.log(this.list.data);
      if (this.mode === "add" || this.mode === "edit") {
        if (idx === -1) {
          this.list.data.push(item);
        } else {
          this.list.data[idx] = item;
        }
      } else if (this.mode === "complete") {
        console.log(idx);
        if (idx !== -1) {
          this.list.data[idx] = item;
          this.list.data[idx].complete = true;
          console.log(item);
        }
      }
      this.resetForm();
    },
    resetForm() {
      this.$nextTick(() => {
        const id = this.list.data[this.list.data.length - 1].id;
        this.form.id = id + 1;
        this.form.title = "";
        this.form.img = "";
        this.form.date = null;
        this.form.detail = "";
        this.form.complete = false;
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
  &__complete {
    display: flex;
    flex-direction: column;
    align-items: center;
    & h1 {
      font-size: 64px;
      margin: 10px;
      display: flex;
      align-items: center;
    }
    & .el-icon {
      cursor: pointer;
    }
    &__form {
      width: 80%;
      display: flex;
      min-width: 300px;
      &__block {
        flex: 1;
        padding: 10px;
      }
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
  padding: 0;
}
</style>
