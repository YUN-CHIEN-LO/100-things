<template>
  <div class="item" :class="{ 'is-edit': isEdit }">
    <!-- 底圖 -->
    <div class="item__img">
      <!-- 新增項目 -->
      <div v-if="props.url === ''" class="item__card item__default">
        <el-icon :size="64"> <plus /> </el-icon>
      </div>
      <!-- 有色圖片 -->
      <img v-if="props.color" :src="props.url" alt="" />
      <!-- 黑白圖片 -->
      <img v-if="!props.color" :src="props.url + '?grayscale&blur=5'" alt="" />
    </div>
    <div
      class="item__content"
      @mouseover="isEdit = true"
      @mouseleave="isEdit = false"
    >
      <!-- 標題 -->
      <div class="item__card item__view">
        <div :style="titleFontSize" class="item__view__title">
          <span>{{ props.title }}</span>
        </div>
      </div>
      <!-- 動作 -->
      <div class="item__card item__edit">
        <!-- 編輯 -->
        <el-icon v-show="!props.lock" :size="64"><setting /></el-icon>
        <!-- 完成 -->
        <el-icon v-show="props.lock && !complete" :size="64"><plus /></el-icon>
        <!-- 檢視 -->
        <el-icon v-show="props.lock && complete" :size="64"><View /></el-icon>
      </div>
    </div>
    <!-- 工具列 -->
    <transition name="slide-fade">
      <div
        v-show="!props.lock"
        class="item__info"
        @click="(evt) => evt.stopPropagation()"
      >
        <!-- 編號 -->
        <span>
          {{ props.sort }}
        </span>
        <!-- 刪除 -->
        <el-icon
          :size="18"
          class="item__info__delete"
          @click="handleDelete(evt, props.id)"
          ><delete
        /></el-icon>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Plus, Delete, Setting, View } from "@element-plus/icons";
import { defineComponent, ref, computed } from "vue";
import { ElIcon, ElMessageBox } from "element-plus";

export default defineComponent({
  name: "Item",
  components: { ElIcon, Delete, Plus, Setting, View },
  props: {
    id: Number,
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
    sort: Number,
  },
  setup(props) {
    let isEdit = ref(false);
    // 設定字體大小
    const titleFontSize = computed(() => {
      const len = props.title.length;
      if (len < 10) {
        return {
          fontSize: "48px",
        };
      }
      if (len < 20) {
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
      isEdit,
      titleFontSize,
    };
  },
  methods: {
    /**
     * 處理刪除動作
     *
     * @param {object} evt - event
     * @param {number} id - id
     */
    handleDelete(evt: any, id: number) {
      ElMessageBox.confirm("Are you sure you want to delete this?", {
        confirmButtonText: "Delete",
      })
        .then(() => {
          this.$emit("item:delete", id);
        })
        .catch(() => {
          // catch error
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.item {
  width: 300px;
  height: 180px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin: 5px;
  transition-duration: 0.5s;
  &__content {
    @include fill();
    transition-duration: 0.3s;
  }
  &__info {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 5px 20px;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include setColor();
    &__delete {
      cursor: pointer;
    }
  }
  &__card {
    position: relative;
    @include fill();
    @include centerFlex();
  }
  &__img {
    @include setColor();
    @include center();
    filter: contrast(80%);
    transition-duration: 0.5s;
  }
  &__view {
    &__title {
      margin: 10px;
      color: #fff;
      @include centerFlex();
      white-space: normal;
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

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
