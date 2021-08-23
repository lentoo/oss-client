import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:8080",
});

// request.interceptors.request.use(config => {

// })

request.interceptors.response.use((response) => {
  return response.data;
});
export default request;
