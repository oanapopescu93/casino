import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    order: [],
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        orderAdd: (state, { payload }) => {	
            state.order.push({ ...payload, orderId: state.order.length })
        },    
        orderRemoveAll: (state) => {
            state.order = []
        },
    }
})

export const {
    orderAdd,
    orderRemoveAll,
} = orderSlice.actions

export default orderSlice.reducer