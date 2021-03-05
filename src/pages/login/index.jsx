import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {Form, Input, Button, message} from "antd";
import MD5 from "blueimp-md5";

import {reqLogin} from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import logo from "../../assets/images/logo.png";
import "./index.less";

const {Item} = Form;

export default class Login extends Component {
    onFinish = async (values) => {
        const {username, password} = values;
        const result = await reqLogin(username, password);
        if (result.status === 0) {
            message.success("登陆成功");
            let user = result.data;
            const password = MD5(user.password);
            user = {...user, password};
            memoryUtils.user = user;
            storageUtils.saveUser(user);
            this.props.history.replace("/");
        } else {
            message.error("登陆失败");
        }
    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    render() {
        const user = memoryUtils.user;
        if (user && user._id) {
            return <Redirect to="/"/>
        }
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-section">
                    <h2>用户登录</h2>
                    <Form
                        name="basic"
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                    >
                        <Item
                            label="Username"
                            name="username"
                            rules={[
                                {required: true, message: 'Please input your username!'}
                            ]}
                            initialValue="admin"
                        >
                            <Input placeholder="请输入用户名"/>
                        </Item>

                        <Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    validator: (rule, value) => {
                                        if(!value){
                                            return Promise.reject("Please input your Password!");
                                        } else {
                                            return Promise.resolve();
                                        }
                                    }
                                },
                            ]}
                            initialValue="admin"
                        >
                            <Input.Password placeholder="请输入密码"/>
                        </Item>

                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Submit
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        );
    }
}
