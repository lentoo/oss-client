<template>
    <div class="nav">
        <div class="nav-item">
            <img src="../resources/images/icon-back.png" alt="">
        </div>
        <div class="nav-item">
            <img src="../resources/images/icon-home.png" alt="">
        </div>
        <div class="nav-item">
            <img src="../resources/images/icon-refresh.png" alt="">
        </div>
        <div class="nav-item">
            <img src="../resources/images/icon-add.png" alt="">
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: 'nav'
})
</script>
<style lang="scss">
.nav {
    color: #fff;
    background-color: #1a7380;
    display: flex;
    padding: 6px 15px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;    
    &-item {
        background-color: #fff;
        border-radius: 4px;
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        &:active {
            background-color: #eee;
        }
        img {
            width: 18px;
            height: 18px;
        }
    }
}
</style>
