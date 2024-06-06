import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    page: 'Salon',
    game: null,
    game_page: null,
    room: null,
    page_prev: null,
    game_prev: null,
    game_page_prev: null,
    room_prev: null
}

const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        changePage: (state, { payload }) => {
            state.page_prev = state.page
            state.page = payload
        },
        changeGame: (state, { payload }) => {
            state.game_prev = state.game
            state.game = payload
        },
        changeGamePage: (state, { payload }) => {
            state.game_page_prev = state.game_page
            state.game_page = payload
        },
        changeRoom: (state, { payload }) => {
            state.room_prev = state.room
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