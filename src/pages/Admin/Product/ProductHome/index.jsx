import React, {Component} from 'react';
import {Button, Card, Form, Input, message, Modal, Select, Table} from "antd";
import LinkButton from "../../../../components/LinkButton";
import {PlusOutlined} from "@ant-design/icons";
import {reqProductList, reqProductSearch, reqUpdateStatus} from "../../../../api";
import {PAGE_SIZE} from "../../../../utils/constants";

class ProductHome extends Component {

    state = {
        products: [],
        total: 0,
        loading: false,
        searchType: 'productName',
        keyword: '',
    }


    // 初始化表格
    initColumns = () => {

        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
                width: '20%'
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                width: '50%'
            },
            {
                title: '价格',
                dataIndex: 'price',
                width: '10%',
                render: (price) => '¥' + price
            },
            {
                title: '状态',
                // dataIndex: 'status',
                width: '10%',
                render: (productObj) => {
                    // this.showLinkButton(categoryObj)
                    const {_id, status} = productObj
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <div>
                            <Button type='primary' onClick={() => {
                                this.updateStatus(_id, newStatus)
                            }}>
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <br/>
                            {status === 1 ? '在售' : '已下架'}
                        </div>)
                }
            },
            {
                title: '操作',
                width: '10%',
                render: (productObj) =>
                    // this.showLinkButton(categoryObj)
                    <div>
                        {/*<LinkButton onClick={() => {
                            this.showUpdateModal(categoryObj)
                        }}>修改分类</LinkButton>
                        {categoryObj.parentId === '0' ? <LinkButton
                            onClick={() => this.showSubCategories(categoryObj)}>查看子分类</LinkButton> : null}*/}
                        <LinkButton onClick={() => {
                            this.props.history.push('/product/detail', productObj)
                        }}>详情</LinkButton>
                        <LinkButton>修改</LinkButton>
                    </div>
            }
        ]
    }


    getProducts = async (pageNum) => {
        this.currentPage = pageNum
        this.setState({
            loading: true
        })
        const {searchType, keyword} = this.state
        // console.log('searchType, keyword: ', searchType, keyword)
        let result
        if (keyword) {
            result = await reqProductSearch(pageNum, PAGE_SIZE, keyword, searchType)
        } else {
            // pageNum 表示请求第几页数据
            result = await reqProductList(pageNum, PAGE_SIZE)
        }

        this.setState({
            loading: false
        })
        // console.log('results', result)
        if (result.status === 0) {
            const {list: products, total} = result.data
            this.setState({products, total})
        } else {
            message.error('数据请求失败..')
        }
    }

    /*pageChange = (event) => {
        // console.log('我在这里.....', e)
        this.getProducts(event.current)
    }*/


    onFinish = async (values) => {
        this.currentPage = 1
        const {searchType, keyword} = values
        this.initColumns()
        // console.log('接收到数据: ', values)
        this.setState({searchType, keyword}, () => {
            this.getProducts(1)
        })

        /*const {searchMethod, keyword} = values
        let result
        if (searchMethod === 'productDesc') {
            console.log('这里按照描述...')
            result = await reqProductSearchByDesc(1, PAGE_SIZE, keyword)
        } else {
            console.log('这里按照名称...')
            result = await reqProductSearchByName(1, PAGE_SIZE, keyword)
        }
        console.log('搜索到的结果: ',result)

        // bug: 搜索到结果后,跳转到第二页(有bug)!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if (result.status === 0) {
            const {list: products, total} = result.data
            this.setState({products, total})
        } else {
            message.error('数据请求失败..')
        }*/
    }


    updateStatus = async (productId, status) => {
        this.setState({loading: true})
        const result = await reqUpdateStatus(productId, status)
        this.setState({loading: false})
        if (result.status === 0) {
            // console.log('this.currentPage', this.currentPage)
            message.success("商品更新状态成功")
            this.getProducts(this.currentPage)
        } else {
            message.error("更新状态失败,请稍后再试..")
        }
    }

    // 为第一次render()准备页面
    componentWillMount() {
        this.searchOptions = [{value: 'productName', label: '按名称搜索'}, {value: 'productDesc', label: '按描述搜索'}]
        this.initColumns()

    }

    // 为第一次render()准备数据
    componentDidMount() {
        this.getProducts(1)
    }


    render() {

        const title =
            <Form
                style={{'width': '380px', display: 'flex'}}
                onFinish={this.onFinish}
            >
                <Form.Item name='searchType' initialValue='productName'>
                    <Select
                        style={{width: '120px'}}
                        // onSelect={this.collectSelectValue}
                        // showSearch
                        // ref={c => this.selectOption = c }
                        placeholder="按名称搜索"
                        // optionFilterProp="children"
                        // value='按名称搜索'
                        // initialValue='productName'
                        // defaultValue="productName"
                        // onChange={onChange}
                        // onSearch={onSearch}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={this.searchOptions}
                    />
                </Form.Item>

                <Form.Item
                    name='keyword'
                    rules={[
                        {
                            required: true,
                            message: '请输入关键字',
                        }]}
                >
                    <Input
                        style={{width: '150px', margin: '0 10px'}}
                        placeholder='关键字'
                        // defaultValue={categoryName}
                        // onChange={this.saveValue}
                    />
                </Form.Item>

                <Form.Item style={{display: "inline-block"}}>
                    <Button type='primary' htmlType="submit">
                        搜索
                    </Button>
                </Form.Item>
            </Form>


        const extra =
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <PlusOutlined/> 添加商品
            </Button>


        const {products, total, loading} = this.state


        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        change="handleTableChange"
                        pagination={{
                            pageSize: PAGE_SIZE,
                            total,
                            showQuickJumper: true,
                            onChange: (page) => {
                                this.getProducts(page);
                                this.currentPage = page
                            },
                            // onChange: this.getProducts,  // 等效上方
                            current: this.currentPage
                        }}
                        // onChange={this.pageChange}
                        rowKey='_id'
                        bordered
                        dataSource={products}
                        columns={this.columns}
                        loading={loading}
                    />
                </Card>
            </div>
        );
    }
}

export default ProductHome;