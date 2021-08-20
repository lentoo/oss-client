import { createApp } from 'vue'

import Antd from 'ant-design-vue';

import 'ant-design-vue/dist/antd.css';

import App from './render/App.vue'
createApp(App).use(Antd).mount('#app')
