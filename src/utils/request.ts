import { notification } from "ant-design-vue";
import axios from "axios";
import qs from "qs";
// @ts-ignore
const connection = window.navigator.connection;

const request = axios.create({
  baseURL: import.meta.env.VITE_BASEURL as string, //"http://localhost:8080",
  // baseURL: "http://localhost:8080",
});
let currentKey = "";
request.interceptors.request.use(
  (config) => {
    console.log("req");

    if (config.method === "get" || config.method === "delete") {
      if (!config.params) {
        config.params = {};
      }
      config.params.bucket = localStorage.getItem("bucket");
      currentKey = `${config.url}?${qs.stringify(config.params)}`;
    }
    if (config.method === "post" || config.method === "put") {
      if (!config.data) {
        config.data = {};
      }
      config.data.bucket = localStorage.getItem("bucket");
      currentKey = `${config.data}?${qs.stringify(config.data)}`;
    }
    return config;
  },
  (error) => {
    if (error) {
      console.log("requesr error");
    }
    console.log(connection);
  }
);

// request.interceptors.request.use(config => {

// })

request.interceptors.response.use(
  (response) => {
    console.log(response);
    const cacheKey = `${response.config.url}?${qs.stringify(
      response.config.params
    )}`;
    localStorage.setItem(cacheKey, JSON.stringify(response.data));
    return response.data;
  },
  (error) => {
    console.log("response error", currentKey);

    notification.destroy();
    notification.error({
      message: "数据获取异常、本次数据从缓存获取",
    });
    let data = localStorage.getItem(currentKey);
    if (data) {
      return Promise.resolve(JSON.parse(data));
    }
    notification.error({
      message: "连接失败",
    });
    return Promise.reject(error);
  }
);
export default request;
