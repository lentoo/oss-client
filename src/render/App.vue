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
      :env="state.env"
      @onRefresh="onRefresh"
      @onAddFolder="onAddFolder"
      @onAddFile="onAddFile"
      @env-change="onEnvChange"
    />
    <div class="file-list" v-if="state.files.length">
      <FileItem
        v-for="file in state.files"
        :key="file._id"
        :filename="file.filename"
        :is-dir="file.isDir"
        :editing="file.editing"
        :mimetype="file.mimetype"
        :size="file.file_size"
        :date="file.updatedAt"
        @click="handleClick(file)"
        @rename="handleFileRename"
        @cancel-rename="handleCancelRename"
        @contextmenu="onContextMenu($event, file)"
      />
    </div>
    <div class="empty-img" v-else>
      <img src="./resources/images/empty.png" alt="" />
      <p>空空如也~~</p>
    </div>

    <div class="upload-card">
      <UploadQueue v-model:queue="filesQueue" @success="uploadSuccess" />
    </div>

    <a-modal
      title="新建文件夹"
      v-model:visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleModalCancel"
    >
      <p>
        <a-input v-model:value="folderValue" placeholder="请输入文件夹名称" />
      </p>
    </a-modal>

    <context-menu v-model:show="menuShow" :options="menuOptions" />

    <a-modal v-model:visible="modalState.visible" width="80%" title="预览文件">
      <div style="text-align: center">
        <img
          style="max-width: 100%; max-height: 50vh"
          :src="modalState.imageUrl"
          alt=""
        />
      </div>
      <div style="margin-top: 20px">
        <a-button
          size="small"
          type="primary"
          @click="copyLink(modalState.imageUrl)"
          >复制链接</a-button
        >

        <a-button
          style="margin-left: 10px"
          size="small"
          type="primary"
          @click="download(modalState.imageUrl)"
          >下载文件</a-button
        >
        <a-button
          style="margin-left: 10px"
          size="small"
          type="primary"
          @click="compression(modalState.fileKey)"
          >图片压缩</a-button
        >
        <a-button
          style="float: right"
          size="small"
          type="danger"
          @click="
            () => {
              reqeustDeleteFile(modalState.fileId);
              modalState.visible = false;
            }
          "
          >删除文件</a-button
        >
      </div>
    </a-modal>
    <InputDialog
      title="新增文件"
      v-model:value="addFileDialogVisible"
      @ok="onInputDialogOK"
    />
  </main>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  toRaw,
  reactive,
  watchEffect,
  createVNode,
  computed,
} from "vue";
import { notification, Modal } from "ant-design-vue";
import { copyText } from "vue3-clipboard";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
// import { ipcRenderer } from "electron";

const { ipcRenderer } = require("electron");

import Nav from "./components/Nav.vue";
import FileItem from "./components/FileItem/index.vue";
import UploadQueue from "./components/UploadQueue.vue";
import InputDialog from "./components/InputDialog/index.vue";
import {
  getFileList,
  addDirectory,
  deleteFile,
  renameFile,
  addFile,
  replaceFile,
  requestDownloadFile,
  compressionFile,
} from "./api";
import type { IFile } from "../types";

type FileStatus = "waiting" | "processing" | "success";
interface IAddFileStatus {
  _id?: string;
  parent_id?: string;
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
    InputDialog,
  },
  setup() {
    const filesQueue = ref<IAddFileStatus[]>([]);
    const isDragover = ref(false);

    const appendFileToQueue = (filesArr: File[]) => {
      const fileArray = filesArr.map((file) => {
        const findFile = state.files.find((f) => f.filename === file.name);
        if (findFile) {
          return {
            _id: findFile._id,
            parent_id: parent_id.value,
            status: "waiting",
            key: Date.now() + (Math.random() * 100).toFixed(0),
            file,
          };
        } else {
          return {
            file,
            parent_id: parent_id.value,
            status: "waiting",
            key: Date.now() + (Math.random() * 100).toFixed(0),
          };
        }
      }) as IAddFileStatus[];

      filesQueue.value = [...fileArray, ...filesQueue.value];
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      isDragover.value = false;
      const files = e.dataTransfer?.files;
      if (files && files.length) {
        const filesArr = Array.from(files);
        const existFile = state.files.some((file) =>
          filesArr.find((item) => item.name === file.filename)
        );
        if (existFile) {
          Modal.confirm({
            title: "文件替换提示",
            icon: createVNode(ExclamationCircleOutlined),
            content: "已存在同名文件、是否要替换？",
            okText: "替换",
            cancelText: "取消",
            onOk: () => {
              appendFileToQueue(filesArr);
            },
          });
        } else {
          appendFileToQueue(filesArr);
        }
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

    let fileDatas: IFile[] = [];

    const parent_id = ref("");
    const queue_parent_ids = ref<string[]>([]);

    const getFileListById = async () => {
      const result = await getFileList({
        parent_id: parent_id.value,
        env: state.env,
      });

      fileDatas = result.data;

      state.files = fileDatas;
    };
    onMounted(async () => {
      getFileListById();
    });

    // const files = ref(fileDatas);
    let state = reactive<{
      queue: IFile[];
      env: string;
      files: IFile[];
    }>({
      queue: [],
      env: localStorage.getItem("env") || "test",
      files: [],
    });

    const dirPath = ref("");
    const modalState = reactive({
      visible: false,
      imageUrl: "",
      fileId: "",
      fileKey: "",
    });

    const handleClick = (file: IFile) => {
      file = toRaw(file);
      console.log(file);
      if (file.isDir) {
        queue_parent_ids.value.push(parent_id.value);
        // queue.value.push(file);
        state.queue.push(file);
        parent_id.value = file._id!;
        getFileListById();
      } else {
        modalState.visible = true;
        modalState.fileId = file._id || "";
        modalState.imageUrl = file.cstore_url;
        modalState.fileKey = file.file_key;
      }
    };

    const copyLink = (link: string) => {
      copyText(link, undefined, (err: any, event: any) => {
        if (err) {
          notification.error({
            message: "复制失败、请手动复制",
          });
        } else {
          notification.success({
            message: "复制成功",
          });
        }
      });
    };
    const download = (url: string) => {
      ipcRenderer.send("download-file", url);
    };

    watchEffect(() => {
      console.log("watch");
      let cpath = "";
      state.queue.forEach((item) => {
        cpath = cpath + item.filename + "/";
      });
      dirPath.value = cpath;
    });

    const onBack = () => {
      if (queue_parent_ids.value.length > 0) {
        const last_paent_id = queue_parent_ids.value.pop();
        state.queue.pop();
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
      state.queue = [];
      queue_parent_ids.value = [];
      parent_id.value = "";
      getFileListById();
    };

    const onEnvChange = (newenv: string) => {
      state.env = newenv;
      onHome();
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
          env: state.env,
          parent_id: parent_id.value,
        });
        confirmLoading.value = false;
        if (result.code === 0) {
          getFileListById();
          handleModalCancel();
        } else {
          notification.error(result.message);
        }
      }
    };
    const handleModalCancel = () => {
      visible.value = false;
      folderValue.value = "";
    };
    const onAddFolder = () => {
      visible.value = true;
    };

    const addFileDialogVisible = ref(false);
    const onAddFile = () => {
      addFileDialogVisible.value = true;
    };
    const onInputDialogOK = (url: string) => {
      requestDownloadFile(url).then((f: File) => {
        console.log(f);
        appendFileToQueue([f]);
        addFileDialogVisible.value = false;
      });
    };

    const compression = (fileKey: string) => {
      compressionFile(fileKey).then((res: any) => {
        console.log(res);
      });
    };

    const reqeustDeleteFile = async (_id: string) => {
      const response = await deleteFile({
        _id,
      });
      if (response.code === 0) {
        getFileListById();
      } else {
        notification.error({
          message: response.message,
        });
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

    const menuOptions = computed(() => {
      return {
        items: [
          {
            label: "删除",
            onClick: () => {
              if (contextFile) {
                reqeustDeleteFile(contextFile._id!);
              }
            },
          },
          {
            label: "重命名",
            onClick: () => {
              state.files.forEach((item) => {
                item.editing = false;
              });
              if (contextFile) {
                contextFile.editing = true;
              }
            },
          },
        ],
        iconFontClass: "iconfont",
        customClass: "class-a",
        minWidth: 120,
        x: 0,
        y: 0,
      };
    });
    const menuShow = ref(false);
    const handleFileRename = async (newFileName: string) => {
      if (contextFile) {
        const result = await renameFile(
          contextFile._id!,
          newFileName,
          contextFile.parent_id
        );
        console.log(result);

        if (result.code === 0) {
          getFileListById();
        } else {
          notification.error({
            message: result.message,
          });
        }
      }
    };
    const handleCancelRename = () => {
      if (contextFile) {
        contextFile.editing = false;
      }
    };
    const uploadSuccess = async (
      result: {
        downloadUrl: string;
        fileKey: string;
        fileSize: number;
        filename: string;
        mimetype: string;
      } & IAddFileStatus
    ) => {
      const {
        downloadUrl,
        fileKey,
        filename,
        mimetype,
        fileSize,
        parent_id,
        _id,
      } = result;
      let p: Promise<any> = Promise.resolve();
      if (result._id) {
        p = replaceFile({
          _id,
          cstore_url: downloadUrl,
          file_key: fileKey,
          file_size: fileSize,
          mimetype,
        });
      } else {
        p = addFile({
          parent_id: parent_id!,
          filename,
          mimetype,
          env: state.env,
          cstore_url: downloadUrl,
          file_key: fileKey,
          file_size: fileSize,
          isDir: false,
        });
      }
      const res = await p;
      if (res.code === 0) {
        getFileListById();
      } else {
        notification.error({
          message: res.message,
        });
      }
    };
    return {
      modalState,
      onDrop,
      onDragOver,
      onDragLeave,
      handleClick,
      copyLink,
      download,
      onBack,
      onHome,
      onRefresh,
      onAddFolder,
      onEnvChange,
      onAddFile,
      addFileDialogVisible,
      onInputDialogOK,
      state,
      dirPath,
      isDragover,
      filesQueue,

      visible,
      confirmLoading,
      handleOk,
      handleModalCancel,
      folderValue,

      onContextMenu,
      menuOptions,
      menuShow,
      reqeustDeleteFile,
      compression,
      handleFileRename,
      handleCancelRename,
      uploadSuccess,
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
  padding-top: 34px;
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
.ant-modal-mask {
  backdrop-filter: blur(4px);
}
</style>
