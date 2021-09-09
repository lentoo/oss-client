<template>
  <a-modal
    v-model:visible="show"
    destroyOnClose
    title="图片压缩"
    @ok="handleOk"
    @cancel="onCancel"
    width="100%"
    wrapClassName="full-modal"
  >
    <p>
      压缩质量：<a-slider v-model:value="sliderValue" :tooltip-visible="true" />
    </p>
    <p>
      <img style="max-width: 100%; max-height: 300px" :src="imgSrc" alt="" />
    </p>
    <p>
      <a-button size="small" type="primary" @click="copy(imgSrc)"
        >复制压缩后的链接</a-button
      >
    </p>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import { notification } from "ant-design-vue";
import { copyLink } from "../../../utils";
export default defineComponent({
  name: "full-modal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    src: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const show = ref(props.visible);
    const sliderValue = ref(85);
    watch(
      () => props.visible,
      () => {
        show.value = props.visible;
      }
    );
    const imgSrc = computed(() => {
      return `${props.src}?x-oss-process=image/format,jpg/quality,q_${sliderValue.value}`;
    });
    const handleOk = () => {
      console.log("handleOk");
    };
    const copy = (str: string) => {
      copyLink(str).then(() => {
        notification.success({
          message: "复制成功",
        });
      });
    };
    const onCancel = () => {
      context.emit("cancel");
      context.emit("update:visible", false);
    };
    return {
      show,
      handleOk,
      sliderValue,
      imgSrc,
      copy,
      onCancel,
    };
  },
});
</script>

<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
