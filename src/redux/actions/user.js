import {LOGIN, LOGOUT} from "../constant";

export const userLogin = user => ({type:LOGIN, data:user})

export const userLogout = user => ({type:LOGOUT, data:user})

