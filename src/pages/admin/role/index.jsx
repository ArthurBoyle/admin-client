// 角色管理路由
import React, {Component} from 'react';
import {Card, Button, Table, Modal, Form, Input, message} from "antd";

import {reqGetRoleList, reqAddRole, reqUpdateRole} from "../../../api";
import AuthForm from "./role-auth-form";
import memoryUtils from "../../../utils/memoryUtils";
import {formateDate} from "../../../utils/dateUtils";

const {Item} = Form;

export default class Role extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "角色名称",
                    dataIndex: "name"
                },
                {
                    title: "创建时间",
                    dataIndex: "create_time",
                    render: (create_time) => formateDate(create_time)
                },
                {
                    title: "授权时间",
                    dataIndex: "auth_time",
                    render: formateDate
                },
                {
                    title: "授权人",
                    dataIndex: "auth_name"
                }
            ],
            roleList: [],
            selectRole: {},
            isLoading: false,
            showAddRole: false,
            showUpdateRole: false
        };
        this.addRoleForm = React.createRef();
        this.updateRoleForm = React.createRef();
    }
    /*    columns = [
          {
              title: "角色名称",
              dataIndex: "name"
          },
          {
              title: "创建时间",
              dataIndex: "create_time"
          },
          {
              title: "授权时间",
              dataIndex: "auth_time"
          },
          {
              title: "授权人",
              dataIndex: "auth_name"
          }
      ]*/

    getRoleList = async () => {
        this.setState({isLoading: true});
        const result = await reqGetRoleList();
        this.setState({isLoading: false});
        if (result.status === 0) {
            this.setState({roleList: result.data});
        }
    }

    showAddRole = () => {
        this.setState({showAddRole: true});
    }

    addRole = () => {
        this.addRoleForm.current.validateFields().then(async values => {
            this.setState({showAddRole: false});
            const {roleName} = values;
            const result = await reqAddRole(roleName);
            if (result.status === 0) {
                message.success("添加成功");
                // this.getRoleList();
                this.setState(state => ({
                    roleList: [...state.roleList, result.data]
                }));
            } else {
                message.error("添加失败");
            }
        }).catch(() => {
            message.info("角色名称不能为空");
        });
    }

    showUpdateRole = () => {
        this.setState({showUpdateRole: true});
    }

    updateRole = async () => {
        this.setState({showUpdateRole: false});
        const _id = this.state.selectRole._id;
        const menus = this.updateRoleForm.current.getMenus();
        const auth_time = Date.now();
        const auth_name = memoryUtils.user.username;
        const updateRole = {_id, menus, auth_time, auth_name};
        const result = await reqUpdateRole(updateRole);
        if (result.status === 0) {
            message.success("更新成功");
            this.getRoleList();
            this.setState({
                selectRole: {...this.state.selectRole, ...updateRole}
            });
        }
    }

    componentDidMount() {
        this.getRoleList();
    }

    render() {
        const {columns, roleList, selectRole, isLoading, showAddRole, showUpdateRole} = this.state;
        const title = (
            <span>
                <Button type="primary" onClick={this.showAddRole}>创建角色</Button>
                &nbsp;&nbsp;&nbsp;
                <Button type="primary" disabled={!selectRole._id} onClick={this.showUpdateRole}>设置角色权限</Button>
            </span>
        );
        return (
            <Card title={title}>
                <Table
                    bordered
                    columns={columns}
                    dataSource={roleList}
                    loading={isLoading}
                    pagination={{defaultPageSize: 3}}
                    rowKey="_id"
                    rowSelection={{
                        type: "radio",
                        selectedRowKeys: [selectRole._id],
                        onSelect: role => {
                            this.setState({selectRole: role});
                        }
                    }}
                    onRow={role => {
                        return {
                            onClick: event => {
                                this.setState({selectRole: role});
                            }
                        };
                    }}
                />
                <Modal
                    title="创建角色"
                    visible={showAddRole}
                    onOk={this.addRole}
                    onCancel={() => this.setState({showAddRole: false})}
                    destroyOnClose
                >
                    <Form name="test" ref={this.addRoleForm}>
                        <Item
                            name="roleName"
                            label="角色名称"
                            initialValue=""
                            rules={[
                                {required: true, message: "角色名称不能为空"}
                            ]}
                        >
                            <Input placeholder="请输入角色名称"/>
                        </Item>
                    </Form>
                </Modal>
                <Modal
                    id="modal"
                    title="设置角色权限"
                    visible={showUpdateRole}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({showUpdateRole: false})
                    }}
                    // destroyOnClose
                >
                    <AuthForm selectRole={selectRole} ref={this.updateRoleForm}/>
                </Modal>
            </Card>
        );
    }
}
