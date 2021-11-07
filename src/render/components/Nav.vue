<template>
  <div class="nav">
    <div class="nav-item" @click="$emit('onBack')">
      <img src="../resources/images/icon-back.svg" alt="" />
    </div>
    <div class="nav-item" @click="$emit('onHome')">
      <img src="../resources/images/icon-home.svg" alt="" />
    </div>
    <div class="nav-item" @click="$emit('onRefresh')">
      <img src="../resources/images/icon-refresh.svg" alt="" />
    </div>
    <div class="nav-item" @click="$emit('onAddFolder')">
      <img src="../resources/images/icon-add-folder.svg" alt="" />
    </div>
    <a-select
      v-model:value="envValue"
      size="small"
      :style="{ height: '26px', marginRight: '16px', width: '100px' }"
      @change="handleChange"
    >
      <a-select-option value="gymgest">官网</a-select-option>
      <a-select-option value="qishen_h5">起身H5</a-select-option>
      <a-select-option value="email">邮件</a-select-option>
    </a-select>
    <a-space></a-space>
    <div class="nav-navigation">
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
    <div class="nav-item" @click="$emit('onAddFile')" style="margin-left: 10px">
      <img src="../resources/images/icon-add.png" alt="" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "@vue/runtime-core";

export default defineComponent({
  name: "nav",
  emits: [
    "env-change",
    "onBack",
    "onHome",
    "onRefresh",
    "onAddFolder",
    "onAddFile",
  ],
  props: {
    value: {
      type: String,
      default: "",
    },
    env: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const envValue = ref(props.env);
    const handleChange = (value: string) => {
      localStorage.setItem("bucket", value);
      context.emit("env-change", value);
    };
    watch([props.env], () => {
      console.log("wach env", props.env);
    });

    return {
      envValue,
      handleChange,
    };
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
  user-select: none;
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
