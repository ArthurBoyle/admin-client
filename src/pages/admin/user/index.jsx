// 用户管理路由
import React, {Component} from 'react';
import {Button, Card, Table, Modal, message} from "antd";
import {ExclamationCircleOutlined} from "@ant-design/icons";

import LinkButton from "../../../components/link-button";
import {formateDate} from "../../../utils/dateUtils";
import {reqGetUserList, reqDeleteUser, reqAddOrUpdateUser} from "../../../api";
import AddOrUpdateUser from "./add-or-update-user";

export default class User extends Component {
    state = {
        columns: [
            {
                title: "用户名",
                dataIndex: "username"
            },
            {
                title: "邮箱",
                dataIndex: "email"
            },
            {
                title: "电话",
                dataIndex: "phone"
            },
            {
                title: "注册时间",
                dataIndex: "create_time",
                render: formateDate
            },
            {
                title: "所属角色",
                dataIndex: "role_id",
                // render: (role_id) => this.state.roles.find(role => role._id === role_id).name
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: "操作",
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            }
        ],
        users: [],
        roles: [],
        isShowModal: false,
        isShowDelete: false
    };

    componentDidMount() {
        this.getUserList();
    }

    getUserList = async () => {
        const result = await reqGetUserList();
        if (result.status === 0) {
            const {users, roles} = result.data;
            this.initRoleNames(roles);
            this.setState({users, roles});
        }
    }

    // 根据role数组，生成包含所有角色名的对象
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name;
            return pre;
        }, {});
        this.roleNames = roleNames;
    }

    addOrUpdateUser = async () => {
        this.setState({isShowModal: false});
        const user = this.form.getFieldValue();
        console.log(user)
        if (this.user) {
            user._id = this.user._id;
        }
        const result = await reqAddOrUpdateUser(user);
        if (result.status === 0) {
            message.success(`${this.user ? "修改" : "添加"}用户成功`);
            this.getUserList();
        }
    }

    showUpdate = (user) => {
        this.setState({isShowModal: true});
        this.user = user;
    }

    cancel = () => {
        this.setState({isShowModal: false});
        this.user = null;
    }

    deleteUser = (user) => {
        Modal.confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            onOk: async () => {
                const result = await reqDeleteUser(user._id);
                if (result.status === 0) {
                    message.success("删除成功");
                    this.getUserList();
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        })
    }

    render() {
        const {columns, users, roles, isShowModal, isShowDelete} = this.state;
        const user = this.user || {};
        const title = <Button type="primary" onClick={() => this.setState({isShowModal: true})}>创建用户</Button>
        return (
            <Card title={title}>
                <Table
                    bordered
                    columns={columns}
                    dataSource={users}
                    pagination={{defaultPageSize: 3}}
                    rowKey="_id"
                />
                <Modal
                    destroyOnClose
                    title={user._id ? "修改用户" : "添加用户"}
                    visible={isShowModal}
                    onCancel={() => this.cancel()}
                    onOk={this.addOrUpdateUser}
                >
                    <AddOrUpdateUser roles={roles} setForm={form => this.form = form} user={user}/>
                </Modal>
                <Modal
                    title="删除用户"
                    visible={isShowDelete}
                    onCancel={() => this.setState({isShowDelete: false})}
                    onOk={this.deleteUser}
                />
            </Card>
        );
    }
}
