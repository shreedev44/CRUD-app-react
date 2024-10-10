import {createStore, combineReducers, Reducer} from 'redux'
import Cookies from 'js-cookie'

interface ActionType{
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
}

const user: Reducer<object | null, ActionType> = (prevState = null, action) => {
    if(action.type === 'profile-update') {
        return {
            ...prevState, ...action.payload
        }
    } else {
        return prevState;
    }
}

const initialUserToken = Cookies.get('accessToken') ?? null;

const userToken: Reducer<string | null, ActionType> = (prevState = initialUserToken, action) => {
    if(action.type === 'set-token'){
        return action.payload;
    } else {
        return prevState;
    }
}





const admin: Reducer<object | null, ActionType> = (prevState = null , action) =>{
    if(action.type === 'update-admin'){
        return action.payload
    }else{
        return prevState
    }
}


const initialAdminToken = Cookies.get('adminAccessToken') ?? null;

const adminToken: Reducer<string | null, ActionType> = (prevState = initialAdminToken, action) => {
    if(action.type === 'set-admin-token') {
        return action.payload;
    } else{
        return prevState;
    }
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const appReducer = combineReducers<any>({
    user,
    userToken,
    admin,
    adminToken
})




export function SetToken (token: string | null) {
    return {
        type: 'set-token',
        payload: token
    }
}


export function UpdateUser (user: object | null) {
    return {
        type: 'profile-update',
        payload: user
    }
}





export function SetAdminToken (token: string | null) {
    return {
        type: 'set-admin-token',
        payload: token
    }
}

export function UpdateAdmin (admin: object | null) {
    return {
        type: 'update-admin',
        payload: admin
    }
}


const store = createStore(appReducer)
export default store
