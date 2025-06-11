import React, { useEffect, useState } from 'react'
import Header from '../../../partials/header'
import BlackjackButtons from './blackJackButtons'
import BlackjackTable from './blackjackTable'
import BlackjackGame from './blackjackGame'
import { translate } from '../../../../translations/translate'
import { get_cards, getRoom } from '../../../../utils/games'
import { decryptData } from '../../../../utils/crypto'
import { useDispatch, useSelector } from 'react-redux'
import { changePopup } from '../../../../reducers/popup'
import { getWindowDimensions, useHandleErrors } from '../../../../utils/utils'
import { checkBets } from '../../../../utils/checkBets'

function Blackjack(props){
	const {page, user, settings, socket, handleHandleExit} = props
	const {lang, theme} = settings
    const {game} = page

    const handleErrors = useHandleErrors()

    const [startGame, setStartGame]= useState(false)
	const [bets, setBets]= useState(1)
    const [gameData, setGameData] = useState(null)
    const [images, setImages] = useState(null)
    const [width, setWidth] = useState(getWindowDimensions().width)

    let dispatch = useDispatch()
    let items = get_cards()
    
	let moneyEncrypted = useSelector(state => state.auth.money)
    let money = moneyEncrypted ? decryptData(moneyEncrypted) : 0
	let howManyPlayers = 5

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

    function choice(action){
        if(action === "start"){
            if(!checkBets({bets, money, lang}, handleErrors)){
                return
            }
        }  

        if(action === "start" || action === "hit" || action === "stand" || action === "double_down"  || action === "surrender"){
            let blackjack_payload_server = {
                uuid: user.uuid,
                room: getRoom(game),
                action,
                bet: bets,
                howManyPlayers
            }			
            switch (action){
                case "start":
                    socket.emit('blackjack_send', blackjack_payload_server)								
					setStartGame(true)
                    break
                case "hit":
                case "stand":
                case "surrender":	
                    blackjack_payload_server.players = gameData.players			
                    socket.emit('blackjack_send', blackjack_payload_server)
                    break
				case "double_down":	//hits once then immediately stands after doubling the bet
                    blackjack_payload_server.players = gameData.players
                    blackjack_payload_server.bet = 2 * bets
                    socket.emit('blackjack_send', blackjack_payload_server)
                    setBets(2 * bets)
                    break
            }
        }
    }

    function updateBets(e){
        setBets(e)
    }

    function handleBack(){
        if(startGame){
            //you bet, then started the game and decided to leave the game --> you lose your bet
            let blackjack_payload = {
                uuid: user.uuid,
                game: game,
                money: money - bets,
                status: "lose",
                bet: bets
            }							
            props.results(blackjack_payload)
        }
        handleHandleExit()
    }

    useEffect(() => {
		const handleBlackjackRead = (data)=>{
            if(data){
				if(data.action === "start" || data.action === "hit" || data.action === "stand" || data.action === "double_down"  || data.action === "surrender"){
					setGameData(data)
				} else {
					//it means it must be an error
					let payload = {
						open: true,
						template: "error",
						title: "error",
						data: translate({lang, info: data.action}),
						size: "sm",
					}
					dispatch(changePopup(payload))
				}
				
            }
        }
		socket.on('blackjack_read', handleBlackjackRead)
		return () => {
            socket.off('blackjack_read', handleBlackjackRead)
        }
    }, [socket])

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

    function handleReset(){
        setStartGame(false)
        setBets(0)
        setGameData(null)
    }

    function handleBets(){
        setBets(0)
    }

    return <div id="baccarat" className='game_container'>
        <div className='game_box'>
            <Header template={"game"} details={page} lang={lang} theme={theme}/>            
            <BlackjackGame 
                {...props} 
                startGame={startGame} 
                bets={bets}
                gameData={gameData}
                images={images}                
                width={width}
                money={money}
                howManyPlayers={howManyPlayers}
                handleBets={()=>handleBets()}
            />
            <BlackjackTable 
                {...props} 
                startGame={startGame} 
                bets={bets}
                gameData={gameData}
                choice={(e)=>choice(e)} 
                updateBets={(e)=>updateBets(e)}                
            />
            <BlackjackButtons 
                {...props} 
                gameData={gameData}
                handleBack={()=>handleBack()}
                handleReset={()=>handleReset()}
            />
		</div>
	</div>
}

export default Blackjack