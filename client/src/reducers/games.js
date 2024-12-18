import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    roulette: {start: false},
    blackjack: {start: false},
    slots: {start: false},
    craps: {start: false},
    race: {start: false,},
    keno: {start: false},
    poker: {start: false},
    baccarat: {start: false},
}

const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        setGameStart: (state, { payload }) => {
            const { game, start } = payload
            if (state[game]) {
                state[game].start = start
            }
        },
        resetGame: (state, { payload }) => {
            if (initialState[payload]) {
                state[payload] = initialState[payload]
            }
        },
    }
})

export const {
    setGameStart,
    resetGame,
} = gamesSlice.actions

export default gamesSlice.reducer