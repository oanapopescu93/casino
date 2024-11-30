import React, { useEffect, useState } from 'react'
import BaccaratGame from './baccaratGame'
import Header from '../../../partials/header'
import { translate } from '../../../../translations/translate'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPlay, faTrashCan, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import BaccaratTable from './baccaratTable'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../../../reducers/popup'
import { getRoom } from '../../../../utils/games'

function Baccarat(props){
    const {page, user, settings, socket} = props
	const {lang, theme} = settings
    const {game} = page

    let dispatch = useDispatch()

    const [start, setStart] = useState(false)
    const [playerBet, setPlayerBet] = useState(0)
    const [bankerBet, setBankerBet] = useState(0)
    const [tieBet, setTieBet] = useState(0)
    const [choice, setChoice] = useState(null)
    const [gameData, setGameData] = useState(null)

    function updateBets(type, bet){
        switch (type) {
            case 'player':
                setPlayerBet(bet)
                break
            case 'banker':
                setBankerBet(bet)
                break
            case 'tie':
                setTieBet(bet)
                break
        }
    }

    function handleChoice(type, bet){
        if(type && bet > 0){
            setChoice({type, bet})
        }
    }

    function startGame(){
        if(choice && choice.bet > 0){
            let baccarat_payload_server = {
                uuid: user.uuid,
                room: getRoom(game),
                action: "start",
                choice
            }
            socket.emit('baccarat_send', baccarat_payload_server)            
        } else {
            let payload = {
                open: true,
                template: "error",
                title: "error",
                data: translate({lang: lang, info: "no_bets"}),
                size: "sm",
            }
            dispatch(changePopup(payload))
        }        
	}

    function resetGame(){
        setPlayerBet(0)
        setBankerBet(0)
        setTieBet(0)
        setChoice(null)
        setStart(false)
	}

    useEffect(() => {
		const handleBaccaratRead = function(data){
            if(data){
                setStart(true)
                setGameData(data)
            }
        }
		socket.on('baccarat_read', handleBaccaratRead)
		return () => {
            socket.off('baccarat_read', handleBaccaratRead)
        }
    }, [socket])

    return <div id="baccarat" className='game_container'>
        <div className='game_box'>
            <Header template={"game"} details={page} lang={lang} theme={theme}/>            
            {start ? <BaccaratGame 
                {...props} 
                gameData={gameData}
                choice={choice}
            /> : <BaccaratTable 
                {...props} 
                playerBet={playerBet}
                bankerBet={bankerBet}
                tieBet={tieBet}
                choice={choice}
                updateBets={(type, bet)=>updateBets(type, bet)}
                handleChoice={(type, bet)=>handleChoice(type, bet)}
            />}
            <div className="button_action_group baccarat_buttons_container">
                <div className="tooltip">
                    <Button 
                        type="button"
                        className="mybutton round button_transparent shadow_convex"
                        onClick={()=>startGame()}
                    ><FontAwesomeIcon icon={faPlay} /></Button>
                    <span className="tooltiptext">{translate({lang: lang, info: "start"})}</span>
                </div>
                <div className="tooltip">
                    <Button 
                        type="button"
                        className="mybutton round button_transparent shadow_convex"
                        onClick={()=>resetGame()}
                    ><FontAwesomeIcon icon={faTrashCan} /></Button>
                    <span className="tooltiptext">{translate({lang: lang, info: "reset"})}</span>
                </div>
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
    </div>
}

export default Baccarat