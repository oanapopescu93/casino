import React from 'react'
import GameBoard from '../other/gameBoard'

function BlackjackTable(props){
	const {gameData, startGame, bets, choice, updateBets} = props
    let game_end = gameData?.game_end

    return <>
        {!gameData || !game_end ? <GameBoard         
            {...props} 
            template="blackjack_board" 
            startGame={startGame} 
            bet={bets}
            choice={(e)=>choice(e)} 
            updateBets={(e)=>updateBets(e)} 
        /> : null}
    </>
}

export default BlackjackTable