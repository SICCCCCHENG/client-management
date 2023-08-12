// 专门用于Category里addCategory对话框中收集数据的表单

import React, {Component} from 'react';

import {Form, Select, Input} from 'antd'
import PropTypes from "prop-types";

class AddForm extends Component {

    static propTypes = {
        categories: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired
    }

    collectCategoryName = () => {
        const {categories} = this.props

        console.log(categories)

        // 收集数组中的list名字到options数组中,再向下传递给Form表单
        return categories.map((item) => {
            return {value: item.name, label: item.name}
        })
    }

    findParentName = () => {
        const {categories, parentId} = this.props
        const targetObj = categories.find((item) => {
            return item._id === parentId
        })
        return targetObj.name
    }

    render() {
        const options = this.collectCategoryName()
        // label 待定
        const itemObj = {value: '一级分类列表', label: '一级分类列表'}
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
                        showSearch
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
                    <Input placeholder='请输入分类名称'/>
                </Form.Item>
                <br/>
            </Form>
        );
    }
}

export default AddForm;