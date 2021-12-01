import axios from "axios";
import Qs from "qs";

const http = axios.create({
  baseURL:
    process.env.NODE_ENV === "production" ? "/m" : "http://dev.like6.cn/m",
  timeout: 50000,
  headers: {
    "accept": "*/*"
  },
});

http.interceptors.request.use(
  (config) => {
    if (config.method === "post") {
      config.data = {
        ...config.data,
        sid: window.USER_SID,
        noble_level:window.USER_NOBLE,
        current_family_id:window.CURRENT_FAMILY_ID
      };
      config.data = Qs.stringify(config.data);
    } else if (config.method === "get") {
      config.params = {
        ...config.params,
        sid: window.USER_SID,
        noble_level:window.USER_NOBLE,
        current_family_id:window.CURRENT_FAMILY_ID
      };
    }
    // config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

http.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);

export default http;
