import React, { useEffect, useState } from 'react'
import BaccaratGame from './baccaratGame'
import Header from '../../../partials/header'
import BaccaratTable from './baccaratTable'
import { useSelector } from 'react-redux'
import { get_cards, getRoom } from '../../../../utils/games'
import BaccaratButtons from './baccaratButtons'
import { getWindowDimensions, useHandleErrors } from '../../../../utils/utils'
import { checkBets } from '../../../../utils/checkBets'
import { decryptData } from '../../../../utils/crypto'

function Baccarat(props){
    const {page, user, settings, socket} = props
	const {lang, theme} = settings
    const {game} = page
    
    const handleErrors = useHandleErrors()
    let items = get_cards()
    let moneyEncrypted = useSelector(state => state.auth.money)
    let money = moneyEncrypted ? decryptData(moneyEncrypted) : 0

    const [start, setStart] = useState(false)
    const [playerBet, setPlayerBet] = useState(0)
    const [bankerBet, setBankerBet] = useState(0)
    const [tieBet, setTieBet] = useState(0)
    const [choice, setChoice] = useState(null)
    const [gameData, setGameData] = useState(null)
    const [gameResults, setGameResults] = useState(null)
    const [images, setImages] = useState(null)
    const [width, setWidth] = useState(getWindowDimensions().width)

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
            if(checkBets({bets: choice.bet, money, lang}, handleErrors)){
                let baccarat_payload_server = {
                    uuid: user.uuid,
                    room: getRoom(game),
                    action: "start",
                    choice
                }
                socket.emit('baccarat_send', baccarat_payload_server)
            }         
        } else {
            handleErrors("error", "no_bets", lang)
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

    useEffect(() => {
        getImagesBaccarat()
    }, [])

    function getImagesBaccarat(){
        let promises = []
        for(let i in items){				
            promises.push(preaload_images(items[i]))
        }
        Promise.all(promises).then((result)=>{
            setImages(result)
        })
    }

    function preaload_images(item){
		return new Promise((resolve)=>{
			let image = new Image()
			image.src = item.src
			image.addEventListener("load", ()=>{
				resolve({suit: item.suit, value: item.value, src: image})
			}, false)
		})
	}

    function handleResize() {
        setWidth(getWindowDimensions().width)
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize)
            handleResize()
            return () => window.removeEventListener("resize", handleResize)
        }
    }, [])

    return <div id="baccarat" className='game_container'>
        <div className='game_box'>
            <Header template={"game"} details={page} lang={lang} theme={theme}/>            
            {start ? <BaccaratGame 
                {...props} 
                gameData={gameData}
                choice={choice}
                images={images}
                width={width}
                gameResults={gameResults}
                money={money}
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