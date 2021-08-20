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
    <NavComponent @onBack="onBack" @onHome="onHome" :value="dirPath" />
    <div class="file-list">
      <FileItem
        v-for="file in files"
        :key="file.id"
        :filename="file.name"
        :is-dir="file.isDir"
        @click="handleClick(file)"
      />
    </div>

    <div class="upload-card">
      <UploadQueue v-model:queue="filesQueue" />
    </div>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRaw, watch } from "vue";

import Nav from "./components/Nav.vue";
import FileItem from "./components/FileItem.vue";
import UploadQueue from "./components/UploadQueue.vue";

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

    const fileDatas = [
      {
        id: 1,
        isDir: true,
        name: "app",
        files: [
          {
            id: 3,
            isDir: true,
            name: "lalala",
            files: [
              {
                id: 4,
                isDir: false,
                name: "aaa.png",
              },
            ],
          },
          {
            id: 2,
            isDir: false,
            name: "logo.png",
          },
        ],
      },
      {
        id: 21,
        isDir: false,
        name: "test.png",
      },
    ];

    let currentDir = ref();

    const files = ref(fileDatas);
    const queue = ref<any[]>([]);

    const dirPath = ref("");
    const handleClick = (file: any) => {
      if (file.isDir) {
        currentDir.value = file;
        files.value = file.files;
        queue.value.push(file);
      }
    };

    watch([queue.value], () => {
      console.log("watch");
      let cpath = "";
      queue.value.forEach((item) => {
        cpath = cpath + item.name + "/";
      });
      dirPath.value = cpath;
    });

    const onBack = () => {
      if (queue.value.length > 0) {
        queue.value.pop();
        const file = queue.value[queue.value.length - 1];
        if (file) {
          currentDir.value = file;
          files.value = file.files;
        } else {
          files.value = fileDatas;
        }
      }
    };
    const onHome = () => {
      while (queue.value.length) {
        queue.value.pop();
      }
      currentDir.value = null;
      files.value = fileDatas;
    };

    return {
      onDrop,
      onDragOver,
      onDragLeave,
      handleClick,
      onBack,
      onHome,
      dirPath,
      isDragover,
      files,
      filesQueue,
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
</style>
