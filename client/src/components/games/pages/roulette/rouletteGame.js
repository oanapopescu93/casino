import React, { useEffect } from 'react'
import Header from '../../../partials/header'
import RouletteButtons from './rouletteButtons'
import { draw_dot, getDistance_between_entities } from '../../../../utils/games'

function roulette_game(props){
    const {page, betsInfo, gameInfo, handleEndGame} = props

    let self = this	
    let canvas
    let ctx

    let roulette_radius_x = 240
	let roulette_radius_y = 240
    let numbers = [] 
	let colors = []
	let startAngle = -1.65
	let startAngle01 = 0
	let arc = 0
	let outsideRadius = 200
	let textRadius = outsideRadius - 20
	let insideRadius = outsideRadius - 30
    let roulettePos = []
    let rouletteType = page.game.table_type

	let circle = {radius: textRadius * 0.6, angle: 0}
	let ball = {x: 70, y: insideRadius, speed: 0.05, width: 10}

	let font_bold_10 = 'bold 10px sans-serif'
	let font_bold_12 = 'bold 12px sans-serif'
	let font_bold_14 = 'bold 14px sans-serif'

    let spin_clear = [0, 0, 0, 0]
    let radiantLine01 = []
	let radiantLine02 = []
	let radiantLine03 = []

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
			
			textRadius = outsideRadius - 15
			insideRadius = outsideRadius - 20

			radiantLine01 = [-65, 15]
			radiantLine02 = [-105, -35]
			radiantLine03 = [-105, -85]	

            circle = {radius: textRadius-15, angle:0}
			ball = {x: 70, y: roulette_radius_x, speed: gameInfo && gameInfo.ball_speed ? gameInfo.ball_speed : 0.05, width: 6}

			font_bold_10 = 'bold 8px sans-serif'
			font_bold_12 = 'bold 10px sans-serif'
			font_bold_14 = 'bold 12px sans-serif'
		} else {
			//big
			canvas.width = 480
			canvas.height = 480
			
			roulette_radius_x = canvas.width / 2
			roulette_radius_y = 240
			outsideRadius = 200
			textRadius = outsideRadius - 20
			insideRadius = outsideRadius - 30
			
			circle = {radius: textRadius - 22, angle: 0}
			ball = {x: 70, y: roulette_radius_x, speed: gameInfo && gameInfo.ball_speed ? gameInfo.ball_speed : 0.05, width: 10}
			
			font_bold_10 = 'bold 10px sans-serif'
			font_bold_12 = 'bold 12px sans-serif'
			font_bold_14 = 'bold 14px sans-serif'

			radiantLine01 = [-60, 20]
			radiantLine02 = [-60, -160]
			radiantLine03 = [-160, -200]
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
		draw_dot(ctx, roulette_radius_x, roulette_radius_y, outsideRadius * 1.05, 0, 2 * Math.PI, false, '#a87b51', 15, '#5e391c')	
		draw_dot(ctx, roulette_radius_x, roulette_radius_y, outsideRadius * 0.97, 0, 2 * Math.PI, false, 'black', 15, 'black')			
		ctx.shadowBlur = 0

		ctx.font = font_bold_12	
		drawRouletteHoles(outsideRadius, insideRadius, numbers.length, colors, true, startAngle)
		ctx.font = font_bold_14
		drawRouletteHoles(insideRadius - 1, insideRadius * 0.7, numbers.length, "dark", false, startAngle)
		
		radiantLine(numbers.length, 1, "gold", radiantLine01, startAngle)		
		
		drawRouletteHoles(insideRadius * 0.7 - 1, 0, 12, "grey", false, startAngle01)
		radiantLine(12, 1, "#4d4d4d", radiantLine02, startAngle01)

		drawRouletteHoles(20, 0, 8, "gold", false, startAngle01)	
		radiantLine(8, 1, "#b99813", radiantLine03, startAngle01)
    }
    function drawRouletteHoles(outsideRadius, insideRadius, how_many, colors, show, startAngle){
        let space = outsideRadius - insideRadius		
		for(let i = 0; i < how_many; i++) {
			arc = Math.PI / (how_many/2)
			let angle = startAngle + i * arc			
		  
			ctx.beginPath()	  
			ctx.arc(roulette_radius_x, roulette_radius_y, outsideRadius, angle, angle + arc, false)
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
            
            let radius = textRadius - 2 * ball.width // Radius to text
            let sliceX = roulette_radius_x + Math.cos(angle + arc / 2) * textRadius
            let sliceY = roulette_radius_y + Math.sin(angle + arc / 2) * textRadius
            let slicePosX = roulette_radius_x + Math.cos(angle + arc / 2) * radius
            let slicePosY = roulette_radius_y + Math.sin(angle + arc / 2) * radius
            let w = 2 * radius * Math.sin(arc / 2)

			if(show){
				ctx.fillStyle = "white"
				ctx.translate(sliceX, sliceY)
				ctx.rotate(angle + arc / 2 + Math.PI / 2)
				let text = numbers[i]
				ctx.fillText(text, -ctx.measureText(text).width / 2, 0)
				roulettePos.push({
                    x: slicePosX,
                    y: slicePosY,
                    nr: text, 
                    color: colors[i],
                    h: space,
                    w
                })
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
			ctx.moveTo(roulette_radius_x + Math.cos(angle + arc) * (textRadius + offset[0]), roulette_radius_y + Math.sin(angle + arc) * (textRadius + offset[0]))
			ctx.lineTo(roulette_radius_x + Math.cos(angle + arc) * (textRadius + offset[1]), roulette_radius_y + Math.sin(angle + arc) * (textRadius + offset[1]))
			ctx.stroke()
			ctx.closePath()
		}
	}

    this.closest_nr = function(nr, arr, text){
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

    this.spin = ()=>{
		let arc = gameInfo.arc
		let spin_nr = 0
		let spin_time = gameInfo.spin_time
		let spin_time_more = 200
        let roulette_index = 0
        let win_nr = null
		//uncomment this to make the spin shorter
		// spin_time = 10
		// spin_time_more = 10

		let monkey = gameInfo.monkey
		let monkey_wait = 200

		window.requestAnimFrame = (()=>{
			return  window.requestAnimationFrame	||
			window.webkitRequestAnimationFrame		||
			window.mozRequestAnimationFrame			||
			((callback) => window.setTimeout(callback, 1000 / 60))
	    })()
	  
	    function spin_roulette() {
			if(ctx){
				ctx.clearRect(spin_clear[0], spin_clear[1], spin_clear[2], spin_clear[3])
				let stop = false

				if (spin_nr > spin_time) {
					if(spin_nr > spin_time + spin_time_more){
						stop = true
                        endSpin() 
					} else {
						spin_nr++ 
						self.rotateWheel(arc-0.04)		
						
						roulette_index = parseInt(self.closest_nr(ball, roulettePos, "nr"))
						win_nr = roulettePos[roulette_index]
						
						circle.angle -= arc-0.04
						self.rotateBall(win_nr.x, win_nr.y)
						
						stop = false
					}
				} else {
					spin_nr++
					
					switch (true) {
						case (spin_nr <= spin_time/2):						
							self.rotateWheel(arc)
							circle.angle += ball.speed	
							break
						case (spin_nr > spin_time/2 && spin_nr <= 2*spin_time/3):
							self.rotateWheel(arc-0.01)
							circle.angle += ball.speed-0.01	
							break
						case (spin_nr > 2*spin_time/3 && spin_nr <= 5*spin_time/6):
							self.rotateWheel(arc-0.02)
							circle.angle += ball.speed-0.02		
							break
						case (spin_nr > 5*spin_time/6 && spin_nr <= spin_time-20):
							self.rotateWheel(arc-0.03)
							circle.angle += ball.speed-0.03	
							break
						case (spin_nr > spin_time-20 && spin_nr <= spin_time-10):
							self.rotateWheel(arc-0.04)
							circle.angle += ball.speed-0.04	
							break
						default:
							break
					}
					
					if(monkey && self.closest_nr){							
						roulette_index = parseInt(self.closest_nr(ball, roulettePos, "nr"))
						win_nr = roulettePos[roulette_index]
						
						if(typeof monkey === "number"){
							monkey = monkey.toString()
						}	

						if(monkey === win_nr.nr && spin_nr > spin_time -  monkey_wait){
							self.rotateBall(win_nr.x, win_nr.y)
							spin_nr = spin_time + 1
						} else {
							self.rotateBall(ball.x,ball.y)
						}					
					} else {
						self.rotateBall(ball.x,ball.y)
					}
					
					stop = false
				}		
            
				if(!stop){
					window.requestAnimationFrame(spin_roulette)
				} else {
					window.cancelAnimationFrame(spin_roulette)
				}
			}
	  	}

	  	spin_roulette()
	}

    function endSpin(){
        self.drawRoulette()

        const rouletteIndex = parseInt(self.closest_nr(ball, roulettePos, "nr"))
        const winNr = roulettePos[rouletteIndex]

        self.rotateBall(winNr.x, winNr.y)

        handleEndGame({winNr, betsInfo})
    }   

    this.rotateWheel = (x)=>{
		startAngle  = startAngle + x
		startAngle01  = startAngle01 + x
		ball.y = roulette_radius_y + Math.cos(circle.angle) * circle.radius
		ball.x = roulette_radius_x + Math.sin(circle.angle) * circle.radius		
	}

    this.rotateBall = (a, b)=>{
		self.drawRoulette()	
		ctx.font = font_bold_14		
		self.drawBall(a, b, ball.width, 0, 2 * Math.PI, false)
	}

    this.drawBall = (x, y, r, sAngle, eAngle, counterclockwise)=>{
		draw_dot(ctx, x, y, r, sAngle, eAngle, counterclockwise, 'white', 1, 'grey')
	}
}

function RouletteGame(props){ 
    const {page, betsInfo, gameInfo, width, spin, settings} = props
    const {lang, theme} = settings

    let options = {...props}
    
    let my_roulette = new roulette_game(options)

	function ready(){
		if(my_roulette && document.getElementById("roulette_canvas")){
            my_roulette.ready()
        }
	}

    useEffect(() => {
		ready()
    }, [])

    useEffect(() => {
		if(betsInfo && gameInfo){
			ready()
		}
    }, [betsInfo, gameInfo, width])

    useEffect(() => {
		if(spin && my_roulette && document.getElementById("roulette_canvas")){
            my_roulette.spin()
        }
    }, [spin])
    
    return <div className="game_box">
        <Header template={"game"} details={page} lang={lang} theme={theme}/>
        <canvas id="roulette_canvas" /> 
        <RouletteButtons {...props}/>
    </div>
}

export default RouletteGame