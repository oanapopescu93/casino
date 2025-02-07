import { createSlice } from '@reduxjs/toolkit'
import { encryptData } from '../utils/crypto'
import { getCookie, setCookie } from '../utils/utils'

const initialState = {
    user: {
        profile_pic: getCookie("casino_profile_pic") !== "" ? getCookie("casino_profile_pic") : null,
        account_type: getCookie("casino_account_type") !== "" ? getCookie("casino_account_type") : null,
        device: getCookie("casino_device") !== "" ? getCookie("casino_device") : null,
        email: getCookie("casino_email") !== "" ? getCookie("casino_email") : null,
        phone: getCookie("casino_phone") !== "" ? getCookie("casino_phone") : null,
        user: getCookie("casino_user") !== "" ? getCookie("casino_user") : null,
        uuid: getCookie("casino_uuid") !== "" ? getCookie("casino_uuid") : null,
        logs: getCookie("casino_logs") !== "" ? getCookie("casino_logs") : null,
        logsTotal: getCookie("casino_logsTotal") !== "" ? getCookie("casino_logsTotal") : null,
    },
    isMinor: getCookie("casino_isminor") !== "" ? getCookie("casino_isminor") : null,
    money: getCookie("casino_money") !== "" ? getCookie("casino_money") : null,
}

const pageSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeUser: (state, { payload }) => {
            if(payload.profile_pic){
                state.user.profile_pic = encryptData(payload.profile_pic)
                setCookie("casino_profile_pic", encryptData(payload.profile_pic))
            }
            if(payload.account_type){
                state.user.account_type = encryptData(payload.account_type)
                setCookie("casino_account_type", encryptData(payload.account_type))
            }
            if(payload.device === 0 || payload.device === 1 || payload.device === 2){
                state.user.device = encryptData(payload.device)
                setCookie("casino_device", encryptData(payload.device))
            }
            if(payload.email){
                state.user.email = encryptData(payload.email)
                setCookie("casino_email", encryptData(payload.email))
            }
            if(payload.phone){
                state.user.phone = encryptData(payload.phone)
                setCookie("casino_phone", encryptData(payload.phone))
            }
            if(payload.user){
                state.user.user = encryptData(payload.user)
                setCookie("casino_user", encryptData(payload.user))
            }
            if(payload.uuid){
                state.user.uuid = payload.uuid
                setCookie("casino_uuid", payload.uuid)
            }
            if(payload.logs !== undefined && payload.logs !== null){
                state.user.logs = payload.logs
                setCookie("casino_logs", payload.logs)
            }
            if(payload.logsTotal !== undefined && payload.logsTotal !== null){
                state.user.logsTotal = payload.logsTotal
                setCookie("casino_logsTotal", payload.logsTotal)
            }
        },
        changeIsMinor: (state, { payload }) => {
            state.isMinor = payload
            setCookie("casino_isminor", payload, 336) //it will expire after 14 days
        },
        changePic: (state, { payload }) => {
            if(payload){
                state.user.profile_pic = encryptData(payload)
                setCookie("casino_profile_pic", encryptData(payload))
            }
        },
        changeUsername: (state, { payload }) => {
            if(payload){
                state.user.user = encryptData(payload)
                setCookie("casino_user", encryptData(payload))
            }
        },
        updateMoney: (state, { payload }) => {
            if(payload){
                state.money = encryptData(payload)
                setCookie("casino_money", encryptData(payload))
            }
        },
        resetAuth: () => initialState,
    }
})

export const {
    changeUser,
    changeIsMinor,
    changePic,
    changeUsername,
    updateMoney,
} = pageSlice.actions

export default pageSlice.reducer