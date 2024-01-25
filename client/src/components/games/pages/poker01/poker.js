import React from 'react'
import PokerDashboard from './pokerDashboard'

function Poker(props){ 
    const {page} = props
    let table_type = page.game.table_type //texas holdem or 5 card draw
    let template = "texas_holdem"
    switch(table_type) {
        case "5_card_draw":
            template = "5_card_draw"
            break
        case "texas_holdem":
        default: 
            template = "texas_holdem"
    }

    return <PokerDashboard {...props} template={template}></PokerDashboard>
}

export default Poker