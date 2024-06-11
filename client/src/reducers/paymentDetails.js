import { createSlice } from '@reduxjs/toolkit'
import { getCookie, setCookie } from '../utils/utils'

const initialState = {
    bitcoin_address: getCookie("casino_payment_bitcoin_address") !== "" ? getCookie("casino_payment_bitcoin_address") : "",
    cardNumber: getCookie("casino_payment_cardNumber") !== "" ? getCookie("casino_payment_cardNumber") : "",
    city: getCookie("casino_payment_city") !== "" ? getCookie("casino_payment_city") : "",
    country: getCookie("casino_payment_country") !== "" ? getCookie("casino_payment_country") : "",
    cvv: getCookie("casino_payment_cvv") !== "" ? getCookie("casino_payment_cvv") : "",
    email: getCookie("casino_payment_email") !== "" ? getCookie("casino_payment_email") : "",
    month: getCookie("casino_payment_month") !== "" ? getCookie("casino_payment_month") : -1,
    year: getCookie("casino_payment_year") !== "" ? getCookie("casino_payment_year") : "",
    name: getCookie("casino_payment_name") !== "" ? getCookie("casino_payment_name") : "",
    phone: getCookie("casino_payment_phone") !== "" ? getCookie("casino_payment_phone") : "",    
    option: getCookie("casino_payment_option") !== "" ? getCookie("casino_payment_option") : "1",   // 1 = card, 2 = paypal, 3 = crypto
}

const paymentDetailsSlice = createSlice({
    name: 'paymentDetails',
    initialState,
    reducers: {
        updatePaymentDetails: (state, { payload }) => {	
            console.log(payload)
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