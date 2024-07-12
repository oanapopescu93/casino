import React, {useState, useEffect, useRef} from 'react'
import { translate } from '../../../../translations/translate'
import { Button, Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../../../reducers/popup'
import { getRoom } from '../../../../utils/games'
import { decryptData } from '../../../../utils/crypto'
import $ from "jquery"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlay, faCarrot, faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

function Dice(props){	
	let number = props.number
	const [x, setX] = useState(1)

	useEffect(() => {
		setX(Math.floor((Math.random() * 6) + 1))
	}, [])

	return (
		<div ref={props.innerRef} className="dice_box">
			<div id={'dice'+number} className={"dice dice_" + number + " show_" + x}>
				<div id={"dice_"+number+"_side_one"} className='side one'>
					<div className="dot one_1"></div>
				</div>
				<div id={"dice_"+number+"_side_two"} className='side two'>
					<div className="dot two_1"></div>
					<div className="dot two_2"></div>
				</div>
				<div id={"dice_"+number+"_side_three"} className='side three'>
					<div className="dot three_1"></div>
					<div className="dot three_2"></div>
					<div className="dot three_3"></div>
				</div>
				<div id={"dice_"+number+"_side_four"} className='side four'>
					<div className="dot four_1"></div>
					<div className="dot four_2"></div>
					<div className="dot four_3"></div>
					<div className="dot four_4"></div>
				</div>
				<div id={"dice_"+number+"_side_five"} className='side five'>
					<div className="dot five_1"></div>
					<div className="dot five_2"></div>
					<div className="dot five_3"></div>
					<div className="dot five_4"></div>
					<div className="dot five_5"></div>
				</div>
				<div id={"dice_"+number+"_side_six"} className='side six'>
					<div className="dot six_1"></div>
					<div className="dot six_2"></div>
					<div className="dot six_3"></div>
					<div className="dot six_4"></div>
					<div className="dot six_5"></div>
					<div className="dot six_6"></div>
				</div>					
			</div>
			<div className="dice_box_shadow"></div>
		</div>
	)
}

function CrapsBoardText(props){
	return <>
		{props.list && props.list.length>0 ? <>
			{props.list.map((item, i)=>{
					let dices = item.dices
					let point = item.point
					let sum = item.sum
					if(dices === "Craps!!!" || dices === "Natural!!!"){
						return <div key={i} className="craps_board_text">
							<span className="text text01">{dices}</span>
						</div>
					} else if(point){
						return <div key={i} className="craps_board_text">
							<span className="text text01">Dices:</span>
							<span className="text text02">{dices[0]}, {dices[1]}</span>
							<span className="text text03">Sum:</span>
							<span className="text text04">{sum}</span>
							<span className="text text05">Point:</span>
							<span className="text text06">{point}</span>
						</div>
					} else {
						return <div key={i} className="craps_board_text">
							<span className="text text01">Dices:</span>
							<span className="text text02">{dices[0]}, {dices[1]}</span>
							<span className="text text03">Sum:</span>
							<span className="text text04">{sum}</span>
						</div>	
					}
			})}
		</> : null}
	</>
}

function Craps(props){
	const {startGame, lang, socket, bets, page} = props
    const [crapsBoardText, setCrapsBoardText] = useState(null)
	const [crapsBoardList, setCrapsBoardList] = useState([])
	let game_type = bets ? bets.game_type : "pass line"
	// let game_odds = bets ? bets.game_odds : 2
	let game = page.game
	let room = getRoom(game)

    let craps_board = useRef(null)
	const dice1 = useRef(null)
	const dice2 = useRef(null)
	let dice_array = [dice1, dice2]
	let dicesNumber = [] 
	
	useEffect(() => {	
		if(startGame){
			start_game()
		}
	}, [startGame]) 

	useEffect(() => {	
		if(crapsBoardText){
			setCrapsBoardList([... crapsBoardList, crapsBoardText])
		}		
	}, [crapsBoardText]) 

	function roll(point){
		return new Promise((resolve, reject)=>{
			getNumbers(point).then((res)=>{
				if(dice_array && dice_array.length>0 && res && res.length>0){
					for(let i in res){
						if(dice_array[i] && dice_array[i].current){
							let dice = $(dice_array[i].current).children()[0]
							let roll = res[i]			
							animate(dice, roll)
						}
					}					
					dicesNumber = res
					resolve(res)
				} else {
					resolve(false)
				}
			})
		})
	}

	function getNumbers(point){
		return new Promise((resolve, reject)=>{
			let dice_number1 = getDiceNumber(dice_array[0])
			let dice_number2 = getDiceNumber(dice_array[1])
			let payload={uuid: props.user.uuid, room: room, how_many_dices: 2, point: point, before: [dice_number1, dice_number2]}
			socket.emit('craps_send', payload)
			socket.on('craps_read', (data)=>{
				if(data){
					resolve(data)
				}
			})
		})
	}

	function animate(dice, roll){
		if(dice && roll){			
			for (let i = 1; i <= 6; i++) {
				$(dice).removeClass('show_' + i)
				if (roll === i) {
					$(dice).addClass('show_' + i)
				}
			}
		}
	}

	function getDiceNumber(dice){
		let x
		if(dice && dice.current){
			let child = $(dice.current).children()[0]
			let classList = $(child).attr('class').split(/\s+/)
			for(let i in classList){
				if(classList[i].indexOf("show_") > -1){
					x = parseInt(classList[i].replace("show_", ""))
					break
				}
			}
		}
		return x
	}

	function show_on_board(dicesNumber, sum, point){
		setCrapsBoardText({dices: dicesNumber, sum: sum, point: point})	
		scrollToBottom()
	}

	function scrollToBottom(){		
		if(craps_board && craps_board.current){
			let board = craps_board.current
			let height = $(board)[0].scrollHeight
			$(board).animate({scrollTop: height},"fast")
		}
	}

	function check_win_lose(result){
		props.winLose(result)
	}

	function start_game(){
		let timer
		let state = 1
		let point = 0
		let sum
		let myArray
		let value
		// let time = 2000
		let firstTime = 100
		let subsequentTime = 2000
		setCrapsBoardText(null)
		setCrapsBoardList([])
		switch(game_type) {
			case "any 7":
					roll(point).then(()=>{ // one roll, sum must be 7
						sum = dicesNumber[0] + dicesNumber[1]
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
				switch(game_type) {
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
				roll(point).then(()=>{
					sum = dicesNumber[0] + dicesNumber[1]
					if(sum === value){
						check_win_lose('win')
					} else {
						check_win_lose('lose')
					}
				})
				break

			case "any craps":
				roll(point).then(()=>{ // one roll, wins if a 2, 3 or 12
					sum = dicesNumber[0] + dicesNumber[1]
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
				myArray = game_type.split("field bet ")
				value = parseInt(myArray[1])
				roll(point).then(()=>{ // one roll bet for 2, 3, 4, 9, 10, 11, 12
					sum = dicesNumber[0] + dicesNumber[1]
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
				myArray = game_type.split("place bet ")
				value = parseInt(myArray[1])
				gameStrategy("place bet")				
				break
			
			case "6 big 8": //you think you will land a 6 or 8 before landing a 7				
			case "come":
			case "don't come":
			case "don't pass line":
			default: //pass line
				gameStrategy(game_type)
				break
		}

		function gameStrategy(type){
			setTimeout(()=>{
				gameLogic(type)					
				timer = setInterval(gameLogic, subsequentTime) // Set up subsequent calls with setInterval for 2000ms
			}, firstTime)
		}

		function gameLogic(type){
			switch(type) {
				case "place bet":
					switch(state) {
						case 1:
							roll(point).then((res)=>{
								sum = dicesNumber[0] + dicesNumber[1]
								if(sum === value){
									state = 2
								} else if(sum === 7){
									state = 4
								} else {
									point = sum
									state = 3
									show_on_board(dicesNumber, sum)
								}
							})
							break
						case 2:
							check_win_lose('win')
							clearInterval(timer)
							break
						case 3:
							roll(point).then((res)=>{
								sum = dicesNumber[0] + dicesNumber[1]
								show_on_board(dicesNumber, sum)
								if (sum === value) {
									state = 2
								} else if (sum === 7) {
									state = 4
								} else if (sum === 2 || sum === 3 || sum === 12) {
									state = 4
								} else {
									state = 3
								}
							})
							break
						case 4:
							check_win_lose('lose')
							clearInterval(timer)
							break
						default:
					}
					break
				case "6 big 8":
					switch(state) {
						case 1:
							roll(point).then((res)=>{
								sum = dicesNumber[0] + dicesNumber[1]
								if(sum === 6|| sum === 8){
									state = 2
								} else if (sum === 7) {
									state = 4
								} else {
									state = 3
								}
							})
							break
						case 2:
							check_win_lose('win')
							clearInterval(timer)
							break
						case 3:
							roll(point).then((res)=>{
								sum = dicesNumber[0] + dicesNumber[1]
								show_on_board(dicesNumber, sum)
								if (sum === 7) {
									state = 4
								}
							})
							break
						case 4:
							check_win_lose('lose')
							clearInterval(timer)
							break
						default:
					}
					break
				case "come":
					switch(state) {
						case 1:
							roll(point).then((res)=>{
								sum = dicesNumber[0] + dicesNumber[1]
								if(sum === 7|| sum === 11){
									state = 2
								} else {
									point = sum
									state = 3
									show_on_board(dicesNumber, sum, point)
								}
							})
							break
						case 2:
							check_win_lose('win')
							clearInterval(timer)
							break
						case 3:
							roll(point).then((res)=>{
								sum = dicesNumber[0] + dicesNumber[1]
								show_on_board(dicesNumber, sum, point)
								if (sum === point) {
									state = 2
								} else if (sum === 7) {
									state = 4
								} else if (sum === 2 || sum === 3 || sum === 12) {
									state = 4
								} else {
									state = 3
								}
							})
							break
						case 4:
							check_win_lose('lose')
							clearInterval(timer)
							break
						default:
					}
					break
				case "don't come":
					switch(state) {
						case 1:
							roll(point).then((res)=>{
								sum = dicesNumber[0] + dicesNumber[1]	
								if(sum === 2 || sum === 3){
									state = 2
								} else {
									point = sum
									state = 3
									show_on_board(dicesNumber, sum, point)
								}
							})
							break
						case 2:
							check_win_lose('win')
							clearInterval(timer)
							break
						case 3:
							roll(point).then((res)=>{
								sum = dicesNumber[0] + dicesNumber[1]
								show_on_board(dicesNumber, sum, point)
								if (sum !== point) {
									state = 2
								} else if (sum === 12) {
									check_win_lose('push')
									clearInterval(timer)
								} else if (sum === 7|| sum === 11) {
									state = 2
								} else {
									state = 3
								}
							})
							break
						case 4:
							check_win_lose('lose')
							clearInterval(timer)
							break
						default:
					}
					break
				case "don't pass line":
					switch(state) {
						case 1:
							roll(point).then((res)=>{
								sum = dicesNumber[0] + dicesNumber[1]		
								if(sum === 2 || sum === 3){
									//Natural
									state = 2
									show_on_board("Natural!!!", sum)
								} else {
									point = sum
									state = 3
									show_on_board(dicesNumber, sum, point)
								}
							})
							break
						case 2:
							check_win_lose('win')
							clearInterval(timer)
							break
						case 3:
							roll(point).then((res)=>{
								sum = dicesNumber[0] + dicesNumber[1]
								show_on_board(dicesNumber, sum, point)
								if (sum !== point) {
									state = 2
								} else if (sum === 12) {
									check_win_lose('push')
									clearInterval(timer)
								} else if (sum === 7|| sum === 11) {
									//Craps
									state = 2
									show_on_board("Craps!!!", sum)
								} else {
									state = 3
								}
							})
							break
						case 4:
							check_win_lose('lose')
							clearInterval(timer)
							break
						default:
					}
					break
				default:
					switch(state) {
						case 1:
							roll(point).then((res)=>{
								sum = dicesNumber[0] + dicesNumber[1]
								if(sum === 7|| sum === 11){
									//Natural
									state = 2
									show_on_board("Natural!!!", sum)
								} else {
									point = sum
									state = 3
									show_on_board(dicesNumber, sum, point)
								}
							})
							break
						case 2:
							check_win_lose('win')
							clearInterval(timer)
							break
						case 3:
							roll(point).then((res)=>{
								sum = dicesNumber[0] + dicesNumber[1]
								show_on_board(dicesNumber, sum, point)
								if (sum === point) {
									state = 2
								} else if (sum === 7) {
									state = 4
								} else if (sum === 2 || sum === 3 || sum === 12) {
									//craps
									state = 4
									show_on_board("Craps!!!", sum)
								} else {
									state = 3
								}
							})
							break
						case 4:
							check_win_lose('lose')
							clearInterval(timer)
							break
						default:
					}
			}
		}
	}
	
	return <>
		<Row>
			<Col sm={12}>
				<h3 className="craps_subtitle"><span>{translate({lang: lang, info: "bet_type"})}: </span>{game_type}</h3>
			</Col>
		</Row>
        <Row>
            <Col sm={2} />
            <Col sm={8}>
				<Row>
					<Col lg={6}>
						<div className="dice_container">
							<Dice innerRef={dice1} number={1} />
							<Dice innerRef={dice2} number={2} />
						</div>
						<div className="button_action_group">
							<div className="tooltip">
								<Button 
									type="button"
									className="mybutton round button_transparent shadow_convex"
									onClick={()=>props.handleGameStart()}
								><FontAwesomeIcon icon={faPlay} /></Button>
								<span className="tooltiptext">{translate({lang: props.settings.lang, info: "start"})}</span>
							</div>
							<div className="tooltip">
								<Button 
									type="button"
									className="mybutton round button_transparent shadow_convex"
									onClick={()=>props.handleOpenTable()}
								><FontAwesomeIcon icon={faCarrot} /></Button>
								<span className="tooltiptext">{translate({lang: props.settings.lang, info: "settings"})}</span>
							</div>
							<div className="tooltip">
								<Button 
									type="button"
									className="mybutton round button_transparent shadow_convex"
									onClick={()=>props.handleHandleExit()}
								><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
								<span className="tooltiptext">{translate({lang: props.settings.lang, info: "back"})}</span>
							</div>
						</div>
					</Col>
					<Col lg={6} className="craps_board_container">
						<div className="craps_board_box">
							<div readOnly id="craps_board" className="craps_board" ref={craps_board}>
								<CrapsBoardText list={crapsBoardList} />
							</div>
						</div>
					</Col>
				</Row>
            </Col>
            <Col sm={2} />
        </Row>
	</>	
}

let craps_status = false
function CrapsGame(props){
	let dispatch = useDispatch()
	const [start, setStart] = useState(false)
	let money = props.user.money ? decryptData(props.user.money) : 0
	let game = props.page.game	

	useEffect(() => {
		return () => clear()
    }, [])

	function clear(){
		if(craps_status){
			let craps_payload = {
				uuid: props.user.uuid,
				game: game,
				money: money - 1,
				status: 'lose',
				bet: 1
			}
			if(typeof props.results === "function"){
				props.results(craps_payload)
			}
		}
		
	}

	function gameStart(){
		if(!start && props.bets){
			setStart(true)
			craps_status = true
		} else {
			let payload = {
				open: true,
				template: "error",
				title: "error",
				data: translate({lang: props.settings.lang, info: "no_bets"})
			}
			dispatch(changePopup(payload))
		}
    }

	function winLose(results){
		let pay = money
		if(results === "win"){
			pay = pay + 1
		} else if(results === "lose"){
			pay = pay - 1
		}
		let craps_payload = {
			uuid: props.user.uuid,
			game: game,
			money: pay,
			status: results,
			bet: 1
		}
		if(typeof props.results === "function"){
			props.results(craps_payload)
		}
		setStart(false)
		craps_status = false
	}

	function openTable(){
		if(!start && money && money>0){
			props.openTable()
		} else {
			let payload = {
				open: true,
				template: "error",
				title: "error",
				data: translate({lang: props.settings.lang, info: "no_money"})
			}
			dispatch(changePopup(payload))
		}
	}

    return <div className="game_container craps_container">
		<Craps 
			{...props} 
			startGame={start} 
			winLose={(e)=>winLose(e)} 
			handleGameStart={()=>gameStart()}
			handleOpenTable={()=>openTable()}
		/>
    </div>
}

export default CrapsGame