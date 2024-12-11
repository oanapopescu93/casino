import React from 'react'
import GameBoard from '../other/gameBoard'

function PokerTables(props){
    const {template, startGame, showdown, bets, action, choice, updateBets} = props

    return <>
       {startGame && !showdown? <GameBoard                 
            {...props}
            template={template + "_board"}
            bet={bets}
            action={action}
            choice={(e)=>choice(e)} 
            updateBets={(e)=>updateBets(e)}
        /> : null}
    </>
}

export default PokerTables