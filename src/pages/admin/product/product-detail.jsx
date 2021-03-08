import React, {Component} from 'react';
import {Card, List} from "antd";
import {LeftOutlined} from "@ant-design/icons";

import LinkButton from "../../../components/link-button";
import {BASE_URL} from "../../../utils/constants";
import {reqGetCategoryNameById} from "../../../api";
import "./index.less";

const {Item} = List;

export default class ProductDetail extends Component {
    state = {
        cName1: "",
        cName2: ""
    };
    async componentDidMount() {
        const {pCategoryId, categoryId} = this.props.location.state;
        console.log(pCategoryId);
        if (pCategoryId === "0") {
            const result = await reqGetCategoryNameById(categoryId);
            if (result.status === 0) {
                this.setState({cName1: result.data.name});
            }
        } else {
            /*
            const result1 = await reqGetCategoryNameById(pCategoryId);
            const result2 = await reqGetCategoryNameById(categoryId);
            if (result1.status === 0) {
                this.setState({
                    cName1: result1.data.name,
                    cName2: result2.data.name
                });
            }
             */
            const results = await Promise.all([
                reqGetCategoryNameById(pCategoryId),
                reqGetCategoryNameById(categoryId)
            ]);
            console.log(results);
            if (results[0].status === 0 && results[1].status === 0) {
                this.setState({
                    cName1: results[0].data.name,
                    cName2: results[1].data.name
                })
            }
        }
    }

    render() {
        const {desc, detail, imgs, name, price} = this.props.location.state;
        const {cName1, cName2} = this.state;
        const title = (
            <LinkButton onClick={this.props.history.goBack}><LeftOutlined/>&nbsp;&nbsp;商品详情</LinkButton>
        );
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="product-detail-left">商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="product-detail-left">商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="product-detail-left">商品价格：</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className="product-detail-left">所属分类：</span>
                        <span>{cName1} {cName2 ? "--> " + cName2 : null}</span>
                    </Item>
                    <Item>
                        <span className="product-detail-left">商品图片：</span>
                        {
                            imgs.map(img => (
                                <img className="img" key={img} src={BASE_URL + img} alt="商品图片"/>
                            ))
                        }
                    </Item>
                    <Item>
                        <span className="product-detail-left">商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html: detail}} />
                    </Item>
                </List>
            </Card>
        );
    }
}
