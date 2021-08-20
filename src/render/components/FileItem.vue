<template>
  <div class="file-item">
    <img
      class="file-icon"
      v-if="isDir"
      src="../resources/images/icon-folder.png"
    />
    <img
      class="file-icon"
      v-else="isDir"
      src="../resources/images/icon-image.png"
    />

    <p>{{ filename }}</p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "file-item",
  props: {
    filename: {
      type: String,
      required: true,
    },
    isDir: {
      type: Boolean,
      default: false,
    },
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
