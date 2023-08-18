import React, {Component} from 'react';
import {Button, Card, message, Modal, Table} from 'antd'
import LinkButton from "../../../components/LinkButton";
import moment from "moment";
import AddModifyUserForm from './AddModifyUserForm'
import {reqUserList, reqAddUser, reqUpdateUser, reqDeleteUser} from "../../../api";

class User extends Component {

    state = {
        userList: [],
        user: {},
        roleList: [],
        isModalOpen: 0
    }

    /*

    {
                _id: '1',
                username: '测试',
                password: '123456',
                phone: '12657364748',
                email: '123123@qq.com',
                role_id: '2312323321',
                create_time: 1555061609666,
                __v: 0
            },
            {
                _id: '1',
                username: '产品',
                password: '123456',
                phone: '12657364748',
                email: '123123@qq.com',
                role_id: '2312323321',
                create_time: 1555061609666,
                __v: 0
            },

    * */

    showAddUserModal = () => {
        this.setState({
            isModalOpen: 1
        })
    }


    getForm = (form) => {
        this.form = form
        console.log('this.form: ', this.form)
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: create_time => moment(create_time).format('YYYY-MM-DD HH:mm')
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: role_id => {
                    const {roleList} = this.state
                    const targetRole = roleList.find(item => {
                        return item._id === role_id
                    })
                    return targetRole.name
                }
            },
            {
                title: '操作',
                // dataIndex: 'role_id',
                render: (user) => {

                    return (
                        <div key={user._id}>
                            <LinkButton onClick={() => this.showModifyUserModal(user)}>修改</LinkButton>
                            <LinkButton onClick={() => this.showDeleteUserModal(user)}>删除</LinkButton>
                        </div>
                    )
                }

            },
        ];
    }


    showModifyUserModal = (user) => {
        this.setState({
            isModalOpen: 2,
            user
        })
    }


    showDeleteUserModal = (user) => {
        this.setState({
            isModalOpen: 3,
            user
        })
    }

    handleAddUser = () => {
        this.form.validateFields().then(async values => {

            console.log("验证通过...")
            this.handleCancel() // 隐藏表单界面

            // 验证通过
            const result = await reqAddUser(values)

            if (result.status === 0) {
                message.success("创建用户成功!")
                const {userList} = this.state
                const newUserList = [...userList, values]
                this.setState({
                    userList: newUserList
                })
            }
            // console.log('values: ', values)
        }).catch(err => {
            message.error("请校验输入信息..")
        })
    }

    handleModifyUser = () => {

        this.form.validateFields().then(async values => {
            const {user, userList} = this.state
            values._id = user._id
            console.log('values: ', values)
            const result = await reqUpdateUser(values)
            console.log("result: ", result)
            if (result.status === 0) {
                message.success("更新用户成功!")
                this.handleCancel()
                /*const newUserList = userList.map(item => {
                    if (item._id === user._id){
                        return {...item, ...values}
                    }else {
                        return item
                    }
                })*/

                const newUserList = userList.reduce((pre, item) => {
                    console.log("pre: ", pre)
                    console.log("pre.length: ", pre.length)
                    if (item._id === user._id) {
                        pre.push({...item, ...values})
                    } else {
                        pre.push(item)
                    }
                    return pre
                }, [])

                console.log('newUserList: ', newUserList)

                this.setState({userList: newUserList})

            } else {
                message.error("更新用户失败,请稍后再试..")
            }
        }).catch(error => {
            message.error("请校验输入信息..")
        })

    }


    handleDeleteUser = async () => {
        const {user, userList} = this.state
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
            this.handleCancel()
            message.success("删除用户成功!")
            const newUserList = userList.filter(item => {
                return item._id !== user._id
            })
            this.setState({
                userList: newUserList
            })
        } else {
            message.error("删除用户失败..请稍后再试..")
        }
    }

    handleCancel = () => {
        this.setState({
            isModalOpen: 0
        })
    }

    // 获取用户列表
    getUserAndRolesList = async () => {
        const result = await reqUserList()
        if (result.status === 0) {
            const {users: userList, roles: roleList} = result.data
            this.setState({
                userList,
                roleList
            })
        } else {
            message.error("请求用户列表出错,请稍后再试..")
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUserAndRolesList()
    }

    render() {

        const {userList, isModalOpen, roleList, user} = this.state

        const title = <Button type='primary' onClick={this.showAddUserModal}>创建用户</Button>


        return (
            <Card title={title}>

                <Table
                    rowKey={'_id'}
                    bordered
                    columns={this.columns}
                    dataSource={userList}
                />

                <Modal
                    title='添加用户'
                    open={isModalOpen === 1}
                    onCancel={this.handleCancel}
                    onOk={this.handleAddUser}
                >
                    <AddModifyUserForm getForm={this.getForm} roleList={roleList}/>
                </Modal>

                <Modal
                    title='修改用户'
                    open={isModalOpen === 2}
                    onCancel={this.handleCancel}
                    onOk={this.handleModifyUser}
                >
                    <AddModifyUserForm getForm={this.getForm} roleList={roleList} user={user}/>
                </Modal>

                <Modal
                    title='删除用户'
                    open={isModalOpen === 3}
                    onCancel={this.handleCancel}
                    onOk={this.handleDeleteUser}
                >
                    <div style={{textAlign: 'center', fontSize: '18px'}}>确定要删除用户 {user.username} 吗?</div>
                </Modal>

            </Card>
        );
    }
}

export default User;