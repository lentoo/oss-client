<template>
    <div class="file-item">
        <img class="file-icon" src="../resources/images/icon-folder.png" />
        <p>app/</p>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: 'file-item'
})
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
        .file-icon {
            height: 24px;
            width: 24px;
            margin-right: 10px;
        }
    }
</style>