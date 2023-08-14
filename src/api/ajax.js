import {message} from "antd";
import axios from "axios";


// ajax名字是自己起的

// 在内部统一处理异常
export default function ajax(url, data = {}, type = 'GET') {

    return new Promise((resolve, reject)=>{
        let promise
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data
            })
        }else {
            // console.log('ajax中的data对象: ',data)
            promise = axios.post(url, data)
        }

        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            message.error('请求出错..' + error.toString())
        })
    })
}