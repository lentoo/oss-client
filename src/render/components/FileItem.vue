<template>
  <div class="file-item" @click="$emit('click')">
    <img
      class="file-icon"
      v-if="isDir"
      src="../resources/images/icon-folder.png"
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
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";

import IconImage from "../resources/images/icon-image.png";
import IconUnKnow from "../resources/images/icon-unknow.png";
import IconMp3 from "../resources/images/icon-mp3.png";
import IconVideo from "../resources/images/icon-video.png";
import IconPdf from "../resources/images/icon-pdf.png";
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

    const mimetypeToImage: any = {
      "image/png": IconImage,
      "image/jpg": IconImage,
      "image/jpeg": IconImage,
      "image/bmp": IconImage,
      "image/webp": IconImage,
      "audio/mpeg": IconMp3,
      "audio/aac": IconMp3,
      "audio/weba": IconMp3,
      "video/mpeg": IconVideo,
      "video/webm": IconVideo,
      "video/x-msvideo": IconVideo,
      "application/pdf": IconPdf,
    };
    const mimetypeImage = mimetypeToImage[props.mimetype] || IconUnKnow;

    return {
      value,
      mimetypeImage,
      pressEnter,
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
    &:hover {
      text-decoration: underline;
      user-select: none;
    }
  }
}
</style>
