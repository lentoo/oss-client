<template>
  <div class="file-item" @click="$emit('click')">
    <img
      class="file-icon"
      v-if="isDir"
      src="../resources/images/icon-folder.png"
    />
    <img class="file-icon" v-else src="../resources/images/icon-image.png" />

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
import { notification } from "ant-design-vue";

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
    return {
      value,

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
