import React, {Component} from 'react';
import {Card, Form, List, Upload, Input, Cascader, Select, Button, message} from "antd";
import {ArrowLeftOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {reqAddProduct, reqCategories, reqCategoryName, reqUpdateProduct} from "../../../../api";
import PicturesWall from "./Pictures-wall";
import RichTextEditor from "./RichTextEditor";

class AddUpdate extends Component {

    state = {
        // loading: false,
        // parentCategories: [],
        // subCategories:[]
        // cascaderDefaultValue: [],
        options: [],
        // productObj: null
    }


    picturesWall = React.createRef()

    richTextEditor = React.createRef()

    validatePrice = (rule, value) => {
        if (+value >= 0) {
            return Promise.resolve()
        } else {
            return Promise.reject('数值必须大于等于0')
        }
    }

    getCurrentPage = () => {
        const receivedInfo = this.props.location.state
        if (Array.isArray(receivedInfo)) {
            return receivedInfo[1]
            // this.props.history.push('/product', receivedInfo[1])
        } else {
            return receivedInfo
            // this.props.history.push('/product', receivedInfo)
        }
    }

    submitForm = async (values) => {
        console.log('values: ', values)
        console.log('picture Wall: ', this.picturesWall.current.getImgsArray())
        console.log('richTextEditor: ', this.richTextEditor.current.getDetail())

        const {categoryIds, name, price, desc} = values

        let pCategoryId, categoryId
        if (categoryIds.length === 2) {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        } else {
            pCategoryId = categoryIds[0]
            categoryId = 0
        }

        const imgs = this.picturesWall.current.getImgsArray()
        const detail = this.richTextEditor.current.getDetail()

        let result
        if (this.isUpdate) {
            const {_id} = this.productObj
            result = await reqUpdateProduct(_id, pCategoryId, categoryId, name, desc, price, detail, imgs)
        } else {
            result = await reqAddProduct(pCategoryId, categoryId, name, desc, price, detail, imgs)
        }

        console.log('result: .....', result)

        if (result.status === 0) {
            message.success(this.isUpdate ? '修改成功' : '添加成功')
        } else {
            message.error(this.isUpdate ? '修改失败, 请稍后再试..' : '添加失败, 请稍后再试..')
        }

        const currentPage = this.getCurrentPage()

        this.props.history.replace('/product', currentPage)

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


            if (this.isUpdate) {
                // 初始化指定二级分类选项
                const {pCategoryId, categoryId} = this.productObj
                if (categoryId !== '0') {
                    // console.log('categoryId: ==============', pCategoryId);
                    const subResult = await reqCategories(pCategoryId)
                    // console.log('subResult: +++++++++++++', subResult)
                    if (subResult.status === 0) {
                        const children =
                            subResult.data.map((item) => {
                                return {
                                    label: item.name,
                                    value: item._id,
                                    isLeaf: true
                                }
                            })

                        // console.log('children:==============',children)
                        const targetOption = options.find((item) => {
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
        console.log('this.props: ==============', this.props)
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
        } else {
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
        if (this.isUpdate) {
            const {pCategoryId, categoryId} = this.productObj
            if (categoryId === '0') {
                cascaderValueArray = [pCategoryId]
            } else {
                cascaderValueArray = [pCategoryId, categoryId]
            }
        }

        const title =
            <div>
                <ArrowLeftOutlined onClick={() => {
                    // 判断收到的数据是 currentPage 还是 [productObj, currentpage]

                    const currentPage = this.getCurrentPage()

                    this.props.history.push('/product', currentPage)

                    /*const receivedInfo = this.props.location.state
                    if (Array.isArray(receivedInfo)) {
                        this.props.history.push('/product', receivedInfo[1])
                    } else {
                        this.props.history.push('/product', receivedInfo)
                    }*/
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
                        initialValue={this.isUpdate ? this.productObj.name : ''}
                        rules={[
                            {
                                required: true,
                                message: '必须输入商品名称'
                            }
                        ]}
                    >
                        <Input></Input>
                        {/*defaultValue={this.isUpdate ? this.productObj.name : ''}*/}
                    </Form.Item>

                    <Form.Item
                        name='desc'
                        label="商品描述"
                        initialValue={this.isUpdate ? this.productObj.desc : ''}
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
                        />
                        {/*defaultValue={this.isUpdate ? this.productObj.desc : ''}*/}
                    </Form.Item>

                    <Form.Item
                        name='price'
                        initialValue={this.isUpdate ? this.productObj.price : ''}
                        label="商品价格"
                        rules={[
                            {
                                required: true,
                                validator: this.validatePrice,

                            },
                        ]}
                    >
                        {/*<span className='add-LeftTitle'><span className='mandatory'>*</span> 商品价格:</span>*/}
                        <Input type='number' addonAfter={'元'}/>
                        {/*defaultValue={this.isUpdate ? this.productObj.price : ''}*/}
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
                        // initialValue='productName'
                        label='商品图片'
                        rules={[
                            {
                                required: false,
                            }
                        ]}
                    >
                        {/*<span className='add-LeftTitle'>商品图片:</span>*/}
                        {/*<Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            // beforeUpload={beforeUpload}
                            // onChange={handleChange}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                            {uploadButton}
                        </Upload>*/}

                        <PicturesWall ref={this.picturesWall} imgs={this.isUpdate ? this.productObj.imgs : []}/>
                    </Form.Item>

                    <Form.Item
                        name='detail'
                        initialValue='productName'
                        label='商品详情'
                        labelCol={{span: 2}}
                        wrapperCol={{span: 20}}
                    >
                        {/*<div>
                            <span className='Detail-LeftTitle'>商品详情:</span>
                            <span
                                dangerouslySetInnerHTML={{__html: '<h1 style="color:red">{desc}</h1>'}}></span>
                        </div>*/}
                        <RichTextEditor ref={this.richTextEditor} detail={this.isUpdate ? this.productObj.detail : ''}/>
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

/*
* 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件,子组件就可以调用 (即props)
* 父组件调用子组件的方法: 在子组件中定义方法,在父组件中通过ref得到子组件标签对象(即组件对象),调用其方法
* */