import React, {useState} from 'react'
import PokerDashboard from './pokerDashboard'

function Poker(props){ 
    const {page} = props
    let table_type = page.game.table_type //texas holdem or 5 card draw
    let template = "poker_texas_holdem"
    let [bet, setBet] = useState(0)

    switch(table_type) {
        case "poker_5_card_draw":
            template = "poker_5_card_draw"
            break
        case "poker_texas_holdem":
        default: 
            template = "poker_texas_holdem"
    }

    function updateBets(e){
        setBet(e) 
    }

    return <PokerDashboard {...props} template={template} bet={bet} updateBets={(e)=>updateBets(e)} />
}

export default Poker