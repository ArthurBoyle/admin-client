import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {connect} from "react-redux";

import {reqWeather} from "../../api";
import {formateDate} from "../../utils/dateUtils";
import LinkButton from "../link-button";
import {logout} from "../../redux/actions";
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

    logout = () => {
        confirm({
            title: 'Do you Want to logout current user?',
            icon: <ExclamationCircleOutlined />,
            onOk:() => {
                this.props.logout();
            }
        });
    }

    render() {
        const {currentTime, weather, temperature} = this.state;
        const {username} = this.props.user;
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{this.props.headTitle}</div>
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

export default connect(
    state => ({headTitle: state.headTitle, user: state.user}),
    {logout})
(withRouter(Header));