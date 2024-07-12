import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: [], 
    market: [],
    finances: {},
    profiles: [],
    donations: [],
    career: [],
    questions: [],
    race_rabbits: [],
    keno_prizes: [],
    contact: [],
    loaded: false
}

function getRaceRabbits(rabbit_race){
    let colors = ["red", "orange", "yellow", "green", "blue", "purple"]
    let rabbit_speed = [3, 1] //max, min
    let rabbit_delay = [50, 20] //max, min
    let rabbit_health_max = 5

    for(let i in rabbit_race) {
        rabbit_race[i].max_speed = rabbit_speed[0]
        rabbit_race[i].min_speed = rabbit_speed[1]
    
        // Calculate health (randomly)
        let random_health = Math.random() * rabbit_health_max
        rabbit_race[i].health_max = rabbit_health_max
        rabbit_race[i].health = Math.round(random_health * 10) / 10
        
        // Calculate delay based on health
        let calculated_delay = rabbit_delay[1] + (rabbit_delay[0] - rabbit_delay[1]) * (rabbit_health_max - random_health) / rabbit_health_max
        rabbit_race[i].delay = Math.round(calculated_delay)
        
        rabbit_race[i].bet = 0
        rabbit_race[i].place = 1
    }

    let x = 0
    while(x < colors.length){
        let t = Math.floor(Math.random() * rabbit_race.length)
        if(!rabbit_race[t].participating){
            rabbit_race[t].participating = true
            rabbit_race[t].name = colors[x].charAt(0).toUpperCase() + colors[x].slice(1)
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
            state.finances = payload.finances
            state.profiles = payload.profiles
            state.donations = payload.donations
            state.career = payload.career
            state.questions = payload.questions
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