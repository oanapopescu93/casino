import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { translate } from '../../../../translations/translate'
import { draw_dot, draw_rect } from '../../../../utils/games'

function Rabbit(config){
	let self = this

	self.id = config.id
	self.name = config.name
	self.color = config.color

	self.speed = config.speed
	self.delay = config.delay
	self.max_speed = config.max_speed
	self.min_speed = config.min_speed

	self.img_sit = config.img_sit
	self.img_move = config.img_move
	self.img_stop = config.img_stop

	self.x = config.x
	self.y = config.y
	self.w = config.w
	self.h = config.h
	self.y_original = config.y
	self.x_starting = config.x
	self.y_starting = config.y + 10

	self.frameWidth = 672
	self.frameHeight = 592
	self.frame = 0
	self.avg_dist = 0

    self.canvas = config.canvas
    self.ctx = config.ctx

	self.border_color = "white"
	if(self.color === "yellow" || self.color === "orange"){
		self.border_color = "black"
	}
	
	self.draw = ()=>{		
		self.drawStartingLine()
		self.ctx.drawImage(self.img_sit, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)		
	}

	self.run = (nr, finish_line_x)=>{
		self.drawStartingLine()

		if(nr >= self.delay){
			if(typeof finish_line_x === "undefined"){
				if(self.avg_dist > self.canvas.width / 2){
					self.x = self.x - 3
				}
			}			
			if(nr % self.speed === 0){
				self.frame++
				self.x = self.x + 3				
			}
			if(self.frame > 7){
				self.frame = 0
			}					
			self.ctx.drawImage(self.img_move, self.frame * self.frameWidth, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)			
		} else {
			self.ctx.drawImage(self.img_sit, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)
		}		
	}

	self.stop = (nr)=>{
		self.drawStartingLine()

		if(self.frame !== 4){	
			if(nr % self.speed === 0){
				self.frame++
				self.x = self.x + 5				
			}		
			if(self.frame > 7){
				self.frame = 0
			}						
			self.ctx.drawImage(self.img_move, self.frame * self.frameWidth, 2 * self.frameHeight, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)
		} else {
			self.ctx.drawImage(self.img_stop, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)
		}		
	}

    self.drawStartingLine = ()=>{
		draw_rect(self.ctx, 0, self.y_starting, 10, self.h, self.color, self.border, self.border_color)
	}

	self.changeSpeed = ()=>{
		let random_speed = Math.floor(Math.random() * self.max_speed) + self.min_speed
		self.speed = random_speed
	}

	self.moveView = (all)=>{
		let sum_dist = 0
		for(let i in all){
			sum_dist = sum_dist + all[i].x
		}
		self.avg_dist = sum_dist/all.length
	}
}

function Lane(config){
	let self = this
	self.id = config.id

	self.x = config.x
	self.y = config.y
	self.w = config.w
	self.h = config.h
	self.min_speed = 0

	self.rabbit = null
	self.rabbit_config = config.rabbit_config

	self.obstacles = []
	self.obstacle_img = config.obstacle_img
	self.obstacle_size = config.obstacle_size

    self.canvas = config.canvas
    self.ctx = config.ctx
	
	self.createRabbit = ()=>{
		self.rabbit = new Rabbit(self.rabbit_config)
	}

	self.action = (rabbitList, nr, finish_line_x)=>{
		//check collision
		self.rabbit.y = self.rabbit.y_original		
		if(self.collision()){
			self.rabbit.y = self.rabbit.y - 2 * self.obstacle_size[0]
		}

		//create and move obstacle
		self.createObstacles(nr, finish_line_x)
		self.moveObstacles(nr)

		//make rabbit run
		self.rabbit.changeSpeed()
		self.rabbit.moveView(rabbitList, nr)
		self.rabbit.run(nr, finish_line_x)

		self.getMinSpeed(rabbitList)
	}

	self.collision = ()=>{
		let collision = false	
		for(let i in self.obstacles){
			if(self.collisionEntities(self.rabbit, self.obstacles[i])){
				collision = true
				break
			}
		}
		return collision
	}
	self.collisionEntities = (rect01, rect02)=>{	
		let cond01 = rect01.x <= rect02.x + rect02.w
		let cond02 = rect01.y <= rect02.y + rect02.h
		let cond03 = rect02.x <= rect01.x + rect01.w
		let cond04 = rect02.y <= rect01.y + rect01.h		
		return cond01 && cond02 && cond03 && cond04
	}

    self.createObstacles = ()=>{
        if (Math.random() >= 0.01) return

        const x = self.canvas.width + self.obstacle_size[0]
        const t = self.obstacles.length + 1

        // Ensure spacing between obstacles if there are existing ones
        const canPlaceObstacle =
            self.obstacles.length === 0 ||
            x > self.obstacles[self.obstacles.length - 1].x + 10 * self.obstacle_size[0]

        if (!canPlaceObstacle) return

		// Create a new obstacle
        const obstacle = new Obstacle({
            id: self.id,
            name: `obstacle_${self.id}_${t}`,
            img: self.obstacle_img,
            color: "rgba(255, 215, 0, 0.1)",
            border: "rgba(255, 215, 0, 0.5)",
            border_color: 1,
            x,
            y: self.y,
            w: self.obstacle_size[0],
            h: self.obstacle_size[1],
            canvas: self.canvas,
            ctx: self.ctx
        })        
        self.obstacles.push(obstacle)
	}
    self.moveObstacles = (nr)=>{
		for(let i in self.obstacles){
			self.laneUpdate(self.obstacles[i], nr)
			self.drawObstacle(self.obstacles[i])
			if(self.obstacles[i].x < -50){
				self.obstacles.splice(i, 1) 
				i--
			}
		}
	}
    self.laneUpdate = (obstacle)=>{
		obstacle.x = obstacle.x - 3
	}
	self.drawObstacle = (obstacle)=>{
		obstacle.draw()
	}
    self.getMinSpeed = (all)=>{
		let min_speed = all[0].speed
		for(let i in all){
			if(min_speed > all[i].speed){
				min_speed = all[i].speed
			}
		}
		self.min_speed = min_speed
	}
}

function Obstacle(config){
	let self = this
	self.id = config.id + 1
	self.name = config.name
	self.img = config.img
	self.color = config.color
	self.border = config.border
	self.border_color = config.border_color
	self.x = config.x
	self.y = config.y + config.w
	self.w = config.w
	self.h = config.h
	self.frameWidth = 816
	self.frameHeight = 635
    self.canvas = config.canvas
    self.ctx = config.ctx

	self.draw = ()=>{
		let coord = self.y + self.h / 2
		self.ctx.drawImage(self.img, 0, 0, self.frameWidth, self.frameHeight, self.x, coord, self.w, self.h)
	}
}

function Land(config){
	let self = this
    self.layer = config.layer
    self.x = config.x
    self.y = config.y
    self.width = config.width
    self.height = config.height
}

function Landscape(config){
	let self = this
	let distance = 1

	self.x = -config.speed * distance
	self.y = config.y
    self.lands = []
	self.layer = config.layer
	self.width = {
		min: config.width.min,
    	max: config.width.max
	}
	self.height = {
		min: config.height.min,
    	max: config.height.max
	}
	self.speed = config.speed
	self.color = config.color
	self.color_stroke = config.color_stroke
	self.stroke = config.stroke
    self.canvas = config.canvas
    self.ctx = config.ctx

	self.populate = ()=>{
		let totalWidth = 0
		let x = 0
		while (totalWidth <= 2 * self.canvas.width + (10 * self.width.max)){
			let newWidth = Math.floor(Math.random() * self.width.max) + self.width.min
			let newHeight = Math.floor(Math.random() * self.height.max) + self.height.min
			if(self.lands.length !== 0){
				x = self.lands[self.lands.length - 1].x + self.lands[self.lands.length - 1].width + self.x
			}
			self.lands.push(new Land({
				layer: self.layer,
				width: newWidth,
				height: newHeight,
				color: self.color,
				color_stroke: self.color_stroke,
				stroke: self.stroke,
				x: x,
        		y: self.y - newHeight,
			}))

			totalWidth = totalWidth + newWidth
		}
	}

	self.draw = ()=>{
		self.ctx.save()
		self.ctx.translate(self.x, 0)
		self.ctx.beginPath()
		self.ctx.moveTo(self.lands[0].x, self.lands[0].y)
		
		for(let i=0; i < self.lands.length-1; i++){
			let point01 = (self.lands[i].x + self.lands[i + 1].x) / 2
			let point02 = (self.lands[i].y + self.lands[i + 1].y) / 2
			self.ctx.quadraticCurveTo(self.lands[i].x, self.lands[i].y, point01, point02)
		}
		self.ctx.lineTo(self.canvas.width - self.x, self.canvas.height)
    	self.ctx.lineTo(0 - self.x, self.canvas.height)

		self.ctx.fillStyle = self.color
		self.ctx.lineWidth = self.stroke
		self.ctx.strokeStyle = self.color_stroke
		self.ctx.fill()
		self.ctx.stroke()
		self.ctx.restore()
	}

	self.update = ()=>{
		let x = 0
		let newWidth = Math.floor(Math.random() * self.width.max) + self.width.min
		let newHeight = Math.floor(Math.random() * self.height.max) + self.height.min
		
		if(self.lands.length !== 0){
			x = self.lands[self.lands.length - 1].x + self.lands[self.lands.length - 1].width + self.x
		}

        let y = self.y - newHeight

		self.lands.push(new Land({
			layer: self.layer,
			width: newWidth,
			height: newHeight,
			color: self.color,
			color_stroke: self.color_stroke,
			stroke: self.stroke,
			x,
			y,
		}))
	}
}

function FinishLine(config){
	let self = this
	let space = 2

	self.fillStyle = config.fillStyle
	self.lineWidth = config.lineWidth
	self.strokeStyle = config.strokeStyle
	self.x = config.x
	self.y = config.y
	self.cube = config.cube	
    self.canvas = config.canvas	
    self.ctx = config.ctx	

	self.draw = ()=>{
		draw_rect(self.ctx, self.x, self.y, self.cube/2, self.canvas.height, self.fillStyle, self.lineWidth, self.strokeStyle) //line01
		
		//cubes
		let t = self.y - self.cube
		let z = 0
		while(t < self.canvas.height){
			t = t + self.cube
			z++
			if(z%2===0){
				draw_rect(self.ctx, self.x + 1 * self.cube + space, t, self.cube, self.cube, self.fillStyle, self.lineWidth, self.strokeStyle)
			} else {
				draw_rect(self.ctx, self.x + 2 * self.cube, t, self.cube, self.cube, self.fillStyle, self.lineWidth, self.strokeStyle)
			}
		}
		
		draw_rect(self.ctx, self.x + 4 * self.cube-space, self.y, self.cube/2, self.canvas.height, self.fillStyle, self.lineWidth, self.strokeStyle) //line03
	}
	self.move = (x)=>{
		self.x = x
	}
}

function race_game(props){
	let self = this
    const {settings, rabbitArray, images} = props
	const {theme} = settings
    
	let color = "gold"
	let color_transparent_1 = "rgba(255, 215, 0, 0.1)"
	let color_transparent_5 = "rgba(255, 215, 0, 0.5)"
	
	switch(theme){
		case "purple":
			color = "pink"
			color_transparent_1 = "rgba(255, 105, 180, 0.1)"
			color_transparent_5 = "rgba(255, 105, 180, 0.5)"
			break
		case "black":
			color = "green"
			color_transparent_1 = "rgba(50, 205, 50, 0.1)"
			color_transparent_5 = "rgba(50, 205, 50, 0.5)"
			break
		case "blue":
			color = "#ff8000"
			color_transparent_1 = "rgba(255, 128, 0, 0.1)"
			color_transparent_5 = "rgba(255, 128, 0, 0.5)"
			break
		case "green":
		default:
			color = "gold"
			color_transparent_1 = "rgba(255, 215, 0, 0.1)"
			color_transparent_5 = "rgba(255, 215, 0, 0.5)"
			break
	}

    let canvas
    let ctx
    let font_counter = 'bold 40px sans-serif'

    let landscape = []
	let lanscape_config = {}
	let land_color = [
		[color_transparent_1, color_transparent_5, 1], 
		[color_transparent_1, color_transparent_5, 1], 
		[color_transparent_1, color_transparent_5, 1]
	]	
    let draw_road_height	

	let rabbit_size

	let obstacle_size

    let finish_line
	let finish_line_x = 0

    let laneList = []
    let rabbitList = []
    let race_interval = 600

	self.running = true

    this.ready = ()=>{
		self.createCanvas()	
		self.start()
	}
    this.createCanvas = ()=>{
		canvas = document.getElementById("race_canvas")	
		ctx = canvas.getContext("2d")
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas.width = 400
				canvas.height = 280			
			} else {
				//small portrait
				canvas.width = 280
				canvas.height = 300		
			}
			lanscape_config = {
				y: 100,
				width: [1, 5, 1, 7],
				height: [20, 4, 30, 4],
				sun: [35, 35, 15],
			}
			draw_road_height = 101
			rabbit_size = [5, 100, 35, 35, -5]
			obstacle_size = [10, 10]
			font_counter = 'bold 30px sans-serif'
		} else {			
			if (window.innerWidth < 1200){
				//big
				canvas.width = 900
				canvas.height = 600
			} else if (window.innerWidth < 1400){
				//biger
				canvas.width = 1000
				canvas.height = 600
			} else {
				//the biggest
				canvas.width = 1200
				canvas.height = 600
			}
			draw_road_height = canvas.height/2 - 100
			rabbit_size = [10, 160, 80, 80, -10]
			lanscape_config = {
				y: 250,
				width: [1, 25, 1, 35],
				height: [100, 20, 150, 20],
				sun: [50, 50, 30],
			}
			font_counter = 'bold 40px sans-serif'
			obstacle_size = [20, 20]
		}
		finish_line_x = canvas.width
	}
    this.start = ()=>{
        laneList = self.createLane()
        rabbitList = self.getRabbits(laneList)
        self.background()
        self.drawRabbits('sit')
        setTimeout(()=>{
            self.counter(3)
       }, 500)
	}

    this.createLane = ()=>{
		let lanes = []        
		for(let i in rabbitArray){
			let rabbit_config = {
				id: rabbitArray[i].id, 
				name: rabbitArray[i].name, 
				color: rabbitArray[i].color, 
				img_sit: images[0], 
				img_move: images[1],
				img_stop: images[2], 
				speed: 0,
				delay: rabbitArray[i].delay,
				max_speed: rabbitArray[i].max_speed,
				min_speed: rabbitArray[i].min_speed,
				x: rabbit_size[0],
				y: rabbit_size[1]+i * (rabbit_size[3]+rabbit_size[4]),
				w: rabbit_size[2],
				h: rabbit_size[3],
                canvas, 
                ctx
			}
			let lane = new Lane({
				id: i,
				x: 0,
				y: rabbit_size[1] + i * (rabbit_size[3] + rabbit_size[4]),
				w: canvas.width,
				h: rabbit_size[3],
				rabbit_config,
				obstacle_img: images[3],
				obstacle_size,
                canvas, 
                ctx
			})
			lane.createRabbit()
			lanes.push(lane)			
		}
		return lanes
	}
    this.getRabbits = ()=>{
        let rabbits = []
		for(let i in laneList){
			rabbits.push(laneList[i].rabbit)
		}
		return rabbits
    }

    this.background = ()=>{
		self.createBackground()	
		self.drawBackground()	
		self.createFinishLine()
	}
	this.createBackground = ()=>{
        let t = land_color.length
		landscape = []
		while(t--){
			let config = {
				layer: t,
				y: lanscape_config.y,
				width: {
					min: (t + lanscape_config.width[0]) * lanscape_config.width[1],
					max: (t + lanscape_config.width[2]) * lanscape_config.width[3]
				},
				height: {
					min: lanscape_config.height[0] - (t * lanscape_config.height[1]),
					max: lanscape_config.height[2] - (t * lanscape_config.height[3])
				},
				speed: (t + 1) * 0.5,
				color: land_color[t][0],
				color_stroke: land_color[t][1],
				stroke: land_color[t][2],
                canvas,
                ctx
			}
			let my_land = new Landscape(config)
            my_land.populate()
			landscape.push(my_land)
		}
    }
    this.drawBackground = ()=>{
        ctx.clearRect(0, 0, canvas.width, canvas.height)
		self.drawSun()		
		let t = landscape.length
        while(t--){
			landscape[t].draw()
		}
        self.drawRoad(-100, 2 * canvas.width)
    }    
    this.drawSun = ()=>{        
        let x = canvas.width - lanscape_config.sun[0]
        let y = lanscape_config.sun[1]
        let r = lanscape_config.sun[2]
        draw_dot(ctx, x, y, r, 0, 2 * Math.PI, false, color_transparent_1, 1, color_transparent_5)
    }
    this.drawRoad = (x, w)=>{
        ctx.clearRect(0, draw_road_height, canvas.width, canvas.height)
		ctx.beginPath()
		ctx.fillStyle = color_transparent_1
		ctx.fillRect(x, draw_road_height, w, canvas.height)
		ctx.strokeStyle = color_transparent_5
		ctx.lineWidth = 1
		ctx.strokeRect(x, draw_road_height, w, canvas.height)
    }
    this.createFinishLine = ()=>{
        finish_line = new FinishLine({
			fillStyle: color_transparent_1,
			lineWidth: 1,
			strokeStyle: color_transparent_1,
			x: finish_line_x,
			y: draw_road_height,
			cube: 10,
            canvas, 
            ctx
		})
		finish_line.draw()
    }

    this.drawRabbits = (action, nr, finish_line_x)=>{
        switch(action){
            case "sit":
                for(let i in laneList){
                    laneList[i].rabbit.draw()
                }
                break
            case "run":
                for(let i in laneList){
                    laneList[i].action(rabbitList, nr, finish_line_x)
                }
                rabbitList = self.orderRabbits(rabbitList)
                self.postOrderRabbits(rabbitList)
                break
        }
	}
    this.orderRabbits = (list)=>{
		let done = false
		while(!done){
			done = true
			for (let i = 1; i < list.length; i += 1){
				if (list[i - 1].x < list[i].x){
					done = false
					let tmp = list[i - 1]
					list[i - 1] = list[i]
					list[i] = tmp
				} 
			}
		}
		return list
	}
    this.postOrderRabbits = (list)=>{
        const raceOrderElement = document.getElementById('race_order')
		if(raceOrderElement){
            raceOrderElement.innerHTML = ''
			list.forEach((rabbit, index) => {
                const place = index + 1
                const rabbitBox = document.createElement('div')
                rabbitBox.className = `rabbit_box_nr shadow_convex ${rabbit.color}`
                rabbitBox.textContent = place
                raceOrderElement.appendChild(rabbitBox)
            })
		}
	}

    this.counter = (totalTime)=>{
		let self_counter = this
		self_counter.totaTime = totalTime
		self_counter.timeRemaining = self_counter.totaTime
		let my_counter
		
		timerGame()

		function timerGame(){	
			my_counter = setInterval(()=>{				
				self.drawBackground()
				self.drawRabbits('sit')
				self.addText(self_counter.timeRemaining, canvas.width/2,  canvas.height/2-10, font_counter, color_transparent_5, "center", color, "1")

                self_counter.timeRemaining = self_counter.timeRemaining - 1
				if(self_counter.timeRemaining <= 0){
					clearInterval(my_counter)
					self.startRace()
				}
			}, 1000)
		}
	}
    this.addText = (text, x, y, font, color, text_align, stroke, line)=>{
		ctx.font = font
		ctx.textAlign = text_align
		if(stroke && line){
			ctx.strokeStyle = stroke
			ctx.lineWidth = line
			ctx.strokeText(text, x, y)
		}
		ctx.fillStyle = color
		ctx.fillText(text, x, y)	
	}

    this.startRace = ()=>{
		let nr = 0
        let moveLandscape = false
        // race_interval = 400 //test

		window.requestAnimFrame = (()=>{
			return  window.requestAnimationFrame	||
			window.webkitRequestAnimationFrame		||
			window.mozRequestAnimationFrame			||
			((callback) => window.setTimeout(callback, 1000 / 60))
	    })()
	  
		function runRace() {
			let stop = false            
            let avgDist = laneList[0].rabbit.avg_dist
		
            if (nr > race_interval) {
                let endRabbit = true
                let endFinishLine = true
                let sitRabbit = true

                // Move finish line
                if (finish_line_x > canvas.width / 2) {
                    finish_line_x -= 5
                    endFinishLine = false
                }

                //check if all rabbits passed the finish line
                endRabbit = self.checkRabbits('pass', finish_line_x)
                
                if (endRabbit && endFinishLine) {
                    // Check if all rabbits have finished running (we can't sit the rabbit midair)
                    sitRabbit = self.checkRabbits('finish')
    
                    self.drawBackground()
					finish_line.draw()
					laneList.forEach(lane => lane.rabbit.stop(nr))

					if (sitRabbit) {
						stop = true
						setTimeout(self.win_lose, 1000)
					} else {
						nr++
						stop = false
					}
                } else {
                    nr++
					stop = false
                    self.drawBackground()
                    finish_line.move(finish_line_x)
                    finish_line.draw()
    
                    if (endRabbit) {
                        laneList.forEach(lane => lane.rabbit.stop(nr))
                    } else {
                        self.drawRabbits('run', nr, finish_line_x)
                    }
                }
            } else {
                nr++
				stop = false
                if (!moveLandscape) {
                    if (avgDist > canvas.width / 2) {
                        moveLandscape = true
                    }
                } else {
                    // Update landscape
                    landscape.forEach(land => {
                        land.update()
                        land.lands.forEach(myLand => {
                            myLand.x += land.x
                        })
                    })
                }
    
                self.drawBackground()
                self.drawRabbits('run', nr)
            }

			if (stop) {
				window.cancelAnimationFrame(runRace)
				return
			}

			window.requestAnimationFrame(runRace)
		}

		runRace()
	}
    this.checkRabbits = (check_type, line)=>{
        switch(check_type){
            case "pass":
                //check if all rabbits passed the finish line
                let passed = true
                for(let i in laneList){		
                    if(laneList[i].rabbit.x < line){
                        passed = false
                        break
                    }
                }
                return passed
            case "finish":
                // Check if all rabbits have finished (frame 4)
                let finish = true
                for (let i in laneList) {
                    if (laneList[i].rabbit.frame !== 4) {
                        finish = false
                        break
                    }
                }
                return finish
        }
		
	}
    this.win_lose = ()=>{
		if(self.running){
			rabbitList = self.orderRabbits(rabbitList)
			props.handleRaceResults(rabbitList)
		}
    }

	this.leave = ()=>{
		self.running = false
	}
}

function RaceGame(props){
    const {settings, images, width, handleExit} = props
    const {lang} = settings

    let options = {...props}
    let my_race = new race_game(options)

    function ready(){
		if(my_race && document.getElementById("race_canvas")){
            my_race.ready()
        }
	}

    useEffect(() => {
        if(images){
            ready()
        }
		return () => {
			my_race.leave()
		}
    }, [images, width])

    return <>
        <div className="race_order_container">
			<div id="race_order"></div>
		</div>
		<canvas id="race_canvas" className="shadow_convex" />
        <div className="button_action_group race_buttons_container">			
			<div className="tooltip">
				<Button 
					type="button" 
					className="mybutton round button_transparent shadow_convex"
					onClick={()=>handleExit()} 
				><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
				<span className="tooltiptext">{translate({lang, info: "back"})}</span>
			</div>
		</div>
    </>
}

export default RaceGame