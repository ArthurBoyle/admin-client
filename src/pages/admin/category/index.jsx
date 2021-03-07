// 品类管理路由
import React, {Component} from 'react';
import {Button, Card, message, Table, Modal} from 'antd';
import {PlusOutlined, RightOutlined} from "@ant-design/icons";

import LinkButton from "../../../components/link-button";
import {reqGetCategoryList, reqAddCategory, reqUpdateCategory} from "../../../api";
import AddForm from "./AddForm";
import UpdateForm from "./updateForm";

export default class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            isLoading: false,
            parentId: "0",
            parentName: "",
            subCategories: [],
            showAddModal: false,
            showUpdateModal: false
        };
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdateModal(category)}>修改分类</LinkButton>
                        {
                            this.state.parentId === "0" ?
                                <LinkButton
                                    onClick={() => this.showSubCategoryList(category)}
                                >
                                    查看子分类
                                </LinkButton> : null
                        }
                    </span>
                ),
                width: 300
            }
        ];
    }

    componentDidMount() {
        this.getCategoryList();
    }

    // 获取分类列表
    getCategoryList = async (parentId) => {
        parentId = parentId || this.state.parentId;
        this.setState({isLoading: true});
        const result = await reqGetCategoryList(parentId);
        this.setState({isLoading: false});
        if (result.status === 0) {
            if (parentId === "0") {
                this.setState({categories: result.data});
            } else {
                this.setState({subCategories: result.data});
            }
        } else {
            message.error("获取分类列表失败");
        }
    }

    // 显示二级分类列表
    showSubCategoryList = (category) => {
        this.setState(
            {parentId: category._id, parentName: category.name},
            () => this.getCategoryList()
        );
    }

    // 显示一级分类列表
    showCategoryList = () => this.setState({
        parentId: "0",
        parentName: "",
        subCategories: []
    })

    // 显示添加对话框
    showAddModal = () => {
        this.setState({showAddModal: true});
    }

    // 添加分类
    addCategory = () => {
        this.form.validateFields().then( async (values) => {
            this.setState({showAddModal: false});
            const {parentId, categoryName} = values;
            const result = await reqAddCategory(parentId, categoryName);
            if (result.status === 0) {
                message.success("添加成功");
                if (parentId === this.state.parentId) {
                    this.getCategoryList();
                } else if (parentId === "0") {
                    this.getCategoryList(parentId);
                }
            } else {
                message.error("添加失败");
            }
        }).catch(() => {
            message.info("请输入分类名称");
        });
    }

    // 显示更新对话框
    showUpdateModal = (category) => {
        this.category = category;
        this.setState({showUpdateModal: true});
    }

    // 更新分类
    updateCategory = () => {
        this.form.validateFields().then(async (values) => {
            // 隐藏确认框
            this.setState({showUpdateModal: false});
            // 更新分类列表
            const categoryId = this.category._id;
            const {categoryName} = values;
            // const categoryName = this.form.getFieldValue("categoryName");
            // if (!categoryName) return message.info("请输入分类名称");
            const result = await reqUpdateCategory(categoryId, categoryName);
            if (result.status === 0) {
                message.success("修改成功");
                // 重新显示列表
                this.getCategoryList();
            } else {
                message.error("修改失败");
            }
        }).catch(() => {
            message.info("请输入分类名称");
        });
    }

    render() {
        const {
            categories,
            parentId,
            isLoading,
            parentName,
            subCategories,
            showAddModal,
            showUpdateModal
        } = this.state;
        const category = this.category || {};
        const title = (
            parentId==="0" ? "一级分类列表" :
                <span>
                    <LinkButton onClick={this.showCategoryList}>一级分类列表</LinkButton>
                    &nbsp;<RightOutlined/>&nbsp;&nbsp;
                    {parentName}
                </span>
        );
        const extra = (
            <Button
                type="primary"
                onClick={this.showAddModal}
            >
                <PlusOutlined/>添加
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    columns={this.columns}
                    dataSource={parentId==="0" ? categories : subCategories}
                    bordered
                    rowKey="_id"
                    loading={isLoading}
                    pagination={{defaultPageSize: 5}}
                />
                <Modal
                    title="添加分类"
                    visible={showAddModal}
                    onOk={this.addCategory}
                    onCancel={() => this.setState({showAddModal: false})}
                    destroyOnClose
                >
                    <AddForm categories={categories} parentId={parentId} setForm={form => this.form = form}/>
                </Modal>
                <Modal
                    title="更新分类"
                    visible={showUpdateModal}
                    onOk={this.updateCategory}
                    onCancel={() => this.setState({showUpdateModal: false})}
                    destroyOnClose
                >
                    <UpdateForm categoryName={category.name} setForm={form => this.form = form}/>
                </Modal>
            </Card>
        );
    }
}

