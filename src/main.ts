import { createApp } from "vue";

import Antd from "ant-design-vue";

import "ant-design-vue/dist/antd.css";

import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import ContextMenu from "@imengyu/vue3-context-menu";

import App from "./render/App.vue";
createApp(App).use(Antd).use(ContextMenu).mount("#app");
