import React, {Component} from 'react';
import {Form, Input} from 'antd'

class AddRoleForm extends Component {

    state = {
        roleName: ''
    }

    /*componentDidMount() {
        this.props.setForm(this.props.form)
    }*/


    storeRoleName = (event) => {
        this.setState({
            roleName: event.target.value
        })
    }

    getRole = () => {
        return this.state.roleName
    }

    render() {
        return (
            <Form>
                <Form.Item
                    label='角色名称'
                    name='roleName'
                    rules={[{
                        required: true,
                        message: '请输入角色名称'
                    }]}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                >
                    <Input
                        onChange={this.storeRoleName}
                        placeholder='请输入角色名称'
                    />
                </Form.Item>
            </Form>
        );
    }
}

export default AddRoleForm;