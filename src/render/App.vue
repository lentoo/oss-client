<template>
  <main
    @drop="onDrop"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    :class="{
      'is-dragover': isDragover,
    }"
    class="page"
  >
    <NavComponent
      @onBack="onBack"
      @onHome="onHome"
      :value="dirPath"
      @onRefresh="onRefresh"
      @onAddFolder="onAddFolder"
    />
    <div class="file-list" v-if="files.length">
      <FileItem
        v-for="file in files"
        :key="file._id"
        :filename="file.filename"
        :is-dir="file.isDir"
        @click="handleClick(file)"
        @contextmenu="onContextMenu($event, file)"
      />
    </div>
    <div class="empty-img" v-else>
      <img src="./resources/images/empty.png" alt="" />
      <p>空空如也~~</p>
    </div>

    <div class="upload-card">
      <UploadQueue v-model:queue="filesQueue" />
    </div>

    <a-modal
      title="新建文件夹"
      v-model:visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      <p>
        <a-input v-model:value="folderValue" placeholder="请输入文件夹名称" />
      </p>
    </a-modal>

    <context-menu v-model:show="menuShow" :options="menuOptions" />
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRaw, watch } from "vue";
import { notification } from "ant-design-vue";

import Nav from "./components/Nav.vue";
import FileItem from "./components/FileItem.vue";
import UploadQueue from "./components/UploadQueue.vue";

import { getFileList, addDirectory, deleteFile } from "./api";
import type { IFile } from "../types";

type FileStatus = "waiting" | "processing" | "success";
interface IAddFileStatus {
  status: FileStatus;
  file: File;
  key: string;
}

export default defineComponent({
  name: "App",
  components: {
    NavComponent: Nav,
    FileItem,
    UploadQueue,
  },
  setup() {
    const filesQueue = ref<IAddFileStatus[]>([]);
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      isDragover.value = false;
      const files = e.dataTransfer?.files || [];
      if (files.length) {
        const fileArray = Array.from(files).map((file) => {
          return {
            file,
            status: "waiting",
            key: Date.now() + (Math.random() * 100).toFixed(0),
          };
        }) as IAddFileStatus[];
        console.log(fileArray);
        console.log(filesQueue.value);

        filesQueue.value = [...fileArray, ...filesQueue.value];

        console.log(filesQueue.value);
      }
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      isDragover.value = false;
    };
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      isDragover.value = true;
    };

    const isDragover = ref(false);

    let fileDatas: IFile[] = [];

    const parent_id = ref("");
    const queue_parent_ids = ref<string[]>([]);
    const env = ref("dev");

    const getFileListById = async () => {
      const result = await getFileList({
        parent_id: parent_id.value,
        env: env.value,
      });

      fileDatas = result.data;

      files.value = fileDatas;
    };
    onMounted(async () => {
      getFileListById();
    });

    let currentDir = ref();

    const files = ref(fileDatas);
    const queue = ref<any[]>([]);

    const dirPath = ref("");
    const handleClick = (file: IFile) => {
      file = toRaw(file);
      console.log(file);

      if (file.isDir) {
        queue_parent_ids.value.push(parent_id.value);
        // currentDir.value = file;
        queue.value.push(file);
        parent_id.value = file._id;
        getFileListById();
        // files.value = file.files;
      } else {
      }
    };

    watch([queue.value], () => {
      console.log("watch");
      let cpath = "";
      queue.value.forEach((item) => {
        cpath = cpath + item.filename + "/";
      });
      dirPath.value = cpath;
    });

    const onBack = () => {
      if (queue_parent_ids.value.length > 0) {
        const last_paent_id = queue_parent_ids.value.pop();
        queue.value.pop();
        if (last_paent_id) {
          // currentDir.value = file;
          parent_id.value = last_paent_id;
          // files.value = file.files;
          getFileListById();
        } else {
          parent_id.value = "";
          getFileListById();
          // files.value = fileDatas;
        }
      }
    };
    const onHome = () => {
      while (queue.value.length) {
        queue.value.pop();
      }
      queue_parent_ids.value = [];
      parent_id.value = "";
      getFileListById();
      // currentDir.value = null;
      // files.value = fileDatas;
    };

    const onRefresh = () => {
      getFileListById();
    };

    const visible = ref(false);
    const confirmLoading = ref(false);
    const folderValue = ref("");
    const handleOk = async () => {
      if (folderValue.value) {
        confirmLoading.value = true;
        const result = await addDirectory({
          filename: folderValue.value,
          env: env.value,
          parent_id: parent_id.value,
        });
        confirmLoading.value = false;
        if (result.code === 0) {
          visible.value = false;
          getFileListById();
        } else {
          notification.error(result.message);
        }
      }
    };
    const onAddFolder = () => {
      visible.value = true;
    };
    const reqeustDeleteFile = async (_id: string) => {
      const response = await deleteFile({
        _id,
      });
      if (response.code === 0) {
        getFileListById();
      } else {
        notification.error(response.message);
      }
    };

    let contextFile: IFile | null = null;
    const onContextMenu = (event: MouseEvent, file: IFile) => {
      event.preventDefault();
      menuShow.value = true;
      menuOptions.value.x = event.x;
      menuOptions.value.y = event.y;
      contextFile = file;
    };
    const menuOptions = ref({
      items: [
        {
          label: "删除",
          onClick: () => {
            if (contextFile) {
              reqeustDeleteFile(contextFile._id);
            }
          },
        },
        // { label: "Paste", disabled: true },
        {
          label: "重命名",
          onClick: () => {
            document.execCommand("print");
          },
        },
      ],
      iconFontClass: "iconfont",
      customClass: "class-a",
      minWidth: 120,
      x: 0,
      y: 0,
    });
    const menuShow = ref(false);

    return {
      onDrop,
      onDragOver,
      onDragLeave,
      handleClick,
      onBack,
      onHome,
      onRefresh,
      onAddFolder,
      dirPath,
      isDragover,
      files,
      filesQueue,

      visible,
      confirmLoading,
      handleOk,
      folderValue,

      onContextMenu,
      menuOptions,
      menuShow,
    };
  },
});
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
html,
body {
  height: 100%;
}
img {
  vertical-align: middle;
}
.page {
  min-height: 100vh;
}
.file-list {
  padding-top: 40px;
}
.is-dragover {
  background-color: rgba(32, 159, 255, 0.1);
}

.upload-card {
  position: fixed;
  right: 10px;
  bottom: 10px;
  width: 50%;
  height: 60%;
}
.empty-img {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.empty-img p {
  color: #666;
  font-size: 14px;
}
.mx-context-menu-item {
  padding: 6px 0 !important;
}
</style>
