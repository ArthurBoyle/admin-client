import {SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER} from "./constant";
import {reqLogin} from "../api";
import storageUtils from "../utils/storageUtils";

// 设置头部标题的同步action
export const setHeadTitle = (headTitle) => ({type: SET_HEAD_TITLE, data: headTitle});

// 登录的异步action
export const login = (username, password) => {
    return async dispatch => {
        const result = await reqLogin(username, password);
        if (result.status === 0) {
            const user = result.data;
            storageUtils.saveUser(user);
            dispatch(receiveUser(user));
        } else {
            const msg = result.msg;
            // message.error(msg)
            dispatch(showErrorMsg(msg));
        }
    }
}

// 接收用户信息的同步action(登录成功)
export const receiveUser = (user) => ({type: RECEIVE_USER, data: user});

// 显示错误信息的同步action(登录失败)
export const showErrorMsg = (msg) => ({type: SHOW_ERROR_MSG, data: msg});

// 退出登录的同步action
export const logout = () => {
    // 先清除local中的user
    storageUtils.removeUser();
    // 返回action对象
    return {type: RESET_USER}
};