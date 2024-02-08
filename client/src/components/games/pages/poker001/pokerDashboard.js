import React, {useState, useEffect} from 'react'
import GameBoard from '../other/gameBoard'
import { useDispatch } from 'react-redux'
import { decryptData } from '../../../../utils/crypto'
import $ from "jquery"
import { getRoom } from '../../../../utils/games'
import { translate } from '../../../../translations/translate'
import { changePopup } from '../../../../reducers/popup'
import { poker_game } from './pokerGame'

var poker_bets = 0
var poker_status = false
function PokerDashboard(props){ 
    let game = props.page.game
	let money = decryptData(props.user.money)
	let [startGame, setStartGame]= useState(false)
    let [round, setRound]= useState(0)
    let [spectator, setSpectator]= useState(false)
    let dispatch = useDispatch()    

	let clear = function(bet){
		poker_bets = bet
		if(poker_bets > 0){			
			let poker_payload = {
				uuid: props.user.uuid,
				game: game,
				status: 'lose',
				bet: poker_bets,
				money: money - poker_bets
			}
			props.results(poker_payload)
		}
	}

    let getResults = function(payload){
		props.results(payload)
		setStartGame(false)
        poker_status = false
	}
    let options = {...props, dispatch, getResults, clear}
    let my_poker = new poker_game(options)    

    function ready(){
        if(my_poker && document.getElementById("poker_canvas")){
            my_poker.ready()
        }
    }

    useEffect(() => {
        ready()
        $(window).resize(function(){
			ready()
		})
		return () => {
			if(my_poker){
				clear(poker_bets) // if the user leaves the game, if he bet, he will lose the bets
				my_poker = null
				poker_bets = 0
				poker_status = false	
			}
		}
    }, [])

    useEffect(() => {
		props.socket.on('poker_read', function(data){
			if(my_poker && data){
                if(data.action === "start" || data.action === "call" || data.action === "raise" || data.action === "fold" || data.action === "replace"){
                    my_poker.action(data)
                    setRound(data.round)
                    if(data.action === "fold"){ //the user decided to quit --> he loses his bet  
                        let poker_payload = {
                            uuid: props.user.uuid,
                            game: game,
                            status: 'lose',
                            bet: poker_bets,
                            money: money - poker_bets
                        }
                        props.results(poker_payload)
                    }				
                } else {
                    //it means it must be an error, if the user folds, he just loses the money without payload to server
                    let payload = {
                        open: true,
                        template: "error",
                        title: translate({lang: props.lang, info: "error"}),
                        data: translate({lang: props.lang, info: data.action})
                    }
                    dispatch(changePopup(payload))
                }
            }	
		})	
    }, [props.socket])

    function choice(type){
        if(type === "start" || type === "fold" || type === "call" || type === "raise" || type === "replace"){
            if(my_poker){
                let poker_payload_server = {
                    game: props.template,
                    uuid: props.user.uuid,
                    room: getRoom(game),
                    action: type,
                    bet: poker_bets,
                    money: money
                }

                let payload = null
                switch (type) {
                    case "start":
                        if(poker_bets === 0){
                            payload = {
                                open: true,
                                template: "error",
                                title: translate({lang: props.lang, info: "error"}),
                                data: translate({lang: props.lang, info: "no_bets"})
                            }
                            dispatch(changePopup(payload))
                        } else {          
                            if(!poker_status){                                
                                props.socket.emit('poker_send', poker_payload_server)
                                poker_status = true
                                setStartGame(true)
                            }
                        }                    
                        break
                    case "fold": 
                    case "call":
                    case "raise":
                    case "replace":
                        if(type === "replace"){
                            poker_payload_server.replaceCards = my_poker.getReplaceCards()
                        }
                        props.socket.emit('poker_send', poker_payload_server)
                        if(type === "fold"){
                            setSpectator(true)
                        }
                        break
                }
                if(payload){
                    dispatch(changePopup(payload))
                }
            }
        }		
	}

    function updateBets(x){
        poker_bets = x
    }

    return <div className="game_container poker_container">
        <canvas id="poker_canvas"></canvas>
        {!spectator ? <GameBoard 
            template={props.template}
            {...props} 
            startGame={startGame} 
            round={round}
            choice={(e)=>choice(e)} 
            updateBets={(e)=>updateBets(e)}
        ></GameBoard> : null}
    </div>
}

export default PokerDashboard