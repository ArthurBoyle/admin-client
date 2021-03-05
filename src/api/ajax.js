import axios from "axios";
import {message} from "antd";

export default function ajax (url, type, data={}) {
    return new Promise((resolve) => {
        let promise;
        // 1.执行异步ajax请求
        if (type === "GET") {
            promise = axios.get(url, {params: data});
        } else {
            promise = axios.post(url, data);
        }
        // 2.如果成功了，调用resolve(value)
        promise.then(response => {
            resolve(response.data);
            // 3.如果失败了，不调用reject，而是直接提示异常信息
        }).catch(error => {
            message.error("请求失败：" + error.message);
        });
    })
}