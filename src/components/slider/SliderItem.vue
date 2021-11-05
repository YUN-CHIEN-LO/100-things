<template>
  <div class="slider-item" ref="item" :style="setHeight">
    <!-- 標題 -->
    <h1 v-if="props.title">{{ props.title }}</h1>
    <!-- 插槽 -->
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
export default defineComponent({
  name: "SliderItem",
  props: {
    title: String,
    slider: Object as any,
  },
  setup(props) {
    let setHeight = reactive({ height: "100%" });
    return { props, setHeight };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHeight.height = `${this.props.slider.$el.clientHeight}px`;
    });
  },
});
</script>

<style lang="scss" scoped>
.slider-item {
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  & h1 {
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 10;
    padding: 20px 0px;
    margin: 0;
  }
}
</style>
