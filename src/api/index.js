// 封装不同类型的请求方法

import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from "antd";

const baseUrl = 'http://127.0.0.1:3000'

export const reqLogin = ({username, password}) => ajax(baseUrl + '/login', {username, password}, 'POST')

export const reqAddUser = (dataObj) => ajax(baseUrl + '/manage/user/add', dataObj, 'POST')


// 获取一级/二级分类列表
export const reqCategories = (parentId) => ajax(baseUrl + '/manage/category/list', {parentId}, 'GET')
// 添加分类
export const reqAddCategory = (parentId, categoryName) => ajax(baseUrl + '/manage/category/add', {parentId, categoryName}, 'POST')
// 修改分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(baseUrl + '/manage/category/update', {categoryId, categoryName}, 'POST')


export const reqWeather = (cityCode) => {

    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=d503450507970741ccfbd14e9624786e`

    return new Promise((resolve, reject) => {
        jsonp(url, {}, (err, data) => {
            if (!err && data.status === '1') {
                const {weather, temperature} = data.lives[0]
                resolve({weather, temperature})
            } else {
                message.error('获取数据出错!'+err.toString())
            }
        })
    })
}



