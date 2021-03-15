import React, {Component} from 'react';
import {Form, Input, Select} from "antd";
import PropTypes from "prop-types";
import "./index.less";

const {Item} = Form;
const {Option} = Select;

export default class AddOrUpdateUser extends Component {
    static propTypes = {
        roles: PropTypes.array,
        setForm: PropTypes.func,
        user: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.userForm = React.createRef();
    }

    componentDidMount() {
        this.props.setForm(this.userForm.current);
    }

    render() {
        const {roles, user} = this.props;
        return (
            <Form style={{width: 400, margin: "auto"}} ref={this.userForm}>
                <Item
                    name="username"
                    label="用户名"
                    rules={[{required: true, message: "必须输入用户名"}]}
                    initialValue={user.username}
                >
                    <Input placeholder="请输入用户名" disabled={!!user._id}/>
                </Item>
                <Item name="password" label="密码" initialValue={user.password}>
                    <Input placeholder="请输入密码" type="password" disabled={!!user._id}/>
                </Item>
                <Item
                    name="phone"
                    label="手机号"
                    rules={[{pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: "请输入正确的手机号"}]}
                    initialValue={user.phone}
                >
                    <Input placeholder="请输入手机号"/>
                </Item>
                <Item name="email" label="邮箱" initialValue={user.email}>
                    <Input placeholder="请输入邮箱"/>
                </Item>
                <Item name="role_id" label="角色" initialValue={user.role_id}>
                    <Select placeholder="请选择角色">
                        {
                            roles.map(role => (
                                <Option key={role._id} value={role._id}>{role.name}</Option>
                            ))
                        }
                    </Select>
                </Item>
            </Form>
        );
    }
}
