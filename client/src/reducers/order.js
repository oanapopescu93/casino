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
            let order = null
            switch(payload.type){
                case "stripe":
                    order = {
                        chargeId: payload.payload.id, 
                        type: payload.type, 
                        timestamp: payload.payload.created * 1000, 
                        description: payload.payload.description,
                        amount: (payload.payload.amount / 100).toFixed(2)
                    }
                    break
                case "paypal":
                    order = {
                        chargeId: payload.payload.id, 
                        type: payload.type, 
                        timestamp: payload.payload.created * 1000, 
                        description: payload.payload.description,
                        amount: (payload.payload.amount / 100).toFixed(2)
                    }
                    break
                case "crypto":
                    order = {
                        chargeId: payload.payload.id, 
                        type: payload.type, 
                        timestamp: payload.payload.created * 1000, 
                        description: payload.payload.description,
                        amount: (payload.payload.amount / 100).toFixed(2)
                    }
                    break
                default:
            }
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