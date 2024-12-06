import React, { useEffect } from 'react'
import $ from 'jquery'
import { draw_dot, getDistance_between_entities } from '../../../../utils/games'

function keno_game(props){
    let self = this	
    let canvas
    let ctx
    let radiusBall = 20
    let radiusBig = 300
    let ballsArray = []
    let howManyBalls = 80
    let fontObstacle = '12px sans-serif'
    let duration = 500
    let ballPos = [350, 50]
    let ballSpeed = [1000, 3000]
    
    let theme = props.settings.theme
    let color = "gold"
    let color_transparent_1 = "rgba(255, 255, 0, 0.1)"
    switch(theme){
		case "purple":
			color = "pink"
			color_transparent_1 = "rgba(255, 105, 180, 0.1)"
			break
		case "black":
			color = "green"
			color_transparent_1 = "rgba(50, 205, 50, 0.1)"
			break
        case "blue":
			color = "#ff8000"
			color_transparent_1 = "rgba(255, 128, 0, 0.1)"
			break
		case "green":
		default:
			color = "gold"
			color_transparent_1 = "rgba(255, 215, 0, 0.1)"
			break
	}

    this.ready = ()=>{
        self.createCanvas()
        self.createBallArray()
        self.drawBigCircle()
        self.move()
    }

    this.createCanvas = ()=>{	
		canvas = document.getElementById("keno_canvas")	
		ctx = canvas.getContext("2d")
		
		if (window.innerWidth < 960){
            //small landscape and portrait
            canvas.width = 200
            canvas.height = 200
            radiusBall = 10
            radiusBig = 100
            ballPos = [150, 50]
            ballSpeed = [500, 1500]
		} else {
            //big
            canvas.width = 610
            canvas.height = 610
            radiusBall = 20
            radiusBig = 300
            ballPos = [350, 50]
            ballSpeed = [1000, 3000]			
		}
	}

    this.createBallArray = ()=>{
        for (let i=0; i<howManyBalls; i++){
            ballsArray[i] = {
                radius: radiusBall,
                xspeed: 0,
                yspeed: 0,
                xpos: ballPos[0],
                ypos: ballPos[1],
                dir: (Math.random() * 2) + 0.5,
            }
            let dir = (Math.random() * 1) + 0
            if(Math.round(Math.random())>0.5){
                dir = -dir
            }
            ballsArray[i].xspeed = dir * Math.floor((Math.random()*ballSpeed[1])+ballSpeed[0])
            dir = (Math.random() * 1) + 0
            if(Math.round(Math.random())>0.5){
                dir = -dir
            }
            ballsArray[i].yspeed = dir * Math.floor((Math.random()*ballSpeed[1])+ballSpeed[0])
            ballsArray[i].number = parseInt(i)+1
       }
    }

    this.drawBallArray = ()=>{
        for (let i in ballsArray){
            self.drawBalls(ballsArray[i].xpos, ballsArray[i].ypos, ballsArray[i].radius, ballsArray[i].number);
        }
    }

    this.drawBalls = (x,y,r, number)=>{
        draw_dot(ctx, x,y,r, 0, 2 * Math.PI, false, color_transparent_1, 1, color)
		self.add_text(number, x, y+4, fontObstacle, color, "center")
    }

    self.add_text = (text, x, y, font, color, text_align)=>{
		ctx.font = font
		ctx.textAlign = text_align		
		ctx.fillStyle = color			
		ctx.fillText(text, x, y)
	}

    this.drawBigCircle = ()=>{
        ctx.clearRect(0,0,canvas.height, canvas.width)
        draw_dot(ctx, canvas.width/2, canvas.height/2, radiusBig, 0, 2 * Math.PI, false, color_transparent_1, 1, color)	
	}
    
    this.move = ()=>{
        setTimeout(()=>{
            self.animation(duration)
       }, 500)
    }

    this.animation = (time)=>{ 
		let spinFrame = 0
        const spinTime = time

		window.requestAnimFrame = (()=>{
			return  window.requestAnimationFrame	||
			window.webkitRequestAnimationFrame		||
			window.mozRequestAnimationFrame			||
			((callback) => window.setTimeout(callback, 1000 / 60))
	    })()
	  
	    function runKenoBalls() {
            if (!ctx) {
                window.cancelAnimationFrame(runKenoBalls)
                return
            }

            if (spinFrame > spinTime) {
                endAnimation()
                return
            }

            updateBallsPosition()
            checkCollisionAndReflect()
            redrawScene()

            spinFrame++
            window.requestAnimFrame(runKenoBalls)
	  	}

	  	runKenoBalls()

        function updateBallsPosition() {
            ballsArray.forEach((ball) => {
                ball.xpos += (ball.xspeed * ball.dir) / 1000
                ball.ypos += (ball.yspeed * ball.dir) / 1000
            })
        }
    
        function checkCollisionAndReflect() {
            ballsArray.forEach((ball) => {
                const ballPosition = { x: ball.xpos, y: ball.ypos }
                const centerPosition = { x: canvas.width / 2, y: canvas.height / 2 }
    
                if (getDistance_between_entities(ballPosition, centerPosition) + ball.radius >= radiusBig) {
                    const [newXSpeed, newYSpeed] = calculateReflection(ball, centerPosition)
                    ball.xspeed = newXSpeed
                    ball.yspeed = newYSpeed
                }
            })
        }

        function calculateReflection(ball, center) {
            const nx_o = center.x - ball.xpos
            const ny_o = center.y - ball.ypos
    
            const nx = nx_o / Math.sqrt(nx_o ** 2 + ny_o ** 2)
            const ny = ny_o / Math.sqrt(nx_o ** 2 + ny_o ** 2)
    
            const dotProduct = nx * ball.xspeed + ny * ball.yspeed
    
            const newXSpeed = ball.xspeed - 2 * dotProduct * nx
            const newYSpeed = ball.yspeed - 2 * dotProduct * ny
    
            return [newXSpeed, newYSpeed]
        }
    
        function redrawScene() {
            self.drawBigCircle()
            self.drawBallArray()
        }
    
        function endAnimation() {
            self.drawBigCircle()
            props.animationFinished()
        }
	}
}

function KenoBalls(props){
    let animationFinished = ()=>{
		props.animationFinished("balls")
	}

    let options = {...props, animationFinished}
    let my_keno = new keno_game(options)

    function ready(){
		if(my_keno && document.getElementById("keno_canvas")){
            my_keno.ready()
        }
	}

    useEffect(() => {
        ready()
        $(window).resize(()=>{
			ready()
		})
		return () => {
			if(my_keno){				
				my_keno = null // if the user leaves the game, if he bet, he will lose the bets
			}
		}
    }, [])
    
    return <canvas id="keno_canvas" />
}

export default KenoBalls