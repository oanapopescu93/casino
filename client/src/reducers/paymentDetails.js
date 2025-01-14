import { createSlice } from '@reduxjs/toolkit'
import { getCookie, isEmpty, setCookie } from '../utils/utils'

const initialState = {
    option: !isEmpty(getCookie("casino_payment_option")) ? getCookie("casino_payment_option") : "google", // google, stripe, paypal
    cardNumber: !isEmpty(getCookie("casino_payment_cardNumber")) ? getCookie("casino_payment_cardNumber") : "",
    city: !isEmpty(getCookie("casino_payment_city")) ? getCookie("casino_payment_city") : "",
    country: !isEmpty(getCookie("casino_payment_country")) ? getCookie("casino_payment_country") : "",    
    cvv: !isEmpty(getCookie("casino_payment_cvv")) ? getCookie("casino_payment_cvv") : "",
    email: !isEmpty(getCookie("casino_payment_email")) ? getCookie("casino_payment_email") : "",
    month: !isEmpty(getCookie("casino_payment_month")) ? getCookie("casino_payment_month") : -1,
    name: !isEmpty(getCookie("casino_payment_name")) ? getCookie("casino_payment_name") : "",    
    phone: !isEmpty(getCookie("casino_payment_phone")) ? getCookie("casino_payment_phone") : "",
    year: !isEmpty(getCookie("casino_payment_year")) ? getCookie("casino_payment_year") : "",
}

const paymentDetailsSlice = createSlice({
    name: 'paymentDetails',
    initialState,
    reducers: {
        updatePaymentDetails: (state, { payload }) => {
            Object.keys(payload).forEach(key => {
                if(payload[key]){
                    state[key] = payload[key]
                    setCookie(`casino_payment_${key}`, payload[key])
                }
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