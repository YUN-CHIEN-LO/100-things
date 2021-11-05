<template>
  <div class="tool-box" :class="{ 'is-not-lock': !props.isLock }">
    <div class="tool-box__content">
      <slot></slot>
    </div>
    <div class="tool-box__lid">
      <el-icon :size="32"><more-filled /></el-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { ElIcon } from "element-plus";
import { MoreFilled } from "@element-plus/icons";
export default {
  name: "ToolBox",
  components: {
    ElIcon,
    MoreFilled,
  },
  props: {
    isLock: {
      type: Boolean,
      default: true,
    },
  },
  setup(props: any) {
    return {
      props,
    };
  },
};
</script>

<style lang="scss">
.tool-box {
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 25px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  &__lid,
  &__content {
    transition-duration: 0.3s;
    transition-delay: 0.1s;
  }
  &__lid {
    width: 60px;
    height: 60px;
    @include setColor();
    @include centerFlex();
    color: #fff;
    border-radius: 100%;
    cursor: pointer;
  }
  &__content {
    opacity: 0;
    transform: translateY(100%) scale(0);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  &:hover {
    & .tool-box {
      &__content {
        opacity: 1;
        transform: translateY(0%) scale(1);
      }
      &__lid {
        box-shadow: 10px 10px rgba(0, 0, 0, 0.5);
        background: #eee;
        color: #333;
      }
    }
  }
}

.is-not-lock .tool-box {
  &__content {
    opacity: 1;
    transform: translateY(0%) scale(1);
  }
  &__lid {
    box-shadow: 10px 10px rgba(0, 0, 0, 0.5);
    background: #eee;
    color: #333;
  }
}
</style>
