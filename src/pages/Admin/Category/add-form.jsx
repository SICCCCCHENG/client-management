// 专门用于Category里addCategory对话框中收集数据的表单

import React, {Component} from 'react';

import {Form, Select, Input} from 'antd'
import PropTypes from "prop-types";

class AddForm extends Component {

    state = {
        parentId: '0',
        categoryName:''
    }

    static propTypes = {
        categories: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
        getParentidAndCategoryname: PropTypes.func.isRequired
    }

    collectCategoryName = () => {
        const {categories} = this.props

        // console.log('我在这里....',categories)

        // 收集数组中的list名字到options数组中,再向下传递给Form表单
        return categories.map((item) => {
            return {value: item._id, label: item.name}
        })
    }

    findParentName = () => {
        const {categories, parentId} = this.props
        const targetObj = categories.find((item) => {
            return item._id === parentId
        })
        return targetObj.name
    }


    collectSelectValue = (parentId) => {
        // console.log('seclct这里测试.....',event)
        this.setState({parentId}, ()=>{
            // console.log('this.state', this.state)
            const {parentId, categoryName} = this.state
            this.props.getParentidAndCategoryname(parentId, categoryName)
        })
    }

    collectInputValue = (event) => {
        const {value: categoryName} = event.target
        // console.log('input这里测试.....',event.target.value)
        this.setState({categoryName}, ()=>{
            const {parentId, categoryName} = this.state
            this.props.getParentidAndCategoryname(parentId, categoryName)
        })
    }

    componentDidMount() {
        const {parentId} = this.props
        this.setState({parentId})
    }

    render() {
        const options = this.collectCategoryName()
        // label 待定
        const itemObj = {value: '0', label: '一级分类列表'}
        const newOptions = [itemObj, ...options]

        let parentName
        const {parentId} = this.props
        if (parentId !== '0') {
            parentName = this.findParentName()
        } else {
            parentName = '一级分类列表'
        }

        return (

            <Form>
                <br/>
                所属分类:
                <Form.Item>
                    <Select
                        onSelect={this.collectSelectValue}
                        // showSearch
                        // ref={c => this.selectOption = c }
                        placeholder="一级分类"
                        optionFilterProp="children"
                        defaultValue={parentName}
                        // onChange={onChange}
                        // onSearch={onSearch}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={newOptions}
                    />
                </Form.Item>
                <br/>
                分类名称:
                <Form.Item>
                    <Input onChange={this.collectInputValue} placeholder='请输入分类名称'/>
                </Form.Item>
                <br/>
            </Form>
        );
    }
}

export default AddForm;