import React, {Component} from 'react';
import {Button, Card, Table, Modal, Input, message} from 'antd'
import moment from "moment";
import AddRoleForm from "./Add-Role-Form";
import AddRoleAuthForm from './Add-Role-Auth-Form'
import {reqAddRole, reqRoleList, reqUpdateRoleAuth} from "../../../api";
import {PAGE_SIZE} from "../../../utils/constants";
import memoryUtils from "../../../utils/memoryUtils";

class Role extends Component {

    state = {
        roles: [],
        role: {},
        isModalOpen: 0
    }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ];

    }

    addRoleForm = React.createRef()

    setRoleAuth = React.createRef()

    onRow = (role) => {
        return {
            onClick: (event) => {
                console.log('点击了', role)
                this.setState({
                    role
                })
            }, // 点击行
            /* onDoubleClick: (event) => {},
             onContextMenu: (event) => {},
             onMouseEnter: (event) => {}, // 鼠标移入行
             onMouseLeave: (event) => {},*/
        };
    }


    handleAddRoleName = async () => {
        // console.log(this.form)
        const roleName = this.addRoleForm.current.getRole()
        console.log('roleName: ',roleName)
        if (roleName) {
            // 如果选项框有值,点击确认后关闭Modal
            this.handleCancel()
            const addRoleResult = await reqAddRole(roleName)
            console.log('addRoleResult: ', addRoleResult)
            if (addRoleResult.status === 0) {
                message.success("添加新角色成功")
                const newRoleObj = {...addRoleResult.data, create_time: moment(addRoleResult.data.create_time).format('YYYY-MM-DD HH:mm')}
                this.setState({
                    roles: [...this.state.roles, newRoleObj]
                })
            } else {
                message.error("添加新角色失败, 请稍后再试..")
            }
        }
    }

    handleSetRoleAuth = async () => {
        this.handleCancel()
        const selectedKeys = this.setRoleAuth.current.getSelectedKeys()
        const {_id} = this.state.role
        const auth_time = new Date()
        const auth_name = memoryUtils.user.username

        // console.log('selectedKeys: ',selectedKeys)
        // console.log('memoryUtils: ', memoryUtils)
        const result = await reqUpdateRoleAuth (_id, selectedKeys, auth_time, auth_name)
        if (result.status === 0){
            message.success("更新用户权限成功")
            await this.getRoleList()
            this.setState({
                role: {}
            })
        }else {
            message.error("更新用户权限失败,请稍后再试..")
        }
    }

    handleCancel = () => {
        this.setState({
            isModalOpen: 0
        })
    }

    showAddRoleModal = () => {
        this.setState({
            isModalOpen: 1
        })
    }

    showAddRoleAuthModal = () => {
        this.setState({
            isModalOpen: 2
        })
    }

    getRoleList = async () => {
        const roleListResult = await reqRoleList()
        if (roleListResult.status === 0) {
            const newRoleList = roleListResult.data.map(item => {
                let processed_auth_time
                if (item.auth_time){
                    processed_auth_time = moment(item.auth_time).format('YYYY-MM-DD HH:mm')
                }else {
                    processed_auth_time = item.auth_time
                }
                return {...item,
                    create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm'),
                    auth_time: processed_auth_time
                }
            })
            this.setState({roles: newRoleList})
        } else {
            message.error("角色列表请求失败..请稍后再试..")
        }
    }

    componentDidMount() {
        // 初始化表格
        this.initColumns()
        // 请求角色数据
        this.getRoleList()

    }


    render() {

        const {roles, role, isModalOpen} = this.state

        const title = (
            <span>
                <Button type='primary' onClick={this.showAddRoleModal} style={{marginRight: '10px'}}>创建角色</Button>
                <Button type='primary' onClick={this.showAddRoleAuthModal} disabled={!role._id}>创建角色权限</Button>
            </span>
        )

        return (
            <div>
                <Card title={title}>
                    <Table
                        rowSelection={{
                            type: "radio",
                            selectedRowKeys: [role._id]
                        }}
                        pagination={{
                            pageSize: PAGE_SIZE,
                            // total,
                            showQuickJumper: true,
                            /*onChange: (page) => {
                                this.getProducts(page);
                                this.currentPage = page
                            },*/
                            // onChange: this.getProducts,  // 等效上方
                            // current: this.currentPage
                        }}
                        rowKey={'_id'}
                        bordered
                        onRow={this.onRow}
                        columns={this.columns}
                        dataSource={roles}/>
                </Card>

                <Modal
                    title="创建角色"
                    open={isModalOpen === 1}
                    onOk={this.handleAddRoleName}
                    onCancel={this.handleCancel}
                    destroyOnClose='true'
                >
                    {/*<AddRoleForm setForm={(form) => {this.form = form}}></AddRoleForm>*/}
                    <AddRoleForm ref={this.addRoleForm}/>
                </Modal>

                <Modal
                    title="设置角色权限"
                    open={isModalOpen === 2}
                    onOk={this.handleSetRoleAuth}
                    onCancel={this.handleCancel}
                    destroyOnClose='true'
                >
                    <AddRoleAuthForm role={this.state.role} ref={this.setRoleAuth}/>
                </Modal>
            </div>
        );
    }
}

export default Role;