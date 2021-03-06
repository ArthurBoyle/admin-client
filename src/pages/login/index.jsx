import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {Form, Input, Button} from "antd";

import logo from "../../assets/images/logo.png";
import {login} from "../../redux/actions";
import "./index.less";

const {Item} = Form;

class Login extends Component {
    onFinish = async (values) => {
        const {username, password} = values;
        this.props.login(username, password);
    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    render() {
        const user = this.props.user;
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

export default connect(
    state => ({user: state.user}),
    {login}
)(Login);