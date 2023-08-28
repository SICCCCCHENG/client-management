import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import moment from "moment";
import {message, Modal} from 'antd';
import {ExclamationCircleFilled} from '@ant-design/icons'
import {connect} from "react-redux";

import memoryUtils from "../../utils/memoryUtils";
import './index.css'
import {reqWeather} from '../../api/index'
import menuList from "../../config/menuConfig";
import storageUtils from "../../utils/storageUtils";
import LinkButton from "../LinkButton";
import {changeTitle} from "../../redux/actions/title";


class Header extends Component {

    state = {
        currentTime: moment(new Date()).format('YYYY/MM/DD HH:mm:ss'),
        weather: '',
        temperature: ''
    }

    /*findTitle = (menuList, pathname) => {
        for (let item of menuList) {
            if (!item.children) {
                if (pathname === item.key) {
                    return item.title
                }
            } else {
                this.title = this.findTitle(item.children, pathname)
                if (this.title)
                    return this.title
            }
        }
    }*/


    updateTime = () => {
        this.timer = setInterval(async () => {
            const currentTime = moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
            this.setState({currentTime})
        }, 1000)
    }

    getWeather = async () => {
        // 获取天气请求
        const {weather, temperature} = await reqWeather(230100)
        this.setState({weather, temperature})
    }


    logout = () => {
        // event.defaultPrevented(event)
        const {confirm} = Modal;
        confirm({
            title: '您确定要退出登陆吗 ?',
            icon: <ExclamationCircleFilled/>,
            onOk: () => {
                // console.log('OK');
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.props.changeTitle('首页')
                // this.props.history.replace('/home')
                this.props.history.replace('/login')
                // return <Redirect to='/login'/>
                message.success('退出成功')
            }
        })
    }

    // 第一次render()之后执行一次
    // 一般在此执行异步操作: 发送ajax请求/启动定时器
    componentDidMount() {
        this.updateTime()
        this.getWeather()
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }


    render() {

        const {currentTime, weather, temperature} = this.state
        const {username} = memoryUtils.user



        // const {pathname} = this.props.location
        // const title = this.findTitle(menuList, pathname)


        return (
            <div className='header'>
                <div className='header-top'>
                    <span>
                        欢迎, {username}
                    </span>
                    {/*<a href="#" onClick={this.logout}>退出</a>*/}
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-title'>{this.props.title}
                        <div className='pointer'></div>
                    </div>
                    <div className='header-bottom-info'>
                        <div className='curTime'>{currentTime}</div>
                        <div className='temperature'>{temperature}°C</div>
                        {/*<img src={Sunny} alt="Sunny"/>*/}
                        <div className='weather'>{weather}</div>
                    </div>
                </div>
            </div>
        );
    }
}

// 只需要从redux中读取title
export default connect(state => ({
    title: state.title
}), {changeTitle})
(withRouter(Header))