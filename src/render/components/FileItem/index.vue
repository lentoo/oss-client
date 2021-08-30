<template>
  <div class="file-item" @click="$emit('click')">
    <img
      class="file-icon"
      v-if="isDir"
      src="../../resources/images/icon-folder.png"
    />
    <img class="file-icon" v-else :src="mimetypeImage" />

    <p v-if="editing" @click.stop="() => {}">
      <a-input
        :autofocus="editing"
        size="small"
        v-model:value="value"
        @pressEnter="pressEnter"
        @blur="pressEnter"
      />
    </p>
    <p v-else>{{ filename }}</p>

    <span class="file-size">{{ isDir ? "--" : displayFileSize }}</span>
    <span class="file-date">{{ fileDate }}</span>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { mimetypeToImage, converFileDate, converFileSize } from "./index";
export default defineComponent({
  name: "file-item",
  emits: ["click", "rename", "cancelRename"],
  props: {
    filename: {
      type: String,
      required: true,
    },
    isDir: {
      type: Boolean,
      default: false,
    },
    editing: {
      type: Boolean,
      default: false,
    },
    mimetype: {
      type: String,
      default: "",
    },
    size: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const value = ref(props.filename);

    const pressEnter = () => {
      console.log("pressEnter");

      if (value.value.trim() === "") {
        context.emit("cancelRename");
        return;
      }
      if (value.value === props.filename) {
        context.emit("cancelRename");

        return;
      }
      context.emit("rename", value.value);
    };

    const mimetypeImage = computed(() => {
      return mimetypeToImage(props.mimetype);
    });

    const displayFileSize = computed(() => {
      const size = props.size;
      return converFileSize(size);
    });

    const fileDate = computed(() => {
      return converFileDate(new Date(props.date).valueOf());
    });
    return {
      value,
      mimetypeImage,
      pressEnter,
      displayFileSize,
      fileDate,
    };
  },
});
</script>
<style lang="scss">
.file-item {
  // height: 35px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  color: #666;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  border-bottom: 1px solid #e5e5e5;
  user-select: none;
  .file-icon {
    height: 24px;
    width: 24px;
    margin-right: 10px;
  }
  p {
    margin-bottom: 0;
    flex: 1;
    &:hover {
      text-decoration: underline;
      user-select: none;
    }
  }
  .file-size,
  .file-date {
    color: #999;
    font-size: 14px;
    width: 100px;
  }
  .file-date {
    width: 160px;
  }
}
</style>
