<template>
  <a-card
    hoverable
    title="上传列表"
    :style="{ height: '100%' }"
    v-show="visible"
  >
    <template #extra>
      <CloseOutlined :style="{ cursor: 'pointer' }" @click="onClose" />
    </template>
    <div class="upload-list">
      <div class="upload-item" v-for="(item, index) in queue" :key="item.key">
        <p>{{ item.file.name }}</p>
        <a-tag color="success" v-if="item.status === 'success'">
          <template #icon>
            <check-circle-outlined />
          </template>
          success
        </a-tag>
        <a-tag color="processing" v-else-if="item.status === 'processing'">
          <template #icon>
            <sync-outlined :spin="true" />
          </template>
          processing
        </a-tag>
        <a-tag color="default" v-else-if="item.status === 'waiting'">
          <template #icon>
            <clock-circle-outlined />
          </template>
          waiting
        </a-tag>
      </div>
    </div>
  </a-card>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, watchEffect } from "vue";
import {
  CloseOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons-vue";

import { handleUpload as requestUpload } from "../api";

type FileStatus = "waiting" | "processing" | "success";
interface IAddFileStatus {
  status: FileStatus;
  file: File;
  key: string;
}
export default defineComponent({
  name: "App",
  emits: ["success"],
  components: {
    CloseOutlined,
    SyncOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
  },
  props: {
    queue: {
      type: Array as PropType<IAddFileStatus[]>,
      default: () => [],
    },
    max: {
      type: Number,
      default: 4,
    },
  },
  setup(props, context) {
    const visible = ref(false);
    const onClose = () => {
      visible.value = false;
    };
    const processingQueue = ref<IAddFileStatus[]>([]);
    const handleUpload = (file: IAddFileStatus) => {
      console.log(file.file.name, " 上传中");
      file.status = "processing";
      const filename = file.file.name;
      const mimetype = file.file.type;
      requestUpload(file.file).then((result) => {
        file.status = "success";
        const emitArgs = {
          ...result,
          filename,
          mimetype,
        };
        console.log(file.file.name, " 上传完成");
        context.emit("success", emitArgs);
      });
      processingQueue.value = processingQueue.value.filter(
        (item) => item.key !== file.key
      );
      checkUploadQueue();
    };

    const checkUploadQueue = () => {
      if (processingQueue.value.length >= props.max) {
        return;
      }

      const waitingFileQueue = props.queue.filter(
        (item) => item.status === "waiting"
      );
      if (waitingFileQueue.length) {
        const fileItem = waitingFileQueue.pop();
        if (fileItem) {
          processingQueue.value.push(fileItem);
        }
        console.log("待处理队列", processingQueue.value.length);
        processingQueue.value.map((item) => {
          handleUpload(item);
        });
      }
    };

    watchEffect(() => {
      const waitingFileQueue = props.queue.filter(
        (item) => item.status === "waiting"
      );
      if (waitingFileQueue.length) {
        visible.value = true;
        checkUploadQueue();
      }
    });
    return {
      visible,
      onClose,
    };
  },
});
</script>
<style>
.upload-card .ant-card-body {
  height: 87%;
}
</style>
<style scoped>
.upload-card {
  position: fixed;
  right: 10px;
  bottom: 10px;
  width: 50%;
  height: 60%;
}
.upload-list {
  height: 100%;
  overflow-y: auto;
}
.upload-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}
.upload-item + .upload-item {
  padding-top: 15px;
}
.upload-item p {
  margin-bottom: 0;
  color: #666;
  flex: 1;
  margin-right: 20px;
}
</style>
