import React from 'react'
import GameBoard from '../other/gameBoard'

function BlackjackTable(props){
	const {startGame, bets, choice, updateBets} = props

    return <GameBoard         
        {...props} 
        template="blackjack_board" 
        startGame={startGame} 
        bet={bets} 
        choice={(e)=>choice(e)} 
        updateBets={(e)=>updateBets(e)} 
    />
}

export default BlackjackTable