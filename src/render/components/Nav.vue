<template>
  <div class="nav">
    <div class="nav-item" @click="$emit('onBack')">
      <img src="../resources/images/icon-back.png" alt="" />
    </div>
    <div class="nav-item" @click="$emit('onHome')">
      <img src="../resources/images/icon-home.png" alt="" />
    </div>
    <div class="nav-item" @click="$emit('onRefresh')">
      <img src="../resources/images/icon-refresh.png" alt="" />
    </div>
    <div class="nav-item" @click="$emit('onAddFolder')">
      <img src="../resources/images/icon-add.png" alt="" />
    </div>
    <a-select
      :value="'test'"
      size="small"
      :style="{ height: '26px', marginRight: '16px', width: '80px' }"
    >
      <a-select-option value="test">内网</a-select-option>
      <a-select-option value="prod">正式</a-select-option>
    </a-select>
    <a-space></a-space>
    <div class="nav-navigation">
      <!-- <input
        type="text"
        placeholder="路径、默认为根目录"
        disabled
        :value="value"
      /> -->
      <a-input
        disabled
        :maskClosable="false"
        v-model:value="value"
        placeholder="路径、默认为根目录"
        size="small"
        :style="{
          height: '100%',
        }"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";

export default defineComponent({
  name: "nav",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
});
</script>
<style lang="scss">
.nav {
  color: #fff;
  background-color: #1a7380;
  display: flex;
  padding: 5px 15px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  &-item {
    background-color: #fff;
    border-radius: 2px;
    width: 24px;
    height: 24px;
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

  &-navigation {
    background-color: #fff;
    // color: #566;
    // border-radius: 4px;
    // padding: 0px 10px;
    flex: 1;
    input {
      border: 0;
      outline: none;
    }
  }
}
</style>
