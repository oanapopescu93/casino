import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    processWithdraw: false,
    processPayment: false,
    messageWithdraw: null,
    messagePayment: null,
}

const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        sendWithdrawRequest: (state) => {
            state.processWithdraw = true
        },
        sendWithdrawRequestSuccess: (state, { payload }) => {
            state.processWithdraw = false
            state.messageWithdraw = payload
        },
        sendPaymentRequest: (state) => {
            state.processPayment = true
        },
        sendPaymentRequestSuccess: (state, { payload }) => {
            state.processPayment = false
            state.messagePayment = payload
        },
    }
})

export const {
    sendWithdrawRequest,
    sendWithdrawRequestSuccess,
    sendPaymentRequest,
    sendPaymentRequestSuccess,
} = paymentsSlice.actions

export default paymentsSlice.reducer