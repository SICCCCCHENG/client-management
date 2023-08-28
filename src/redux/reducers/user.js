
import {LOGIN, LOGOUT} from "../constant";

const initState = {}
export default function userReducer (preState=initState, action){
    const {type, data} = action

    console.log('user: ', preState)

    switch (type) {
        case LOGIN:
            return data
        case LOGOUT:
            return {}
        default:
            return preState
    }
}