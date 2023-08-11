import React, {Component} from 'react';
// import {Link, NavLink} from 'react-router-dom'
import {Link, withRouter} from 'react-router-dom'
import logo from '../../assets/images/bob.jpeg'
import './index.css'
import menuList from '../../config/menuConfig'
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
    }

    render() {
        const {pathname} = this.props.location
        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt=""/>
                    <h1>管理后台</h1>
                </Link>

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