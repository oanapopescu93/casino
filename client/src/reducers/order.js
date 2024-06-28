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
            state.order.push({ ...payload, orderId: state.order.length })
            setCookie("casino_order", JSON.stringify(state.order))
        },    
        orderRemoveAll: (state) => {
            state.order = []
            setCookie("casino_order", JSON.stringify(state.order))
        },
    }
})

export const {
    orderAdd,
    orderRemoveAll,
} = orderSlice.actions

export default orderSlice.reducer