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
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPlay, faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

let replaceCards = null

function PokerDashboard(props){
    const {page, bet, user, settings, template, socket} = props
    const {lang} = settings
    let game = page.game
	let money = user.money ? decryptData(user.money) : 0 
    let poker_bets = bet
    let dispatch = useDispatch()
    let [startGame, setStartGame] = useState(false)
    let [showdown, setShowDown] = useState(false)
    let [pot, setPot] = useState(0)
    let [action, setAction]= useState(null)
    
    let clear = (bet)=>{
		if(bet > 0 && startGame){			
			let payload = {
				uuid: user.uuid,
				game,
				status: 'lose',
				bet,
				money: money - bet
			}
			props.results(payload)
		}
	}

    let getResults = (payload)=>{		
        props.results(payload)
	}
    let getCardList = (payload)=>{
        replaceCards = payload
	}
    let options = {...props, dispatch, getResults, getCardList, clear}
    let my_poker = new poker_game(options)

    function ready(r){
        if(my_poker && document.getElementById("poker_canvas")){
            my_poker.ready(r)
        }
    }

    useEffect(() => {
        ready()

        const handleResize = () => ready('resize')
        $(window).resize(handleResize)

		return () => {
			$(window).off('resize', handleResize)
            replaceCards = null
            if(my_poker){
				if(my_poker.get_status_game()){
					my_poker.leave()// if the user leaves the game, if he bet, he will lose the bets
				}
				my_poker = null
			}
		}
    }, [])

    useEffect(() => {
        const handlePokerRead = (data)=>{
            if (my_poker && data){
                if(data.action){
                    setAction(data.action)
                    if(data.error){
                        let payload = {
                            open: true,
                            template: "error",
                            title: "error",
                            data: translate({lang: lang, info: data.error})
                        }
                        dispatch(changePopup(payload))
                    } else {
                        switch(data.action){
                            case "preflop_betting":                      
                                setStartGame(true)
                                break
                            case "fold":
                                setStartGame(false)
                                break
                            case "showdown":
                                setShowDown(true)
                                break
                            default:
                        }
                        if(data.pot){
                            setPot(data.pot)
                        }
                        my_poker.action(data)
                    }
                }
                
            }
        }
		socket.on('poker_read', handlePokerRead)
        return () => {
            socket.off('poker_read', handlePokerRead)
        }
    }, [socket])

    function choice(e){
        if(my_poker){
            let poker_payload_server = {
                game: template,
                uuid: user.uuid,
                room: getRoom(game),
                action: e.action,
                stage: e.stage,
                money: money
            }
            switch(e.action){
                case "start":
                    socket.emit('poker_send', poker_payload_server)
                    break
                case "bet":
                case "call":
                case "raise":
                    if(poker_bets === 0){
                        let payload = {
                            open: true,
                            template: "error",
                            title: "error",
                            data: translate({lang: lang, info: "no_bets"})
                        }
                        dispatch(changePopup(payload))
                    } else {
                        poker_payload_server.bet = poker_bets
                        socket.emit('poker_send', poker_payload_server)
                    }
                    break
                case "draw":
                    poker_payload_server.replaceCards = replaceCards
                    socket.emit('poker_send', poker_payload_server)
                    break
                case "check":
                case "fold":
                case "showdown":
                    socket.emit('poker_send', poker_payload_server)
                    break
            }
        }
    }

    function updateBets(e){
        props.updateBets(e)
    }

    return <div className="game_container poker_container">
        <div className="game_box_poker">
            <canvas id="poker_canvas" />
            {pot > 0 && getWindowDimensions().width >= 960 ? <div className="poker_pot_container">
                <div className="poker_pot">{translate({lang: lang, info: "total_pot"})}: {pot}</div>
            </div> : null}
            {!startGame ? <div className="game_start">
                <div className="tooltip">
                    <Button 
                        type="button"
                        className="mybutton round button_transparent"
                        onClick={()=>choice({action: 'start', stage: 'start'})}
                    ><FontAwesomeIcon icon={faPlay} /></Button>
                    <span className="tooltiptext">{translate({lang: lang, info: "start"})}</span>
                </div>
            </div> : null}
        </div>
        {startGame && !showdown ? <GameBoard 
            template={template}
            {...props}
            action={action}
            choice={(e)=>choice(e)} 
            updateBets={(e)=>updateBets(e)}
        /> : null}
        <div className="page_exit">
            <div className="tooltip">
                <Button 
                    type="button"
                    className="mybutton round button_transparent shadow_convex"
                    onClick={()=>props.handleHandleExit()}
                ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
                <span className="tooltiptext">{translate({lang: lang, info: "back"})}</span>
            </div>
        </div>
    </div>
}

export default PokerDashboard