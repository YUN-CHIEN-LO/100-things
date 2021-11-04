<template>
  <div class="slider" ref="slider" :style="{ height: props.height }">
    <div class="slider__content" :style="setSlide" ref="sliderContent">
      <slot></slot>
    </div>
    <div
      class="slider__overlay"
      :class="{ 'is-end__overlay': isEnd || props.isOverlay }"
    >
      <i class="el-icon" data-v-394d1fd8="" style="--font-size: 64px"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          data-v-394d1fd8=""
        >
          <path
            fill="currentColor"
            d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
          ></path></svg
      ></i>
    </div>
    <div class="slider__btn slider__btn--prev" @click="handleSlide(-1)">
      <i class="el-icon" data-v-066465b6="" style="--font-size: 32px"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          data-v-066465b6=""
        >
          <path
            fill="currentColor"
            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
          ></path>
          <path
            fill="currentColor"
            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
          ></path></svg
      ></i>
    </div>

    <div
      class="slider__btn slider__btn--next"
      :class="{ 'is-end': isEnd, 'is-disabled': disableNext }"
      @click="handleSlide(1)"
    >
      <i class="el-icon" data-v-066465b6="" style="--font-size: 32px"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          data-v-066465b6=""
        >
          <path
            fill="currentColor"
            d="M754.752 480H160a32 32 0 1 0 0 64h594.752L521.344 777.344a32 32 0 0 0 45.312 45.312l288-288a32 32 0 0 0 0-45.312l-288-288a32 32 0 1 0-45.312 45.312L754.752 480z"
          ></path></svg
      ></i>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
export default defineComponent({
  name: "Slider",
  props: {
    height: {
      type: String,
      default: "100%",
    },
    disableNext: {
      type: Boolean,
      default: false,
    },
    isOverlay: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const num = ref(0);
    const isEnd = ref(false);
    const setSlide = computed(() => {
      return {
        transform: `translateX(-${100 * num.value}%)`,
      };
    });
    return {
      props,
      num,
      setSlide,
      isEnd,
    };
  },
  methods: {
    handleSlide(step) {
      if (step === 1 && this.disableNext) {
        return;
      }
      if (step === -1 && this.isEnd) {
        this.isEnd = false;
        return;
      }
      if (this.isEnd) {
        this.$emit("slider:submit");
        this.reset();
        return;
      }
      if (this.num + step < 0) {
        this.$emit("slider", "start");
        return;
      }
      if (this.num + step === this.$refs.sliderContent.children.length) {
        this.$emit("slider", "end");
        this.isEnd = true;
        return;
      }
      if (!this.isEnd) {
        this.num += step;
      }
      this.$emit("slider", this.num);
      this.isEnd = false;
    },
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
    display: flex;
    justify-content: center;
    align-items: center;
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
  &__overlay {
    transform: 0.3s;
    width: 0%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    right: 0;
  }
}

.is-end {
  left: 50%;
  transition-duration: 0.3s;
  width: 150px;
  height: 150px;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 30s linear infinite;
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
    display: flex;
    justify-content: center;
    align-items: center;
    & .el-icon {
      animation: loading 3s linear infinite;
      color: #fff;
    }
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
