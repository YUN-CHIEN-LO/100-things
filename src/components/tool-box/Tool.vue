<template>
  <div class="tool">
    <div class="tool__icon">
      <el-icon :size="32">
        <slot></slot>
      </el-icon>
    </div>
    <div class="tool__title">
      {{ props.title }}
    </div>
  </div>
</template>

<script lang="ts">
import { ElIcon } from "element-plus";
export default {
  name: "Tool",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  components: {
    ElIcon,
  },
  setup(props: any) {
    return {
      props,
    };
  },
};
</script>

<style lang="scss">
.tool {
  margin: 5px 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &__icon {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    @include setColor();
    @include centerFlex();
    color: #fff;
    border-radius: 100%;
    transition-duration: 0.3s;
  }
  &__title {
    opacity: 0;
    transition-duration: 0.3s;
    width: 0px;
    white-space: nowrap;
    z-index: -1;
  }
  &:hover {
    & .tool {
      &__icon {
        box-shadow: 10px 10px rgba(0, 0, 0, 0.5);
      }
      &__title {
        opacity: 1;
        width: 100px;
        margin-left: -10px;
        background-color: #fff;
        padding: 10px 20px;
      }
    }
  }
}
</style>
