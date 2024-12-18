import React, { useEffect, useRef, useState } from 'react'
import { get_craps_bets, getRoom } from '../../../../utils/games'
import GameBets from '../other/gameBets'
import CrapsGame from './crapsGame'
import { decryptData } from '../../../../utils/crypto'
import { checkBets } from '../../../../utils/checkBets'
import { useHandleErrors } from '../../../../utils/utils'
import { useSelector } from 'react-redux'

function Craps(props){
    const { page, user, settings, socket } = props
    const { lang } = settings

    const [betInfo, setBetInfo] = useState({gameType: "pass line", gameOdds: 2, bet: 1})
    const [open, setOpen] = useState(false)
    const [images, setImages] = useState(null)
    const [startGame, setStartGame] = useState(false)
    const [showNumbers, setShowNumbers] = useState([1, 1])
    const [crapsBoardList, setCrapsBoardList] = useState([])
    
    const handleErrors = useHandleErrors()

    let items = get_craps_bets()
    let moneyEncrypted = useSelector(state => state.auth.money)
    let money = moneyEncrypted ? decryptData(moneyEncrypted) : 0
	let game = page.game
    let room = getRoom(game)

    const crapsGameRef = useRef(null)

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
			image.id = item.id
			image.src = item.src
			image.addEventListener("load", ()=>{
				resolve(image)
			}, false)
		})
	}

    function getData(x){
        if(x){
            setBetInfo(x)
        }
	}

    function openTable(){setOpen(true)}
    function closeTable(){setOpen(false)}    

	useEffect(() => {
		setShowNumbers([
            Math.floor((Math.random() * 6) + 1),
            Math.floor((Math.random() * 6) + 1)
        ])
	}, [])

    function gameStart(){
        if(!startGame && checkBets({bets: betInfo.bet, money, lang}, handleErrors)){
            setStartGame(true)
            setCrapsBoardList([])
            rollCraps()
        }
    }

    function updateBets(e){
        setBetInfo({...betInfo, bet: e})
    }

    function rollCraps(){
        let timer
		let state = 1
		let point = 0
		let sum
		let myArray
		let value
		let firstTime = 100
		let subsequentTime = 2000

        switch(betInfo.gameType){
			case "any 7":
				roll(point).then((res)=>{ // one roll, sum must be 7
                    setShowNumbers(res)
					sum = res[0] + res[1]
                    if(sum === 7){
                        check_win_lose('win')
                    } else {
                        check_win_lose('lose')
                    }
                })
				break

			case "hardway 1":
			case "hardway 2":
			case "hardway 3":
			case "hardway 4": // one roll, specific dices
				switch(betInfo.gameType){
					case "hardway 1":
						value = 4
						break
					case "hardway 2":
						value = 10
						break
					case "hardway 3":
						value = 6
						break
					case "hardway 4":
						value = 8
						break
					case "one roll 1":
						value = 3
						break
					case "one roll 2":
						value = 11
						break
					case "one roll 3":
						value = 2
						break
					case "one roll 4":
						value = 12
						break
					default: 
						value = null
				}
				roll(point).then((res)=>{
					setShowNumbers(res)
					sum = res[0] + res[1]
					if(sum === value){
						check_win_lose('win')
					} else {
						check_win_lose('lose')
					}
				})
				break

			case "any craps":
				roll(point).then((res)=>{ // one roll, wins if a 2, 3 or 12
					setShowNumbers(res)
					sum = res[0] + res[1]
					if(sum === 2 || sum === 3 || sum === 12){
						check_win_lose('win')
					} else {
						check_win_lose('lose')
					}
				})
				break

			case "field bet 2":
			case "field bet 3":
			case "field bet 4":
			case "field bet 9":
			case "field bet 10":
			case "field bet 11":
			case "field bet 12":
				myArray = betInfo.gameType.split("field bet ")
				value = parseInt(myArray[1])
				roll(point).then((res)=>{ // one roll bet for 2, 3, 4, 9, 10, 11, 12
                    setShowNumbers(res)
					sum = res[0] + res[1]
					if(sum === value){
						check_win_lose('win')
					} else {
						check_win_lose('lose')
					}
				})
				break

			case "place bet 4":
			case "place bet 5":
			case "place bet 6":
			case "place bet 8":
			case "place bet 9":
			case "place bet 10":
                myArray = betInfo.gameType.split("place bet ")
				value = parseInt(myArray[1])
				gameStrategy("place bet")		
				break
			
			case "6 big 8": //you think you will land a 6 or 8 before landing a 7				
			case "come":
			case "don't come":
			case "don't pass line":
			default: //pass line
				gameStrategy(betInfo.gameType)
				break
		}

        function gameStrategy(type){
            setTimeout(()=>{
                gameLogic(type)					
                timer = setInterval(gameLogic, subsequentTime) // Set up subsequent calls with setInterval for 2000ms
            }, firstTime)
        }
    
        function gameLogic(type){
            switch(type){
                case "place bet":
                    
                    break
                case "6 big 8":
                    
                    break
                case "come":
                    
                    break
                case "don't come":
                    
                    break
                case "don't pass line":
                    
                    break
                default:
                    switch(state){
                        case 1: //A roll is made, and the sum is evaluated for a natural win (7 or 11) or a point is established.
                            roll(point).then((res)=>{
                                setShowNumbers(res)
                                sum = res[0] + res[1]
								if(sum === 7|| sum === 11){
									//Natural
									state = 2
									showOnBoard("Natural!!!", sum)
								} else {
									point = sum
									state = 3
									showOnBoard(res, sum, point)
								}
                            })
                            break
                        case 2: //A win is declared.
                            check_win_lose('win')
                            clearInterval(timer)
                            break
                        case 3: //The player tries to roll the point again or lose by rolling a 7 or craps (2, 3, or 12).
                            roll(point).then((res)=>{
                                setShowNumbers(res)
                                sum = res[0] + res[1]
                                showOnBoard(res, sum, point)
                                if(sum === point){
                                    state = 2
                                } else if(sum === 7){
                                    state = 4
                                } else if(sum === 2 || sum === 3 || sum === 12){
                                    //craps
                                    state = 4
                                    showOnBoard("Craps!!!", sum)
                                } else {
                                    state = 3
                                }
                            })
                            break
                        case 4: //A loss is declared.
                            check_win_lose('lose')
                            clearInterval(timer)
                            break
                        default:
                            break
                    }
            }
        }
    }

    function roll(point){
		return new Promise((resolve)=>{
			getNumbers(point).then((res)=>{
				resolve(res)
			})
		})
	}

    function getNumbers(point){
		return new Promise((resolve)=>{
			let payload={
                uuid: user.uuid, 
                room: room, 
                how_many_dices: 2, 
                point: point, 
                before: [1, 1]
            }
			socket.emit('craps_send', payload)
			socket.on('craps_read', (data)=>{
				if(data){
					resolve(data)
				}
			})
		})
	}

    function showOnBoard(dices, sum, point){
        setCrapsBoardList((prevList) => [...prevList, { dices, sum, point }])
        if(crapsGameRef && crapsGameRef.current){
            crapsGameRef.current.scrollToBottom()
        }
    }

    function check_win_lose(status){
        let bet = betInfo.bet
        setStartGame(false)
        updateBets(1)

        let craps_payload = {
			uuid: user.uuid,
			game,
			status,
			bet,
            money: money - bet
		}
        
        if(status === "win"){
            craps_payload = money + bet
        }

        props.results(craps_payload)
    }

    return <div id="craps" className='game_container'>
        <CrapsGame 
            {...props} 
            betInfo={betInfo} 
            showNumbers={showNumbers}
            startGame={startGame}
            crapsBoardList={crapsBoardList}
            gameStart={()=>gameStart()}
            openTable={()=>openTable()}
            updateBets={(e)=>updateBets(e)}
            ref={crapsGameRef}
        />
        <GameBets 
            {...props} 
            open={open} 
            images={images} 
            getData={(e)=>getData(e)} 
            closeTable={()=>closeTable()} 
        />
    </div>
}

export default Craps