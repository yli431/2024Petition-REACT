import axios from "axios";
import {message} from "antd";
import {baseUrl} from "@/utils/url.js";

export const AxiosConfig = {
    timeout: 5000,
    baseURL: baseUrl
};
const instance = axios.create(AxiosConfig);

instance.interceptors.response.use(
    response => {
        return response.data;
    },
    err => {
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = "请求错误";
                    break;
                case 401:
                    err.message = "未授权访问";
                    break;
                case 404:
                    err.message = "请求资源不存在";
                    break;
                case 500:
                    err.message = "服务器错误";
                    break;
                case 502:
                    err.message = "Bad Gateway";
                    break;
                default:
            }
        }
        const [messageApi]=message.useMessage()
        if(err){
            messageApi.open({
                type:'error',
                content:err?.message
            })
        }
        return err;
    }
);

export default instance;