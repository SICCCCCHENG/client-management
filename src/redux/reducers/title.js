
import {CHANGE_TITLE} from "../constant";

const initState = '首页'
export default function titleReducer (preState=initState, action){
    const {type, data} = action
    console.log('title: ', preState)
    switch (type) {
        case CHANGE_TITLE:
            return data
        default:
            return preState
    }
}