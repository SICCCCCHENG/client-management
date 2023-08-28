import React, {Component} from 'react';
// import {Link, NavLink} from 'react-router-dom'
import {Link, withRouter} from 'react-router-dom'
import {connect} from "react-redux";
import {Menu} from 'antd';

import logo from '../../assets/images/bob.jpeg'
import menuList from '../../config/menuConfig'
import memoryUtils from "../../utils/memoryUtils";
import {changeTitle} from "../../redux/actions/title";
import './index.css'

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


    // 保存当前标题到redux中
    saveTitle = (title) => {
        console.log('title: ',title)
        this.props.changeTitle(title)
        // console.log('this.props: ',this.props)
    }

    // pre相当于收集数据
    generateNodes(menuList) {

        if (memoryUtils.user.username === 'admin') {
            return menuList.reduce((pre, item) => {
                if (!item.children) {
                    this.setTitle(item)
                    pre.push((
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key} onClick={()=>this.saveTitle(item.title)}>{item.title}</Link>
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
                        this.setTitle(item)
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

    setTitle = (item) => {
        let {pathname} = this.props.location
        if (pathname.startsWith(item.key)){
            this.props.changeTitle(item.title)
        }
    }

    findTitle = (menuList, pathname) => {
        for (let ele of menuList){
            if (!ele.children) {
                if (ele.key === pathname)
                    return ele.title
            }else {
                let res = this.findTitle(ele.children, pathname)
                if (res) return res
            }
        }
    }

    render() {

        this.userAuth = memoryUtils.user.role.menus
        // console.log('this.userAuth: ', this.userAuth)


        let {pathname} = this.props.location

        /*console.log('pathname: ',pathname)
        const titleObj = this.findTitle(menuList, pathname) || {}
        this.props.changeTitle(titleObj)
        console.log('titleObj: ',titleObj)*/

        if (pathname.startsWith('/product')) {
            pathname = '/product'
        }



        // console.log('title: =========',title)


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
                </Menu>
            </div>
        );
    }
}


export default connect(
    state => ({}),
    {changeTitle}
)(withRouter(LeftNav))