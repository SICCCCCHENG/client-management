import React, {Component} from 'react';
import {Form, Input, Select} from "antd";
import PropTypes from "prop-types";

class AddUserForm extends Component {

    state = {
        options: [],
        user:{}
    }

    static propTypes = {
        getForm: PropTypes.func.isRequired,
        roleList: PropTypes.array.isRequired,
        user: PropTypes.object
    }


    setupOptions = () => {
        const {roleList} = this.props
        const options = roleList.map(item => {
            return {
                label: item.name,
                value: item._id
            }
        })
        this.setState({
            options
        })
    }


    setupUser = () => {
        // 如果是修改,则有 user 属性
        if (this.props.user){
            this.isModify = true
            const {user} = this.props

            console.log('收到的user', user)
            this.setState({
                user
            })
        }
    }

    componentWillMount() {
        // console.log('this.refs: ', this.refs)
        this.props.getForm(this.refs.form)
        this.setupUser()
        this.setupOptions()
    }

    render() {

        // const {roleList} = this.props

        const {options, user} = this.state

        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };


        console.log("render() ... ")

        return (

            <Form
                ref='form'
                {...layout}
            >
                <Form.Item
                    label='用户名'
                    name='username'
                    initialValue={this.isModify ? user.username : ''}
                    rules={[{
                        required: true,
                        message: '请输入用户名'
                    }]}
                >
                    <Input placeholder='请输入用户名'></Input>
                </Form.Item>

                <Form.Item
                    label='密码'
                    name='password'
                    rules={[{
                        required: true,
                        message: '请输入密码'
                    }]}
                >
                    <Input placeholder='请输入密码'></Input>
                </Form.Item>

                <Form.Item
                    label='手机号'
                    name='phone'
                    initialValue={this.isModify ? user.phone : ''}
                    rules={[{
                        required: false,
                        message: '请输入手机号'
                    }]}
                >
                    <Input placeholder='请输入手机号'></Input>
                </Form.Item>

                <Form.Item
                    label='邮箱'
                    name='email'
                    initialValue={this.isModify ? user.email : ''}
                    rules={[{
                        required: false,
                        message: '请输入邮箱'
                    }]}
                >
                    <Input placeholder='请输入邮箱'></Input>
                </Form.Item>

                <Form.Item
                    label='角色'
                    name='role_id'
                    initialValue={this.isModify ? user.role_id : ''}
                    rules={[{
                        required: false,
                        message: '请选择角色'
                    }]}
                >
                    <Select placeholder='请选择角色' options={options} ></Select>
                </Form.Item>
            </Form>
        );
    }
}

export default AddUserForm;