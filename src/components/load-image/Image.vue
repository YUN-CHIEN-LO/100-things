<template>
  <div class="image" @click="handleClick">
    <!-- 圖片 -->
    <img :src="props.url" alt="" />
    <!-- 遮罩 -->
    <div
      :class="{
        'is-check': props.checked || isCheck,
      }"
      class="image__cover"
    >
      <!-- 遮罩 -->
      <div class="image__cover__item"></div>
      <!-- icon -->
      <div class="image__cover__item image__cover__check">
        <div class="check-icon">
          <div class="bar bar--right">
            <div class="bar__item"></div>
          </div>
          <div class="bar bar--left">
            <div class="bar__item"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
export default defineComponent({
  name: "Image",
  props: {
    url: {
      type: String,
      defaule: "https://picsum.photos/id/0/300/180`",
    },
    disable: {
      type: Boolean,
      default: false,
    },
    checked: Boolean,
    resetFlag: Boolean,
  },
  setup(props) {
    // 是否選擇
    let isCheck = ref(false);
    watch(
      () => props.resetFlag,
      (newValue: boolean, oldValue: boolean) => {
        if (newValue === true) {
          isCheck.value = false;
        }
      }
    );
    return {
      props,
      // 是否選擇
      isCheck,
    };
  },
  methods: {
    /**
     * 處理點擊事件
     */
    handleClick() {
      if (this.disable && !this.isCheck) {
        return;
      }
      this.isCheck = !this.isCheck;
      this.$emit("select-image", this.props.url, this.isCheck);
    },
    /**
     * 重置
     */
    reset() {
      this.isCheck = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.image {
  width: 300px;
  height: 180px;
  border-radius: 10px;
  overflow: hidden;
  margin: 5px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  &__cover {
    position: absolute;
    top: 0;
    left: 0%;
    width: 200%;
    height: 100%;
    display: flex;
    transition-duration: 0.1s;
    &__item {
      width: 50%;
      height: 100%;
    }
    &__check {
      background-color: rgba(0, 0, 0, 0.5);
      @include centerFlex();
      color: white;
    }
  }
}
.check-icon {
  position: relative;
  width: 80px;
  height: 80px;
  & .bar {
    position: relative;
    transform: translate(-50%, -50%);
    position: absolute;
    top: 50%;
    left: 50%;
    transition-duration: 0.1s;
    &__item {
      height: 8px;
      width: 40px;
      background-color: #fff;
      border-radius: 8px;
    }
  }
  & .bar--right {
    transform: translate(-75%, 80%) rotate(45deg);
  }
  & .bar--left {
    transform: translate(-17%, -5%) rotate(-45deg);
    & .bar__item {
      width: 60px;
    }
  }
  &:hover {
    & .bar__item {
      width: 80px;
      background-color: rgb(209, 47, 47);
    }
    & .bar--right {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    & .bar--left {
      transform: translate(-50%, -50%) rotate(45deg);
    }
  }
}
.is-check {
  left: -100%;
}
</style>
