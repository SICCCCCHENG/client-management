import React, {Component} from 'react';
// import {Link, NavLink} from 'react-router-dom'
import {Link, withRouter} from 'react-router-dom'
import logo from '../../assets/images/bob.jpeg'
import './index.css'
import menuList from '../../config/menuConfig'
import memoryUtils from "../../utils/memoryUtils";
/*
import {
    ToolOutlined,
    UnorderedListOutlined,
    HomeOutlined,
    AppstoreOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
    AreaChartOutlined,
    PieChartOutlined,
    LineChartOutlined,
    BarChartOutlined
} from '@ant-design/icons';
*/

import {Menu} from 'antd';

class LeftNav extends Component {
    generateNodes_map(menuList) {
        return menuList.map((item) => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <Menu.SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.generateNodes(item.children)}
                    </Menu.SubMenu>
                )
            }
        })
    }

    // pre相当于收集数据
    generateNodes(menuList) {

        if (memoryUtils.user.username === 'admin') {
            return menuList.reduce((pre, item) => {
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key}>{item.title}</Link>
                        </Menu.Item>
                    ))
                } else {
                    pre.push((
                        /*默认展开选项卡 defaultOpenKeys={['/charts']}*/
                        <Menu.SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {this.generateNodes(item.children)}
                        </Menu.SubMenu>
                    ))
                }
                return pre
            }, [])
        } else {
            return menuList.reduce((pre, item) => {
                // debugger
                if (!item.children) {
                    if (this.findNode(item.key)) {
                        pre.push((
                            <Menu.Item key={item.key} icon={item.icon}>
                                <Link to={item.key}>{item.title}</Link>
                            </Menu.Item>
                        ))
                    }
                } else {
                    if (this.hasSubcategory(item.key)){
                        pre.push((
                            /*默认展开选项卡 defaultOpenKeys={['/charts']}*/
                            <Menu.SubMenu key={item.key} icon={item.icon} title={item.title}>
                                {this.generateNodes(item.children)}
                            </Menu.SubMenu>
                        ))
                    }else {
                        {this.generateNodes(item.children)}
                    }
                }
                return pre
            }, [])
        }
    }

    // 判断一级标题下是否含有二级子标题
    hasSubcategory = (key) => {
        // 先找出一级标题
        const targetMenu = menuList.find(item => {
            return item.key === key
        })

        for (let i = 0; i < targetMenu.children.length; i++){
            for (let j = 0; j < this.userAuth.length; j++){
                if (targetMenu.children[i].key === this.userAuth[j])
                    return true
            }
        }
        return false
    }

    findNode = (key) => {
        const index = this.userAuth.indexOf(key)
        console.log('key: =====>', key)
        console.log('index: =====>', index)
        return index >= 0
    }

    render() {

        this.userAuth = memoryUtils.user.role.menus
        console.log('this.userAuth: ', this.userAuth)


        let {pathname} = this.props.location
        if (pathname.startsWith('/product')) {
            pathname = '/product'
        }


        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt=""/>
                    <h1>管理后台</h1>
                </Link>
                {/*这里是中括号是因为有可以多个选中,即为数组*/}
                <Menu theme="dark" mode="vertical" style={{textAlign: 'left'}} selectedKeys={[pathname]}>
                    {
                        // console.log(this.generateNodes(menuList))
                        this.generateNodes(menuList)
                    }
                    {/*
                    <Menu.Item key="/home" icon={<HomeOutlined />}>
                        <Link to="/home">首页</Link>
                    </Menu.Item>

                    <Menu.SubMenu icon={<AppstoreOutlined/>} title='商品'>
                        <Menu.Item key="/category" icon={<UnorderedListOutlined />}>
                            <NavLink to="/category">品类管理</NavLink>
                        </Menu.Item>
                        <Menu.Item key="/product" icon={<ToolOutlined />}>
                            <NavLink to="/product">商品管理</NavLink>
                        </Menu.Item>
                    </Menu.SubMenu>

                    <Menu.Item key="/user" icon={<UserOutlined />}>
                        <NavLink to="/user">用户管理</NavLink>
                    </Menu.Item>

                    <Menu.Item key="/role" icon={<SafetyCertificateOutlined/>}>
                        <NavLink to="/role">角色管理</NavLink>
                    </Menu.Item>

                    <Menu.SubMenu icon={<AreaChartOutlined/>} title='图表界面'>
                        <Menu.Item key="/charts/bar" icon={<BarChartOutlined />}>
                            <NavLink to="/charts/bar">条形图</NavLink>
                        </Menu.Item>
                        <Menu.Item key="/charts/pie" icon={<PieChartOutlined />}>
                            <NavLink to="/charts/pie">比例图</NavLink>
                        </Menu.Item>
                        <Menu.Item key="/charts/line" icon={<LineChartOutlined />}>
                            <NavLink to="/charts/line">折线图</NavLink>
                        </Menu.Item>
                    </Menu.SubMenu>
                    */}
                </Menu>
            </div>
        );
    }
}

export default withRouter(LeftNav);