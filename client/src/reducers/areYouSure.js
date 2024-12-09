import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    areYouSureSlotsMaxBet: false,
}

const areYouSureSlice = createSlice({
    name: 'areYouSure',
    initialState,
    reducers: {
        changeAreYouSureSlotsMaxBet: (state, { payload }) => {
            state.areYouSureSlotsMaxBet = payload
        },
        resetAreYouSure: () => initialState,
    }
})

export const {
    changeAreYouSureSlotsMaxBet,
    resetAreYouSure,
} = areYouSureSlice.actions

export default areYouSureSlice.reducer