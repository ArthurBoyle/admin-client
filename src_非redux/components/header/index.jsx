import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {reqWeather} from "../../api";
import {formateDate} from "../../utils/dateUtils";
import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import LinkButton from "../link-button";
import "./index.less";

const { confirm } = Modal;

class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        weather: "",
        temperature: ""
    };
    async componentDidMount() {
        this.timer = setInterval(() => {
            const currentTime = formateDate(Date.now());
            this.setState({currentTime});
        }, 1000);
        const {weather, temperature} = await reqWeather();
        this.setState({weather, temperature});
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    getTitle = () => {
        const path = this.props.location.pathname;
        let title;
        menuList.forEach((item) => {
            if (item.key === path) {
                title = item.title;
            } else if (item.children) {
                // item.children.forEach((cItem) => {
                //     if (cItem.key === path) {
                //         title = cItem.title;
                //     }
                // })
                const cItem = item.children.find((cItem) => path.indexOf(cItem.key) === 0);
                if (cItem) {
                    title = cItem.title;
                }
            }
        });
        return title;
    }

    logout = () => {
        confirm({
            title: 'Do you Want to logout current user?',
            icon: <ExclamationCircleOutlined />,
            onOk:() => {
                memoryUtils.user = {};
                storageUtils.removeUser();
                this.props.history.replace("/login");
            }
        });
    }

    render() {
        const {currentTime, weather, temperature} = this.state;
        const {username} = memoryUtils.user;
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{this.getTitle()}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <span>{weather}</span>
                        <span>{temperature}°C</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);