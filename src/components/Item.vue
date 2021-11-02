<template>
  <div
    class="item"
    :class="{ 'is-edit': isEdit }"
    @mouseover="isEdit = true"
    @mouseleave="isEdit = false"
  >
    <div class="item__img">
      <div v-if="props.url === ''" class="item__card item__default">
        <i class="el-icon" data-v-066465b6="" style="--font-size: 64px"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-066465b6=""
          >
            <path
              fill="currentColor"
              d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z"
            ></path></svg
        ></i>
      </div>
      <img :src="props.url + '?grayscale&blur=5'" alt="" />
    </div>
    <div class="item__content">
      <div class="item__card item__view">
        <div :style="titleFontSize" class="item__view__title">
          <span>{{ props.title }}</span>
        </div>
      </div>
      <div class="item__card item__edit">
        <i class="el-icon" data-v-066465b6="" style="--font-size: 64px"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-066465b6=""
          >
            <path
              fill="currentColor"
              d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z"
            ></path></svg
        ></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Plus } from "@element-plus/icons";
import { defineComponent, ref, computed } from "vue";

export default defineComponent({
  name: "Item",
  props: {
    url: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    let isEdit = ref(false);

    const titleFontSize = computed(() => {
      const len = props.title.length;
      if (len < 15) {
        return {
          fontSize: "64px",
        };
      }
      if (len >= 15 && len < 30) {
        return {
          fontSize: "32px",
        };
      }
      return {
        fontSize: "24px",
      };
    });
    return {
      props,
      Plus,
      isEdit,
      titleFontSize,
    };
  },
});
</script>

<style lang="scss" scoped>
@mixin center() {
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
}
@mixin centerFlex() {
  display: flex;
  justify-content: center;
  align-items: center;
}
@mixin fill() {
  width: 100%;
  height: 100%;
}
.item {
  width: 300px;
  height: 180px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin: 5px;
  &__content {
    @include fill();
    transition-duration: 0.3s;
  }
  &__card {
    position: relative;
    @include fill();
    @include centerFlex();
  }
  &__img {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    @include center();
    filter: contrast(80%);
    transition-duration: 0.5s;
  }
  &__view {
    &__title {
      @include center();
      color: #fff;
      @include centerFlex();
    }
  }
  &__edit,
  &__default {
    cursor: pointer;
    transition-duration: 0.5s;
    & .el-icon {
      color: #fff;
    }
    &:hover {
      & .el-icon {
        transition-duration: 0.3s;
        transform: rotate(180deg);
      }
    }
  }
}

.is-edit {
  & .item__content,
  & .item__default {
    transform: translateY(-100%);
  }
  & .item__img {
    filter: contrast(80%) brightness(50%);
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
