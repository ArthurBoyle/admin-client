import {combineReducers} from "redux";
import storageUtils from "../utils/storageUtils";
import {SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER} from "./constant";

const initHeadTitle = "首页";
function headTitle(preState=initHeadTitle, action) {
    const {type, data} = action;
    switch (type) {
        case SET_HEAD_TITLE:
            return data
        default:
            return preState
    }

}

const initUser = storageUtils.getUser();
function user(preState=initUser, action) {
    const {type, data} = action;
    switch (type) {
        case RECEIVE_USER:
            return data
        case SHOW_ERROR_MSG:
            return data
        case RESET_USER:
            return {}
        default:
            return preState
    }

}

export default combineReducers({headTitle, user});