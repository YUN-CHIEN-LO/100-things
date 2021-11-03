<template>
  <div class="slider-item" ref="item" :style="setHeight">
    <h1 v-if="props.title">{{ props.title }}</h1>
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
export default defineComponent({
  name: "SliderItem",
  props: {
    title: String,
  },
  setup(props) {
    let setHeight = reactive({ height: "100%" });
    return { props, setHeight };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHeight.height = `${this.$parent.$refs.slider.clientHeight}px`;
    });
  },
});
</script>

<style lang="scss" scoped>
.slider-item {
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 20px 10px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
