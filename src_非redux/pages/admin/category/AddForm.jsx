import React, {Component} from 'react';
import {Form, Select, Input} from "antd";
import PropTypes from "prop-types";

const {Item} = Form;
const {Option} = Select;

export default class AddForm extends Component {
    static propTypes = {
        categories: PropTypes.array,
        parentId: PropTypes.string,
        setForm: PropTypes.func
    };

    formRef = React.createRef();

    componentDidMount() {
        this.props.setForm(this.formRef.current);
    }

    render() {
        const {categories, parentId} = this.props;
        return (
            <Form ref={this.formRef}>
                <span>所属分类：</span>
                <Item name="parentId" initialValue={parentId}>
                    <Select>
                        <Option value="0">一级分类</Option>
                        {
                            categories.map(category => (
                                <Option key={category._id} value={category._id}>{category.name}</Option>
                            ))
                        }
                    </Select>
                </Item>
                <span>分类名称：</span>
                <Item
                    name="categoryName"
                    rules={[
                        {required: true, message: "分类名称不能为空"}
                    ]}
                >
                    <Input placeholder="请输入分类"/>
                </Item>
            </Form>
        );
    }
}
