import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Roulette from './pages/roulette/roulette'
import Blackjack from './pages/blackjack/blackjack'
import Slots from './pages/slots/slots'
import Craps from './pages/craps/craps'
import Poker from './pages/poker/poker'
import Baccarat from './pages/baccarat/baccarat'
import Race from './pages/race/race'
import Keno from './pages/keno/keno'
import Dashboard from './pages/dashboard/dashboard'
import Market from './pages/market/market'
import WhackARabbit from './pages/whackARabbit/whackARabbit'
import Panel from './sidebar/panel'

import { changePopup } from '../../reducers/popup'
import { changeMoney } from '../../reducers/auth'
import { changePage, changeGame, changeGamePage, changeRoom } from '../../reducers/page'
import { getCookie, isEmpty, setCookie } from '../../utils/utils'
import { getRoom } from '../../utils/games'
import { translate } from '../../translations/translate'
import GameLoading from './gameLoading'

function Game(props){
    const {page, user, socket, settings} = props
    const {lang} = settings
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
                data: res,
                size: "sm",
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
        let show_streak_popup = getCookie("casino_show_streak_popup")
        let casino_streak = getCookie("casino_streak")
        if(isEmpty(show_streak_popup)){
            socket.emit('game_send', {uuid: user.uuid}) 
            socket.on('game_read', (res)=>{
                if(res && res.streak){
                    setStreak(res.streak)
                    setCookie('casino_streak', res.streak)

                    if(res.streak > 1){ // if popup streak hasn't been show and streak is more than 1
                        let payload = {
                            open: true,
                            template: "streak",
                            title: "Streak",
                            data: res,
                            size: 'lg',
                            icon: "faCalendarDays"
                        }
                        dispatch(changePopup(payload))
                        setCookie('casino_show_streak_popup', true)
                    }
                }
            })
        } else {
            setStreak(casino_streak)
        }

        let room = getRoom(game)
        socket.emit('join_room', {room: room, uuid: user.uuid, user: user.user}) 
        socket.on('chatroom_users_read', (res)=>{
            setChatRoomUsers(res)
            dispatch(changeRoom(room))
        })
        return () => {
			socket.emit('leave_room', {room: room, uuid: user.uuid, user: user.user}) 
            socket.on('chatroom_users_read', (res)=>{
                setChatRoomUsers(res)
            })
            dispatch(changeRoom(null))
		}
    }, [socket])

    return <>   
        {!game_page ? <>
                {(() => {
                    if(room){
                        switch (title) {
                            case "roulette":
                                return <Roulette {...props} streak={streak} results={(e)=>results(e)} handleHandleExit={()=>handleExit()} />
                            case "blackjack":
                                return <Blackjack {...props} streak={streak} results={(e)=>results(e)} handleHandleExit={()=>handleExit()} />
                            case "slots":
                                return <Slots {...props} streak={streak} results={(e)=>results(e)} handleHandleExit={()=>handleExit()} />
                            case "craps":
                                return <Craps {...props} streak={streak} results={(e)=>results(e)} handleHandleExit={()=>handleExit()} />
                            case "poker":
                                return <Poker {...props} streak={streak} results={(e)=>results(e)} handleHandleExit={()=>handleExit()} />
                            case "race":
                                return <Race {...props} streak={streak} results={(e)=>results(e)} handleHandleExit={()=>handleExit()} />
                            case "keno":
                                return <Keno {...props} streak={streak} results={(e)=>results(e)} handleHandleExit={()=>handleExit()} />
                            case "baccarat":
                                return <Baccarat {...props} streak={streak} results={(e)=>results(e)} handleHandleExit={()=>handleExit()} />         
                            case "whack_a_rabbit":
                                return <WhackARabbit {...props} streak={streak} results={(e)=>results(e)} handleHandleExit={()=>handleExit()} />
                        }
                    }
                    return <GameLoading {...props} />
                })()}
        </> : <>
            {(() => {
                switch (game_page) {
                    case "dashboard":
                        return <Dashboard {...props} streak={streak} handleHandleExit={()=>handleExit()} />
                    case "market":
                        return <Market {...props} streak={streak} handleHandleExit={()=>handleExit()} />
                    default:
                        return <p>{translate({lang: lang, info: "error"})}</p>
                }
            })()}
        </>}
        <Panel {...props} streak={streak} chatRoomUsers={chatRoomUsers} />
    </>
}

export default Game