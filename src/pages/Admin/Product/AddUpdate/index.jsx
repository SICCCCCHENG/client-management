import React, {Component} from 'react';
import {Card, List, Upload, Input, Cascader} from "antd";
import {ArrowLeftOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";

class AddUpdate extends Component {

    state = {
        loading: false
    }

    render() {

        const title =
            <div>
                <ArrowLeftOutlined onClick={() => {
                    this.props.history.goBack()
                }} style={{fontSize: "18px", color: "green", marginRight: '10px'}}/>
                <span>添加商品</span>
            </div>


        const {loading} = this.state

        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );



        const options = [
            {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                    {
                        value: 'hangzhou',
                        label: 'Hangzhou',
                        children: [
                            {
                                value: 'xihu',
                                label: 'West Lake',
                            },
                        ],
                    },
                ],
            },
            {
                value: 'jiangsu',
                label: 'Jiangsu',
                children: [
                    {
                        value: 'nanjing',
                        label: 'Nanjing',
                        children: [
                            {
                                value: 'zhonghuamen',
                                label: 'Zhong Hua Men',
                            },
                        ],
                    },
                ],
            },
        ];


        return (


            <Card title={title}>

                <List
                    style={{textAlign: 'left'}}
                    className='Detail-List'
                    size="large"
                    // header={<div>Header</div>}
                    // footer={<div>Footer</div>}
                    // bordered
                    // dataSource={data}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                >
                    <List.Item>
                        <div>
                            <span className='add-LeftTitle'><span className='mandatory'>*</span> 商品名称:</span>
                            <Input></Input>
                        </div>
                    </List.Item>
                    <List.Item>
                        <div>
                            <span className='add-LeftTitle'><span className='mandatory'>*</span> 商品描述:</span>
                            <Input.TextArea rows={4} placeholder="maxLength is 6" maxLength={6} />
                        </div>

                    </List.Item>
                    <List.Item>
                        <div>
                            <span className='add-LeftTitle'><span className='mandatory'>*</span> 商品价格:</span>
                            <Input addonAfter={'元'}/>
                        </div>

                    </List.Item>
                    <List.Item>
                        <div>
                            <span className='add-LeftTitle'><span className='mandatory'>*</span> 所属分类:</span>
                            {/*<Cascader options={options} onChange={this.onChange} placeholder="Please select" />*/}
                            <Cascader options={options} placeholder="Please select" />
                        </div>

                    </List.Item>
                    <List.Item>
                        <div>
                            <span className='add-LeftTitle'>商品图片:</span>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                // beforeUpload={beforeUpload}
                                // onChange={handleChange}
                            >
                                {/*{imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}*/}
                                {uploadButton}
                            </Upload>
                        </div>

                    </List.Item>
                    <List.Item>
                        <div>
                            <span className='Detail-LeftTitle'>商品详情:</span>
                            <span
                                dangerouslySetInnerHTML={{__html: '<h1 style="color:red">{desc}</h1>'}}></span>
                        </div>
                    </List.Item>
                </List>

            </Card>
        );
    }
}

export default AddUpdate;