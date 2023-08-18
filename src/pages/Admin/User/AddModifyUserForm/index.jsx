import React, {Component} from 'react';
import {Form, Input, Select} from "antd";
import PropTypes from "prop-types";

class AddModifyUserForm extends Component {

    state = {
        options: [],
        user: {}
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
        if (this.props.user) {
            this.isModify = true
            const {user} = this.props

            console.log('收到的user', user)
            this.setState({
                user
            })
        } else {
            this.isModify = false
        }
    }

    componentDidMount() {
        // console.log('this.refs: ', this.refs)
        this.props.getForm(this.refs.form)
        this.setupOptions()
    }

    componentWillMount() {
        this.setupUser()
    }

    render() {

        // const {roleList} = this.props

        const {options, user} = this.state

        const layout = {
            labelCol: {span: 4},
            wrapperCol: {span: 16},
        };


        console.log("Add User Form render() ... ")

        return (

            <Form
                ref='form'
                {...layout}
            >
                <Form.Item
                    label='用户名'
                    name='username'
                    initialValue={this.isModify ? user.username : ''}
                    /*rules={[{
                        required: true,
                        message: '请输入用户名'
                    }]}*/
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Please input your Username!',
                        },
                        {
                            min: 4,
                            message: 'username must be over than 4!',
                        },
                        {
                            max: 12,
                            message: 'username must be less than 12!',
                        },
                        {
                            pattern: /^[a-zA-Z0-9_]+/,
                            message: '用户名必须是英文、数字或者下划线组成!',
                        },
                    ]}

                >
                    <Input placeholder='请输入用户名'></Input>
                </Form.Item>


                {
                    // 判断是否显示密码输入框
                    !this.isModify ? (
                        <Form.Item
                            label='密码'
                            name='password'
                            /*rules={[{
                                required: true,
                                message: '请输入密码'
                            }]}*/
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: 'Please input your Password!',
                                },
                                {
                                    min: 4,
                                    message: 'password must be over than 4!',
                                },
                                {
                                    max: 12,
                                    message: 'password must be less than 12!',
                                },
                                {
                                    pattern: new RegExp('^[a-zA-Z0-9_]+'),
                                    // pattern: /^[a-zA-Z0-9_]+/,
                                    message: '密码必须是英文、数字或者下划线组成!',
                                },
                                {
                                    pattern: /^\S*$/,
                                    message: '禁止输入空格',
                                }
                            ]}

                        >
                            <Input type='password' placeholder='请输入密码'></Input>
                        </Form.Item>
                    ) : null
                }

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
                    initialValue={this.isModify ? user.role_id : undefined}
                    rules={[{
                        required: false,
                        message: '请选择角色'
                    }]}
                >
                    <Select options={options} placeholder="请选择角色"></Select>
                </Form.Item>
            </Form>
        );
    }
}

export default AddModifyUserForm;