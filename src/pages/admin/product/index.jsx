// 商品管理路由
import React, {Component} from 'react';
import {Route} from "react-router-dom";

import ProductHome from "./product-home";

export default class Product extends Component {
    render() {
        return (
            <div>
                <Route path="/product" component={ProductHome}/>
            </div>
        );
    }
}
