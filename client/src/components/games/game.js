import React, {useEffect, useState} from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { translate } from '../../translations/translate'
import { changePage, changeGame, changeGamePage, changeRoom } from '../../reducers/page'

import Header from '../partials/header'

import Roulette from './pages/roulette/roulette'
import Blackjack from './pages/blackjack/blackjack'
import Slots from './pages/slots/slots'
import Craps from './pages/craps/craps'
import Poker from './pages/poker/poker'
import Race from './pages/race/race'
import Keno from './pages/keno/keno'
import Panel from './sidebar/panel'
import { getRoom } from '../../utils/games'
import WhackARabbit from './pages/whackARabbit/whackARabbit'

import roulette_loading_icon from '../../img/icons_other/icons/yellow/roulette.png'
import blackjack_loading_icon from '../../img/icons_other/icons/yellow/blackjack.png'
import slots_loading_icon from '../../img/icons_other/icons/yellow/slots.png'
import craps_loading_icon from '../../img/icons_other/icons/yellow/craps.png'
import race_loading_icon from '../../img/icons_other/icons/yellow/race.png'
import keno_loading_icon from '../../img/icons_other/icons/yellow/keno.png'
import poker_loading_icon from '../../img/icons_other/icons/yellow/carribean.png'
import whack_loading_icon from '../../img/whack_a_rabbit/whack_a_rabbit_icon.png'

import Dashboard from './pages/dashboard/dashboard'
import Market from './pages/market/market'
import { changePopup } from '../../reducers/popup'
import { getCookie, isEmpty, setCookie } from '../../utils/utils'
import { changeMoney } from '../../reducers/auth'

function Game(props){
    const {lang, page, socket} = props
    let game = page.game
    let game_page = page.game_page
    let title = game.table_name ? game.table_name : ""
    let dispatch = useDispatch()
    const [chatRoomUsers, setChatRoomUsers] = useState([])
    const [streak, setStreak] = useState(1)
    let room = useSelector(state => state.page.room)

    function results(res){
        if(res && res.bet && res.bet>0){ //send results to server only if he bet
            socket.emit('game_results_send', res)
            let payload = {
                open: true,
                template: "game_results",
                title: "results",
                data: res
            }
            dispatch(changePopup(payload))
            dispatch(changeMoney(res.money))
        }
    }

    function handleExit(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    useEffect(() => {
        let streak = getCookie("casino_streak")
        if(isEmpty(streak)){ // check if popup streak has already been shown
            socket.emit('game_send', {uuid: props.user.uuid}) 
            socket.on('game_read', function(res){
                if(res && res.streak){
                    setStreak(res.streak)
                    if(!isEmpty(streak)){
                        if(res.streak>1){
                            let payload = {
                                open: true,
                                template: "streak",
                                title: "Streak",
                                data: res,
                                size: 'lg',
                            }
                            dispatch(changePopup(payload))
                        }
                        setCookie('casino_streak', true)
                    }
                }
            })
        }

        let room = getRoom(game)
        socket.emit('join_room', {room: room, uuid: props.user.uuid, user: props.user.user}) 
        socket.on('chatroom_users_read', function(res){
            setChatRoomUsers(res)
            dispatch(changeRoom(room))
        })
        return () => {
			socket.emit('leave_room', {room: room, uuid: props.user.uuid, user: props.user.user}) 
            socket.on('chatroom_users_read', function(res){
                setChatRoomUsers(res)
            })
            dispatch(changeRoom(null))
		} 
    }, [socket])      

    return <>
        <div className="content_wrap">
            <Header template="game" details={page} lang={lang}></Header>
            {!game_page ? <div className='game_container'>
                {(() => {
                    switch (title) {
                        case "roulette":
                            if(room){
                                return <Roulette {...props} streak={streak} results={(e)=>results(e)}></Roulette>
                            } else {
                                return <>
                                    <img src={roulette_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                                    <p>Loading...</p>
                                </>
                            }
                        case "blackjack":
                            if(room){
                                return <Blackjack {...props} results={(e)=>results(e)}></Blackjack>
                            } else {
                                return <>
                                    <img src={blackjack_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                                    <p>Loading...</p>
                                </>
                            }
                        case "slots":
                            if(room){
                                return <Slots {...props} results={(e)=>results(e)}></Slots>
                            } else {
                                return <>
                                    <img src={slots_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                                    <p>Loading...</p>
                                </>
                            }
                        case "craps":
                            if(room){
                                return <Craps {...props} results={(e)=>results(e)}></Craps>
                            } else {
                                return <>
                                    <img src={craps_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                                    <p>Loading...</p>
                                </>
                            }                        
                        case "race":
                            if(room){
                                return <Race {...props} results={(e)=>results(e)}></Race>
                            } else {
                                return <>
                                    <img src={race_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                                    <p>Loading...</p>
                                </>
                            }                        
                        case "keno":
                            if(room){
                                return <Keno {...props} results={(e)=>results(e)}></Keno>
                            } else {
                                return <>
                                    <img src={keno_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                                    <p>Loading...</p>
                                </>                                
                            }  
                        case "poker":
                            if(room){
                                return <Poker {...props} results={(e)=>results(e)}></Poker>
                            } else {
                                return <>
                                    <img src={poker_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                                    <p>Loading...</p>
                                </>
                            }    
                        case "whack_a_rabbit":
                            if(room){
                                return <WhackARabbit {...props} results={(e)=>results(e)}></WhackARabbit>  
                            } else {
                                return <>
                                    <img src={whack_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                                    <p>Loading...</p>
                                </>
                            }            
                        default:
                            return <p>{translate({lang: lang, info: "error"})}</p>
                    }
                })()}
            </div> : <>
                {(() => {
                    switch (game_page) {
                        case "dashboard":
                            return <Dashboard {...props}></Dashboard>
                        case "market":
                            return <Market {...props}></Market>
                        default:
                            return <p>{translate({lang: props.lang, info: "error"})}</p>
                    }
                })()}
            </>}
            <div className="page_exit">
                <Button id="exit_salon" type="button" onClick={()=>handleExit()} className="mybutton button_transparent shadow_convex">
                    {translate({lang: lang, info: "exit_game"})}
                </Button>
            </div>
        </div>
        <Panel {...props} streak={streak} chatRoomUsers={chatRoomUsers}></Panel>
    </>
}

export default Game