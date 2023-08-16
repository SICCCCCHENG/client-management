import React, {Component} from 'react';
import {message, Modal, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {reqRemoveImg} from "../../../../../api";
import PropTypes from "prop-types";
import {nanoid} from "nanoid";
import {IMG_UPLOAD_BASE_URL} from "../../../../../utils/constants";

class PicturesWall extends Component {

    static propTypes = {
        imgs: PropTypes.array
    }

    state = {
        previewVisible: false,  // 标识是否显示大图预览
        previewImage: '',  // 大图的url
        fileList: [
            /*{
                uid: '-1',   // 每个file都有一个唯一的uid
                name: 'xx.png',  // 图片文件名
                status: 'done',  // options：uploading, done, error, removed
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
            }*/
        ]
    }


    // 隐藏Modal
    handleCancel = () => {
        this.setState({previewVisible: false})
    }


    // 显示指定file文件的大图
    handlePreview = file => {
        console.log('file', file)
        this.setState({
            previewImage: file.url || file.thumUrl,
            previewVisible: true
        })
    }

    // file 当前操作的文件(删除/上传)
    // fileList所有已上传文件的对象数组
    // 过程: 上传成功后在response中获取数据,在file对象中 修改name属性 与 添加url属性
    handleChange = async ({file, fileList, event}) => {
        console.log('file, fileList, event', file, fileList, event)

        if (file.status === 'done') {
            const result = file.response
            const {data, status} = result

            if (status === 0) {
                message.success("上传图片成功")

                // console.log('fileList[length - 1] = file', fileList[fileList.length - 1] === file)

                // 可以不写
                // fileList[fileList.length - 1] = file
                // fileList[fileList.length - 1].name = data.name
                file.name = data.name
                file.url = data.url

                /*const fileObj = {
                    uid: file.uid,
                    name: result.data.name,
                    status: 'done',
                    url: result.data.url
                }
                // 不能用push是因为方法进来的时候fileList已经带有file对象,且数组最后一个元素指向file对象
                fileList.push(fileObj)
                console.log('fileList: ',fileList)*/
            } else {
                message.error("上传图片失败..")
            }
        } else if (file.status === 'removed') {
            const {name} = file
            const result = await reqRemoveImg(name)
            if (result.status === 0) {
                message.success("图片移除成功")
            } else {
                message.error("文件移除失败, 请刷新后再试..")
            }
        }
        this.setState({fileList})
    }


    getImgsArray = () => {
        return this.state.fileList.map(file => {
            return file.name
        })
    }

    componentDidMount() {
        const {imgs} = this.props
        if (imgs.length !== 0) {
            const fileList = imgs.map(item => {
                return {
                    uid: '-'+nanoid(),  // 每个file都有一个唯一的uid
                    name: item,         // 图片文件名
                    status: 'done',     // options：uploading, done, error, removed
                    url: IMG_UPLOAD_BASE_URL + item
                }
            })
            this.setState({fileList})
        }
    }

    render() {

        const {previewVisible, previewImage, fileList} = this.state
        const uploadButton = (
            <div>
                {/*{loading ? <LoadingOutlined/> : <PlusOutlined/>}*/}
                <PlusOutlined/>
                <div style={{marginTop: 8}}>Upload</div>
            </div>
        );


        return (
            // <ImgCrop rotationSlider>
            <div className='clearfix'>
                <Upload
                    action="/manage/img/upload"
                    accept="image/*"   //只接收图片类型
                    name='image'         // 请求参数名
                    listType="picture-card"  // 卡片样式
                    fileList={fileList}  // 指定所有已上传文件的列表
                    // defaultFileList={fileList}
                    onChange={this.handleChange}
                    onPreview={this.handlePreview}
                    // onRemove={this.handleRemove}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img src={previewImage} alt="" style={{width: '100%'}}/>
                </Modal>
            </div>

            /*
            const onPreview = async (file) => {
                let src = file.url;
                if (!src) {
                    src = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file.originFileObj);
                        reader.onload = () => resolve(reader.result);
                    });
                }
                const image = new Image();
                image.src = src;
                const imgWindow = window.open(src);
                imgWindow?.document.write(image.outerHTML);
            };

            const {fileList} = this.state

            const uploadButton = (
                <div>
                    {/!*{loading ? <LoadingOutlined/> : <PlusOutlined/>}*!/}
                    <PlusOutlined/>
                    <div style={{marginTop: 8}}>Upload</div>
                </div>
            );

            return (
                // <ImgCrop rotationSlider>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onChange={this.onChange}
                    onPreview={onPreview}
                >
                    {/!*{fileList.length < 5 && '+ Upload'}*!/}
                </Upload>*/
            /*
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            // beforeUpload={beforeUpload}
                            // onChange={handleChange}
                        >
                            {/!*{imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}*!/}
                            {uploadButton}
                        </Upload>*/
        );
    }
}

export default PicturesWall;