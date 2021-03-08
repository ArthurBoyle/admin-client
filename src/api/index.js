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

// 3. 获取一级或某个二级分类列表
export const reqGetCategoryList = (parentId) => ajax("/manage/category/list", "GET", {parentId});

// 4. 添加分类
export const reqAddCategory = (parentId, categoryName) => ajax("/manage/category/add", "POST", {parentId, categoryName});

// 5. 更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax("/manage/category/update", "POST", {categoryId, categoryName});

// 6. 获取商品分页列表
export const reqGetProductList = (pageNum, pageSize) => ajax("/manage/product/list", "GET", {pageNum, pageSize});

// 7. 根据商品名称/描述搜索
export const reqSearchProducts = (pageNum, pageSize, searchType, searchName) => ajax("manage/product/search", "GET", {pageNum, pageSize, [searchType]: searchName});

// 8. 商品上架/下架
export const reqUpdateStatus = (productId, status) => ajax("/manage/product/updateStatus", "POST", {productId, status});
