import React, {Component} from 'react';
import {Form, Input, Tree} from "antd";
import PropTypes from "prop-types";
import menuConfig from "../../../../config/menuConfig";
import {HomeOutlined} from "@ant-design/icons";

class AddRoleAuthForm extends Component {

    state = {
        selectedKeys: []
    }

    static propTypes = {
        role: PropTypes.object.isRequired
    }

    initTree = () => {

        this.treeData = [
            {
                title: '平台权限', // 菜单标题名称
                key: '/all', // 对应的 path
                children: menuConfig
            }
        ]
    }


    onCheck = (selectedKeys) => {
        // console.log('selectedKeys, e:{selected, selectedNodes, node, event}', selectedKeys, e)
        this.setState({
            selectedKeys
        })
    }


    // 传递给父组件 selectedKeys 的方法
    getSelectedKeys = () => {
        return this.state.selectedKeys
    }

    componentWillMount() {
        this.initTree()
        const {menus} = this.props.role
        this.setState({
            selectedKeys: menus
        })
    }


    render() {

        const {selectedKeys} = this.state

        return (
            <Form>
                <Form.Item
                    label='设置角色权限'
                    rules={[{
                        // required: true,
                        // message: '请输入角色名称'
                    }]}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                >
                    {/*<Input placeholder='请输入角色名称'></Input>*/}
                    <Input value={this.props.role.name} disabled></Input>
                </Form.Item>


                <Form.Item>
                    <Tree
                        checkable
                        defaultExpandAll='true'
                        defaultCheckedKeys={selectedKeys}
                        // onExpand={onExpand}
                        // expandedKeys={expandedKeys}
                        // autoExpandParent={autoExpandParent}
                        onCheck={this.onCheck}
                        // checkedKeys={checkedKeys}
                        // onSelect={this.onSelect}
                        // selectedKeys={selectedKeys}
                        treeData={this.treeData}
                    />
                </Form.Item>
            </Form>
        );
    }
}

export default AddRoleAuthForm;