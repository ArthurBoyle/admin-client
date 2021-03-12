import React, {Component} from 'react';
import {Card, Button, Select, Input, Table, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import LinkButton from "../../../components/link-button";
import {reqGetProductList, reqSearchProducts, reqUpdateStatus} from "../../../api";
import {PAGE_SIZE} from "../../../utils/constants";

const {Option} = Select;

export default class ProductHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchType: "productName",
            searchName: "",
            products: [],
            total: 0,
            isLoading: false
        };
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => "￥" + price,
                align: "center"
            },
            {
                title: '状态',
                render: (product) => {
                    const {_id, status} = product;
                    return (
                        <span>
                        <span>{status===1 ? "在售" : "已下架"}</span>
                        <br/>
                        <Button
                            type="primary"
                            onClick={() => this.updateStatus(_id, status===1 ? 2 : 1)}
                        >
                            {status===1 ? "下架" : "上架"}
                        </Button>
                    </span>
                    )
                },
                width: 130,
                align: "center"
            },
            {
                title: '操作',
                render: (product) => (
                    <span>
                        <LinkButton onClick={() => this.props.history.push("/product/detail", product)}>详情</LinkButton>
                        <LinkButton onClick={() => this.props.history.push("/product/addupdate", product)}>修改</LinkButton>
                    </span>
                ),
                width: 120,
                align: "center"
            },

        ];
    }

    componentDidMount() {
        this.getProductList(1);
    }

    getProductList = async (pageNum) => {
        this.pageNum = pageNum;
        this.setState({isLoading: true});
        const {searchName, searchType} = this.state;
        let result;
        if (!searchName) {
            result = await reqGetProductList(pageNum, PAGE_SIZE);
        } else {
            result = await reqSearchProducts(pageNum, PAGE_SIZE, searchType, searchName);
        }
        this.setState({isLoading: false});
        if (result.status === 0) {
            const {total, list} = result.data;
            this.setState({total, products: list});
        }
    }

    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status);
        if (result.status === 0) {
            message.success("更新商品成功");
            this.getProductList(this.pageNum);
        }
    }

    render() {
        const {searchType, products, total, isLoading, searchName} = this.state;
        const title = (
            <span>
                <Select value={searchType} onChange={(value) => this.setState({searchType: value})}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input style={{width: 300, margin: "0 10px"}} value={searchName} onChange={event => this.setState({searchName: event.target.value})}/>
                <Button type="primary" onClick={() => this.getProductList(1)}>搜索</Button>
            </span>
        );

        const extra = (
            <Button type="primary" onClick={() => this.props.history.push("/product/addupdate")}><PlusOutlined/>添加商品</Button>
        );
        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={products}
                    columns={this.columns}
                    rowKey="_id"
                    bordered
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        total,
                        // onChange: (pageNum) => {this.getProductList(pageNum)}
                        onChange: this.getProductList
                    }}
                    loading={isLoading}
                />
            </Card>
        );
    }
}
