import { createSlice } from '@reduxjs/toolkit'
import { getCookie, setCookie } from '../utils/utils'

const initialState = {
    withdraw: getCookie("casino_withdraw") !== "" ? JSON.parse(getCookie("casino_withdraw")) : [],
}

const withdrawSlice = createSlice({
    name: 'withdraw',
    initialState,
    reducers: {
        withdrawAdd: (state, { payload }) => {
            let withdraw = payload
            if(withdraw){
                state.withdraw.push({ ...withdraw, withdrawId: state.withdraw.length })
                setCookie("casino_withdraw", JSON.stringify(state.withdraw))
            }            
        }, 
    }
})

export const {
    withdrawAdd,
} = withdrawSlice.actions

export default withdrawSlice.reducer