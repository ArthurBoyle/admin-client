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

// 9. 根据分类ID获取分类
export const reqGetCategoryNameById = (categoryId) => ajax("/manage/category/info", "GET", {categoryId});

// 10. 删除图片
export const reqDeleteImg = (name) => ajax("/manage/img/delete", "POST", {name});

// 11. 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax("/manage/product/" + (product._id ? "update" : "add"), "POST", product);

// 12. 获取角色列表
export const reqGetRoleList = () => ajax("/manage/role/list", "GET");

// 13. 添加角色
export const reqAddRole = (roleName) => ajax("/manage/role/add", "POST", {roleName});

// 14. 更新角色权限
export const reqUpdateRole = (updateRole) => ajax("/manage/role/update", "POST", updateRole);

// 15. 获取所有用户列表
export const reqGetUserList = () => ajax("/manage/user/list", "GET");

// 16. 删除用户
export const reqDeleteUser = (userId) => ajax("/manage/user/delete", "POST", {userId});

// 17. 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax("/manage/user/" + (user._id ? "update" : "add"), "POST", user);