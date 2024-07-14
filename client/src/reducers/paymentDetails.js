import { createSlice } from '@reduxjs/toolkit'
import { getCookie, isEmpty, setCookie } from '../utils/utils'

const initialState = {    
    cardNumber: !isEmpty(getCookie("casino_payment_cardNumber")) ? getCookie("casino_payment_cardNumber") : "",
    city: !isEmpty(getCookie("casino_payment_city")) ? getCookie("casino_payment_city") : "",
    country: !isEmpty(getCookie("casino_payment_country")) ? getCookie("casino_payment_country") : "",
    cvv: !isEmpty(getCookie("casino_payment_cvv")) ? getCookie("casino_payment_cvv") : "",
    email: !isEmpty(getCookie("casino_payment_email")) ? getCookie("casino_payment_email") : "",
    month: !isEmpty(getCookie("casino_payment_month")) ? getCookie("casino_payment_month") : -1,
    year: !isEmpty(getCookie("casino_payment_year")) ? getCookie("casino_payment_year") : "",
    name: !isEmpty(getCookie("casino_payment_name")) ? getCookie("casino_payment_name") : "",
    phone: !isEmpty(getCookie("casino_payment_phone")) ? getCookie("casino_payment_phone") : "",
    option: !isEmpty(getCookie("casino_payment_option")) ? getCookie("casino_payment_option") : "1",   // 1 = card, 2 = paypal, 3 = crypto
    crypto: !isEmpty(getCookie("casino_payment_crypto")) ? getCookie("casino_payment_crypto") : "btc" //btc, ltc
}

const paymentDetailsSlice = createSlice({
    name: 'paymentDetails',
    initialState,
    reducers: {
        updatePaymentDetails: (state, { payload }) => {
            Object.keys(payload).forEach(key => {
                state[key] = payload[key]
                setCookie(`casino_payment_${key}`, payload[key])
            })
        },
        resetPaymentDetails: (state) => {	
			const keys = Object.keys(state)
            keys.forEach(key => {
                state[key] = key === 'month' ? -1 : ""
                setCookie(`casino_payment_${key}`, "")
            })
        },
    }
})

export const {
    updatePaymentDetails,
    resetPaymentDetails,
} = paymentDetailsSlice.actions

export default paymentDetailsSlice.reducer