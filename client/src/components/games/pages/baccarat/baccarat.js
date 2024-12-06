import React, { useEffect, useState } from 'react'
import { translate } from '../../../../translations/translate'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../../../reducers/popup'
import { get_cards, getRoom } from '../../../../utils/games'
import Header from '../../../partials/header'
import BaccaratGame from './baccaratGame'
import BaccaratTable from './baccaratTable'
import BaccaratButtons from './baccaratButtons'
import { getWindowDimensions } from '../../../../utils/utils'

function Baccarat(props){
    const {page, user, settings, socket} = props
	const {lang, theme} = settings
    const {game} = page

    const [start, setStart] = useState(false)
    const [playerBet, setPlayerBet] = useState(0)
    const [bankerBet, setBankerBet] = useState(0)
    const [tieBet, setTieBet] = useState(0)
    const [choice, setChoice] = useState(null)
    const [gameData, setGameData] = useState(null)
    const [gameResults, setGameResults] = useState(null)
    const [images, setImages] = useState(null)
    const [width, setWidth] = useState(getWindowDimensions().width)

    let dispatch = useDispatch()
    let items = get_cards()

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
		const handleBaccaratRead = (data)=>{
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
        let promises = []
        for(let i in items){				
            promises.push(preaload_images(items[i]))
        }
        Promise.all(promises).then((result)=>{
            setImages(result)
        })
    }, [])

    function preaload_images(item){
		return new Promise((resolve)=>{
			let image = new Image()
			image.src = item.src
			image.addEventListener("load", ()=>{
				resolve({suit: item.suit, value: item.value, src: image})
			}, false)
		})
	}

    return <div id="baccarat" className='game_container'>
        <div className='game_box'>
            <Header template={"game"} details={page} lang={lang} theme={theme}/>            
            {start ? <BaccaratGame 
                {...props} 
                gameData={gameData}
                choice={choice}
                images={images}
                width={width}
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