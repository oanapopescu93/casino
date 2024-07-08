import React, {useEffect, useState, useRef} from 'react'
import { useDispatch} from 'react-redux'
import $ from 'jquery'
import { get_whack_a_rabbit_img, isInside } from '../../../../utils/games'
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
    self.killed = false

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
    self.change_killed = function(status){
		self.killed = status
	}
}

function whack_game(props){
    let self = this
    this.images = []

    this.secs = 10
    let duration = 1000
    let lastSpawn = Date.now()  
    let spawnRate = Math.round(Math.random() * (2000 - 1000) + 1000)

    let canvas
    let canvas_hammer
    let ctx
    let ctx_hammer

    let items = props.items
    let target_size = []
    let target_array = []

    let dispatch = props.dispatch

    this.ready = function(reason){
        if(reason !== "resize"){            
            canvas = document.getElementById("whack_canvas")
            canvas_hammer = document.getElementById("whack_canvas_hammer")
            self.getImage().then((res)=>{
                self.images = res
                if(canvas && canvas_hammer){
                    self.start()
                }
            })
        } else {
            if(canvas && canvas_hammer){
                self.start()
            }
        }       
    }

    this.createCanvas = function(){	
		ctx = canvas.getContext("2d")
        ctx_hammer = canvas_hammer.getContext("2d")
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape
				canvas.width = canvas_hammer.width = 400
				canvas.height = canvas_hammer.height = 300
			} else {
				//small portrait
				canvas.width = canvas_hammer.width = 280
				canvas.height = canvas_hammer.height = 300
			}
            target_size = [70, 70]
		} else {
			//big
			canvas.width = canvas_hammer.width = 900
			canvas.height = canvas_hammer.height = 480
            target_size = [100, 100]
		}
        if(props.whack_a_rabbit_container_ref && props.whack_a_rabbit_container_ref.current){
            let height = canvas.height + 10
            props.whack_a_rabbit_container_ref.current.style.height = height + 'px'
        }
	}
    this.getImage = function(){
        return new Promise(function(resolve, reject){
            let promises = []
            for(let i in items){				
                promises.push(self.preaload_images(items[i]))
            }
            Promise.all(promises).then(function(result){
                resolve(result)
            })
		})
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
    this.drawHammer = function(){
        if(ctx_hammer){
            canvas_hammer.addEventListener("mousemove", function(event) {
                const rect = canvas_hammer.getBoundingClientRect()
                const mouseX = event.clientX - rect.left
                const mouseY = event.clientY - rect.top
                ctx_hammer.clearRect(0, 0, canvas_hammer.width, canvas_hammer.height)
                self.drawHammerAtPosition(mouseX, mouseY)
            })
        }
    }
    this.drawHammerAtPosition = function(x, y){        
        let hammer_x = x - target_size[0]/2
        let hammer_y = y - target_size[1]/2
        ctx_hammer.drawImage(self.images[4], 0, 0, 260, 260, hammer_x, hammer_y, target_size[0], target_size[1])
    }

    this.getTimer = function(secs){
        self.secs = secs
    }
    this.start = function(){		
        self.createCanvas()
        self.drawHammer()
        self.handleClick()
        ctx.clearRect(0,0, canvas.width, canvas.height)
        self.animation(duration)
	}
    this.animation = function(time){ 
		let spin_nr = 0
		let spin_time = time        

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
				} else {
					spin_nr++					
					stop = false
                    if(self.secs === 0){
                        stop = true
                    }
				}
                self.play(stop)		
            
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
    this.play = function(stop){
        if(!stop){
            let currentTime = Date.now()
            if (currentTime > (lastSpawn + spawnRate)) {
                lastSpawn = currentTime
                spawnRate = Math.round(Math.random() * (2000 - 1000) + 1000)
                self.drawAll()
            }
        } else {
            self.win_lose() //the game ended
        }
        
    }
    this.drawAll = function(){
        ctx.clearRect(0,0, canvas.width, canvas.height)
		self.createTarget()
        self.drawTarget()
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
    this.drawTarget = function(){
		for(let i in target_array){
            target_array[i].change_active(false)
            if(parseInt(i) === target_array.length-1){ //meaning it's the last rabbit to spawn
                target_array[i].change_active(true) //it will be shown (the rest will only show a hole)
            }
            target_array[i].draw(ctx)
        }
	}

    this.handleClick = function(){
		if(ctx_hammer){
            canvas_hammer.addEventListener("click", function(event) {
                const rect = canvas_hammer.getBoundingClientRect()
                self.canvas_click({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top
                })
            })
        }
	}
    this.canvas_click = function(mouse){
        for(let i in target_array){
            let obj = {x: target_array[i].x, y: target_array[i].y, width: target_array[i].w, height: target_array[i].h}
			if(isInside(mouse, obj) && target_array[i].active && !target_array[i].killed){
                target_array[i].change_killed(true)
                self.hammerAnimation(mouse)
            }
        }
    }
    this.hammerAnimation = function(obj){
        hammerUp(obj).then(function() {
            ctx_hammer.clearRect(0, 0, canvas_hammer.width, canvas_hammer.height)
			hammerDown(obj).then(function() {
                ctx_hammer.clearRect(0, 0, canvas_hammer.width, canvas_hammer.height)
				hammerUp(obj).then(function() {
                    ctx_hammer.clearRect(0, 0, canvas_hammer.width, canvas_hammer.height)
                })
			})
		})
    }
    function hammerUp(obj){
        return new Promise(function(resolve, reject){
            let hammer_x = obj.x - target_size[0]/2
            let hammer_y = obj.y - target_size[1]/2
            ctx_hammer.drawImage(self.images[4], 0, 0, 260, 260, hammer_x, hammer_y, target_size[0], target_size[1])
            setTimeout(function(){
                resolve(true)					
            }, 100)
        })
    }    
    function hammerDown(obj){
        return new Promise(function(resolve, reject){
            let hammer_x = obj.x - target_size[0]/2
            let hammer_y = obj.y - target_size[1]/2
            ctx_hammer.drawImage(self.images[5], 0, 0, 260, 260, hammer_x, hammer_y, target_size[0], target_size[1])
            setTimeout(function(){
                resolve(true)
            }, 100)
        })
    }

    this.win_lose = function(){
        const target_array_killed = target_array.filter(item => item.killed).length
        if(target_array_killed > 0){
            let game = null
            if(props.page && props.page.game){
                game = props.page.game
            }
            let money = props.user.money ? decryptData(props.user.money) : 0 

            let whack_payload = {
                uuid: props.user.uuid,
                game: game,
                money: money + target_array_killed,
                status: 'win',
                bet: target_array_killed
            }

            if(typeof props.results === "function"){
                props.results(whack_payload)
            }

            dispatch(changePage('Salon'))
            dispatch(changeGame(null))
            dispatch(changeGamePage(null))
        }
    }
    this.leave = function(){ // in this game if you leave, you don't lose anything
        target_array = []
    }
}

function WhackARabbit(props){  
    let dispatch = useDispatch()
    let whack_a_rabbit_container_ref = useRef(null)
    let items = get_whack_a_rabbit_img()

    let options = {...props, dispatch, whack_a_rabbit_container_ref, items}
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
            if(my_whack){
                my_whack.getTimer(sec)
            }            
            if(sec <= 0){
                clearInterval(timer)
                if(my_whack){
                    my_whack.win_lose()
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
        <div className="whack_a_rabbit_container" ref={whack_a_rabbit_container_ref}>
            <canvas id="whack_canvas" className="shadow_concav" />
            <canvas id="whack_canvas_hammer" />
        </div>
    </>
}
export default WhackARabbit