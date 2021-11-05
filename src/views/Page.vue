<template>
  <div class="page">
    <!-- 工具列 -->
    <div class="page__tool">
      <!-- 進度條 -->
      <div
        class="page__tool__bar"
        :style="{ width: `${setPercentage(compRate, list.length)}` }"
      ></div>
      <h1>{{ setPercentage(compRate, list.length) }}</h1>
      <!-- 編輯/檢視模式 -->
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

    <!-- 項目 -->
    <div class="page__items">
      <!-- 一般項目 -->
      <Item
        v-for="(item, id) in list"
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
      <!-- 新增項目 -->
      <Item :style="showAddItem" :lock="true" @click="itemAdd" />
    </div>
    <!-- 表單 -->
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
        <!-- 新增/編輯標題 -->
        <SliderItem
          v-if="mode === 'add' || mode === 'edit'"
          class="page__form__title"
          :title="'Insert A Title'"
          :slider="slider"
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
            @click="autoStart(1)"
            >Generate A Random Item !</el-button
          >
        </SliderItem>

        <!-- 新增/編輯圖片 -->
        <SliderItem
          v-if="mode === 'add' || mode === 'edit'"
          :title="'Select a Cover'"
          :slider="slider"
        >
          <Loader
            ref="loader"
            :value="[form.img]"
            :max-num="1"
            @select="handleSelect"
          />
        </SliderItem>

        <!-- 新增/編輯完成狀態 -->
        <SliderItem
          v-if="mode === 'complete' || mode === 'view'"
          class="page__complete"
          :slider="slider"
        >
          <!-- 標題 -->
          <h1>
            {{ form.title }}
            <!-- 編輯icon -->
            <el-icon
              v-show="form.complete"
              :size="42"
              @click="form.complete = !form.complete"
            >
              <edit />
            </el-icon>
          </h1>
          <!-- 完成項目 - 表單內容 -->
          <div class="page__complete__form">
            <div class="page__complete__form__block">
              <!-- 選擇日期 -->
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
              <!-- 細節 -->
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

    <!-- 起始設定 -->
    <el-dialog v-model="dialog" title="Start A Project" fullscreen>
      <div class="page__dialog">
        <!-- 自動產生 -->
        <div class="page__dialog__block">
          <div class="page__dialog__block__inner" @click="autoStart(genNum)">
            <span>Generate For Me!</span>
            <el-select
              v-model="genNum"
              @click="
                (evt) => {
                  evt.stopPropagation();
                }
              "
            >
              <el-option
                v-for="item in genOptions"
                :key="item"
                :value="item"
                @click="
                  (evt) => {
                    evt.stopPropagation();
                  }
                "
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 手動產生 -->
        <div class="page__dialog__block page__dialog--right">
          <div class="page__dialog__block__inner" @click="selfStart">
            <span>Create My Own!</span>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 工具箱 -->
    <tool-box>
      <tool v-show="!lock" title="Add A Item !" @click="itemAdd">
        <plus />
      </tool>
      <tool title="Back To Top !" @click="backToTop"><arrow-up /></tool>
    </tool-box>
    <!-- 遮罩 -->
    <div v-show="isOverlay" class="page__overlay">
      <el-icon class="page__overlay__icon" :size="64">
        <loading />
      </el-icon>
      <h1 v-if="genNum > 0">{{ setPercentage(list.length, genNum) }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  computed,
  toRefs,
  shallowRef,
} from "vue";
import Loader from "@/components/load-image/Loader.vue";
import Item from "@/components/Item.vue";
import Slider from "@/components/slider/Slider.vue";
import SliderItem from "@/components/slider/SliderItem.vue";
import ToolBox from "@/components/tool-box/ToolBox.vue";
import Tool from "@/components/tool-box/Tool.vue";
import {
  ElMessageBox,
  ElInput,
  ElDialog,
  ElSelect,
  ElOption,
  ElIcon,
} from "element-plus";
import { Plus, Lock, Edit, Loading, ArrowUp } from "@element-plus/icons";
import { cloneDeep, findIndex } from "lodash";
import axios from "axios";
export default defineComponent({
  name: "Home",
  components: {
    Loader,
    Item,
    Slider,
    SliderItem,
    ToolBox,
    Tool,
    ElInput,
    ElDialog,
    ElSelect,
    ElOption,
    ElIcon,
    Edit,
    Loading,
    Plus,
    ArrowUp,
  },
  setup() {
    /* 維護項目 */

    // 項目列表
    let list = reactive([] as any[]);
    // 初始指標項目
    const idx = list.length > 0 ? list[list.length - 1].id : 0;
    let form = reactive({
      id: idx,
      title: "",
      img: "",
      complete: false,
      date: "",
      detail: "",
    });

    /* 工具列與全局變數 */

    const tools = reactive({
      // 遮罩
      isOverlay: false as boolean,
      // 開啟彈窗(起始設定)
      dialog: true as boolean,
      // 表單模式 (add | edit | complete | view)
      mode: "" as string,
      // 開啟drawer (表單)
      drawer: false as boolean,
      // 表單標題
      drawerTitle: "" as string,
      // 禁用下一頁按鈕
      disableNextAdd: true as boolean,
      // 鎖定模式
      lock: false as boolean,
      // scroll
      isScroll: 0 as number,
    });

    // switch icon
    const active = shallowRef(Lock as any);
    const inactive = shallowRef(Plus as any);

    // 選擇圖片重置 callback
    const loader = ref(null as any);
    const loaderReset = () => {
      loader.value?.reset();
    };

    // slider 表單重置
    const slider = ref(null as any);
    const sliderReset = () => {
      slider.value?.reset();
    };

    /* 完成項目 - 表單元件 */

    const completeForm = reactive({
      // 禁用日期
      disabledDate(time: any) {
        return time.getTime() > Date.now();
      },
      // 捷徑
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

    /* 起始設定 */
    const startSetting = reactive({
      genNum: 5 as number,
      genOptions: [5, 10, 20, 50, 100] as number[],
    });

    /* Computed */
    // 自訂義input樣式
    const inputStyle = computed(() => {
      return {
        textAlign: "center",
        fontSize: "32px",
        padding: "20px",
        marginTop: "20px",
        width: "80%",
      };
    });

    // 計算進度條長度
    const compRate = computed(() => {
      let count = 0;
      list.forEach((x) => {
        if (x.complete) count++;
      });
      return count;
    });

    // 顯示新增項目
    const showAddItem = computed(() => {
      return tools.lock || list.length > 0
        ? {
            width: "0px",
          }
        : {
            width: "300px",
          };
    });

    /**
     * 計算百分比
     *
     * @param {number} child - 分子
     * @param {number} parent - 分母
     */
    const setPercentage = function (child: number, parent: number) {
      if (!parent) return "0%";
      return `${Math.round((child / parent) * 100)}%`;
    };

    return {
      list,
      form,
      loader,
      loaderReset,
      slider,
      sliderReset,
      inputStyle,
      compRate,
      showAddItem,
      active,
      inactive,
      ...toRefs(tools),
      ...toRefs(startSetting),
      ...toRefs(completeForm),
      setPercentage,
    };
  },
  mounted() {
    // 若list為空，則不鎖定
    this.lock = Boolean(this.list.length > 0);
    // 掛載監聽事件
    this.$nextTick(() => {
      window.document.addEventListener("scroll", this.onScroll);
    });
  },
  methods: {
    /**
     * 自動起始
     *
     * @param {number} num - 要產生的項目數量
     */
    autoStart(num: number) {
      let scheduled = [];
      for (let i = 0; i < num; i++) {
        scheduled.push(this.generate());
      }
      this.isOverlay = true;
      this.dialog = false;
      Promise.all(scheduled).then((res) => {
        const timer = setTimeout(() => {
          this.isOverlay = false;
          this.genNum = 0;
          clearTimeout(timer);
        }, 500);
      });
    },
    /**
     * 手動起始
     */
    selfStart() {
      this.dialog = false;
      this.itemAdd();
    },
    /**
     * 點擊項目事件
     *
     * @param {object} item - 被點擊的項目
     */
    handleItem(item: any) {
      // 賦值至指標項目
      const { id, title, img, date, detail, complete } = item;
      this.form.id = id;
      this.form.title = title;
      this.form.img = img;
      this.form.date = date;
      this.form.detail = detail;
      this.form.complete = complete;

      // 分流動作
      if (this.lock) {
        if (item.complete) {
          // 檢視模式
          this.itemView();
        } else {
          // 完成模式
          this.itemComplete();
        }
      } else {
        // 編輯模式
        this.itemEdit();
      }
    },
    /**
     * 檢視項目
     */
    itemView() {
      this.setMode("view", `View Item`);
    },
    /**
     * 完成項目
     */
    itemComplete() {
      this.setMode("complete", `Complete Item`);
    },
    /**
     * 檢視項目
     */
    itemEdit() {
      this.setMode("edit", "Edit Item Setting");
      this.disableNextAdd = false;
    },
    /**
     * 新增項目
     */
    itemAdd() {
      this.setMode("add", "Add Item");
    },
    /**
     * 處理刪除項目事件
     *
     * @param {number} id - 要刪除的項目id
     */
    handleDelete(id: number) {
      const idx = findIndex(this.list, (x) => x.id === id);
      if (idx === -1) return;
      this.list.splice(idx, 1);
    },
    /**
     * 處理傳送表單事件
     */
    handleSubmit() {
      this.drawer = false;
      const item = cloneDeep(this.form);
      const idx = findIndex(this.list, (x) => x.id === item.id);

      if (idx === -1) {
        if (this.mode === "add" || this.mode === "edit") this.list.push(item);
      } else {
        this.list[idx] = item;
        if (this.mode === "complete" || this.mode === "view") {
          this.list[idx].complete = true;
        }
      }
      // 重置表單
      this.resetForm();
    },
    /**
     * 關閉 drawer callback
     *
     * @param {function} done - 關閉回呼函式
     */
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
    /**
     * 處理表單換頁事件
     *
     * @param {number | string} num - 頁碼 | start | end
     */
    handleSlide(num: number | string) {
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
    /**
     * 處理 Input 驗證
     *
     * @param {string | number} val - input 的值
     */
    handleInput(val: string | number) {
      this.disableNextAdd = Boolean(val.toString().length === 0);
    },
    /**
     * 處理選擇圖片驗證
     *
     * @param {array} data - 選擇的圖片
     */
    handleSelect(data: string[]) {
      this.form.img = data[0] ? data[0] : "";
      this.disableNextAdd = Boolean(data.length === 0);
    },
    /**
     * 重置表單
     */
    resetForm() {
      this.$nextTick(() => {
        const id = this.list[this.list.length - 1]
          ? this.list[this.list.length - 1].id
          : 0;
        this.form.id = id + 1;
        this.form.title = "";
        this.form.img = "";
        this.form.date = "";
        this.form.detail = "";
        this.form.complete = false;
      });
      this.loaderReset();
    },
    /**
     * 自動產生項目
     */
    async generate() {
      // 取得項目標題
      await axios
        .get("https://www.boredapi.com/api/activity")
        .then((res) => {
          // 亂數圖片id
          let picId = Math.floor(Math.random() * 300);
          // 檢查圖片是否存在
          axios
            .get(`https://picsum.photos/id/${picId}/300/180`)
            .catch((err) => {
              // 若不存在，預設圖片id為0
              picId = 0;
            })
            .finally(() => {
              // 重置表單
              this.resetForm();
              // 新增項目
              this.list.push({
                id: this.form.id,
                title: res.data.activity as string,
                img: `https://picsum.photos/id/${picId}/300/180`,
                complete: false,
                date: "",
                detail: "",
              });
              // 關閉drawer
              this.drawer = false;
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 切換mode參數
     *
     * @param {string} mode - 模式 (add | edit | complete | view)
     * @param {string} title - drawer 標題
     */
    setMode(mode: string, title: string) {
      // 更新模式
      this.mode = mode;
      // 更新 drawer 設定
      this.drawerTitle = title;
      this.drawer = true;
    },
    /**
     * 當 scroll 時，更新 isScroll 狀態
     */
    onScroll() {
      this.isScroll = Math.floor(
        window.pageYOffset !== undefined
          ? window.pageYOffset
          : (
              document.documentElement ||
              document.body.parentNode ||
              document.body
            ).scrollTop
      );
    },
    backToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
});
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  margin-bottom: 100px;
  &__items {
    @include centerFlex();
    flex-wrap: wrap;
    position: relative;
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
      flex-wrap: wrap;
      &__block {
        flex: 1;
        padding: 10px;
        min-width: 300px;
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
        @include setColor();
      }
    }
    &__lock {
      margin-left: auto;
      height: 50px;
      padding: 10px;
      width: 200px;
      @include centerFlex();
      & * {
        transform: scale(2);
      }
    }
  }
  &__dialog {
    display: flex;
    width: 100%;
    height: 80vh;
    flex-wrap: wrap;
    justify-self: start;
    align-items: center;
    &__block {
      flex: 1;
      height: 50%;
      min-width: 300px;
      margin: 5px 20px;
      @include setColor();
      border-radius: 20px;
      &__inner {
        @include centerFlex();
        flex-direction: column;
        margin: 20px;
        height: calc(100% - 40px);
        box-sizing: border-box;
        border-radius: 10px;
        background-color: #fff;
        padding: 0px 30px;
        transition-duration: 0.3s;
        cursor: pointer;
        &:hover {
          background-color: rgba(255, 255, 255, 0.3);
          color: #fff;
        }
        & span {
          margin: 10px;
          font-size: 32px;
          word-break: break-word;
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
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 5000;
    @include centerFlex();
    flex-direction: column;
    color: #fff;
    &__icon {
      animation: loading 3s linear infinite;
    }
  }
}
::v-deep .el-input__inner {
  height: auto;
  text-align: center;
  font-size: 24px;
  background: rgba(0, 0, 0, 0);
}
::v-deep .el-drawer__body {
  overflow-y: auto;
  padding: 0;
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
