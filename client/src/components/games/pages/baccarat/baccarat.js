import React, { useEffect, useState } from 'react'
import { get_cards, getRoom } from '../../../../utils/games'
import Header from '../../../partials/header'
import BaccaratGame from './baccaratGame'
import BaccaratTable from './baccaratTable'
import BaccaratButtons from './baccaratButtons'
import { getWindowDimensions, useHandleErrors } from '../../../../utils/utils'
import { checkBets } from '../../../../utils/checkBets'
import { decryptData } from '../../../../utils/crypto'
import { changePopup } from '../../../../reducers/popup'
import { useDispatch } from 'react-redux'

let baccaratGameFlow = null
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
    const handleErrors = useHandleErrors()
    let items = get_cards()
    
    let money = 0
    if(baccaratGameFlow && baccaratGameFlow.money){
        money = baccaratGameFlow.money
    } else if(user.money){
        money = decryptData(user.money)
    }
    let money_original = user.money ? decryptData(user.money) : 0
    let accumulatedBets = baccaratGameFlow && baccaratGameFlow.bet ? baccaratGameFlow.bet : 0

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
        setStart(false)
        setPlayerBet(0)
        setBankerBet(0)
        setTieBet(0)
        setChoice(null)        
        setGameData(null)
        setGameResults(null)
        setImages(null)
	}

    useEffect(() => {
		const handleBaccaratRead = (data)=>{
            if(data){
                setStart(true)
                setGameData(data)
                getImagesBaccarat()
            }
        }
		socket.on('baccarat_read', handleBaccaratRead)
		return () => {
            socket.off('baccarat_read', handleBaccaratRead)
        }
    }, [socket])

    function showGameResults(res){
        setGameResults(res)

        money = res.status === "win" ? money + res.bet : money - res.bet
        accumulatedBets = accumulatedBets + res.bet
        baccaratGameFlow = {...res, money, bet: accumulatedBets}        

        const payload = {
            open: true,
            template: "game_results",
            title: "results",
            data: res,
            size: "sm",
        }
        dispatch(changePopup(payload))
	}

    function endGame(){
        let baccarat_payload = {...baccaratGameFlow, status: money_original < baccaratGameFlow.money ? "win" : "lose"}
        props.results(baccarat_payload, false)
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

    useEffect(() => {
		return () => {
            endGame()
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
                showGameResults={(e)=>showGameResults(e)}
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