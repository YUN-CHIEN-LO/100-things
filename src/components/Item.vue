<template>
  <div
    class="item"
    :class="{ 'is-edit': isEdit }"
    @mouseover="isEdit = true"
    @mouseleave="isEdit = false"
  >
    <div class="item__img">
      <img
        :src="`https://picsum.photos/id/1/300/180?grayscale&blur=5`"
        alt=""
      />
    </div>
    <div class="item__content">
      <div class="item__card item__view">
        <div :style="titleFontSize" class="item__view__title">
          <span>{{ title }}</span>
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
  setup() {
    const title = ref("Hello World");
    let isEdit = ref(false);

    const titleFontSize = computed(() => {
      const len = title.value.length;
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
      title,
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
  &__edit {
    cursor: pointer;
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
  & .item__content {
    transform: translateY(-100%);
  }
  & .item__img {
    filter: contrast(80%) brightness(50%);
  }
}
</style>
