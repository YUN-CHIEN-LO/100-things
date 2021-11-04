<template>
  <div class="page">
    <div class="page__tool">
      <div
        class="page__tool__bar"
        :style="{ width: `${(compRate / list.data.length) * 100}%` }"
      ></div>
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
        v-for="(item, id) in list.data"
        :key="item.id"
        :id="item.id"
        :sort="id + 1"
        :title="item.title"
        :url="item.img"
        :color="item.complete"
        :complete="item.complete"
        :lock="lock"
        @click="handleItem(item)"
        @item:delete="handleDelete"
      />
      <transition name="slide-fade">
        <Item
          :style="{ width: lock ? '0' : '300px' }"
          :lock="true"
          @click="handleAdd"
        />
      </transition>
    </div>
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
            show-word-limit
            @input="handleInput"
          ></el-input>
          <el-button
            v-if="mode === 'add'"
            type="info"
            style="margin-top: 10px"
            @click="handleGenerate"
            >Generate A Random Item !</el-button
          >
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
    <el-dialog v-model="dialog" title="Start A Project" width="100%">
      <div class="page__dialog">
        <div class="page__dialog__block">
          <div class="page__dialog__block__inner">
            <el-select v-model="genNum">
              <el-option v-for="item in genOptions" :key="item" :value="item">
              </el-option>
            </el-select>
            <span @click="generateAll">Generate For Me!</span>
          </div>
        </div>
        <div class="page__dialog__block page__dialog--right">
          <div class="page__dialog__block__inner" @click="dialog = false">
            <span>Create My Own!</span>
          </div>
        </div>
      </div>
    </el-dialog>
    <div :class="{ page__overlay: isOverlay }"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, toRefs } from "vue";
import Loader from "@/components/load-image/Loader.vue";
import Item from "@/components/Item.vue";
import Slider from "@/components/slider/Slider.vue";
import SliderItem from "@/components/slider/SliderItem.vue";
import {
  ElMessageBox,
  ElInput,
  ElDialog,
  ElSelect,
  ElOption,
} from "element-plus";
import { Plus, Lock, Edit } from "@element-plus/icons";
import { cloneDeep, findIndex } from "lodash";
import axios from "axios";
export default defineComponent({
  name: "Home",
  components: {
    Loader,
    Item,
    Slider,
    SliderItem,
    ElInput,
    ElDialog,
    ElSelect,
    ElOption,
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
      data: [] as any[],
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
        width: "80%",
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

    const compRate = computed(() => {
      let count = 0;
      list.data.forEach((x) => {
        if (x.complete) count++;
      });
      return count;
    });

    let isOverlay = ref(false);
    let dialog = ref(true);
    let genNum = ref(10);
    let genOptions = reactive([10, 20, 50, 100]);

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
      compRate,
      isOverlay,
      dialog,
      genNum,
      genOptions,
      ...toRefs(state),
    };
  },
  mounted() {
    this.lock = Boolean(this.list.data.length > 0);
  },
  methods: {
    generateAll() {
      for (let i = 0; i < this.genNum; i++) {
        this.handleGenerate();
      }
      this.dialog = false;
    },
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
    handleGenerate() {
      let picId = Math.floor(Math.random() * 300);
      axios
        .get("https://www.boredapi.com/api/activity")
        .then((res) => {
          axios
            .get(`https://picsum.photos/id/${picId}/300/180`)
            .catch((err) => {
              picId = 0;
            })
            .finally(() => {
              let item = {
                id: this.form.id + 1,
                title: res.data.activity as string,
                img: `https://picsum.photos/id/${picId}/300/180`,
                complete: false,
                date: null,
                detail: "",
              };
              this.list.data.push(item);
              this.resetForm();
              this.drawer = false;
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleComplete(item: any) {
      this.setForm(item);
      this.setDrawer("complete", `Complete Item: ${item.title}`);
    },
    handleView(item: any) {
      this.setForm(item);
      this.setDrawer("view", `View Item: ${item.title}`);
    },
    handleAdd() {
      this.resetForm();
      this.setDrawer("add", "Add Item");
    },
    handleEdit(item: any) {
      this.setForm(item);
      this.setDrawer("edit", "Edit Item Setting");
      this.disableNextAdd = false;
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
    handleDelete(id: number) {
      const idx = findIndex(this.list.data, (x) => x.id === id);
      if (idx === -1) return;
      this.list.data.splice(idx, 1);
    },
    handleClose(done: any) {
      if (this.form.complete) {
        done();
      } else {
        ElMessageBox.confirm("Are you sure you want to close this?")
          .then(() => {
            done();
            this.loaderReset();
            this.sliderReset();
          })
          .catch(() => {
            // catch error
          });
      }
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
      if (this.mode === "add" || this.mode === "edit") {
        if (idx === -1) {
          this.list.data.push(item);
        } else {
          this.list.data[idx] = item;
        }
      } else if (this.mode === "complete") {
        if (idx !== -1) {
          this.list.data[idx] = item;
          this.list.data[idx].complete = true;
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
  margin-bottom: 100px;
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
    margin-bottom: 10px;
    &__bar {
      position: absolute;
      transition-duration: 0.3s;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 10px;
      overflow: hidden;
      &:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100%;
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      }
    }
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
  &__dialog {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    &__block {
      flex: 1;
      height: 30vh;
      min-width: 300px;
      margin: 10px 20px;
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      background-size: 400% 400%;
      animation: gradient 15s ease infinite;
      border-radius: 20px;
      &__inner {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 20px;
        height: calc(100% - 40px);
        box-sizing: border-box;
        border-radius: 10px;
        background-color: #fff;
        padding: 0px 30px;
        transition-duration: 00.3s;
        cursor: pointer;
        &:hover {
          background-color: rgba(255, 255, 255, 0.8);
        }
        & span {
          margin: 10px;
          font-size: 32px;
        }
      }
    }
    &--right {
      animation-delay: -5s;
    }
  }
  &__overlay {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 5000;
  }
}
::v-deep .el-input__inner {
  height: auto;
  text-align: center;
  font-size: 24px;
}
::v-deep .el-drawer__body {
  overflow-y: auto;
  padding: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(50px);
  opacity: 0;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
