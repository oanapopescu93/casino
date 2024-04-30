import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: [], 
    market: [],
    currencies: [],
    profiles: [],
    donations: [],
    career: [],
    questions: [],
    slot_prises: [],
    race_rabbits: [],
    keno_prizes: [],
    contact: [],
    loaded: false
}

function getRaceRabbits(rabbit_race){
    let colors = ["red", "orange", "yellow", "green", "blue", "purple"]
    let rabbit_speed = [3, 1] //max, min
    let rabbit_delay = [40, 20] //max, min

    for(let i in rabbit_race){
        rabbit_race[i].max_speed = rabbit_speed[0]
        rabbit_race[i].min_speed = rabbit_speed[1]

        let random_delay = Math.floor(Math.random() * (rabbit_delay[0] - rabbit_delay[1]) ) + rabbit_delay[1]
        rabbit_race[i].delay = random_delay
        
        rabbit_race[i].health_max = 5
        rabbit_race[i].health = Math.round(random_delay * rabbit_race[i].health_max / rabbit_delay[0] * 10) / 10
        
        rabbit_race[i].bet = 0
        rabbit_race[i].place = 1
    }

    let x = 0
    while(x<colors.length){
        let t = Math.floor(Math.random() * rabbit_race.length)        
        if(!rabbit_race[t].participating){            
            rabbit_race[t].participating = true
            rabbit_race[t].name = colors[x]
            rabbit_race[t].color = colors[x]
            x++
        }
    }
    
    return rabbit_race
}

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        bringPayload: () => {},
        showPayload: (state, { payload }) => {            
            state.products = payload.products
            state.market = payload.market
            state.currencies = payload.currencies
            state.profiles = payload.profiles
            state.donations = payload.donations
            state.career = payload.career
            state.questions = payload.questions
            state.slot_prises = payload.slot_prises
            state.race_rabbits = getRaceRabbits(payload.race_rabbits)
            state.keno_prizes = payload.keno_prizes
            state.contact = payload.contact
            state.loaded = true
        },
        resetHome: () => initialState,
    }
})

export const {
    bringPayload,
    showPayload,
    resetHome
} = homeSlice.actions

export default homeSlice.reducer