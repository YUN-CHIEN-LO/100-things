<template>
  <div class="loader">
    <div class="loader__images">
      <Image
        v-for="image in imageList.data"
        :key="image.id"
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
    // 圖片段落
    let pageNum = ref(1);
    // 是否禁用
    let disable = ref(false);
    // 是否重置
    let resetFlag = ref(false);
    // 圖片列表
    let imageList = reactive({ data: [] as any[] });
    // 已選擇的圖片
    let selectList = reactive({ data: [] as string[] });

    // 若選擇數量超過最大限制，禁用
    watch(
      () => selectList.data,
      (newVal, oldVal) => {
        if (props.maxNum) disable.value = newVal.length >= props.maxNum;
      },
      { deep: true }
    );

    // lodash includes 方法
    const includeLodash = (arr: any[], item: any) => {
      return includes(arr, item);
    };
    return {
      props,
      // 圖片段落
      pageNum,
      // 是否禁用
      disable,
      // 是否重置
      resetFlag,
      // 圖片列表
      imageList,
      // 已選擇的圖片
      selectList,
      includeLodash,
    };
  },
  mounted() {
    this.getImagesApi();
  },
  methods: {
    /**
     * 取得圖片
     */
    getImagesApi() {
      axios
        .get("https://picsum.photos/v2/list", {
          params: {
            page: this.pageNum,
          },
        })
        .then((res) => {
          // 延伸圖片列表
          this.imageList.data = concat(this.imageList.data, res.data);
          this.pageNum++;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /**
     * 處理選擇動作
     *
     * @param {string} url - 圖片網址
     * @param {boolean} add - 是否新增
     */
    handleSelect(url: string, add: boolean) {
      this.resetFlag = false;
      if (add && !includes(this.selectList.data, url)) {
        // 若新增並且選擇列表中尚未存在
        this.selectList.data.push(url);
      } else if (!add) {
        // 移除選擇圖片
        remove(this.selectList.data, (x) => x === url);
      }
      this.$emit("select", this.selectList.data);
    },

    /**
     * 重置
     */
    reset() {
      this.selectList.data = [];
      this.resetFlag = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.loader {
  &__tool {
    margin: 30px 0px;
  }
}
</style>
