<template>
  <div class="file-item" @click="$emit('click')">
    <img
      class="file-icon"
      v-if="isDir"
      src="../../resources/images/icon-folder.png"
    />
    <van-image
      v-else
      fit="contain"
      width="24px"
      height="24px"
      :src="mimetypeImage"
      class="file-icon"
    >
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
    </van-image>
    <!-- <img class="file-icon" v-else :src="mimetypeImage" /> -->

    <p v-if="editing" @click.stop="() => {}">
      <a-input
        :autofocus="editing"
        size="small"
        v-model:value="value"
        @pressEnter="pressEnter"
        @blur="pressEnter"
      />
    </p>
    <p v-else ref="filenameRef" :title="filename">{{ filename }}</p>

    <span class="file-size">{{ isDir ? "--" : displayFileSize }}</span>
    <span class="file-date">{{ fileDate }}</span>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { Image, Loading } from "vant";
import { mimetypeToImage } from "../../../utils";
import { converFileDate, converFileSize } from "./index";
export default defineComponent({
  name: "file-item",
  emits: ["click", "rename", "cancelRename"],
  components: {
    [Image.name]: Image,
    [Loading.name]: Loading,
  },
  props: {
    filename: {
      type: String,
      required: true,
    },
    url: {
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
      console.log({
        mimetype: props.mimetype,
      });
      if (props.mimetype.startsWith("image")) {
        return `${props.url}?x-oss-process=image/format,jpg/quality,q_10`;
      }

      return mimetypeToImage(props.mimetype);
    });

    const displayFileSize = computed(() => {
      const size = props.size;
      return converFileSize(size);
    });

    const fileDate = computed(() => {
      return converFileDate(new Date(props.date).valueOf());
    });

    const filenameRef = ref<HTMLElement>();
    // onMounted(() => {
    //   console.log(props.filename);
    //   console.log(window.getComputedStyle(filenameRef.value!).width);
    //   console.log(
    //     window.getComputedStyle(filenameRef.value!.parentElement!).width
    //   );
    //   // console.log(filenameRef.value);
    // });
    return {
      value,
      mimetypeImage,
      pressEnter,
      displayFileSize,
      fileDate,
      filenameRef,
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
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding-right: 20px;
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
