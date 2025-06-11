import React, { useEffect, useState } from 'react'
import Header from '../../../partials/header'
import PokerGame from './pokerGame'
import PokerTables from './pokerTables'
import PokerButtons from './pokerButtons'
import { get_cards, getRoom } from '../../../../utils/games'
import { decryptData } from '../../../../utils/crypto'
import { getWindowDimensions, useHandleErrors } from '../../../../utils/utils'
import { checkBets } from '../../../../utils/checkBets'
import { translate } from '../../../../translations/translate'
import { useSelector } from 'react-redux'

function PokerDashboard(props){
    const { page, settings, user, template, socket } = props
    const { lang, theme } = settings    

    let game = page.game
    let room = getRoom(game)
    let moneyEncrypted = useSelector(state => state.auth.money)
    let money = moneyEncrypted ? decryptData(moneyEncrypted) : 0
    let items = get_cards()
    let replaceCards = null
    let smallBlind = 1
    let gameFlow = {}

    const [startGame, setStartGame] = useState(false)
    const [showdown, setShowDown] = useState(false)
    const [action, setAction] = useState(null)
    const [bets, setBets] = useState(0)
    const [pot, setPot] = useState(0)
    const [images, setImages] = useState(null)
    const [width, setWidth] = useState(getWindowDimensions().width)
    const [gameData, setGameData] = useState(null)

    const handleErrors = useHandleErrors()

    function updateBets(e){
        setBets(e)
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

    function choice(e){
        if(!e){
            return
        }

        const {action, stage} = e      
        let poker_payload_server = {
            game: template,
            uuid: user.uuid,
            room,
            action: action,
            stage: stage,
            money,
            bet: bets,
            smallBlind
        }

        switch(e.action){
            case "start":
            case "call":            
                socket.emit('poker_send', poker_payload_server)
                break
            case "bet":
            case "raise":
                if(checkBets({bets, money, lang}, handleErrors)){                    
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

    useEffect(() => {
        const handlePokerRead = (data)=>{
            if (data && data.action){
                if(data.error){
                    let error_message = translate({lang, info: data.error})
                    if(data.amountToCallRaise > 0){
                        error_message = error_message + " (" + translate({lang, info: "amount"}) + ": " + data.amountToCallRaise + ")"
                    }
                    handleErrors("error", error_message, lang)
                    return
                }

                setGameData(data)
                setAction(data.action)
                if(data.pot){
                    setPot(data.pot)
                }
                gameFlow.gameData = data
                switch(data.action){
                    case "preflop_betting":
                        setStartGame(true)
                        gameFlow.startGame = true
                        break
                    case "fold":
                        setStartGame(false)
                        setPot(0)
                        gameFlow.startGame = false
                        break
                    case "showdown":
                        setStartGame(false)
                        setShowDown(true)
                        setPot(0)
                        gameFlow.startGame = false
                        break
                    default:
                        break
                }
            }
        }
		socket.on('poker_read', handlePokerRead)
        return () => {
            socket.off('poker_read', handlePokerRead)
        }
    }, [socket])

    function handleShowdown(e){
        const {pot, bet, status} = e
        let poker_payload = {
			uuid: user.uuid,
			game,
			status,
			bet
		}        
        if(status === "win"){
            poker_payload.money = money + pot
        } else {
            poker_payload.money = money - bet
        }
        resetGame()
        props.results(poker_payload)
    }

    function resetGame(){
        setStartGame(false)
        setShowDown(false)
        setAction(null)
        setBets(0)
        setPot(0)
        setGameData(null)
    }

    function leave(){
        if(gameFlow && gameFlow.startGame){
            let player = gameFlow.gameData.players.filter((x)=>{
                return x.uuid === user.uuid
            })

            let status = 'lose'
            let bet = player[0]?.bet
            let poker_payload = {
                uuid: user.uuid,
                game,
                status,
                bet: bet && bet > 0 ? bet : smallBlind,
                money: bet && bet > 0 ? money - bet: money - smallBlind
            }

            resetGame()
            props.results(poker_payload)
        }
    }

    useEffect(() => {
		return () => {
			leave()
		}
	}, [])

    function getCardList(e){
        replaceCards = e        
    }

    return <div id="poker" className="game_container poker_container">
        <div className="game_box">
            <Header template={"game"} details={page} lang={lang} theme={theme}/>  
            <PokerGame 
                {...props} 
                pot={pot}
                bets={bets} 
                action={action}
                startGame={startGame}
                showdown={showdown}
                width={width}
                images={images}
                gameData={gameData}
                smallBlind={smallBlind}
                handleShowdown={(e)=>handleShowdown(e)}
                getCardList={(e)=>getCardList(e)}
            />
            <PokerTables 
                {...props} 
                bets={bets} 
                startGame={startGame} 
                showdown={showdown}
                action={action}
                choice={(e)=>choice(e)} 
                updateBets={(e)=>updateBets(e)}
            />
            <PokerButtons 
                {...props}
                startGame={startGame}
                choice={(e)=>choice(e)} 
            />            
        </div>
    </div>
}

export default PokerDashboard