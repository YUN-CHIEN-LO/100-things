<template>
  <div class="slider" ref="slider" :style="{ height: props.height }">
    <!-- 滑頁表格的頁面插槽 -->
    <div class="slider__content" :style="setSlide" ref="sliderContent">
      <slot></slot>
    </div>
    <!-- 遮罩 -->
    <div class="slider__overlay" :class="{ 'is-end__overlay': isEnd }"></div>
    <!-- 上一頁按鈕 -->
    <div class="slider__btn slider__btn--prev" @click="handleSlide(-1)">
      <el-icon :size="32"><back /></el-icon>
    </div>
    <!-- 下一頁按鈕 -->
    <div
      class="slider__btn slider__btn--next"
      :class="{ 'is-end': isEnd, 'is-disabled': disableNext }"
      @click="handleSlide(1)"
    >
      <el-icon :size="32"><right /></el-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { ElIcon } from "element-plus";
import { Back, Right } from "@element-plus/icons";
export default defineComponent({
  name: "Slider",
  components: { ElIcon, Back, Right },
  props: {
    // 設定高度
    height: {
      type: String,
      default: "100%",
    },
    // 是否禁用下一頁按鈕
    disableNext: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    // 當前頁碼
    const num = ref(0);
    // 是否到達最後一頁
    const isEnd = ref(false);
    // 換頁動畫：計算頁位置
    const setSlide = computed(() => {
      return {
        transform: `translateX(-${100 * num.value}%)`,
      };
    });
    // $refs
    const sliderContent = ref(null as any);
    return {
      props,
      // 當前頁碼
      num,
      // 是否到達最後一頁
      isEnd,
      // 換頁動畫：計算頁位置
      setSlide,
      // $refs
      sliderContent,
    };
  },
  methods: {
    /**
     * 換頁
     *
     * @param {number} step - 上一頁(1)或下一頁(-1)
     */
    handleSlide(step: number) {
      // 進入下一頁時，預設不能再進入下一頁
      if (step === 1 && this.disableNext) {
        return;
      }

      // 離開 submit 狀態
      if (step === -1 && this.isEnd) {
        this.isEnd = false;
        return;
      }

      // submit 狀態
      if (this.isEnd) {
        this.$emit("slider:submit");
        this.reset();
        return;
      }

      // 到首頁
      if (this.num + step < 0) {
        this.$emit("slider", "start");
        return;
      }

      // 到末頁
      if (this.num + step === this.sliderContent.children.length) {
        this.$emit("slider", "end");
        this.isEnd = true;
        return;
      }

      // 正常切換頁
      if (!this.isEnd) {
        this.num += step;
      }
      this.$emit("slider", this.num);
      this.isEnd = false;
    },

    /**
     * 重設 slider
     */
    reset() {
      this.isEnd = false;
      this.num = 0;
    },
  },
});
</script>

<style lang="scss" scoped>
.slider {
  width: 100%;
  overflow: hidden;
  position: relative;
  &__btn {
    width: 100px;
    height: 100px;
    background-color: rgba(0, 0, 0, 0.2);
    @include centerFlex();
    transform: translate(-50%, -50%) rotate(45deg);
    position: absolute;
    top: 50%;
    cursor: pointer;
    transition-duration: 0.1s;
    z-index: 10;
    &:hover {
      background-color: #333;
      color: #eee;
    }
    &--prev {
      left: 0;
      & .el-icon {
        transform: rotate(-45deg) translateX(50%);
      }
    }
    &--next {
      left: 100%;
      & .el-icon {
        transform: rotate(-45deg) translateX(-50%);
      }
    }
  }
  &__content {
    display: flex;
    transition-duration: 0.3s;
  }
}

.is-end {
  left: 50%;
  transition-duration: 0.3s;
  width: 150px;
  height: 150px;
  @include setColor();
  box-shadow: 10px 10px rgba(0, 0, 0, 0.5);
  & .el-icon {
    transform: scale(0);
  }
  &:after {
    content: "Submit";
    position: absolute;
    font-size: 32px;
    transform: translate(-50%, -50%) rotate(-45deg);
    top: 50%;
    left: 50%;
    color: #fff;
  }
  &:before {
    content: "";
    transition: all 0.3s;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: 90%;
    border: solid 1px #fff;
    z-index: 9;
  }
  &:hover {
    box-shadow: 20px 20px rgba(0, 0, 0, 0.5);
  }
  &:hover::before {
    transition-duration: 0.3;
    border-radius: 100%;
    border: double 10px #fff;
    width: 110%;
    height: 110%;
  }
  &__overlay {
    transform: 0.3s;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    right: 0;
  }
}
.is-disabled {
  cursor: not-allowed;
  background-color: #efefef;
  color: #aaa;
  &:hover {
    background-color: #efefef;
    color: #aaa;
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
