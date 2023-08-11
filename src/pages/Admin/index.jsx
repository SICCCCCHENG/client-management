import React, {Component} from 'react';
import {Layout} from 'antd';
import memoryUtils from "../../utils/memoryUtils";
import {Redirect, Route, Switch} from "react-router-dom";
import LeftNav from '../../components/LeftNav'
import Header from '../../components/Header'

import Home from "../../pages/Admin/Home";
import Category from "../../pages/Admin/Category";
import Product from "../../pages/Admin/Product";
import Role from "../../pages/Admin/Role";
import User from "../../pages/Admin/User";
import Bar from "../../pages/Admin/Charts/bar";
import Line from "../../pages/Admin/Charts/Line";
import Pie from "../../pages/Admin/Charts/Pie";

const {Footer, Sider, Content} = Layout;

class Admin extends Component {
    render() {
        const user = memoryUtils.user

        // !user._id表示判断{}(之前登陆失败或者未登陆)
        if (!user._id) {
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{height: '100%'}}>
                <Sider><LeftNav/></Sider>
                <Layout>
                    <Header/>
                    <Content style={{margin: '20px', backgroundColor: "white"}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/user' component={User}/>
                            <Route path='/charts/Bar' component={Bar}/>
                            <Route path='/charts/Line' component={Line}/>
                            <Route path='/charts/Pie' component={Pie}/>
                            <Redirect to='/home'/>
                        </Switch>
                    </Content>
                    <Footer style={{
                        color: '#ccc',
                        textAlign: 'center'
                    }}>推荐使用谷歌浏览器,可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Admin;