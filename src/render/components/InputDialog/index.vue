<template>
  <a-modal
    v-model:visible="visible"
    width="80%"
    :title="title"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-input placeholder="请输入文件链接" v-model:value="inputValue" />
  </a-modal>
</template>
<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";

export default defineComponent({
  name: "input-dialog",
  emits: ["ok", "cancel", "update:value"],
  props: {
    title: {
      type: String,
      default: "",
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const visible = ref(props.value);
    const inputValue = ref("");
    watchEffect(() => {
      visible.value = props.value;
      inputValue.value = "";
    });
    const onOk = () => {
      context.emit("ok", inputValue.value);
    };
    const onCancel = () => {
      context.emit("cancel");
      context.emit("update:value", false);
    };
    return {
      visible,
      onOk,
      onCancel,
      inputValue,
    };
  },
});
</script>
