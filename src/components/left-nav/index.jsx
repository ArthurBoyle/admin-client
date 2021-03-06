// 左侧导航
import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import { Menu } from 'antd';
import * as Icon from "@ant-design/icons";

import menuList from "../../config/menuConfig";
import logo from "../../assets/images/logo.png";
import "./index.less";

const { SubMenu, Item } = Menu;

class LeftNav extends Component {
    constructor(props) {
        super(props);
        // 需要先获取列表，这样openKey才能获取数据
        this.menuNodes = this.getMenuNodes(menuList);
    }

    // 根据menuList数组生成对应的标签数组(map)
    getMenuNodes = (menuList) => {
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Item key={item.key} icon={React.createElement(Icon[item.icon])}>
                        <Link to={item.key}>{item.title}</Link>
                    </Item>
                )
            } else {
                const path = this.props.location.pathname;
                // 查找与当前路径匹配的子Item
                const cItem = item.children.find(childrenItem => childrenItem.key === path);
                if (cItem) {
                    this.openKey = item.key;
                }
                return (
                    <SubMenu key={item.key} icon={React.createElement(Icon[item.icon])} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    // 根据menuList数组生成对应的标签数组(reduce)
    /*
    getMenuNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            if (!item.children) {
                pre.push((
                    <Item key={item.key} icon={React.createElement(Icon[item.icon])}>
                        <Link to={item.key}>{item.title}</Link>
                    </Item>
                ))
            } else {
                pre.push((
                    <SubMenu key={item.key} icon={React.createElement(Icon[item.icon])} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
            }
            return pre;
        }, []);
    }
     */

    render() {
        const path = this.props.location.pathname;
        const openKey = this.openKey;
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

// <Item key="/home" icon={<HomeOutlined />}>
//     <Link to="/home">首页</Link>
// </Item>
// <SubMenu key="sub1" icon={<ShopOutlined />} title="商品">
//     <Item key="/category" icon={<MenuOutlined />}>
//         <Link to="/category">品类管理</Link>
//     </Item>
//     <Item key="/product" icon={<ToolOutlined />}>
//         <Link to="/product">商品管理</Link>
//     </Item>
// </SubMenu>
// <Item key="/user" icon={<UserOutlined />}>
//     <Link to="/user">用户管理</Link>
// </Item>
// <Item key="/role" icon={<SafetyOutlined />}>
//     <Link to="/role">角色管理</Link>
// </Item>
// <SubMenu key="sub2" icon={<AreaChartOutlined />} title="图形图表">
//     <Item key="/charts/bar" icon={<BarChartOutlined />}>
//         <Link to="/charts/bar">柱形图</Link>
//     </Item>
//     <Item key="/charts/line" icon={<LineChartOutlined />}>
//         <Link to="/charts/line">折线图</Link>
//     </Item>
//     <Item key="/charts/pie" icon={<PieChartOutlined />}>
//         <Link to="/charts/pie">饼图</Link>
//     </Item>
// </SubMenu>
