<template>
  <main
    @drop="onDrop"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    :class="{
      'is-dragover': isDragover,
    }"
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
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRaw, watch } from "vue";

import Nav from "./components/Nav.vue";
import FileItem from "./components/FileItem.vue";

export default defineComponent({
  name: "App",
  components: {
    NavComponent: Nav,
    FileItem,
  },
  setup() {
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      isDragover.value = false;
      const files = e.dataTransfer?.files || [];
      if (files.length) {
        new Array(files).map((file) => {
          console.log(file);
        });
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

    const fileDatas = {
      id: 0,
      isDir: true,
      name: "/",
      files: [
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
      ],
    };

    let currentDir = ref(fileDatas);

    const files = ref(currentDir.value.files);
    const queue = ref<any[]>([]);
    queue.value.push(currentDir.value);
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
      queue.value.forEach((item, index) => {
        cpath = cpath + item.name;
        if (index !== 0 && index !== queue.value.length - 1) {
          cpath += "/";
        }
      });
      dirPath.value = cpath;
    });

    const onBack = () => {
      if (queue.value.length > 0) {
        queue.value.pop();
        const file = queue.value[queue.value.length - 1];
        currentDir.value = file;
        files.value = file.files;
      }
    };
    const onHome = () => {
      // queue.value = [queue.value[0]];
      // const file = queue.value[queue.value.length - 1];
      // currentDir.value = file;
      // files.value = file.files;
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
.file-list {
  padding-top: 40px;
}
.is-dragover {
  background-color: rgba(32, 159, 255, 0.1);
}
</style>
