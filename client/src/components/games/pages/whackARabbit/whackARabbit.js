import React, {useEffect, useState, useRef} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import $ from 'jquery'
import { get_whack_a_rabbit_img, isInside } from '../../../../utils/games'
import { decryptData } from '../../../../utils/crypto'
import { changeGame, changeGamePage, changePage } from '../../../../reducers/page'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHourglassStart, faHourglassHalf, faHourglassEnd, faGavel } from '@fortawesome/free-solid-svg-icons'

function Target(config){
	let self = this
    self.id = config.id
	self.img = config.img
    self.img_hit = config.img_hit
    self.hole = config.hole
	self.x = config.x
	self.y = config.y
	self.w = config.w
	self.h = config.h
	self.frameWidth = 250
	self.frameHeight = 250
    self.active = config.active
    self.killed = false

	self.draw = (ctx)=>{
        if(self.killed){
            ctx.drawImage(self.img_hit, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)
        } else {
            if(self.active){
                ctx.drawImage(self.img, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)
            } else {
                ctx.drawImage(self.hole, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)
            }           
        }
	}
    self.change_active = (status)=>{
		self.active = status
	}
    self.change_killed = (status)=>{
		self.killed = status
	}
}

function whack_game(props){
    const {money} = props
    
    let self = this
    this.images = []

    this.secs = 10
    let duration = 1000
    let lastSpawn = Date.now()  
    let spawnRate = Math.round(Math.random() * (3000 - 1000) + 1000)

    let canvas
    let canvasHammer
    let ctx
    let ctxHammer

    let items = props.items
    let targetSize = []
    let targetArray = []

    let dispatch = props.dispatch

    this.ready = (reason)=>{
        if(reason !== "resize"){            
            canvas = document.getElementById("whack_canvas")
            canvasHammer = document.getElementById("whack_canvas_hammer")
            self.getImage().then((res)=>{
                self.images = res
                if(canvas && canvasHammer){
                    self.start()
                }
            })
        } else {
            if(canvas && canvasHammer){
                self.start()
            }
        }       
    }

    this.createCanvas = ()=>{	
		ctx = canvas.getContext("2d")
        ctxHammer = canvasHammer.getContext("2d")
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape
				canvas.width = canvasHammer.width = 400
				canvas.height = canvasHammer.height = 280
			} else {
				//small portrait
				canvas.width = canvasHammer.width = 280
				canvas.height = canvasHammer.height = 280
			}
            targetSize = [70, 70]
		} else {
			//big
			canvas.width = canvasHammer.width = 900
			canvas.height = canvasHammer.height = 480
            targetSize = [100, 100]
		}
        if(props.whack_a_rabbit_container_ref && props.whack_a_rabbit_container_ref.current){
            props.whack_a_rabbit_container_ref.current.style.height = canvas.height + 'px'
        }
	}
    this.getImage = ()=>{
        return new Promise((resolve)=>{
            let promises = []
            for(let i in items){				
                promises.push(self.preaload_images(items[i]))
            }
            Promise.all(promises).then((result)=>{
                resolve(result)
            })
		})
	}
    this.preaload_images = (item)=>{
		return new Promise((resolve)=>{
			let image = new Image()
			image.id = item.id
			image.src = item.src
			image.addEventListener("load", ()=>{
				resolve(image)
			}, false)
		})
	}
    this.drawHammer = ()=>{
        if(ctxHammer){
            canvasHammer.addEventListener("mousemove", (event)=>{
                const rect = canvasHammer.getBoundingClientRect()
                const mouseX = event.clientX - rect.left
                const mouseY = event.clientY - rect.top
                ctxHammer.clearRect(0, 0, canvasHammer.width, canvasHammer.height)
                self.drawHammerAtPosition(mouseX, mouseY)
            })
        }
    }
    this.drawHammerAtPosition = (x, y)=>{        
        let hammer_x = x - targetSize[0]/2
        let hammer_y = y - targetSize[1]/2
        ctxHammer.drawImage(self.images[7], 0, 0, 260, 260, hammer_x, hammer_y, targetSize[0], targetSize[1])
    }

    this.getTimer = (secs)=>{
        self.secs = secs
    }
    this.start = ()=>{        
        self.createCanvas()
        self.drawHammer()
        self.handleClick()
        ctx.clearRect(0,0, canvas.width, canvas.height)
        self.animation(duration)
	}

    this.animation = (time)=>{
        let spinNr = 0
        const spinTime = time    
        
        window.requestAnimFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            ((callback) => window.setTimeout(callback, 1000 / 60))    
       
        function runWhackARabbit() {
            if (!ctx) {
                window.cancelAnimationFrame(runWhackARabbit)
                return
            }
            
            let stop = false
            
            if (spinNr > spinTime || self.secs === 0) {
                stop = true
            } else {
                spinNr++
            }
            
            self.play(stop)

            if (stop) {
                window.cancelAnimationFrame(runWhackARabbit)
                return
            } 
            
            window.requestAnimationFrame(runWhackARabbit)
        }    
        
        runWhackARabbit()
    }
    
    this.play = (stop)=>{
        if(!stop){
            let currentTime = Date.now()
            if (currentTime > (lastSpawn + spawnRate)) {
                lastSpawn = currentTime
                spawnRate = Math.round(Math.random() * (3000 - 1000) + 1000)
                self.drawAll()
            }
        } else {
            self.win_lose() //the game ended
        }
        
    }
    this.drawAll = (hit)=>{
        ctx.clearRect(0,0, canvas.width, canvas.height)
        if(!hit){
            self.createTarget()
        }
        self.drawTarget()
	}
    this.createTarget = ()=>{
        let x, y
        let validPosition = false
        while (!validPosition) {
            x = Math.round(Math.random() * (canvas.width - 2 * targetSize[0]) + targetSize[0])
            y = Math.round(Math.random() * (canvas.height - 2 * targetSize[1]) + targetSize[1])
            validPosition = true
            for (let i = 0; i < targetArray.length; i++) {
                let existingTarget = targetArray[i]
                if(x < existingTarget.x + existingTarget.w && x + targetSize[0] > existingTarget.x && y < existingTarget.y + existingTarget.h && y + targetSize[1] > existingTarget.y){
                    validPosition = false
                    break
                }
            }
        }    
        let t = Math.floor(Math.random() * (3 - 1 + 1)) + 1
        let target = new Target({
            id: targetArray.length,
            id_img: items[t].id,
            img: self.images[t],
            img_hit: self.images[t + 3],
            hole: self.images[0],
            x,
            y,
            w: targetSize[0],
            h: targetSize[1],
        })

        targetArray.push(target)
    }
    this.drawTarget = ()=>{
		for(let i in targetArray){
            targetArray[i].change_active(false)
            if(parseInt(i) === targetArray.length-1){ //meaning it's the last rabbit to spawn
                targetArray[i].change_active(true) //it will be shown (the rest will only show a hole)
            }
            targetArray[i].draw(ctx)
        }
	}

    this.handleClick = ()=>{
		if(ctxHammer){
            canvasHammer.addEventListener("click", (event)=>{
                const rect = canvasHammer.getBoundingClientRect()
                self.canvas_click({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top
                })
            })
        }
	}
    this.canvas_click = (mouse)=>{
        for(let i in targetArray){
            let obj = {x: targetArray[i].x, y: targetArray[i].y, width: targetArray[i].w, height: targetArray[i].h}
			if(isInside(mouse, obj) && targetArray[i].active && !targetArray[i].killed){                
                targetArray[i].change_killed(true)
                self.hammerAnimation(mouse)
            }
        }
        self.drawAll('hit')
    }
    this.hammerAnimation = (obj)=>{
        hammerUp(obj).then(()=>{
            ctxHammer.clearRect(0, 0, canvasHammer.width, canvasHammer.height)
			hammerDown(obj).then(()=>{
                ctxHammer.clearRect(0, 0, canvasHammer.width, canvasHammer.height)
				hammerUp(obj).then(()=>{
                    ctxHammer.clearRect(0, 0, canvasHammer.width, canvasHammer.height)
                })
			})
		})
    }
    function hammerUp(obj){
        return new Promise((resolve)=>{
            let hammer_x = obj.x - targetSize[0]/2
            let hammer_y = obj.y - targetSize[1]/2
            ctxHammer.drawImage(self.images[7], 0, 0, 260, 260, hammer_x, hammer_y, targetSize[0], targetSize[1])
            setTimeout(()=>{
                resolve(true)					
            }, 100)
        })
    }    
    function hammerDown(obj){
        return new Promise((resolve)=>{
            let hammer_x = obj.x - targetSize[0]/2
            let hammer_y = obj.y - targetSize[1]/2
            ctxHammer.drawImage(self.images[8], 0, 0, 260, 260, hammer_x, hammer_y, targetSize[0], targetSize[1])
            setTimeout(()=>{
                resolve(true)
            }, 100)
        })
    }

    this.win_lose = ()=>{
        const targetArrayKilled = targetArray.filter(item => item.killed).length
        if(targetArrayKilled > 0){
            let game = null
            if(props.page && props.page.game){
                game = props.page.game
            }            

            let whack_payload = {
                uuid: props.user.uuid,
                game: game,
                money: money + targetArrayKilled,
                status: 'win',
                bet: targetArrayKilled
            }

            props.results(whack_payload)

            dispatch(changePage('Salon'))
            dispatch(changeGame(null))
            dispatch(changeGamePage(null))
        }
    }
    this.leave = ()=>{ // in this game if you leave, you don't lose anything
        targetArray = []
    }
    this.getTargetsHit = ()=>{
        return targetArray.filter(item => item.killed).length
    }
}

function WhackARabbit(props){
    let dispatch = useDispatch()
    let whack_a_rabbit_container_ref = useRef(null)
    let items = get_whack_a_rabbit_img(props.settings.theme)

    let moneyEncrypted = useSelector(state => state.auth.money)
    let money = moneyEncrypted ? decryptData(moneyEncrypted) : 0

    let options = {...props, dispatch, whack_a_rabbit_container_ref, items, money}
    let my_whack = new whack_game(options)
    let limit = 20
    const [time, setTime] = useState(limit)
    const [numberTargetsHit, setNumberTargetsHit] = useState(0)

	function ready(r){
		if(my_whack && document.getElementById("whack_canvas")){
            my_whack.ready(r)
        }
	}

    function counter(){
        let sec = limit
        let timer = setInterval(()=>{
            sec--
            let text = sec
            if(sec <= 9){
                text = "0"+text
            }
            setTime(text)
            if(my_whack){
                my_whack.getTimer(sec)
                setNumberTargetsHit(my_whack.getTargetsHit())
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
        $(window).resize(()=>{
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

    const getHourglassIcon = () => {
        if (time > limit * 0.66) {
            return faHourglassStart
        } else if (time > limit * 0.33) {
            return faHourglassHalf
        } else {
            return faHourglassEnd
        }
    }

    return <div id="whack_a_rabbit" className='game_container whack_a_rabbit_container'>
        <div className='game_box'>
            <div className="whack_a_rabbit_header">
                <p><FontAwesomeIcon icon={getHourglassIcon()} /> <span>00:{time}</span></p>
                <p><FontAwesomeIcon icon={faGavel} /> <span>{numberTargetsHit}</span></p>
            </div>
            <div className="whack_a_rabbit_canvas" ref={whack_a_rabbit_container_ref}>
                <canvas id="whack_canvas" className="shadow_concav" />
                <canvas id="whack_canvas_hammer" />
            </div>
        </div>
    </div>
}
export default WhackARabbit