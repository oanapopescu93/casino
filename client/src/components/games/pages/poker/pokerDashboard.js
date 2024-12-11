import React, { useEffect, useState } from 'react'
import Header from '../../../partials/header'
import PokerGame from './pokerGame'
import PokerTables from './pokerTables'
import PokerButtons from './pokerButtons'
import { get_cards, getRoom } from '../../../../utils/games'
import { decryptData } from '../../../../utils/crypto'
import { getWindowDimensions, useHandleErrors } from '../../../../utils/utils'
import { checkBets } from '../../../../utils/checkBets'

function PokerDashboard(props){
    const { page, settings, user, template, socket } = props
    const { lang, theme } = settings    

    let game = page.game
    let room = getRoom(game)
    let money = user.money ? decryptData(user.money) : 0
    let items = get_cards()
    let replaceCards = null

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
        let poker_payload_server = {
            game: template,
            uuid: user.uuid,
            room,
            action: e.action,
            stage: e.stage,
            money,
            bet: bets
        }        
        switch(e.action){
            case "start":
            case "call":
            case "raise":
                socket.emit('poker_send', poker_payload_server)
                break
            case "bet":
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
                setGameData(data)
                setAction(data.action)

                if(data.error){
                    handleErrors("error", data.error, lang)
                    return
                }

                if(data.pot){
                    setPot(data.pot)
                }
                switch(data.action){
                    case "preflop_betting":
                        setStartGame(true)
                        break
                    case "fold":
                        setStartGame(false)
                        setPot(0)
                        break
                    case "showdown":
                        setStartGame(false)
                        setShowDown(true)
                        setPot(0)
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
                choice={(e)=>choice(e)} 
            />            
        </div>
    </div>
}

export default PokerDashboard