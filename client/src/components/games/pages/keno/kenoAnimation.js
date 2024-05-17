import React, {useEffect} from 'react'
import $ from 'jquery'
import { draw_dot, getDistance_between_entities } from '../../../../utils/games'
import { Row, Col, Button } from 'react-bootstrap'
import { translate } from '../../../../translations/translate'
import KenoResults from './kenoResults'

function keno_game(props){
    let self = this	
    let canvas
    let ctx
    let canvas_width = 700
	let canvas_height = 700
    let radiusBall = 20
    let radiusBig = 300
    let ballsArray = []
    let howManyBalls = 80
    let font_obstacle = '12px sans-serif'
    let duration = 1000
    let ballPos = [350, 50]
    let ballSpeed = [1000, 3000]

    this.ready = function(){
        self.createCanvas(canvas_width, canvas_height)
        self.createBallArray()
        self.drawBigCircle()
        self.move()             
    }

    this.createCanvas = function(canvas_width, canvas_height){	
		canvas = document.getElementById("keno_canvas")	
		ctx = canvas.getContext("2d")
		
		if (window.innerWidth < 960){
            //small landscape and portrait
            canvas.width = 250
            canvas.height = 250
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
        canvas_width = canvas.width
		canvas_height = canvas.height	
		canvas.height = canvas_height
	}

    this.createBallArray = function(){
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

    this.drawBallArray = function(){
        for (let i in ballsArray){
            self.drawBalls(ballsArray[i].xpos, ballsArray[i].ypos, ballsArray[i].radius, ballsArray[i].number);
        }
    }

    this.drawBalls = function(x,y,r, number){
        draw_dot(ctx, x,y,r, 0, 2 * Math.PI, false, 'rgba(255, 255, 0, 0.1)', 1, "gold")
		self.add_text(number, x, y+4, font_obstacle, "gold", "center")
    }

    self.add_text = function(text, x, y, font, color, text_align){
		ctx.font = font
		ctx.textAlign = text_align		
		ctx.fillStyle = color			
		ctx.fillText(text, x, y)
	}

    this.drawBigCircle = function() {
        ctx.clearRect(0,0,canvas.height, canvas.width)
        draw_dot(ctx, canvas.width/2, canvas.height/2, radiusBig, 0, 2 * Math.PI, false, 'rgba(255, 255, 0, 0.1)', 1, "gold")	
	}    	

    this.move = function(){
        setTimeout(function(){
            self.animation(duration)
       }, 500)  
    }

    this.animation = function(time){ 
		let spin_nr = 0
		let spin_time = time
        // let spin_time = 100

		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame	||
			window.webkitRequestAnimationFrame		||
			window.mozRequestAnimationFrame			||
			function( callback ){
			  window.setTimeout(callback, 1000 / 60)
			}
	    })()
	  
	    function run() {
			if(ctx){
				let stop = false
				if (spin_nr > spin_time) {
					stop = true
                    self.drawBigCircle()
                    if(typeof props.generatePick !== "undefined"){
                        props.generatePick()
                    }
				} else {
					spin_nr++					
					stop = false            

                    for(let i in ballsArray){
                        ballsArray[i].xpos += ballsArray[i].xspeed * ballsArray[i].dir/1000  // update position according to constant speed
                        ballsArray[i].ypos += ballsArray[i].yspeed * ballsArray[i].dir/1000  // update position according to constant speed
                    }

                    // change speed direction
                    for(let i in ballsArray){
                        let point01 = {x: ballsArray[i].xpos, y: ballsArray[i].ypos}
                        let point02 = {x: canvas.width/2, y: canvas.height/2}
                        if (getDistance_between_entities(point01, point02) + ballsArray[i].radius >= radiusBig) {                             
                            let nx_o = canvas.width/2 -  ballsArray[i].xpos
                            let ny_o = canvas.width/2 -  ballsArray[i].ypos
                    
                            let nx = nx_o / (Math.sqrt(nx_o * nx_o + ny_o * ny_o))
                            let ny = ny_o / (Math.sqrt(nx_o * nx_o + ny_o * ny_o))
                            // r = v − [2 (n · v) n]
                            let v_newx = ballsArray[i].xspeed - (2 *( nx * ballsArray[i].xspeed + ny * ballsArray[i].yspeed ) ) * nx
                            let v_newy = ballsArray[i].yspeed - (2 *( nx * ballsArray[i].xspeed + ny * ballsArray[i].yspeed ) ) * ny
            
                            ballsArray[i].xspeed = v_newx
                            ballsArray[i].yspeed = v_newy
                        }
                    }

                    // redraw with new positions
                    self.drawBigCircle()
                    self.drawBallArray()
				}		
            
				if(!stop){
					window.requestAnimationFrame(run)
				} else {
					window.cancelAnimationFrame(run)
				}
			} else {
                window.cancelAnimationFrame(run)
            }
	  	}

	  	run()  
	}
}

function KenoAnimation(props){
    const {data, resultsPayload} = props
    let list = data.list
    let no_of_games = data.no_of_games
    let price_per_game = data.price_per_game
    let howManyBalls = 80

    let generatePick = function(){        
        return new Promise(function(resolve, reject){
			let keno_payload_server = {
                uuid: props.user.uuid,
                length: list.length, 
                max: howManyBalls,
                no_of_games: no_of_games
            }
            props.socket.emit('keno_send', keno_payload_server)            
		})
	}

    let options = {...props, generatePick}
    let my_keno = new keno_game(options)

    function ready(){
		if(my_keno && document.getElementById("keno_canvas")){
            my_keno.ready()
        }
	}

    useEffect(() => {
        ready()
        $(window).resize(function(){
			ready()
		})
		return () => {
			if(my_keno){
				// if the user leaves the game, if he bet, he will lose the bets
				my_keno = null
			}
		}
    }, [])

    useEffect(() => {
        const handleKenoRead = function(data) {
            if(data){
                let list_filtered = []
                for(let i in data){
                    let filteredArray = data[i].filter(value => list.includes(value)) //array intersections
                    if(filteredArray && filteredArray.length>0){
                        list_filtered.push(filteredArray)
                    }
                }
                if(typeof props.getResults !== "undefined"){
                    props.getResults({list_results: data, list_filtered})
                }
            }
        }
		props.socket.on('keno_read', handleKenoRead)
		return () => {
            props.socket.off('keno_read', handleKenoRead)
        }
    }, [props.socket])

    function handleShowPrizes(){
        if(typeof props.handleShowPrizes !== "undefined"){
            props.handleShowPrizes()
        }
    }

    return <>
        <Row>
            <Col sm={8}>
                <canvas id="keno_canvas"></canvas>
            </Col>
            <Col sm={4}>
                <Row>
                    <Col sm={12}>
                        <KenoResults 
                            {...props} 
                            list={list} 
                            no_of_games={no_of_games}
                            price_per_game={price_per_game}
                            results={resultsPayload}                            
                        ></KenoResults>
                    </Col>
                    <Col sm={12} className="button_action_group">
                        <Button type="button" onClick={()=>handleShowPrizes()} className="mybutton button_transparent shadow_convex">
                            {translate({lang: props.lang, info: "keno_prizes"})}
                        </Button>	
                    </Col>
                </Row>
            </Col>            
        </Row>
    </>
}

export default KenoAnimation