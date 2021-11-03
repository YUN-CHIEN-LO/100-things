<template>
  <div class="loader">
    <div class="loader__images">
      <Image
        v-for="image in imageList.data"
        :key="image.id"
        :id="image.id"
        :disable="disable"
        @select-image="handleSelect"
      />
    </div>
    <div class="loader__tool">
      <el-button type="info" @click="getImagesApi()">Load More</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import Image from "./Image.vue";
import { defineComponent, ref, reactive, watch } from "vue";
import axios from "axios";
import { concat, includes, remove } from "lodash";
export default defineComponent({
  name: "Loader",
  components: {
    Image,
  },
  props: {
    maxNum: Number,
  },
  setup(props) {
    let pageNum = ref(1);
    let imageList = reactive({ data: [] as any[] });
    let selectList = reactive({ data: [] as string[] });
    let disable = ref(false);
    watch(
      () => selectList.data,
      (newVal, oldVal) => {
        if (props.maxNum) disable.value = newVal.length >= props.maxNum;
      },
      { deep: true }
    );
    return {
      pageNum,
      imageList,
      selectList,
      disable,
    };
  },

  mounted() {
    this.getImagesApi();
  },
  methods: {
    getImagesApi() {
      axios
        .get("https://picsum.photos/v2/list", {
          params: {
            page: this.pageNum,
          },
        })
        .then((res) => {
          this.imageList.data = concat(this.imageList.data, res.data);
          this.pageNum++;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSelect(url: string, add: boolean) {
      if (add && !includes(this.selectList.data, url)) {
        this.selectList.data.push(url);
      } else if (!add) {
        remove(this.selectList.data, (x) => x === url);
      }
      this.$emit("select", this.selectList.data);
    },
    reset() {
      this.selectList.data = [];
    },
  },
});
</script>
