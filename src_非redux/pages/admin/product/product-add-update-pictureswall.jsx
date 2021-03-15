import React, {Component} from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from "prop-types";

import {reqDeleteImg} from "../../../api";
import {BASE_URL} from "../../../utils/constants";

export default class ProductAddUpdatePicturesWall extends Component {
    static propTypes = {
        imgs: PropTypes.array
    }

    constructor(props) {
        super(props);
        let fileList = [];
        const {imgs} = this.props;
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,  // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
                name: img,  // 图片文件名
                status: 'done', // 图片的状态
                url: BASE_URL + img,    // 图片地址
            }));
        }
        this.state = {
            previewVisible: false,  // 预览状态
            previewImage: '',   // 预览图地址
            previewTitle: '',
            fileList,
        };
    }

    // 关闭预览
    handleCancel = () => this.setState({ previewVisible: false });

    // 显示指定的预览图
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    /**
     * @file: 当前操作的图片文件(上传/删除)
     * @fileList: 所有已上传图片文件对象的数组
      */
    handleChange = async ({ file, fileList }) => {
        if (file.status === "done") {
            const result = file.response;
            if (result.status === 0) {
                const {name, url} = result.data;
                file = fileList[fileList.length - 1];
                file.name = name;
                file.url = url;
            }
        } else if (file.status === "removed") {
            const result = await reqDeleteImg(file.name);
            if (result.status === 0) {
                message.success("删除图片成功");
            } else {
                message.error("删除图片失败");
            }
        }
        this.setState({ fileList });
    };

    getBase64 = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    getImgs = () => {
        return this.state.fileList.map(file => file.name);
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload"   // 上传图片的接口地址
                    accept="image/*"    // 只接收图片格式
                    listType="picture-card" // 内建样式
                    name="image"    // 发送到后台的文件参数名，必须与接口文档一致
                    fileList={fileList} // 已上传图片的列表(数组)
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
