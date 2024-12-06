import React, { useEffect } from 'react'
import $ from 'jquery'
import { draw_rect,draw_dot } from '../../../../utils/games'

function keno_tube_game(props){
    let self = this	
    let canvas
    let ctx
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
    let kenoSpotsResult = props.kenoSpotsResult ? props.kenoSpotsResult : []
    let ball = {radius: 20, background: color_transparent_1, color, border: 1}
    let balls = []
    let flask = null
    let font_obstacle = '12px sans-serif'
    let duration = 100000
    let index = 0 // index for the balls

    this.ready = (r)=>{
        if(r !== "resize") {
            self.createAll()
            self.drawAll()
            self.move()            
        } else { //if the user decides to resize in the middle of the animation, the balls will immediately be put down the flask
            self.createCanvas()
            self.createFlask()
            self.createBallsDown()
            self.drawAll()
        }
    }

    this.createAll = ()=>{
        self.createCanvas()
        self.createFlask()
        self.createBalls()
	}

    this.createCanvas = ()=>{	
		canvas = document.getElementById("keno_tube_canvas")	
		ctx = canvas.getContext("2d")

        if (window.innerWidth < 960){
            //small landscape and portrait
            canvas.width = 20
            canvas.height = 200
            ball = {radius: 10, background: color_transparent_1, color, border: 1}
		} else {
            //big
            canvas.width = 40
            canvas.height = 400	
            ball = {radius: 20, background: color_transparent_1, color, border: 1}	
		}
	}
    this.createFlask = ()=>{
        flask = {
            width: canvas.width,
            height: canvas.height,
            background: "transparent",
            color: "transparent",
            border: 0,
        }
    }
    this.createBalls = ()=>{
        const totalBalls = kenoSpotsResult.length
        const ballDiameter = 2 * ball.radius
        const flaskHeight = flask.height
        const offset = -((totalBalls - 1) * ballDiameter) / 2
        
        for(let i in kenoSpotsResult){
            let x = ball.radius
            let y = i * ballDiameter + offset - flaskHeight / 2            
            balls.push({
                number: kenoSpotsResult[i],
                radius: ball.radius,
                x,
                y,
                background: color_transparent_1,
                color,
                border: 1,
            })
        }
    }
    this.createBallsDown = ()=>{
        const ballDiameter = 2 * ball.radius
        const flaskHeight = flask.height
        balls = []

        for(let i in kenoSpotsResult){
            let x = ball.radius
            let y = flaskHeight - (i * ballDiameter) - ballDiameter / 2
            balls.push({
                number: kenoSpotsResult[i],
                radius: ball.radius,
                x,
                y,
                background: color_transparent_1,
                color,
                border: 1,
            })
        }
    }

    this.drawAll = ()=>{
        ctx.clearRect(0,0,1000, 1000)
        self.drawFlask()
        self.drawBalls()
    }

    this.drawFlask = ()=>{
        if(flask){
            draw_rect(ctx, 0, 0, flask.width, flask.height, flask.background, flask.border, flask.color)
        }
    }
    this.drawBalls = ()=>{
        for(let i in balls){
            draw_dot(ctx, balls[i].x, balls[i].y, balls[i].radius, 0, 2 * Math.PI, false, balls[i].background, balls[i].border, balls[i].color)
		    self.add_text(balls[i].number, balls[i].x, balls[i].y+4, font_obstacle, color, "center")
        }
    }
    this.drawBall = (ball)=>{
        draw_dot(ctx, ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false, ball.background, ball.border, ball.color)
		self.add_text(ball.number, ball.x, ball.y+4, font_obstacle, color, "center")
    }
    this.add_text = (text, x, y, font, color, text_align)=>{
		ctx.font = font
		ctx.textAlign = text_align		
		ctx.fillStyle = color			
		ctx.fillText(text, x, y)
	}

    this.move = ()=>{
        setTimeout(()=>{
            self.animation(duration)
       }, 500)
    }
    this.animation = ()=>{ 
		window.requestAnimFrame = (()=>{
			return  window.requestAnimationFrame	||
			window.webkitRequestAnimationFrame		||
			window.mozRequestAnimationFrame			||
			((callback) => window.setTimeout(callback, 1000 / 60))
	    })()
	  
	    function runKenoTube(){
            if (!ctx){
                window.cancelAnimationFrame(runKenoTube)
                return
            }

			let stop = false
            if (index < balls.length){                        
                self.updateBalls()
            } else {
                stop = true
                self.finish()
            }
            
            self.drawAll()

            if(stop){
                window.cancelAnimationFrame(runKenoTube)
                return
            }
        
            window.requestAnimationFrame(runKenoTube)
	  	}

	  	runKenoTube()
	}

    this.updateBalls = ()=>{
        const flaskHeight = flask.height
        const radius = balls[index].radius
        const diameter = 2 * balls[index].radius
        if (balls[index].y < flaskHeight - radius - index * diameter) {
            balls[index].y = balls[index].y + 10
        } else {
            index++
        }
    }

    this.finish = ()=>{
        props.animationFinished()
    }
}

function KenoTube(props){
    let animationFinished = ()=>{
		props.animationFinished("flask")
	}

    let options = {...props, animationFinished}
    let my_keno_tube = new keno_tube_game(options)

    function ready(r){
		if(my_keno_tube && document.getElementById("keno_tube_canvas")){
            my_keno_tube.ready(r)
        }
	}

    useEffect(() => {
        ready()
        $(window).resize(()=>{
			ready('resize')
		})
		return () => {
			if(my_keno_tube){				
				my_keno_tube = null // if the user leaves the game, if he bet, he will lose the bets
			}
		}
    }, [])

    return <canvas id="keno_tube_canvas" />
}

export default KenoTube;
