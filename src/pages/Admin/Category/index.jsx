import React, {Component} from 'react';
import {Button, Card, Table, message} from "antd";
import {PlusOutlined, ArrowRightOutlined} from '@ant-design/icons';
import LinkButton from "../../../components/LinkButton";
import {reqCategories} from "../../../api";

class Category extends Component {

    state = {
        loading: false,
        categories: [],
        subCategories: [],
        parentId: '0',
        parentName: ''
    }

    // 初始化Table所有列数
    initColumns = () => {

        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (categoryObj) =>

                    // this.showLinkButton(categoryObj)

                    <div>
                        <LinkButton>修改分类</LinkButton>
                        {categoryObj.parentId === '0' ? <LinkButton
                            onClick={() => this.showSubCategories(categoryObj)}>查看子分类</LinkButton> : null}
                    </div>

            }
        ]
    }

    /*showLinkButton = (categoryObj) => {
        const {parentId} = this.state
        if (parentId === '0') {
            return (
                <div>
                    <LinkButton>修改分类</LinkButton>
                    <LinkButton onClick={() => this.showSubCategories(categoryObj)}>查看子分类</LinkButton>
                </div>
            )
        }else {
            return (
                <div>
                    <LinkButton>修改分类</LinkButton>
                </div>
            )
        }
    }*/

    // 获取一级与二级列表信息
    getCategories = async () => {
        this.setState({loading: true})
        const {parentId} = this.state
        // console.log('parentId', parentId)
        const results = await reqCategories(parentId)
        this.setState({loading: false})

        // console.log(categories)
        if (results.status === 0) {
            const categories = results.data
            if (parentId === '0') {  // 一级的更新
                this.setState({categories})
            } else { // 一级的更新
                // console.log("subCategories: categories", categories)
                this.setState({subCategories: categories})
            }
        } else {
            message.error('获取分类列表失败..')
        }
    }


    showSubCategories(categoryObj) {
        const {_id, name} = categoryObj
        this.setState({
            parentId: _id,
            parentName: name
        }, () => {
            // 再次调用 getCategories() 方法, 此方法会根据 parentId 来判断是过滤哪些数据
            this.getCategories()
        })
    }

    returnBack = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategories: []
        })
    }

    // 为第一次render()准备数据
    componentWillMount() {
        this.initColumns()
    }


    // 发送ajax请求: 执行异步任务
    componentDidMount() {
        this.getCategories()
    }

    render() {

        /* const dataSource = [
             {
                 "parentId": "0",
                 "_id": "64d524d149bf5c4bbc8ba041",
                 "name": "家用电器",
                 "__v": 0
             },
             {
                 "parentId": "0",
                 "_id": "64d5252a49bf5c4bbc8ba042",
                 "name": "电脑",
                 "__v": 0
             },
             {
                 "parentId": "0",
                 "_id": "64d5252f49bf5c4bbc8ba043",
                 "name": "图书",
                 "__v": 0
             },
             {
                 "parentId": "0",
                 "_id": "64d5282249bf5c4bbc8ba044",
                 "name": "服装",
                 "__v": 0
             },
             {
                 "parentId": "0",
                 "_id": "64d5282c49bf5c4bbc8ba045",
                 "name": "食品",
                 "__v": 0
             },
             {
                 "parentId": "0",
                 "_id": "64d5282f49bf5c4bbc8ba046",
                 "name": "玩具",
                 "__v": 0
             }
         ];*/


        const {categories, loading, parentId, subCategories, parentName} = this.state

        // console.log('render........: ', subCategories)

        const title = parentId === '0' ? '一级分类列表' : <span><LinkButton
            onClick={this.returnBack}>一级分类列表</LinkButton><ArrowRightOutlined/> <span>{parentName}</span></span>


        const extra =
            <Button type='primary'>
                <PlusOutlined/> 添加
            </Button>

        return (
            <Card title={title} extra={extra}>
                <Table
                    pagination={{pageSize: 5, showQuickJumper: true}}
                    rowKey='_id'
                    bordered
                    dataSource={parentId === '0' ? categories : subCategories}
                    columns={this.columns}
                    loading={loading}
                />
            </Card>
        )
    }
}

export default Category;