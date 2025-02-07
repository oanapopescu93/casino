import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    open: false,
    title: "",
    template: "",
    data: null,
    size: "sm", //'sm' | 'lg' | 'xl'
    sticky: false,
    icon: null,
    html: false
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
            state.html = payload.html ? payload.html : false
        },
    }
})

export const {
    changePopup,
} = popupsSlice.actions

export default popupsSlice.reducer