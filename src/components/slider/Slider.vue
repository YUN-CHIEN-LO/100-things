<template>
  <div class="slider" ref="slider" :style="{ height: props.height }">
    <div class="slider__content" :style="setSlide" ref="sliderContent">
      <slot></slot>
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
      :class="{ 'is-end': isEnd }"
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
      if (this.isEnd) {
        this.$emit("slider:submit");
        this.reset();
      } else if (this.num + step < 0) {
        this.$emit("slider", "start");
      } else if (this.num + step === this.$refs.sliderContent.children.length) {
        this.$emit("slider", "end");
        this.isEnd = true;
      } else {
        if (!this.isEnd) {
          this.num += step;
        }
        this.$emit("slider", this.num);
        this.isEnd = false;
      }
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
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 30s linear infinite;
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
  &:hover {
    transform: translate(-50%, -50%) rotate(45deg) scale(1.3);
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
</style>
