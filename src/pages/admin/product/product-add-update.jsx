import React, {Component} from 'react';
import {Card, Form, Input, Cascader, Button} from "antd";
import {LeftOutlined} from "@ant-design/icons";

import LinkButton from "../../../components/link-button";
import {reqGetCategoryList, reqAddOrUpdateProduct} from "../../../api";
import ProductAddUpdatePicturesWall from "./product-add-update-pictureswall";
import "./index.less";

const {Item} = Form;
const {TextArea} = Input;

export default class ProductAddUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionList: []
        };
        const product = this.props.location.state;
        this.isUpdate = !!product;
        this.product = product || {};
        this.picWall = React.createRef();
    }

    componentDidMount() {
        this.getCategoryList("0");
    }

    // 商品价格验证
    validatorPrice = (rule, value) => {
        if (parseInt(value) > 0) {
            return Promise.resolve();
        } else {
            return Promise.reject("价格必须大于0");
        }
    }

    // 获取一级/二级分类列表
    getCategoryList = async (parentId) => {
        const result = await reqGetCategoryList(parentId);
        if (result.status === 0) {
            const categoryList = result.data;
            if (parentId === "0") {
                this.initOptionList(categoryList);
            } else {
                return categoryList;
            }
        }
    }

    // 初始化列表
    initOptionList = async (categoryList) => {
        const optionList = categoryList.map(category => ({
            value: category._id,
            label: category.name,
            isLeaf: false
        }));
        const {isUpdate, product} = this;
        const {pCategoryId} = product;
        if (isUpdate && pCategoryId !== "0") {
            const subCategoryList = await this.getCategoryList(pCategoryId);
            const subOptionList = subCategoryList.map(subCategory => ({
                value: subCategory._id,
                label: subCategory.name,
                isLeaf: true
            }));
            const targetOption = optionList.find(option => option.value === pCategoryId);
            targetOption.children = subOptionList;
        }
        this.setState({optionList});
    }

    // 动态加载选项
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        const subCategoryList = await this.getCategoryList(targetOption.value);
        targetOption.loading = false;
        if (subCategoryList && subCategoryList.length > 0) {
             const subOptionList = subCategoryList.map(subCategory => ({
                value: subCategory._id,
                label: subCategory.name,
                isLeaf: true
            }));
            targetOption.children = subOptionList;
        } else {
            targetOption.isLeaf = true;
        }
        this.setState({optionList: [...this.state.optionList]});
    };

    onFinish = async (value) => {
        console.log(value);
        // reqAddOrUpdateProduct
        const {name, desc, price, categoryIds} = value;
        let pCategoryId, categoryId;
        if (categoryIds.length === 1) {
            pCategoryId = "0";
            categoryId = categoryIds[0];
        } else {
            pCategoryId = categoryIds[0];
            categoryId  = categoryIds[1];
        }
        const imgs = this.picWall.current.getImgs();
        const product = {name, desc, price, pCategoryId, categoryId, imgs};
        if (this.isUpdate) {
            product._id = this.product._id;
        }

        const result = await reqAddOrUpdateProduct(product);
        if (result.status === 0) {
            this.props.history.goBack();
        }
    }

    render() {
        const {isUpdate, product} = this;
        const {pCategoryId, categoryId, imgs} = product;
        const categoryIds = [];
        if (isUpdate) {
            if (pCategoryId === "0") {
                categoryIds.push(categoryId);
            } else {
                categoryIds.push(pCategoryId, categoryId);
            }
        }
        // 指定Item布局的配置对象
        const formItemLayout = {
            wrapperCol: {
                xs: { span: 18 },
                lg: { span: 12 }
            }
        };
        const title = (
            <span>
                <LinkButton
                    onClick={this.props.history.goBack}
                >
                    <LeftOutlined/> {isUpdate ? "修改商品" : "添加商品"}
                </LinkButton>
            </span>
        );
        return (
            <Card title={title}>
                <Form
                    className="form"
                    {...formItemLayout}
                    // style={{width: 400}}
                    onFinish={this.onFinish}
                >
                    <Item
                        label="商品名称"
                        name="name"
                        rules={[
                            {required: true, message: "商品名称不能为空"}
                        ]}
                        initialValue={product.name}
                    >
                        <Input placeholder="商品名称"/>
                    </Item>
                    <Item
                        label="商品描述"
                        name="desc"
                        rules={[
                            {required: true, message: "商品描述不能为空"}
                        ]}
                        initialValue={product.desc}
                    >
                        <TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }}/>
                    </Item>
                    <Item
                        label="商品价格"
                        name="price"
                        rules={[
                            {required: true, message: "商品价格不能为空"},
                            {validator: this.validatorPrice}
                        ]}
                        initialValue={product.price}
                    >
                        <Input placeholder="请输入商品价格" type="number" addonAfter="元"/>
                    </Item>
                    <Item
                        label="商品分类"
                        name="categoryIds"
                        rules={[
                            {required: true, message: "商品分类不能为空"}
                        ]}
                        initialValue={categoryIds}
                    >
                        <Cascader
                            options={this.state.optionList}
                            loadData={this.loadData}
                            placeholder="Please select"
                        />
                    </Item>
                    <Item label="商品图片">
                        <ProductAddUpdatePicturesWall ref={this.picWall} imgs={imgs}/>
                    </Item>
                    <Item label="商品详情">
                        <div>商品详情</div>
                    </Item>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Form>
            </Card>
        );
    }
}
