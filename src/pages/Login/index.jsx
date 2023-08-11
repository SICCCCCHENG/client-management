import React, {Component} from 'react';
import logo from '../../assets/images/bob.jpeg'
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Form, Input, message} from 'antd';
import {reqLogin} from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import './login.css'
import {Redirect} from "react-router-dom";

// 点击提交
/*const onFinish = (values) => {
    console.log('Received values of form: ', values);
    const {username, password} = values
    reqLogin({username, password}).then(value => {
        console.log('登陆成功....', value.data)
    }).catch(err => {
        console.log('登陆失败....', err)
    })
};*/



class Login extends Component {

    onFinish = async (values) => {
        console.log('Received values of form: ', values);
        const {username, password} = values
        const returnData = await reqLogin({username, password})

        console.log('登陆结果', returnData)

        if (returnData.status === 0) {
            memoryUtils.user = returnData.data
            storageUtils.saveUser(returnData.data)
            this.props.history.replace('/')
            message.success("登陆成功")
        } else {
            message.error('用户名或密码错误')
        }
    }
    /*
    * 用户名/密码的的合法性要求
        1). 必须输入
        2). 必须大于等于 4 位
        3). 必须小于等于 12 位
        4). 必须是英文、数字或下划线组成*/

    /*validatePwd = ((rule, value)=>{
        console.log(value)
        return value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement'))
    })*/


    render() {

        if (memoryUtils.user._id){
            return <Redirect to='/'/>
        }

        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt=""/>
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h1>用户登陆</h1>
                    <div className='form'>
                        <Form
                            // onSubmit={this.handleSubmit}
                            /* method={'POST'}
                             action={'http://127.0.0.1:3000/login'}
                            */
                            name="normal_login"
                            className="login-form"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={this.onFinish}
                        >
                            <Form.Item
                                name="username"
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
                                initialValue='admin'
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon"
                                                             style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       placeholder="Username"/>
                            </Form.Item>
                            <Form.Item
                                name="password"
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
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon"
                                                          style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>


                            {/*<Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <a className="login-form-forgot" href="">
                                    Forgot password
                                </a>
                            </Form.Item>*/}


                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                                {/*Or <a href="">register now!</a>*/}
                            </Form.Item>
                        </Form>

                    </div>
                </section>
            </div>
        );
    }
}

export default Login;