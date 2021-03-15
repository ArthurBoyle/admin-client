// 左侧导航
import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import { Menu } from 'antd';
import * as Icon from "@ant-design/icons";

import menuList from "../../config/menuConfig";
import logo from "../../assets/images/logo.png";
import "./index.less";
import memoryUtils from "../../utils/memoryUtils";

const { SubMenu, Item } = Menu;

class LeftNav extends Component {
    constructor(props) {
        super(props);
        // 需要先获取列表，这样openKey才能获取数据
        this.menuNodes = this.getMenuNodes(menuList);
    }

    // 判断当前登录用户对item是否有权限
    hasAuth = (item) => {
        /*
            1.如果用户是admin，返回true
            2.如果为公开的，返回true
            3.如果当前用户有权限，返回true
            4.如果当前用户有item的子item权限，返回true
         */
        const username = memoryUtils.user.username;
        const key = item.key
        const menus = memoryUtils.user.role.menus;
        if (username === "admin" || item.isPublic || menus.indexOf(key) !== -1) {
            return true;
        } else if (item.children) {
            return !!item.children.find(cItem => menus.indexOf(cItem.key) !== -1);
        }
        return false;
    }

    // 根据menuList数组生成对应的标签数组(map)
    /*
    getMenuNodes = (menuList) => {
        return menuList.map(item => {
            // 如果当前用户有对应的item权限，才需要显示对应的菜单项
            if (this.hasAuth(item)) {
                if (!item.children) {
                    return (
                        <Item key={item.key} icon={React.createElement(Icon[item.icon])}>
                            <Link to={item.key}>{item.title}</Link>
                        </Item>
                    )
                } else {
                    const path = this.props.location.pathname;
                    // 查找与当前路径匹配的子Item
                    const cItem = item.children.find(childrenItem => path.indexOf(childrenItem.key) === 0);
                    if (cItem) {
                        this.openKey = item.key;
                    }
                    return (
                        <SubMenu key={item.key} icon={React.createElement(Icon[item.icon])} title={item.title}>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
            }
        })
    }

     */

    // 根据menuList数组生成对应的标签数组(reduce)
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname;
        return menuList.reduce((pre, item) => {
            // 如果当前用户有对应的item权限，才需要显示对应的菜单项
            if (this.hasAuth(item)) {
                if (!item.children) {
                    pre.push((
                        <Item key={item.key} icon={React.createElement(Icon[item.icon])}>
                            <Link to={item.key}>{item.title}</Link>
                        </Item>
                    ))
                } else {
                    const cItem = item.children.find(childrenItem => path.indexOf(childrenItem.key) === 0);
                    if (cItem) {
                        this.openKey = item.key;
                    }
                    pre.push((
                        <SubMenu key={item.key} icon={React.createElement(Icon[item.icon])} title={item.title}>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre;
        }, []);
    }

    render() {
        let path = this.props.location.pathname;
        const openKey = this.openKey;
        // 修改path的值，使其能够与Product的子路由进行匹配
        if (path.indexOf("/product") === 0) {
            path = "/product";
        }
        return (
            <div className="left-nav">
                <Link to="/" className="left-nav-header">
                    <img src={logo} alt=""/>
                    <h1>后台管理系统</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {this.menuNodes}
                </Menu>
            </div>
        );
    }
}

export default withRouter(LeftNav);

/*
<Item key="/home" icon={<HomeOutlined />}>
    <Link to="/home">首页</Link>
</Item>
<SubMenu key="sub1" icon={<ShopOutlined />} title="商品">
    <Item key="/category" icon={<MenuOutlined />}>
        <Link to="/category">品类管理</Link>
    </Item>
    <Item key="/product" icon={<ToolOutlined />}>
        <Link to="/product">商品管理</Link>
    </Item>
</SubMenu>
<Item key="/user" icon={<UserOutlined />}>
    <Link to="/user">用户管理</Link>
</Item>
<Item key="/role" icon={<SafetyOutlined />}>
    <Link to="/role">角色管理</Link>
</Item>
<SubMenu key="sub2" icon={<AreaChartOutlined />} title="图形图表">
    <Item key="/charts/bar" icon={<BarChartOutlined />}>
        <Link to="/charts/bar">柱形图</Link>
    </Item>
    <Item key="/charts/line" icon={<LineChartOutlined />}>
        <Link to="/charts/line">折线图</Link>
    </Item>
    <Item key="/charts/pie" icon={<PieChartOutlined />}>
        <Link to="/charts/pie">饼图</Link>
    </Item>
</SubMenu>
 */
