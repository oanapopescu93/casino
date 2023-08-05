import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    page: 'Salon',
    game: null,
    game_page: null,
    room: null
}

const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        changePage: (state, { payload }) => {
            state.page = payload
        },
        changeGame: (state, { payload }) => {
            state.game = payload
        },
        changeGamePage: (state, { payload }) => {
            state.game_page = payload
        },
        changeRoom: (state, { payload }) => {
            state.room = payload
        },
        resetPage: () => initialState,
    }
})

export const {
    changePage,
    changeGame,
    changeGamePage,
    changeRoom
} = pageSlice.actions

export default pageSlice.reducer