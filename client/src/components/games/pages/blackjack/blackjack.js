import React, { useEffect, useState } from 'react'
import Header from '../../../partials/header'
import BlackjackButtons from './blackJackButtons'
import BlackjackTable from './blackjackTable'
import BlackjackGame from './blackjackGame'
import { translate } from '../../../../translations/translate'
import { get_cards, getRoom } from '../../../../utils/games'
import { decryptData } from '../../../../utils/crypto'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../../../reducers/popup'

function Blackjack(props){
	const {page, user, settings, socket, handleHandleExit} = props
	const {lang, theme} = settings
    const {game} = page

    const [startGame, setStartGame]= useState(false)
	const [bets, setBets]= useState(0)
    const [gameData, setGameData] = useState(null)
    const [images, setImages] = useState(null)

    let dispatch = useDispatch()
    let items = get_cards()
    
	let money = user.money ? decryptData(user.money) : 0
	let howManyPlayers = 5

    function choice(type){        
        if(type === "start" || type === "hit" || type === "stand" || type === "double_down"  || type === "surrender"){
            let blackjack_payload_server = {
                uuid: user.uuid,
                room: getRoom(game),
                action: type,
                bet: bets
            }
			let payload = null
            switch (type){
                case "start":
                    if(bets === 0){
						payload = {
							open: true,
							template: "error",
							title: "error",
							data: translate({lang: lang, info: "no_bets"}),
							size: "sm",
						}
						dispatch(changePopup(payload))
					} else {
						socket.emit('blackjack_send', blackjack_payload_server)								
						setStartGame(true)
					}
                    break
                case "hit":
                case "stand":
                    blackjack_payload_server.players = gameData.players			
                    socket.emit('blackjack_send', blackjack_payload_server)
                    break
				case "double_down":	//hits once then immediately stands after doubling the bet
                    blackjack_payload_server.players = gameData.players
                    blackjack_payload_server.bet = 2 * bets
                    socket.emit('blackjack_send', blackjack_payload_server)
                    setBets(2 * bets)
                    break
                case "surrender":			
                    let blackjack_payload = {
                        uuid: user.uuid,
                        game: game,
                        money: money - bets,
                        status: "lose",
                        bet: Math.round(bets/2) //when you surrender you lose half your stake. The amount can only be interger
                    }							
                    //props.results(blackjack_payload)
                    setStartGame(false)
                    break
            }
        }
    }

    function updateBets(e){
        setBets(e)
    }

    function handleBack(){        
        handleHandleExit()
        if(startGame){
            //you bet, then started the game and decided to leave the game --> you lose your bet
            let blackjack_payload = {
                uuid: user.uuid,
                game: game,
                money: money - bets,
                status: "lose",
                bet: bets
            }							
            //props.results(blackjack_payload)
        } 
    }

    useEffect(() => {
		const handleBlackjackRead = function(data){
            if(data){
				if(data.action === "start" || data.action === "hit" || data.action === "stand" || data.action === "double_down"  || data.action === "surrender"){
					setGameData(data)
				} else {
					//it means it must be an error
					let payload = {
						open: true,
						template: "error",
						title: "error",
						data: translate({lang: lang, info: data.action}),
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
        Promise.all(promises).then(function(result){
            setImages(result)
        })
    }, [])

    function preaload_images(item){
		return new Promise(function(resolve){
			let image = new Image()
			image.src = item.src
			image.addEventListener("load", function(){
				resolve({suit: item.suit, value: item.value, src: image})
			}, false)
		})
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
                howManyPlayers={howManyPlayers}
            />
            <BlackjackTable 
                {...props} 
                startGame={startGame} 
                bets={bets}
                choice={(e)=>choice(e)} 
                updateBets={(e)=>updateBets(e)}
            />
            <BlackjackButtons 
                {...props} 
                handleBack={()=>handleBack()}
            />
		</div>
	</div>
}

export default Blackjack