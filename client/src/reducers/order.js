import { createSlice } from '@reduxjs/toolkit'
import { getCookie, setCookie } from '../utils/utils'

const initialState = {
    order: getCookie("casino_order") !== "" ? JSON.parse(getCookie("casino_order")) : [],
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        orderAdd: (state, { payload }) => {
            let order = payload
            if(order){
                state.order.push({ ...order, orderId: state.order.length })
                setCookie("casino_order", JSON.stringify(state.order))
            }            
        }, 
    }
})

export const {
    orderAdd,
} = orderSlice.actions

export default orderSlice.reducer