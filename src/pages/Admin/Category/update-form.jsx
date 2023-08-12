// 专门用于Category里updateCategory对话框中收集数据的表单

import React, {Component} from 'react';
import {Form, Input} from "antd";
import PropTypes from "prop-types";

class UpdateForm extends Component {
    // 保存从输入框中获取的数据
    state = {
        value:''
    }

    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        getUpdatedCategoryValue: PropTypes.func.isRequired
    }

    saveValue = (event) => {
        this.setState({value: event.target.value}, ()=>{
            this.props.getUpdatedCategoryValue(this.state.value)
        })
    }

    /*componentWillMount() {
        this.props.setForm(this.props.form)
    }*/

    render() {
        const {categoryName} = this.props

        return (
            <Form>

                <Form.Item>
                    <Input
                        placeholder='请输入分类名称'
                        defaultValue={categoryName}
                        onChange={this.saveValue}
                    />
                </Form.Item>

            </Form>
        );
    }
}

export default UpdateForm;