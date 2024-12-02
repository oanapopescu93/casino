import React, { useEffect, useState } from 'react'
import BaccaratGame from './baccaratGame'
import Header from '../../../partials/header'
import { translate } from '../../../../translations/translate'
import BaccaratTable from './baccaratTable'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../../../reducers/popup'
import { getRoom } from '../../../../utils/games'
import BaccaratButtons from './baccaratButtons'

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
    const [gameResults, setGameResults] = useState(null)

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
        setGameResults(null)
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

    function endGame(payload){
        setGameResults(payload)
        props.results(payload)
	}

    return <div id="baccarat" className='game_container'>
        <div className='game_box'>
            <Header template={"game"} details={page} lang={lang} theme={theme}/>            
            {start ? <BaccaratGame 
                {...props} 
                gameData={gameData}
                choice={choice}
                endGame={(e)=>endGame(e)}
            /> : <BaccaratTable 
                {...props} 
                playerBet={playerBet}
                bankerBet={bankerBet}
                tieBet={tieBet}
                choice={choice}
                updateBets={(type, bet)=>updateBets(type, bet)}
                handleChoice={(type, bet)=>handleChoice(type, bet)}
            />}
            <BaccaratButtons 
                {...props} 
                gameResults={gameResults}
                startGame={()=>startGame()}
                resetGame={()=>resetGame()}
            />
        </div>
    </div>
}

export default Baccarat