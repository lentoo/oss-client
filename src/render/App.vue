<template>
  <main>
    <NavComponent />
    <div class="file-list">
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
      <FileItem />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Nav from './components/Nav.vue'
import FileItem from './components/FileItem.vue'

export default defineComponent({
  name: 'App',
  components: {
    NavComponent: Nav,
    FileItem
  }
})
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
html,body {
  height: 100%;
}
img { 
  vertical-align: middle;
}
.file-list {
  padding-top: 40px;
}
</style>
