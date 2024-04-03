import React, {useState} from 'react'
import PokerDashboard from './pokerDashboard'

function Poker(props){ 
    const {page} = props
    let table_type = page.game.table_type //texas holdem or 5 card draw
    let template = "texas_holdem"
    let [bet, setBet] = useState(0)

    switch(table_type) {
        case "5_card_draw":
            template = "5_card_draw"
            break
        case "texas_holdem":
        default: 
            template = "texas_holdem"
    }

    function updateBets(e){
        setBet(e) 
    }

    return <PokerDashboard {...props} template={template} bet={bet} updateBets={(e)=>updateBets(e)}></PokerDashboard>
}

export default Poker