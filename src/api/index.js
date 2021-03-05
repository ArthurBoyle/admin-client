import ajax from "./ajax";

// 1.登录
export const reqLogin = (username, password) => ajax("/login", "POST", {username, password});