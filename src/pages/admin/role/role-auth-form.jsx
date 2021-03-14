import React, {Component} from 'react';
import {Form, Input, Tree} from "antd";
import PropTypes from "prop-types";

import menuList from "../../../config/menuConfig";

const {Item} = Form;

export default class AuthForm extends Component {
    static propTypes = {
        selectRole: PropTypes.object
    };

    constructor(props) {
        super(props);
        // this.checkedKeys = this.props.selectRole.menus;
        this.state = {
            treeData: [
                {
                    title: '平台权限',
                    key: 'all',
                    children: [...menuList]
                }
            ],
            // checkedKeys: this.props.selectRole.menus
        };
    }

    // 选中某个节点时的回调
    onCheck = checkedKeys => {
        console.log(checkedKeys);
        // this.setState({checkedKeys});
        this.props.selectRole.menus = checkedKeys;
        this.forceUpdate()
    }

    // getMenus = () => this.state.checkedKeys;
    getMenus = () => this.props.selectRole.menus;

    // shuaxin = () => {
    //     this.checkedKeys = this.props.selectRole.menus;
    // }
    render() {
        // this.shuaxin()
        const {selectRole} = this.props;
        console.log(this.props.selectRole.menus)
        // console.log(this.checkedKeys)
        // const {checkedKeys} = this.state;
        return (
            <Form id="form">
                <Item label="角色名称">
                    <Input value={selectRole.name} disabled/>
                </Item>
                <Tree
                    treeData={this.state.treeData}
                    checkable
                    defaultExpandAll
                    // checkedKeys={checkedKeys}
                    checkedKeys={this.props.selectRole.menus}
                    onCheck={this.onCheck}
                />
            </Form>
        );
    }
}






/*
import React, {Component} from 'react';
import {Form, Input, Tree} from "antd";
import PropTypes from "prop-types";

import menuList from "../../../config/menuConfig";

const {Item} = Form;

export default class AuthForm extends Component {
    static propTypes = {
        selectRole: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.checkedKeys = this.props.selectRole.menus;
        this.state = {
            treeData: [
                {
                    title: '平台权限',
                    key: 'all',
                    children: [...menuList]
                }
            ],
            // checkedKeys: this.props.selectRole.menus
        };
    }

    // 选中某个节点时的回调
    onCheck = checkedKeys => {
        console.log(checkedKeys);
        // this.setState({checkedKeys});
        this.checkedKeys = checkedKeys;
        this.forceUpdate()
    }

    // getMenus = () => this.state.checkedKeys;
    getMenus = () => this.checkedKeys;

    shuaxin = () => {
        this.checkedKeys = this.props.selectRole.menus;
    }
    render() {
        // this.shuaxin()
        const {selectRole} = this.props;
        console.log(this.props.selectRole.menus)
        console.log(this.checkedKeys)
        // const {checkedKeys} = this.state;
        return (
            <Form id="form">
                <Item label="角色名称">
                    <Input value={selectRole.name} disabled/>
                </Item>
                <Tree
                    treeData={this.state.treeData}
                    checkable
                    defaultExpandAll
                    // checkedKeys={checkedKeys}
                    checkedKeys={this.checkedKeys}
                    onCheck={this.onCheck}
                />
            </Form>
        );
    }
}*/
