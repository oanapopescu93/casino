import React, {useEffect, useState} from 'react'
import { useDispatch} from 'react-redux'
import $ from 'jquery'
import { getMousePos, get_what_a_rabbit_img, isInside } from '../../../../utils/games'
import { decryptData } from '../../../../utils/crypto'
import { changeGame, changeGamePage, changePage } from '../../../../reducers/page'

function Target(config){
	let self = this
    self.id = config.id
	self.img = config.img
    self.hole = config.hole
	self.x = config.x
	self.y = config.y
	self.w = config.w
	self.h = config.h
	self.frameWidth = 250
	self.frameHeight = 250
    self.active = config.active

	self.draw = function(ctx){
        if(self.active){
            ctx.drawImage(self.img, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)
        } else {
            ctx.drawImage(self.hole, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)
        }
	}

    self.change_active = function(status){
		self.active = status
	}
}

function whack_game(props){
    let self = this	
    let canvas
    let canvas_hammer
    let ctx
    let ctx_hammer
	let canvas_width = 900
	let canvas_height = 800
    let target_array = []
    let target_array_killed = []
    let spawnRate=1500
    let lastSpawn=-1
    let target_size = [20, 20]
    let items = get_what_a_rabbit_img()
    this.images = []
    let reason = ""
    let dispatch = props.dispatch

    this.ready = function(r){
        reason = r
        startGameWhack = false //the game immediately begins  
        canvas = document.getElementById("whack_canvas")
        canvas_hammer = document.getElementById("whack_canvas_hammer")
        if(canvas && canvas_hammer && !startGameWhack){
            self.createCanvas(canvas_width, canvas_height)
            self.getImage(reason)
        }
    }

    this.createCanvas = function(canvas_width, canvas_height){	
		ctx = canvas.getContext("2d")
        ctx_hammer = canvas_hammer.getContext("2d")
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape
				canvas.width = canvas_hammer.width = 260
				canvas.height = canvas_hammer.height = 300
			} else {
				//small portrait
				canvas.width = canvas_hammer.width = 290
				canvas.height = canvas_hammer.height = 300
			}
            target_size = [50, 50]
		} else {
			//big
			canvas.width = canvas_hammer.width = 900
			canvas.height = canvas_hammer.height = 480
            target_size = [100, 100]
		}
        canvas_width = canvas.width
		canvas_height = canvas.height	
		canvas.height = canvas_hammer.height = canvas_height
        if($('.whack_a_rabbit_container')){
            $('.whack_a_rabbit_container').height(canvas_height)
        }
	}

    this.getImage = function(reason){
		if(reason !== "resize"){
			let promises = []
			for(let i in items){				
				promises.push(self.preaload_images(items[i]))
			}
			Promise.all(promises).then(function(result){
				self.images = result
				self.start()
				self.handleClick()
			})
		} else {
			self.start()
			self.handleClick()
		}
	}    

	this.preaload_images = function(item){
		return new Promise(function(resolve, reject){
			let image = new Image()
			image.id = item.id
			image.src = item.src
			image.addEventListener("load", function() {
				resolve(image)
			}, false)
		})
	}

	this.start = function(){			
		ctx.clearRect(0,0, canvas_width, canvas_height)
        self.animation()
	}

    this.drawAll = function(){
        self.createTarget()
        self.drawBackground()
        self.drawTarget()
    }

    this.animation = function(){ 
		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame	||
			window.webkitRequestAnimationFrame		||
			window.mozRequestAnimationFrame			||
			function( callback ){
			  window.setTimeout(callback, 1000 / 60)
			}
	    })()
	  
	    function run() {
			if(!startGameWhack){
                let time=Date.now()
                if(time>(lastSpawn+spawnRate)){
                    lastSpawn=time
                    spawnRate = Math.round(Math.random() * (2000 - 1000) + 1000)
                    self.drawAll()
                }            
				window.requestAnimationFrame(run)
			} else {
                window.cancelAnimationFrame(run)
            }
	  	}

	  	run()  
	}

    this.createTarget = function(){
        let x = Math.round(Math.random() * (canvas.width - 2*target_size[0]) + target_size[0])
        let y = Math.round(Math.random() * (canvas.height - 2*target_size[1]) + target_size[1])
        let t = Math.floor(Math.random() * (3 - 1 + 1)) + 1
        let target = new Target({
            id: target_array.length,
            id_img: items[t].id,
            img: self.images[t],
            hole: self.images[0],
            x: x,
            y: y,
            w: target_size[0],
            h: target_size[1],
        })
        target_array.push(target)
	}

    this.drawBackground = function(){
		ctx.clearRect(0,0, canvas_width, canvas_height)
	}

    this.drawTarget = function(){
        for(let i in target_array){
            target_array[i].change_active(false)
            if(parseInt(i) === target_array.length-1){
                target_array[i].change_active(true)
            }

            target_array[i].draw(ctx)
        }
	}

    this.handleClick = function(){
        if($('#whack_canvas_hammer')){
            $('#whack_canvas_hammer').off('click').on('click', function(event) {
                let mousePos = getMousePos(canvas_hammer, event)
                self.canvas_click(mousePos)
            })
        }	
    }

    this.canvas_click = function(mouse){ 
        for(let i in target_array){
            let obj = {x: target_array[i].x, y: target_array[i].y, width: target_array[i].w, height: target_array[i].h}
			if(isInside(mouse, obj) && target_array[i].active){
                target_array_killed.push(target_array[i])
                self.hammer(target_array[i])
            }
        }
    }

    this.hammer = function(obj){
        hammer01(obj).then(function() {
            ctx_hammer.clearRect(0,0, canvas_width, canvas_height)
			hammer02(obj).then(function() {
                ctx_hammer.clearRect(0,0, canvas_width, canvas_height)
				hammer01(obj).then(function() {
                    ctx_hammer.clearRect(0,0, canvas_width, canvas_height)
                })
			})
		})
    }

    function hammer01(obj){
        return new Promise(function(resolve, reject){
            ctx_hammer.drawImage(self.images[4], 0, 0, 260, 260, obj.x, obj.y, obj.w, obj.h)
            setTimeout(function(){
                resolve(true)					
            }, 100)
        })
    }
    
    function hammer02(obj){
        return new Promise(function(resolve, reject){
            ctx_hammer.drawImage(self.images[5], 0, 0, 260, 260, obj.x, obj.y, obj.w, obj.h)
            setTimeout(function(){
                resolve(true)
            }, 100)
        })
    }

    this.leave = function(){
		startGameWhack = true
        target_array = []
        target_array_killed = []
	}

    this.end = function(){
        startGameWhack = true
        ctx.clearRect(0,0, canvas_width, canvas_height)
        self.win_lose()        
    }

    this.win_lose = function(){
        let game = null
		if(props.page && props.page.game){
			game = props.page.game
		}
        let money = props.user.money ? decryptData(props.user.money) : 0 

        let whack_payload = {
			uuid: props.user.uuid,
			game: game,
			money: money + target_array_killed.length,
			status: 'win',
			bet: target_array_killed.length
		}

		if(typeof props.results === "function"){
            props.results(whack_payload)
        }

        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }
}

var startGameWhack = true

function WhackARabbit(props){  
    let dispatch = useDispatch()
    let options = {...props, dispatch}
    let my_whack = new whack_game(options)
    let limit = 10
    const [time, setTime] = useState(limit)

	function ready(r){
		if(my_whack && document.getElementById("whack_canvas")){
            my_whack.ready(r)
        }
	}

    function counter(){
        let sec = limit
        let timer = setInterval(function(){
            sec--
            let text = sec
            if(sec <= 9){
                text = "0"+text
            }
            setTime(text)
            if(sec <= 0){
                clearInterval(timer)
                if(my_whack){
                    my_whack.end()
                }
            }
        }, 1000)
    }

    useEffect(() => {
        ready()
        $(window).resize(function(){
			ready('resize')
		})
		return () => {
			if(my_whack){
                my_whack.leave()
				my_whack = null
			}
		}
    }, [])

    useEffect(() => {
        counter()
    }, [])

    return <>
        <p id="whack_a_rabbit_timer">00:{time}</p>
        <div className="whack_a_rabbit_container">
            <canvas id="whack_canvas" className="shadow_concav"></canvas>
            <canvas id="whack_canvas_hammer"></canvas>
        </div>
    </>
}
export default WhackARabbit