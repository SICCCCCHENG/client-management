import React, {Component} from 'react';
import {Card, Form, List, Upload, Input, Cascader, Select, Button, message} from "antd";
import {ArrowLeftOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {reqCategories, reqCategoryName} from "../../../../api";

class AddUpdate extends Component {

    state = {
        // loading: false,
        // parentCategories: [],
        // subCategories:[]
        // cascaderDefaultValue: [],
        options: [],
        // productObj: null
    }


    validatePrice = (rule, value) => {
        if (+value >= 0) {
            return Promise.resolve()
        } else {
            return Promise.reject('数值必须大于等于0')
        }
    }

    submitForm = (values) => {
        console.log('values: ', values)
    }

    /*onchange = (value) => {
        console.log('value: ', value)
    }*/

    loadData = async (selectedOptions) => {
        // 得到选择的option对象 (0 为不可多选)
        const targetOption = selectedOptions[0];

        // console.log('selectedOption', targetOption);

        targetOption.loading = true
        // 再次发送请求, 获得二级列表
        const subResult = await reqCategories(targetOption.value)
        targetOption.loading = false

        // load options lazily
        // console.log('subCategories: ', subResult)
        if (subResult.status === 0) {

            if (subResult.data.length === 0) {
                targetOption.isLeaf = true
            } else {
                targetOption.children =
                    subResult.data.map((item) => {
                        return {
                            label: item.name,
                            value: item._id,
                            isLeaf: true
                        }
                    })
            }
            /*
            // load options lazily
            targetOption.children = [
                {
                    label: `${targetOption.label} Dynamic 1`,
                    value: 'dynamic1',
                    isLeaf: true
                },
                {
                    label: `${targetOption.label} Dynamic 2`,
                    value: 'dynamic2',
                    isLeaf: true
                },
            ];*/
            this.setState({options: [...this.state.options]});
        } else {
            message.error("二级列表请求失败,请稍后再试..")
        }
    }


    getCategoriesOptions = async () => {
        const pResults = await reqCategories(0)
        // console.log('reqCategories: ', pResults)
        if (pResults.status === 0) {
            // 初始化一级分类列表
            const options = pResults.data.map(item => {
                return {
                    value: item._id,
                    label: item.name,
                    isLeaf: false,
                }
            })


            if (this.isUpdate){
                // 初始化指定二级分类选项
                const {pCategoryId, categoryId} = this.productObj
                if (categoryId !== '0'){
                    // console.log('categoryId: ==============', pCategoryId);
                    const subResult = await reqCategories(pCategoryId)
                    // console.log('subResult: +++++++++++++', subResult)
                    if (subResult.status === 0){
                        const children =
                            subResult.data.map((item) => {
                                return {
                                    label: item.name,
                                    value: item._id,
                                    isLeaf: true
                                }
                            })

                        // console.log('children:==============',children)
                        const targetOption = options.find((item)=>{
                            return item.value === pCategoryId
                        })
                        targetOption.children = children
                    }
                }
            }



            // console.log('options ****************: ', options)
            this.setState({options})
        } else {
            message.error('一级列表请求出错,请稍后再试..')
        }
    }


    getSubcategoryName = async (pCategoryId, categoryId) => {
        // debugger
        const id = await reqCategoryName(categoryId)
        if (id.status === 0) {
            this.cascaderDefaultValue = [pCategoryId, id.data._id]
        } else {
            message.error('数据所属分类请求错误,请稍后再试..')
        }
    }

    // 初始化层叠式选项的值
    async componentWillMount() {
        const receivedInfo = this.props.location.state
        console.log('this.props: ', this.props)
        if (Array.isArray(receivedInfo)) { // 修改
            const [productObj] = receivedInfo
            this.isUpdate = true
            this.productObj = productObj

            // 获取层叠式选项的值
/*            const {pCategoryId, categoryId} = productObj
            await this.getSubcategoryName(pCategoryId, categoryId)*/
/*
            // 获取层叠式选项的值
            const {pCategoryId, categoryId} = productObj

            // this.cascaderDefaultValue = [pCategoryId, categoryId]

            if (categoryId === '0') { // 没有二级分类
                this.cascaderDefaultValue = [pCategoryId]
            }else { // 有二级分类
                // debugger
                this.cascaderDefaultValue = [pCategoryId, categoryId]
                // await this.getSubcategoryName(pCategoryId, categoryId)
            }*/
        }else{
            this.isUpdate = false
        }
    }

    // 获取一级列表数据
    async componentDidMount() {
        console.log('开始DidMount')
        await this.getCategoriesOptions()
    }


    render() {

        let {options} = this.state

        let cascaderValueArray = []
        if (this.isUpdate){
            const {pCategoryId, categoryId} = this.productObj
            if (categoryId === '0'){
                cascaderValueArray = [pCategoryId]
            }else {
                cascaderValueArray = [pCategoryId, categoryId]
            }
        }

        const title =
            <div>
                <ArrowLeftOutlined onClick={() => {
                    // 判断收到的数据是 currentPage 还是 [productObj, currentpage]
                    const receivedInfo = this.props.location.state
                    if (Array.isArray(receivedInfo)) {
                        this.props.history.push('/product', receivedInfo[1])
                    } else {
                        this.props.history.push('/product', receivedInfo)
                    }
                }} style={{fontSize: "18px", color: "green", marginRight: '10px'}}/>
                <span>{this.isUpdate ? '更新商品' : '添加商品'}</span>
            </div>

        const formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 10},
        };


        // console.log("cascaderDefaultValue", cascaderDefaultValue)
        // console.log('productObj:', productObj)
        // console.log('productObj.name:', productObj.name)
        // cascaderDefaultValue = ['cascaderDefaultValue', 'cascaderDefaultValue']

        const uploadButton = (
            <div>
                {/*{loading ? <LoadingOutlined/> : <PlusOutlined/>}*/}
                <PlusOutlined/>
                <div style={{marginTop: 8}}>Upload</div>
            </div>
        );

        console.log('this.cascaderDefaultValue', this.cascaderDefaultValue)
        console.log('this.productObj', this.productObj)

        return (
            <Card title={title}>
                <Form {...formItemLayout} onFinish={this.submitForm}>
                    <Form.Item
                        name='name'
                        label="商品名称"
                        rules={[
                            {
                                required: true,
                                message: '必须输入商品名称'
                            }
                        ]}
                    >
                        <Input defaultValue={this.isUpdate ? this.productObj.name : ''}></Input>
                    </Form.Item>

                    <Form.Item
                        name='productDesc'
                        label="商品描述"
                        rules={[
                            {
                                required: true,
                            }
                        ]}

                    >
                        <Input.TextArea
                            rows={2}
                            placeholder="maxLength is 6"
                            // maxLength={6}
                            defaultValue={this.isUpdate ? this.productObj.desc : ''}
                        />
                    </Form.Item>

                    <Form.Item
                        name='price'
                        // initialValue='productName'
                        label="商品价格"
                        rules={[
                            {
                                required: true,
                                validator: this.validatePrice,

                            },
                        ]}
                    >
                        {/*<span className='add-LeftTitle'><span className='mandatory'>*</span> 商品价格:</span>*/}
                        <Input type='number' addonAfter={'元'}
                               defaultValue={this.isUpdate ? this.productObj.price : ''}/>
                    </Form.Item>

                    <Form.Item
                        name='categoryIds'
                        initialValue={cascaderValueArray}

                        label="商品分类"
                        // placeholder="请选择分类"
                        rules={[
                            {
                                required: true,
                                message: '请选择分类'
                            }
                        ]}
                    >
                        {/*<Cascader options={options} loadData={loadData} onChange={onChange} changeOnSelect />*/}
                        <Cascader
                            options={options}
                            loadData={this.loadData}
                            placeholder="请选择分类"
                            // onChange={this.onchange}
                            // defaultValue={this.isUpdate ? cascaderDefaultValue : ''}
                            // value={cascaderDefaultValue}
                        />
                    </Form.Item>

                    <Form.Item
                        name='imgs'
                        initialValue='productName'
                        label='商品图片'
                        rules={[
                            {
                                required: false,
                            }
                        ]}
                    >
                        {/*<span className='add-LeftTitle'>商品图片:</span>*/}
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
                    </Form.Item>

                    <Form.Item
                        name='detail'
                        initialValue='productName'
                        label='商品详情'
                    >
                        <div>
                            {/*<span className='Detail-LeftTitle'>商品详情:</span>*/}
                            <span
                                dangerouslySetInnerHTML={{__html: '<h1 style="color:red">{desc}</h1>'}}></span>
                        </div>
                    </Form.Item>


                    {/*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*/}
                    <Form.Item label=''>
                        <Button type='primary' htmlType="submit">提交</Button>
                    </Form.Item>
                </Form>
            </Card>
        );
    }
}

export default AddUpdate;