import React, { useEffect, useState } from 'react'
import GameBets from '../other/gameBets'
import RouletteGame from './rouletteGame'
import { decryptData } from '../../../../utils/crypto'
import { get_roulette_bets, getRoom } from '../../../../utils/games'
import { checkBets } from '../../../../utils/checkBets'
import { getWindowDimensions, useHandleErrors } from '../../../../utils/utils'
import carrot_img from '../../../../img/icons/carrot_icon.png'
import { useSelector } from 'react-redux'

let rouletteBetsInfo = null
function Roulette(props){
    const { settings, user, page, socket } = props
    const { lang } = settings

    const [open, setOpen] = useState(false)
    const [bets, setBets] = useState(0)
    const [images, setImages] = useState(null)
    const [tokenImages, setTokenImages] = useState(null)
    const [startGame, setStartGame] = useState(false)
    const [betsInfo, setBetsInfo] = useState(null)
    const [gameInfo, setGameInfo] = useState(null)
    const [spin, setSpin] = useState(false)
    const [width, setWidth] = useState(getWindowDimensions().width)
    const [update, setUpdate] = useState(0)

    const handleErrors = useHandleErrors()

    let moneyEncrypted = useSelector(state => state.auth.money)
    let money = moneyEncrypted ? decryptData(moneyEncrypted) : 0
	let game = page.game
    let room = getRoom(game)
    let items = get_roulette_bets()

    function openTable(){setOpen(true)}
    function closeTable(){setOpen(false)}

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

    function gameStart(){
        if(!startGame && checkBets({bets, money, lang}, handleErrors)){
            setStartGame(true)
            let roulette_payload_server = {
                uuid: user.uuid,
                room,
                bet: bets,
            }
            socket.emit('roulette_send', roulette_payload_server)
        }
    }

    function getData(x){
        if(x){
            setBetsInfo(x)
            setBets(getTotalBets(x))
            rouletteBetsInfo = x
        }
    }

    function getTotalBets(your_bets){
        let total = 0
        for(let i in your_bets){
            total = total + your_bets[i].bet_value
        }
        return total
    }

    useEffect(() => {
		const handleRouletteRead = (res)=>{
            if(res && res.arc && res.spin_time && res.ball_speed){
                let data = {...res, speed: 1}
				if (window.innerWidth < 960){
					if(window.innerHeight < window.innerWidth){
						//landscape
						data.speed = 0.0173
					} else {
						//portrait
						data.speed = 0.018
					}
				} 
                setGameInfo(data)
                setSpin(true)
			}
		}
		socket.on('roulette_read', handleRouletteRead)
		return () => {
            socket.off('roulette_read', handleRouletteRead)
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
        let promiseToken = []
        promiseToken.push(preaload_images({id: "carrot_img", src: carrot_img}))
        Promise.all(promiseToken).then((result)=>{
            setTokenImages(result)
        })
    }, [])

    function preaload_images(item){
		return new Promise((resolve)=>{
			let image = new Image()
			image.id = item.id
			image.src = item.src
			image.addEventListener("load", ()=>{
				resolve(image)
			}, false)
		})
	}

    function handleEndGame(e){
        const {betsInfo, winNr} = e
        let elem01 = JSON.parse(JSON.stringify(betsInfo))
		let elem02 = JSON.parse(JSON.stringify(winNr))
        let money_history = money
        let totalBets = getTotalBets(betsInfo)

        for(let i in elem01){		
			if(isNaN(elem01[i].text) === false){
				if(elem01[i].text.toString() === elem02.nr.toString()){
					money_history = money_history + elem01[i].bet_value
				} else {
					money_history = money_history - elem01[i].bet_value
				}
			} else {
                switch (elem01[i].text) {
					case "1st 12":	
						if(elem02.nr > 0 && elem02.nr < 13){
							money_history = money_history + elem01[i].bet_value
						} else {
							money_history = money_history - elem01[i].bet_value	
						}
						break
					case "2st 12":	
						if(elem02.nr > 12 && elem02.nr < 25){
							money_history = money_history + elem01[i].bet_value
						} else {
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "3st 12":	
						if(elem02.nr > 24 && elem02.nr < 37){
							money_history = money_history + elem01[i].bet_value
						} else {
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "1-18":
						if(elem02.nr > 0 && elem02.nr < 19){
							money_history = money_history + elem01[i].bet_value
						} else {
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "Even":
						if(elem02.nr % 2 === 0){
							money_history = money_history + elem01[i].bet_value
						} else {
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "reds":
						if(elem02.color === "red"){
							money_history = money_history + elem01[i].bet_value
						} else {
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "blacks":
						if(elem02.color === "black"){
							money_history = money_history + elem01[i].bet_value
						} else {
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "Odd":
						if(elem02.nr % 2 !== 0){
							money_history = money_history + elem01[i].bet_value
						} else {
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "19-36":
						if(elem02.nr > 18 && elem02.nr < 37){
							money_history = money_history + elem01[i].bet_value
						} else {
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "2 to 1a":						
						for(let k=0; k<12; k++){
							let x = 3 * k + 3
							if(x === parseInt(elem02.nr)){
								money_history = money_history + elem01[i].bet_value
							} else {
								money_history = money_history - elem01[i].bet_value
							}							
						}
						break
					case "2 to 1b":
						for(let k=0; k<12; k++){
							let x = 3 * k + 2
							if(x === parseInt(elem02.nr)){
								money_history = money_history + elem01[i].bet_value
							} else {
								money_history = money_history - elem01[i].bet_value
							}							
						}
						break
					case "2 to 1c":
						for(let k=0; k<12; k++){
							let x = 3 * k + 1
							if(x === parseInt(elem02.nr)){
								money_history = money_history + elem01[i].bet_value
							} else {
								money_history = money_history - elem01[i].bet_value
							}							
						}
						break
					default:
						break
				}
            }
        }
        win_lose(money_history, totalBets)
    }

    function win_lose(money_history, totalBets){        
        if(rouletteBetsInfo){
            let status = "lose"
            if(money < money_history){
                status = "win"
            }		
            let roulette_payload = {
                uuid: user.uuid,
                game: game,
                money: money_history,
                status: status,
                bet: totalBets
            }
            
            resetGame()
            props.results(roulette_payload)
        }
    }

    function leave(){
        let totalBets = getTotalBets(rouletteBetsInfo)
        let roulette_payload = {
            uuid: user.uuid,
            game: game,
            money: money - totalBets,
            status: "lose",
            bet: totalBets
        }

        resetGame()
        props.results(roulette_payload)
    }

    useEffect(() => {
		return () => {
			leave()
		}
	}, [])

    function resetGame(){
        setBets(0)
        setStartGame(false)
        setBetsInfo(null)
        setGameInfo(null)
        setSpin(false)
        setUpdate(prevUpdate => prevUpdate + 1)
        rouletteBetsInfo = null
    }

    return <div id="roulette" className='game_container'>
        <RouletteGame
            {...props}
            bets={bets}
            betsInfo={betsInfo}
            gameInfo={gameInfo}
            width={width}
            spin={spin}
            openTable={()=>openTable()} 
            gameStart={()=>gameStart()}
            handleEndGame={(e)=>handleEndGame(e)}
        />
        <GameBets 
            {...props} 
            open={open} 
            images={images} 
            tokenImages={tokenImages}
            bets={bets} 
            width={width}
            update={update}
            getData={(e)=>getData(e)} 
            closeTable={()=>closeTable()} 
        />
    </div>
}

export default Roulette