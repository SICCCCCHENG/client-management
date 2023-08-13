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


// 请求获取商品分页列表   (pageNum 表示第几页,不是总页数)
export const reqProductList = (pageNum, pageSize) => ajax(baseUrl + '/manage/product/list', {pageNum, pageSize}, 'GET')
export const reqProductSearchByName = (pageNum, pageSize, productName) => ajax(baseUrl + '/manage/product/search', {pageNum, pageSize, productName}, 'GET')
export const reqProductSearchByDesc = (pageNum, pageSize, productDesc) => ajax(baseUrl + '/manage/product/search', {pageNum, pageSize, productDesc}, 'GET')


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



