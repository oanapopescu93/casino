import React, {useEffect} from 'react'
import { useDispatch} from 'react-redux'
import { translate } from '../../../../translations/translate'
import { Button } from 'react-bootstrap'
import { changePopup } from '../../../../reducers/popup'
import { draw_dot, getDistance_between_entities, getRoom } from '../../../../utils/games'
import { decryptData } from '../../../../utils/crypto'
import { changeRouletteLuckyBet } from '../../../../reducers/games'
import $ from 'jquery'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlay, faCarrot, faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'
import Header from '../../../partials/header'

function roulette_game(props){
    let self = this	
    let canvas
    let ctx    
	const dispatch = props.dispatch	

    let startGame = false

    let roulette_radius_x = 240
	let roulette_radius_y = 240
    let numbers = [] 
	let colors = []
	let startAngle = -1.65
	let startAngle01 = 0
	let arc = 0
	let outsideRadius = 200
	let textRadius = outsideRadius-20
	let insideRadius = outsideRadius-30
    let roulettePos = []
    let rouletteType = props.page.game.table_type

	let circle = {radius: textRadius*0.6, angle:0}
	let ball = {x:70, y:roulette_radius_x, speed:0.05, width:10}

	let font_bold_10 = 'bold 10px sans-serif'
	let font_bold_12 = 'bold 12px sans-serif'
	let font_bold_14 = 'bold 14px sans-serif'

    let spin_clear = [0, 0, 0, 0]
    let radiantLine01 = []
	let radiantLine02 = []
	let radiantLine03 = []
	let text_offset = 0   

    this.ready = ()=>{
        self.createCanvas()
		self.chooseRouletteType()
        self.start()
    }

    this.createCanvas = ()=>{	
		canvas = document.getElementById("roulette_canvas")	
		ctx = canvas.getContext("2d")
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape
				canvas.width = 260
				canvas.height = 260
				roulette_radius_x = 135
				roulette_radius_y = 135
				outsideRadius = 110		
			} else {
				//small portrait
				canvas.width = 250
				canvas.height = 250
				roulette_radius_x = 125
				roulette_radius_y = 125
				outsideRadius = 100					
			}
			
			textRadius = outsideRadius-15
			insideRadius = outsideRadius-20

			radiantLine01 = [-65, 15]
			radiantLine02 = [-105, -35]
			radiantLine03 = [-105, -85]	

            circle = {radius: textRadius-15, angle:0}
			ball = {x:70, y:roulette_radius_x, speed:0.05, width:6}

			font_bold_10 = 'bold 8px sans-serif'
			font_bold_12 = 'bold 10px sans-serif'
			font_bold_14 = 'bold 12px sans-serif'
			text_offset = 15	
		} else {
			//big
			canvas.width = 480
			canvas.height = 480
			
			roulette_radius_x = canvas.width/2
			roulette_radius_y = 240
			outsideRadius = 200
			textRadius = outsideRadius-20
			insideRadius = outsideRadius-30
			
			circle = {radius: textRadius-22, angle:0}
			ball = {x:70, y:roulette_radius_x, speed:0.05, width:10}
			
			font_bold_10 = 'bold 10px sans-serif'
			font_bold_12 = 'bold 12px sans-serif'
			font_bold_14 = 'bold 14px sans-serif'

			radiantLine01 = [-60, 20]
			radiantLine02 = [-60, -160]
			radiantLine03 = [-160, -200]
			text_offset = 25
		}
		spin_clear = [0, 0, canvas.width, canvas.height]
	}
	
	this.chooseRouletteType = ()=>{			
		if(rouletteType === 'european'){
			colors = ["green", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red"]
			numbers = ["0", "32", "15", "19", "4", "21", "2", "25", "17", "34", "6", "27", "13", "36", "11", "30", "8", "23", "10", "5", "24", "16", "33", "1", "20", "14", "31", "9", "22", "18", "29", "7", "28", "12", "35", "3", "26"] //37
			arc = Math.PI / (numbers.length/2)		
		} else {
			colors = ["green", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "green", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red"]
			numbers = ["0", "28", "9", "26", "30", "11", "7", "20", "32", "17", "5", "22", "34", "15", "3", "24", "36", "13", "1", "00", "27", "10", "25", "29", "12", "8", "19", "31", "18", "6", "21", "33", "16", "4", "23", "35", "14", "2"] //38
			arc = Math.PI / (numbers.length/2)
		}		
	}

	this.start = ()=>{			
		ctx.clearRect(0,0, canvas.width, canvas.height)

        ctx.font = font_bold_10
		ctx.shadowColor = "black"
		ctx.shadowOffsetX = 0
		ctx.shadowOffsetY = 0

		self.drawRoulette()	
		ctx.font = font_bold_14
	}

    this.drawRoulette = ()=>{
        roulettePos = []
		
		ctx.shadowBlur = 10
		draw_dot(ctx, roulette_radius_x, roulette_radius_y, outsideRadius*1.05, 0, 2 * Math.PI, false, '#a87b51', 15, '#5e391c')	
		draw_dot(ctx, roulette_radius_x, roulette_radius_y, outsideRadius*0.97, 0, 2 * Math.PI, false, 'black', 15, 'black')			
		ctx.shadowBlur = 0

		ctx.font = font_bold_12	
		drawRouletteHoles(outsideRadius, insideRadius, numbers.length, colors, true, startAngle)
		ctx.font = font_bold_14
		drawRouletteHoles(insideRadius-1, insideRadius*0.7, numbers.length, "dark", false, startAngle)
		
		radiantLine(numbers.length, 1, "gold", radiantLine01, startAngle)		
		
		drawRouletteHoles(insideRadius*0.7-1, 0, 12, "grey", false, startAngle01)
		radiantLine(12, 1, "#4d4d4d", radiantLine02, startAngle01)

		drawRouletteHoles(20, 0, 8, "gold", false, startAngle01)	
		radiantLine(8, 1, "#b99813", radiantLine03, startAngle01)
    }

    function drawRouletteHoles(outsideRadius, insideRadius, how_many, colors, text, startAngle){			
		for(let i = 0; i < how_many; i++) {
			arc = Math.PI / (how_many/2)
			let angle = startAngle + i * arc			
		  
			ctx.beginPath()	  
			ctx.arc(roulette_radius_x, roulette_radius_y, outsideRadius, angle, angle + arc, false)   //ctx.arc(x,y,r,sAngle,eAngle,counterclockwise)
			ctx.arc(roulette_radius_x, roulette_radius_y, insideRadius, angle + arc, angle, true)
			
			if(colors === "grey"){
				if(i%2 === 0){
					ctx.fillStyle = "gray"
				} else {
					ctx.fillStyle = "#999"
				}
			} else if(colors === "gold"){
				if(i%2 === 0){
					ctx.fillStyle = "#f0d875"
				} else {
					ctx.fillStyle = "#eac739"
				}		
			} else if(colors === "dark"){
				if(rouletteType === "european"){
					if(i === 0){
						ctx.fillStyle = "darkgreen"
					} else {
						if(i%2 === 0){
							ctx.fillStyle = "black"
						} else {
							ctx.fillStyle = "darkred"
						}
					}
				} else if(rouletteType === "american"){
					if(i === 0 || i === 19){
						ctx.fillStyle = "darkgreen"
					} else {
						if(i%2 === 0){
							ctx.fillStyle = "darkred"
						} else {
							ctx.fillStyle = "black"
						}
					}
				}				
			} else {
				ctx.fillStyle = colors[i]
			}
			
			ctx.fill()
			ctx.save()		 

			if(text){
				ctx.fillStyle = "white"
				ctx.translate(roulette_radius_x + Math.cos(angle + arc / 2) * textRadius, roulette_radius_y + Math.sin(angle + arc / 2) * textRadius)
				ctx.rotate(angle + arc / 2 + Math.PI / 2)
				let text = numbers[i]
				ctx.fillText(text, -ctx.measureText(text).width / 2, 0)
				roulettePos.push({x: roulette_radius_x + Math.cos(angle + arc / 2) * (textRadius-text_offset), y: roulette_radius_y + Math.sin(angle + arc / 2) * (textRadius-text_offset), nr: text, color: colors[i]})
			}
		  
			ctx.restore()
			ctx.closePath()
		}	
	}
	
	function radiantLine(how_many, line, color, offset, startAngle){
		for(let i = 0; i < how_many; i++) {
			arc = Math.PI / (how_many/2)
			let angle = startAngle + i * arc		
		  
			ctx.beginPath()
			
			ctx.strokeStyle = color
			ctx.lineWidth = line
			ctx.moveTo(roulette_radius_x + Math.cos(angle + arc) * (textRadius+offset[0]), roulette_radius_y + Math.sin(angle + arc) * (textRadius+offset[0]))
			ctx.lineTo(roulette_radius_x + Math.cos(angle + arc) * (textRadius+offset[1]), roulette_radius_y + Math.sin(angle + arc) * (textRadius+offset[1]))
			ctx.stroke()
			ctx.closePath()
		}
	} 

    this.spin = (data)=>{  
		startGame = true 

		const arc = data.arc
		const spinTime = data.spin_time || Math.floor(Math.random() * (800 - 300)) + 300
		const spinTimeMore  = 200
		const monkey = data.monkey
		const monkeyWait = 200

		let spinFrame = 0

		window.requestAnimFrame = (()=>{
			return  window.requestAnimationFrame	||
			window.webkitRequestAnimationFrame		||
			window.mozRequestAnimationFrame			||
			((callback) => window.setTimeout(callback, 1000 / 60))
	    })()
	  
	    function spinRoulette() {
			if (!ctx) return
			
			ctx.clearRect(...spin_clear)

			if (spinFrame > spinTime + spinTimeMore) {
				endSpin()
				return
			}
	
			if (spinFrame > spinTime) {
				// Final phase
				updateWheelAndBall(arc - 0.04)
				spinFrame++;
			} else {
				// Spinning phases
				updateWheelAndBallBasedOnFrame()
				spinFrame++
			}
	
			// Monkey logic
			if (monkeyLogic(monkey, spinFrame, spinTime, monkeyWait)) {
				spinFrame = spinTime + 1 // Force end spin
			}
	
			// Continue animation
			window.requestAnimFrame(spinRoulette)
	  	}

	  	spinRoulette()

		function updateWheelAndBall(arcDelta) {
			self.rotateWheel(arcDelta)
	
			const rouletteIndex = parseInt(self.closest_nr(ball, roulettePos, "nr"))
			const winNr = roulettePos[rouletteIndex]
	
			circle.angle -= arcDelta
			self.rotateBall(winNr.x, winNr.y)
		}

		function updateWheelAndBallBasedOnFrame() {
			const phase = determineSpinPhase(spinFrame, spinTime)
	
			switch (phase) {
				case 1:
					self.rotateWheel(arc)
					circle.angle += ball.speed
					break
				case 2:
					self.rotateWheel(arc - 0.01)
					circle.angle += ball.speed - 0.01
					break
				case 3:
					self.rotateWheel(arc - 0.02)
					circle.angle += ball.speed - 0.02
					break
				case 4:
					self.rotateWheel(arc - 0.03)
					circle.angle += ball.speed - 0.03
					break
				case 5:
					self.rotateWheel(arc - 0.04)
					circle.angle += ball.speed - 0.04
					break
				default:
					break
			}
	
			self.rotateBall(ball.x, ball.y)
		}

		function determineSpinPhase(frame, totalTime) {
			const halfTime = totalTime / 2
			const twoThirdsTime = (2 * totalTime) / 3
			const fiveSixthsTime = (5 * totalTime) / 6
	
			if (frame <= halfTime) return 1
			if (frame > halfTime && frame <= twoThirdsTime) return 2
			if (frame > twoThirdsTime && frame <= fiveSixthsTime) return 3
			if (frame > fiveSixthsTime && frame <= totalTime - 20) return 4
			if (frame > totalTime - 20 && frame <= totalTime - 10) return 5
	
			return 0
		}
	
		function monkeyLogic(monkey, frame, totalTime, waitTime) {
			if (typeof monkey === "undefined") return false
	
			const rouletteIndex = parseInt(self.closest_nr(ball, roulettePos, "nr"))
			const winNr = roulettePos[rouletteIndex]
	
			if (typeof monkey === "number") {
				monkey = monkey.toString()
			}
	
			if (monkey === winNr.nr && frame > totalTime - waitTime) {
				self.rotateBall(winNr.x, winNr.y)
				return true
			}
	
			return false
		}

		function endSpin() {
			self.drawRoulette()
	
			const rouletteIndex = parseInt(self.closest_nr(ball, roulettePos, "nr"))
			const winNr = roulettePos[rouletteIndex]
	
			self.drawBall(winNr.x, winNr.y, ball.width, 0, 2 * Math.PI, false)
			self.check_win_lose(roulette_bets, winNr)
	
			setTimeout(() => {
				self.start()
				startGame = false
			}, 500)
		}
	}

    this.rotateWheel = (x)=>{
		startAngle  = startAngle + x
		startAngle01  = startAngle01 + x
		ball.y = roulette_radius_y + Math.cos(circle.angle) * circle.radius
		ball.x = roulette_radius_x + Math.sin(circle.angle) * circle.radius		
	}	
	
	this.drawBall = (x, y, r, sAngle, eAngle, counterclockwise)=>{
		draw_dot(ctx, x, y, r, sAngle, eAngle, counterclockwise, 'white', 1, 'grey')  //ctx.arc(x, y, r, sAngle, eAngle, counterclockwise)
	}
	
	this.rotateBall = (a, b)=>{
		self.drawRoulette()	
		ctx.font = font_bold_14		
		self.drawBall(a, b, ball.width, 0, 2 * Math.PI, false)
	}
	
	this.closest_nr = (nr, arr, text)=>{
		let closest = 1000
		let obj = {}
		let index = 0
		for(let i in arr){
			if(closest > getDistance_between_entities(nr, arr[i])){
				closest = getDistance_between_entities(nr, arr[i])
				obj = arr[i]
				index = i
			}
		}		
		if(text === "nr"){
			return index
		} else {
			return obj
		}		
	}

    this.check_win_lose = (x, nr)=>{
		let elem01 = JSON.parse(JSON.stringify(x))
		let elem02 = JSON.parse(JSON.stringify(nr))

		dispatch(changeRouletteLuckyBet(elem02))
        let money_history = props.user.money ? decryptData(props.user.money) : 0 

        for(let i in elem01){		
			if(isNaN(elem01[i].text) === false){
				if(elem01[i].text.toString() === elem02.nr.toString()){
					elem01[i].win = true
					money_history = money_history + elem01[i].bet_value
				} else {
					elem01[i].win = false
					money_history = money_history - elem01[i].bet_value
				}
			} else {
				switch (elem01[i].text) {
					case "1st 12":	
						if(elem02.nr > 0 && elem02.nr < 13){
							elem01[i].win = true
							money_history = money_history + elem01[i].bet_value
						} else {
							elem01[i].win = false
							money_history = money_history - elem01[i].bet_value	
						}
						break
					case "2st 12":	
						if(elem02.nr > 12 && elem02.nr < 25){
							elem01[i].win = true
							money_history = money_history + elem01[i].bet_value
						} else {
							elem01[i].win = false
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "3st 12":	
						if(elem02.nr > 24 && elem02.nr < 37){
							elem01[i].win = true
							money_history = money_history + elem01[i].bet_value
						} else {
							elem01[i].win = false
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "1-18":
						if(elem02.nr > 0 && elem02.nr < 19){
							elem01[i].win = true
							money_history = money_history + elem01[i].bet_value
						} else {
							elem01[i].win = false
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "Even":
						if(elem02.nr % 2 === 0){
							elem01[i].win = true
							money_history = money_history + elem01[i].bet_value
						} else {
							elem01[i].win = false
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "reds":
						if(elem02.color === "red"){
							elem01[i].win = true
							money_history = money_history + elem01[i].bet_value
						} else {
							elem01[i].win = false
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "blacks":
						if(elem02.color === "black"){
							elem01[i].win = true
							money_history = money_history + elem01[i].bet_value
						} else {
							elem01[i].win = false
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "Odd":
						if(elem02.nr % 2 !== 0){
							elem01[i].win = true
							money_history = money_history + elem01[i].bet_value
						} else {
							elem01[i].win = false
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "19-36":
						if(elem02.nr > 18 && elem02.nr < 37){
							elem01[i].win = true
							money_history = money_history + elem01[i].bet_value
						} else {
							elem01[i].win = false
							money_history = money_history - elem01[i].bet_value
						}
						break
					case "2 to 1a":						
						for(let k=0; k<12; k++){
							let x = 3*k+3
							if(x === parseInt(elem02.nr)){
								elem01[i].win = true
								money_history = money_history + elem01[i].bet_value
							} else {
								elem01[i].win = true
								money_history = money_history - elem01[i].bet_value
							}							
						}
						break
					case "2 to 1b":
						for(let k=0; k<12; k++){
							let x = 3*k+2
							if(x === parseInt(elem02.nr)){
								elem01[i].win = true
								money_history = money_history + elem01[i].bet_value
							} else {
								elem01[i].win = true
								money_history = money_history - elem01[i].bet_value
							}							
						}
						break
					case "2 to 1c":
						for(let k=0; k<12; k++){
							let x = 3*k+1
							if(x === parseInt(elem02.nr)){
								elem01[i].win = true
								money_history = money_history + elem01[i].bet_value
							} else {
								elem01[i].win = true
								money_history = money_history - elem01[i].bet_value
							}							
						}
						break
					default:
						break
				}
			}
			elem01[i].money_history = money_history
		}
        self.win_lose(elem01, money_history)
    }

    this.win_lose = (arr, money_history, leave=false)=>{
		let game = null
		if(props.page && props.page.game){
			game = props.page.game
		}
		let status = "lose"
		let money_original = props.user.money ? decryptData(props.user.money) : 0 
		if(!leave && money_original < money_history){
			status = "win"
		}		
		let roulette_payload = {
			uuid: props.user.uuid,
			game: game,
			money: money_history,
			status: status,
			bet: Math.abs(money_original - money_history)
		}
		props.results(roulette_payload)			
    }

    this.get_status_game = ()=>{
        return startGame
    }

	this.leave = ()=>{
		let elem01 = JSON.parse(JSON.stringify(roulette_bets))
		let money_history = decryptData(props.user.money)
		for(let i in elem01){
			elem01[i].win = false
			money_history = money_history - elem01[i].bet_value
			elem01[i].money_history = money_history
		}
		self.win_lose(elem01, money_history, true)		
	}
}

var roulette_bets = []
function RouletteGame(props){
	const {page, user, bets, settings, socket} = props
    const {lang, theme} = settings
    let dispatch = useDispatch()	
    let options = {...props, dispatch}
    let my_roulette = new roulette_game(options)
	roulette_bets = bets

	function ready(){
		if(my_roulette && document.getElementById("roulette_canvas")){
            my_roulette.ready()
        }
	}

    useEffect(() => {
        ready()
        $(window).resize(()=>{
			ready()
		})
		return () => {
			if(my_roulette){				
				if(my_roulette.get_status_game()){
					my_roulette.leave()// if the user leaves the game, if he bet, he will lose the bets
				}
				my_roulette = null
			}
		}
    }, [])

	useEffect(() => {
		const handleRouletteRead = (data)=>{
			if(typeof data.arc !== "undefined" || typeof data.spin_time !== "undefined" || typeof data.ball_speed !== "undefined"){
				if (window.innerWidth < 960){
					if(window.innerHeight < window.innerWidth){
						//landscape
						data.speed = 0.0173
					} else {
						//portrait
						data.speed = 0.018
					}					
				} 
				if(my_roulette && document.getElementById("roulette_canvas")){
					my_roulette.spin(data)
				}
			}
		}
		socket.on('roulette_read', handleRouletteRead)
		return () => {
            socket.off('roulette_read', handleRouletteRead)
        }
    }, [socket])

    function openTable(){
        if(my_roulette){
            let status = my_roulette.get_status_game()
			let money = user.money ? decryptData(user.money) : 0 
            if(!status && money && money>0){
                props.openTable()
            } else {
				let payload = {
					open: true,
					template: "error",
					title: "error",
					data: translate({lang: lang, info: "no_money"}),
					size: "sm",
				}
				dispatch(changePopup(payload))
            } 
        }
    }

    function gameStart(){
        if(my_roulette && document.getElementById("roulette_canvas") && roulette_bets && roulette_bets.length>0){
			let money = user.money ? decryptData(user.money) : 0 
			if(roulette_bets.length > money){ // the user bet more than he has
				let payload = {
					open: true,
					template: "error",
					title: "error",
					data: translate({lang: lang, info: "no_money"}),
					size: "sm",
				}
				dispatch(changePopup(payload))
			} else {
				let roulette_payload_server = {
					uuid: user.uuid,
					room: getRoom(page.game),
					bet: roulette_bets,
				}
				socket.emit('roulette_send', roulette_payload_server)
			}
		} else {
			let payload = {
				open: true,
				template: "error",
				title: translate({lang: lang, info: "error"}),
				data: translate({lang: lang, info: "no_bets"}),
				size: "sm",
			}
			dispatch(changePopup(payload))
		}
    }

    return <div className="game_box">
		<Header template={"game"} details={page} lang={lang} theme={theme}/>
		<canvas id="roulette_canvas" /> 
		<div className="button_action_group roulette_buttons_container">
			<div className="tooltip">
				<Button 
					type="button"  
					className="mybutton round button_transparent shadow_convex"
					onClick={()=>gameStart()}
				><FontAwesomeIcon icon={faPlay} /></Button>
                <span className="tooltiptext">{translate({lang: lang, info: "start"})}</span>
            </div>
			<div className="tooltip">
				<Button 
					type="button"  
					className="mybutton round button_transparent shadow_convex"
					onClick={()=>openTable()}
				><FontAwesomeIcon icon={faCarrot} /></Button>
                <span className="tooltiptext">{translate({lang: lang, info: "settings"})}</span>
            </div>
			<div className="tooltip">
				<Button 
					type="button" 
					className="mybutton round button_transparent shadow_convex"
					onClick={()=>props.handleHandleExit()} 					
				><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>	
                <span className="tooltiptext">{translate({lang: lang, info: "back"})}</span>
            </div>	
		</div>    
    </div>
}

export default RouletteGame