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
      <img v-if="props.color" :src="props.url" alt="" />
      <img v-if="!props.color" :src="props.url + '?grayscale&blur=5'" alt="" />
    </div>
    <div class="item__content">
      <div class="item__card item__view">
        <div :style="titleFontSize" class="item__view__title">
          <span>{{ props.title }}</span>
        </div>
      </div>
      <div class="item__card item__edit">
        <i
          v-show="!props.lock"
          class="el-icon"
          data-v-066465b6=""
          style="--font-size: 64px"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-066465b6=""
          >
            <path
              fill="currentColor"
              d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256z"
            ></path></svg
        ></i>
        <i
          v-show="props.lock"
          class="el-icon"
          data-v-066465b6=""
          style="--font-size: 64px"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-066465b6=""
          >
            <path
              v-show="!complete"
              fill="currentColor"
              d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z"
            ></path>
            <path
              v-show="complete"
              fill="currentColor"
              d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"
            ></path>
          </svg>
        </i>
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
    lock: {
      type: Boolean,
      default: false,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    color: Boolean,
  },
  setup(props) {
    let isEdit = ref(false);

    const titleFontSize = computed(() => {
      const len = props.title.length;
      if (len < 10) {
        return {
          fontSize: "64px",
        };
      }
      if (len >= 15 && len < 25) {
        return {
          fontSize: "48px",
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
      margin: 10px;
      color: #fff;
      @include centerFlex();
      word-break: break-all;
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
