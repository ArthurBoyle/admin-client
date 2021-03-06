import ajax from "./ajax";
import jsonp from "jsonp";
import {message} from "antd";

// 1.登录
export const reqLogin = (username, password) => ajax("/login", "POST", {username, password});

// 2. jsonp请求的天气接口请求函数
export const reqWeather = () => {
    return new Promise((resolve) => {
        const ip = "https://restapi.amap.com/v3/ip?output=json&key=2727727a44affdf8682c93d963e7984f";
        jsonp(ip, {}, (error, data) => {
            if (!error && data.status === "1") {
                const weather = `https://restapi.amap.com/v3/weather/weatherInfo?city=${data.adcode}&key=2727727a44affdf8682c93d963e7984f`;
                jsonp(weather, {}, (error, data) => {
                    if (!error && data.status === "1") {
                        const {weather, temperature} = data.lives[0];
                        resolve({weather, temperature});
                    } else {
                        message.error("获取天气信息失败");
                    }
                });
            } else {
                message.error("获取IP地址失败");
            }
        });
    });
}