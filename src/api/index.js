// 封装不同类型的请求方法

import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from "antd";

const baseUrl = 'http://127.0.0.1:3000'


// 请求登陆
export const reqLogin = ({username, password}) => ajax(baseUrl + '/login', {username, password}, 'POST')


// 添加用户
export const reqAddUser = (dataObj) => ajax(baseUrl + '/manage/user/add', dataObj, 'POST')

// 更新用户
export const reqUpdateUser = (dataObj) => ajax(baseUrl + '/manage/user/update', dataObj, 'POST')

// 获取所有用户列表
export const reqUserList = () => ajax(baseUrl + '/manage/user/list')

// 获取所有用户列表
export const reqDeleteUser = (userId) => ajax(baseUrl + '/manage/user/delete', {userId}, 'POST')

// 获取一级/二级分类列表
export const reqCategories = (parentId) => ajax(baseUrl + '/manage/category/list', {parentId}, 'GET')
// 添加分类
export const reqAddCategory = (parentId, categoryName) => ajax(baseUrl + '/manage/category/add', {
    parentId,
    categoryName
}, 'POST')
// 修改分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(baseUrl + '/manage/category/update', {
    categoryId,
    categoryName
}, 'POST')


// 请求获取商品分页列表   (pageNum 表示第几页,不是总页数)
export const reqProductList = (pageNum, pageSize) => ajax(baseUrl + '/manage/product/list', {pageNum, pageSize}, 'GET')

export const reqProductSearch = (pageNum, pageSize, keyword, searchType) => ajax(baseUrl + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: keyword
})
/*
export const reqProductSearchByName = (pageNum, pageSize, productName) => ajax(baseUrl + '/manage/product/search', {pageNum, pageSize, productName}, 'GET')
export const reqProductSearchByDesc = (pageNum, pageSize, productDesc) => ajax(baseUrl + '/manage/product/search', {pageNum, pageSize, productDesc}, 'GET')
*/


export const reqCategoryName = (categoryId) => ajax(baseUrl + '/manage/category/info', {categoryId}, 'GET')

// 对产品进行上架/下架处理(1代表在售,2代表下架)
export const reqUpdateStatus = (productId, status) => ajax(baseUrl + '/manage/product/updateStatus', {
    productId,
    status
}, 'POST')

export const reqRemoveImg = (name) => ajax(baseUrl + '/manage/img/delete', {name}, 'POST')

// 添加商品
export const reqAddProduct = (pCategoryId, categoryId, name, desc, price, detail, imgs) => ajax(baseUrl + '/manage/product/add', {
    pCategoryId,
    categoryId,
    name,
    desc,
    price,
    detail,
    imgs
}, "POST")

// 更新商品
export const reqUpdateProduct = (_id, pCategoryId, categoryId, name, desc, price, detail, imgs) => ajax(baseUrl + '/manage/product/update', {
    _id,
    pCategoryId,
    categoryId,
    name,
    desc,
    price,
    detail,
    imgs
}, "POST")


// 请求当前所有角色
export const reqRoleList = () => ajax(baseUrl + '/manage/role/list')


// 请求添加角色
export const reqAddRole = (roleName) => ajax(baseUrl + '/manage/role/add', {roleName}, 'POST')


// 请求更新角色权限
export const reqUpdateRoleAuth = (_id, menus, auth_time, auth_name) => ajax(baseUrl + '/manage/role/update', {_id, menus, auth_time, auth_name}, 'POST')


export const reqWeather = (cityCode) => {

    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=d503450507970741ccfbd14e9624786e`

    return new Promise((resolve, reject) => {
        jsonp(url, {}, (err, data) => {
            if (!err && data.status === '1') {
                const {weather, temperature} = data.lives[0]
                resolve({weather, temperature})
            } else {
                message.error('获取数据出错!' + err.toString())
            }
        })
    })
}



