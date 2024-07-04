import { createSlice } from '@reduxjs/toolkit'
import { getCookie, setCookie } from '../utils/utils'

const initialState = {
    lang: getCookie("casino_language") !== "" ? getCookie("casino_language") : "ENG",
    currency: getCookie("casino_currency") !== "" ? getCookie("casino_currency") : "USD",
    date: getCookie("casino_date") !== "" ? getCookie("casino_date") : "d.m.Y H:i",
    cookies: getCookie("casino_cookies") !== "" ? getCookie("casino_cookies") : "0",
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        changeLanguage: (state, { payload }) => {
            state.lang = payload
            setCookie("casino_language", payload)
        },
        changeCurrency: (state, { payload }) => {
            state.currency = payload
            setCookie("casino_currency", payload)
        },
        changeDate: (state, { payload }) => {
            state.date = payload
            setCookie("casino_date", payload)
        },
        changeCookies: (state) => {
            state.cookies = '1'
            setCookie("casino_cookies", '1')
        },
        resetSettings: () => initialState,
    }
})

export const {
    changeLanguage,
    changeCurrency,
    changeDate,
    changeCookies,
    resetSettings
} = settingsSlice.actions

export default settingsSlice.reducer