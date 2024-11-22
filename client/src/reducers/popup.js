import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    open: false,
    title: "",
    template: "",
    data: null,
    size: "sm", //'sm' | 'lg' | 'xl'
    sticky: false,
    icon: null,
}

const popupsSlice = createSlice({
    name: 'popups',
    initialState,
    reducers: {
        changePopup: (state, { payload }) => {
            state.open = payload.open
            state.title = payload.title ? payload.title : ""
            state.template = payload.template ? payload.template : ""
            state.data = payload.data ? payload.data : null
            state.size = payload.size ? payload.size : "sm"
            state.sticky = payload.sticky ? payload.sticky : false
            state.icon = payload.icon ? payload.icon : null
        },
    }
})

export const {
    changePopup,
} = popupsSlice.actions

export default popupsSlice.reducer