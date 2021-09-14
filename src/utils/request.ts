import axios from "axios";

const request = axios.create({
  baseURL: import.meta.env.VITE_BASEURL as string, //"http://localhost:8080",
  // baseURL: "http://localhost:8080",
});

request.interceptors.request.use((config) => {
  if (config.method === "get" || config.method === "delete") {
    if (!config.params) {
      config.params = {};
    }
    config.params.bucket = localStorage.getItem("bucket");
  }
  if (config.method === "post" || config.method === "put") {
    if (!config.data) {
      config.data = {};
    }
    config.data.bucket = localStorage.getItem("bucket");
  }
  return config;
});

// request.interceptors.request.use(config => {

// })

request.interceptors.response.use((response) => {
  return response.data;
});
export default request;
