import React, {useState, useEffect} from 'react'
import { Button } from 'react-bootstrap'
import GameBoard from '../other/gameBoard'
import { useDispatch } from 'react-redux'
import { decryptData } from '../../../../utils/crypto'
import $ from "jquery"
import { getRoom } from '../../../../utils/games'
import { translate } from '../../../../translations/translate'
import { changePopup } from '../../../../reducers/popup'
import { poker_game } from './pokerGame'
import { getWindowDimensions } from '../../../../utils/utils'

function PokerDashboard(props){ 
    let game = props.page.game
	let money = decryptData(props.user.money)  
    let dispatch = useDispatch()
    let [startGame, setStartGame] = useState(false)
    let [pot, setPot] = useState(0)
    let [action, setAction]= useState(null) 
    let poker_bets = 0
    
    let clear = function(bet){
		console.log('clear')
	}

    let getResults = function(payload){
		console.log('results--> ', payload)
	}
    let options = {...props, dispatch, getResults, clear}
    let my_poker = new poker_game(options)

    function ready(r){
        if(my_poker && document.getElementById("poker_canvas")){
            my_poker.ready(r)
        }
    }

    useEffect(() => {
        ready()
        $(window).resize(function(){
			ready('resize')
		})
		return () => {
			if(my_poker){}
		}
    }, [])

    useEffect(() => {
        const handlePokerRead = function(data) {
            if (my_poker && data) {
                if(data.action){
                    setAction(data.action)
                    switch(data.action){
                        case "preflop_betting":                        
                            setStartGame(true)
                            break
                        case "fold":
                            setStartGame(false)
                            break
                    }
                    if(data.pot){
                        setPot(data.pot)
                    }
                }
                my_poker.action(data)
            }
        }
		props.socket.on('poker_read', handlePokerRead)	
        return () => {
            props.socket.off('poker_read', handlePokerRead)
        }
    }, [props.socket])

    function choice(e){
        if(my_poker){
            let poker_payload_server = {
                game: props.template,
                uuid: props.user.uuid,
                room: getRoom(game),
                action: e.action,
                stage: e.stage,
                money: money
            }

            switch(e.action){
                case "start":                    
                    props.socket.emit('poker_send', poker_payload_server)
                    break
                case "bet":
                    if(poker_bets === 0){
                        let payload = {
                            open: true,
                            template: "error",
                            title: translate({lang: props.lang, info: "error"}),
                            data: translate({lang: props.lang, info: "no_bets"})
                        }
                        dispatch(changePopup(payload))
                    } else {          
                        poker_payload_server.bet = poker_bets
                        props.socket.emit('poker_send', poker_payload_server)
                    }
                    break
                case "check":
                    props.socket.emit('poker_send', poker_payload_server)
                    break
                case "fold":
                    props.socket.emit('poker_send', poker_payload_server)
                    break
                case "call":
                    props.socket.emit('poker_send', poker_payload_server)
                    break
            }
        }        
    }    

    function updateBets(e){
        poker_bets = e
    }

    return <div className="game_container poker_container">
        <p>{translate({lang: props.lang, info: "under_construction"})}</p>
        <canvas id="poker_canvas"></canvas>
        {pot > 0 && getWindowDimensions().width >= 960 ? <div className="poker_pot_container">
            <div className="poker_pot">{translate({lang: props.lang, info: "total_pot"})}: {pot}</div>
        </div> : null}        
        {!startGame ? <div className="game_start">
            <Button type="button" onClick={()=>choice({action: 'start', stage: 'start'})} className="mybutton round button_fullcolor shadow_convex">
                {translate({lang: props.lang, info: "start"})}
            </Button>
        </div> : <GameBoard 
            template={props.template}
            {...props}
            action={action}
            choice={(e)=>choice(e)} 
            updateBets={(e)=>updateBets(e)}
        ></GameBoard>}
    </div>
}

export default PokerDashboard