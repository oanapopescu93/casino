import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    roulette: {bets: null, lucky_bet: null, result: null},
    blackjack: {bets: null, lucky_bet: null, result: null},
    slots: {bets: null, lucky_bet: null, result: null},
    craps: {bets: null, lucky_bet: null, result: null},
    race: {bets: [], lucky_bet: null, result: null},
    keno: {bets: null, lucky_bet: null, result: null},
}

const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        changeRouletteBets: (state, { payload }) => {
            state.roulette.bets = payload
        },
        changeBlackjackBets: (state, { payload }) => {
            state.blackjack.bets = payload
        },
        changeSlotsBets: (state, { payload }) => {
            state.slots.bets = payload
        },
        changeCrapsBets: (state, { payload }) => {
            state.craps.bets = payload
        },
        changeRaceBets: (state, { payload }) => {
            let bet = parseInt(payload.bet)		
            let place = parseInt(payload.place)		
            const item = state.race.bets.find((x) => x.id === payload.id)
			if (item) {	
                if(bet){
                    item.bet = bet  
                }
                if(place){
                    item.place = place  
                }
			} else {
				state.race.bets.push({ ...payload, bet: bet, raceId: state.race.bets.length })
			}
        },
        changeKenoBets: (state, { payload }) => {
            state.keno.bets = payload
        },

        changeRouletteLuckyBet: (state, { payload }) => {
            state.roulette.lucky_bet = payload
        },
        changeBlackjackLuckyBet: (state, { payload }) => {
            state.blackjack.lucky_bet = payload
        },
        changeSlotsLuckyBet: (state, { payload }) => {
            state.slots.lucky_bet = payload
        },
        changeCrapsLuckyBet: (state, { payload }) => {
            state.craps.lucky_bet = payload
        },
        changeRaceLuckyBet: (state, { payload }) => {
            state.race.lucky_bet = payload
        },
        changeKenoLuckyBet: (state, { payload }) => {
            state.keno.lucky_bet = payload
        },

        resetGame: (state, { payload }) => {
            if (initialState[payload]) {
                state[payload] = initialState[payload]
            }
        },
    }
})

export const {
    changeRouletteBets,
    changeBlackjackBets,
    changeSlotsBets,
    changeCrapsBets,
    changeRaceBets,
    changeKenoBets,

    changeRouletteLuckyBet,
    changeBlackjackLuckyBet,
    changeSlotsLuckyBet,
    changeCrapsLuckyBet,
    changeRaceLuckyBet,
    changeKenoLuckyBet,
    
    resetGame,
} = gamesSlice.actions

export default gamesSlice.reducer