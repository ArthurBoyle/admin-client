import React, {Component} from 'react';
import {Form, Input} from "antd";
import PropTypes from "prop-types";

const {Item} = Form;

export default class UpdateForm extends Component {
    static propTypes = {
        categoryName: PropTypes.string,
        setForm: PropTypes.func
    };

    formRef = React.createRef();

    componentDidMount() {
        this.props.setForm(this.formRef.current);
        console.log("fff", this.formRef)
        console.log("ccc", this.formRef.current);
    }

    render() {
        const {categoryName} = this.props;
        return (
            <Form ref={this.formRef}>
                <Item
                    name="categoryName"
                    initialValue={categoryName}
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
