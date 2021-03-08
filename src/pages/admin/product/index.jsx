// 商品管理路由
import React, {Component} from 'react';
import {Route, Switch} from "react-router-dom";

import ProductHome from "./product-home";
import ProductDetail from "./product-detail";

export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path="/product" exact component={ProductHome}/>
                <Route path="/product/detail" component={ProductDetail}/>
            </Switch>
        );
    }
}
