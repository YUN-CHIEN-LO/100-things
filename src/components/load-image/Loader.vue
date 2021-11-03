<template>
  <div class="loader">
    <div class="loader__images">
      <Image
        v-for="image in imageList.data"
        :key="image.id"
        :id="image.id"
        :url="`https://picsum.photos/id/${image.id}/300/180`"
        :disable="disable"
        :checked="
          includeLodash(
            props.value,
            `https://picsum.photos/id/${image.id}/300/180`
          )
        "
        :resetFlag="resetFlag"
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
    value: {
      type: Array as () => Array<string>,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    let pageNum = ref(1);
    let imageList = reactive({ data: [] as any[] });
    let selectList = reactive({ data: [] as string[] });
    let disable = ref(false);
    let resetFlag = ref(false);
    watch(
      () => selectList.data,
      (newVal, oldVal) => {
        if (props.maxNum) disable.value = newVal.length >= props.maxNum;
      },
      { deep: true }
    );
    const includeLodash = (arr: any[], item: any) => {
      return includes(arr, item);
    };
    return {
      props,
      pageNum,
      imageList,
      selectList,
      disable,
      includeLodash,
      resetFlag,
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
      this.resetFlag = false;
      if (add && !includes(this.selectList.data, url)) {
        this.selectList.data.push(url);
      } else if (!add) {
        remove(this.selectList.data, (x) => x === url);
      }
      this.$emit("select", this.selectList.data);
    },
    reset() {
      this.selectList.data = [];
      this.resetFlag = true;
    },
  },
});
</script>
