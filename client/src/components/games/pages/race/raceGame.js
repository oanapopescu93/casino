import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { draw_dot, draw_rect } from '../../../../utils/games'
import rabbit_sit from '../../../../img/rabbit_move/rabbit000.png'
import rabbit_move from '../../../../img/rabbit_move/rabbit_move_colored.png'
import obstacle from '../../../../img/icons/obstacle.png'
import { decryptData } from '../../../../utils/crypto'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import $ from 'jquery'
import { translate } from '../../../../translations/translate'

function Land(config) {
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
	self.populate = function (canvas){
		let totalWidth = 0
		let x = 0
		while (totalWidth <= 2*canvas.width + (10 * self.width.max)) {
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
	self.draw = function(canvas, ctx){
		ctx.save()
		ctx.translate(self.x, 0)
		ctx.beginPath()
		let lands = self.lands
		ctx.moveTo(self.lands[0].x, self.lands[0].y)
		
		for(let i=0; i<lands.length-1; i++){
			let point01 = (self.lands[i].x + self.lands[i + 1].x) / 2
			let point02 = (self.lands[i].y + self.lands[i + 1].y) / 2
			ctx.quadraticCurveTo(self.lands[i].x, self.lands[i].y, point01, point02)
		}
		ctx.lineTo(canvas.width - self.x, canvas.height)
    	ctx.lineTo(0 - self.x, canvas.height)

		ctx.fillStyle = self.color
		ctx.lineWidth = self.stroke
		ctx.strokeStyle = self.color_stroke
		ctx.fill()
		ctx.stroke()
		ctx.restore()
	}
	self.update = function(){
		let x = 0
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
	}
}

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

	self.border_color = "white"
	if(self.color === "yellow" || self.color === "orange"){
		self.border_color = "black"
	}
	
	self.draw = function(ctx){
		let coord2 = self.y+self.h/2 - 5
		self.draw_starting(ctx, 0, coord2, 10, self.h, 10, 0, 2 * Math.PI, false, self.color, self.border, self.border_color)
		ctx.drawImage(self.img_sit, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)		
	}

	self.draw_starting = function(ctx, x, y, width, height, r, sAngle, eAngle, counterclockwise, fillStyle, lineWidth, strokeStyle){
		draw_rect(ctx, 0, self.y_starting, width, height, fillStyle, lineWidth, strokeStyle)
	}

	self.run = function(canvas, ctx, nr, finish_line_x){
		let coord2 = self.y+self.h/2 - 5
		self.draw_starting(ctx, 0, coord2, 10, self.h, 10, 0, 2 * Math.PI, false, self.color, self.border, self.border_color)

		if(nr >= self.delay){
			if(typeof finish_line_x === "undefined"){
				if(self.avg_dist > canvas.width/2){
					self.x = self.x-3
				}
			}			
			if(nr % self.speed === 0){
				self.frame++
				self.x = self.x+3				
			}
			if(self.frame > 7){
				self.frame = 0
			}					
			ctx.drawImage(self.img_move, self.frame * self.frameWidth, 2 * self.frameHeight, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)			
		} else {
			ctx.drawImage(self.img_sit, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)
		}
		
	}

	self.add_text = function(ctx, text, x, y, font, color, text_align, stroke, line){
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

	self.stop = function(ctx, nr){
		let coord2 = self.y+self.h/2 - 5
		self.draw_starting(ctx, 0, coord2, 10, self.h, 10, 0, 2 * Math.PI, false, self.color, self.border, self.border_color)

		if(self.frame !== 4){	
			if(nr % self.speed === 0){
				self.frame++
				self.x = self.x+5				
			}		
			if(self.frame > 7){
				self.frame = 0
			}						
			ctx.drawImage(self.img_move, self.frame * self.frameWidth, 2 * self.frameHeight, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)
		} else {
			ctx.drawImage(self.img_stop, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h)
		}		
	}

	self.change_speed = function(){
		let random_speed = Math.floor(Math.random() * self.max_speed) + self.min_speed
		self.speed = random_speed
	}

	self.move_view = function(all){
		let sum_dist = 0
		for(let i in all){
			sum_dist = sum_dist + all[i].x
		}
		self.avg_dist = sum_dist/all.length
	}
}

function Obstacle(config){
	let self = this
	self.id = config.id+1
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

	self.draw = function(ctx){
		let coord = self.y+self.h/2
		ctx.drawImage(self.img, 0, 0, self.frameWidth, self.frameHeight, self.x, coord, self.w, self.h)
	}
	self.add_text = function(ctx, text, x, y, font, color, text_align, stroke, line){
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
	
	self.create_rabbit = function(){
		self.rabbit = new Rabbit(self.rabbit_config)
	}

	self.create_obstacles = function(canvas){		
		let chance = Math.random() < 0.01 //probability of 1%		
		if(chance){
			let x = canvas.width + self.obstacle_size[0]
			let t = self.obstacles.length+1
			if(self.obstacles.length>0){
				if(x > self.obstacles[self.obstacles.length-1].x + 10*self.obstacle_size[0]){					
					let obstacle = new Obstacle({
						id: self.id,
						name: "obstacle_" + self.id + '_' + t,
						img: self.obstacle_img,
						color: 'rgba(255, 215, 0, 0.1)',
						border: 'rgba(255, 215, 0, 0.5)',
						border_color: 1,
						x: x,
						y: self.y,
						w: self.obstacle_size[0],
						h: self.obstacle_size[1],
					})
					self.obstacles.push(obstacle)
				}
			} else {
				let obstacle = new Obstacle({
					id: self.id,
					name: "obstacle_" + self.id + '_' + t,
					img: self.obstacle_img,
					color: 'rgba(255, 215, 0, 0.1)',
					border: 'rgba(255, 215, 0, 0.5)',
					border_color: 1,
					x: x,
					y: self.y,
					w: self.obstacle_size[0],
					h: self.obstacle_size[1],
				})
				self.obstacles.push(obstacle)
			}
		}
	}

	self.lane_update = function(obstacle){
		obstacle.x = obstacle.x-3
	}

	self.draw_obstacle = function(ctx, obstacle){
		obstacle.draw(ctx)
	}

	self.move_obstacles = function(ctx, nr){
		for(let i in self.obstacles){
			self.lane_update(self.obstacles[i], nr)
			self.draw_obstacle(ctx, self.obstacles[i])
			if(self.obstacles[i].x < -50){
				self.obstacles.splice(i, 1) 
				i--
			}
		}
	}

	self.collision = function(){
		let collision = false	
		for(let i in self.obstacles){
			if(self.collision_entities(self.rabbit, self.obstacles[i])){
				collision = true
				break
			}
		}
		return collision
	}
	self.collision_entities = function(rect01, rect02){	
		let cond01 = rect01.x <= rect02.x + rect02.w
		let cond02 = rect01.y <= rect02.y + rect02.h
		let cond03 = rect02.x <= rect01.x + rect01.w
		let cond04 = rect02.y <= rect01.y + rect01.h		
		return cond01 && cond02 && cond03 && cond04
	}

	self.action = function(canvas, ctx, rabbit_list, nr, finish_line_x){	
		//check collision
		self.rabbit.y = self.rabbit.y_original		
		if(self.collision()){					
			self.rabbit.y_original = self.rabbit.y
			self.rabbit.y = self.rabbit.y - 2*self.obstacle_size[0]
		}

		//create and move obstacle
		self.create_obstacles(canvas, nr, finish_line_x)
		self.move_obstacles(ctx, nr)

		//make rabbit run
		self.rabbit.change_speed()
		self.rabbit.move_view(rabbit_list, nr)
		self.rabbit.run(canvas, ctx, nr, finish_line_x)

		self.get_min_speed(rabbit_list, nr)
	}

	self.get_min_speed = function(all){
		let min_speed = all[0].speed
		for(let i in all){
			if(min_speed > all[i].speed){
				min_speed = all[i].speed
			}
		}
		self.min_speed = min_speed
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

	self.draw = function(canvas, ctx, x){
		draw_rect(ctx, self.x, self.y, self.cube/2, canvas.height, self.fillStyle, self.lineWidth, self.strokeStyle) //line01
		
		//cubes
		let t = self.y-self.cube
		let z = 0
		while(t<canvas.height){
			t = t+self.cube
			z++
			if(z%2===0){
				draw_rect(ctx, self.x+1*self.cube+space, t, self.cube, self.cube, self.fillStyle, self.lineWidth, self.strokeStyle)
			} else {
				draw_rect(ctx, self.x+2*self.cube, t, self.cube, self.cube, self.fillStyle, self.lineWidth, self.strokeStyle)
			}
		}
		
		draw_rect(ctx, self.x + 4*self.cube-space, self.y, self.cube/2, canvas.height, self.fillStyle, self.lineWidth, self.strokeStyle) //line03
	}
	self.move = function(x){
		self.x = x
	}
}

function race_game(props){
	let self = this
	let rabbit_array = []
	if(props.home.race_rabbits && props.home.race_rabbits.length>0){
		rabbit_array = props.home.race_rabbits.filter(function(x){
			return x.participating
		})
	}
	for(let i in rabbit_array){
		for(let j in props.bets){			
			if(rabbit_array[i].id === props.bets[j].id){
				rabbit_array[i] = {... rabbit_array[i], bet: props.bets[j].bet}
				if(props.bets[j].place){
					rabbit_array[i] = {... rabbit_array[i], place: parseInt(props.bets[j].place)}
				}
			}
		}
	}
	
	let lane_list = []
	let rabbit_list = []
	let money_per_win = 10
    
    let canvas
    let ctx
	let font_counter = 'bold 40px sans-serif'

	let landscape = []
	let lanscape_config = {}
	let land_color = [
		['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.5)', 1], 
		['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.5)', 1], 
		['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.5)', 1]
	]	
	let draw_road_height

	let rabbit_img_sit = {src: rabbit_sit}
	let rabbit_img_move = {src: rabbit_move}
	let rabbit_img_stop = {src: rabbit_sit}
	let obstacle_img = {src: obstacle}
	let rabbit_size
	let obstacle_size

	let finish_line
	let finish_line_x = 0
	let race_interval = 800
	let game_status = false
		
	this.ready = function(reason){
		startGameRace = false //the game immediately begins		
		self.createCanvas()	
		self.start(reason)
	}

	this.createCanvas = function(){	
		canvas = document.getElementById("race_canvas")	
		ctx = canvas.getContext("2d")
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas.width = 300
				canvas.height = 300			
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

	this.start = function(reason){
		let promises = []
		if(reason !== "resize"){
			promises.push(self.preaload_images(rabbit_img_sit))
			promises.push(self.preaload_images(rabbit_img_move))
			promises.push(self.preaload_images(rabbit_img_stop))
			promises.push(self.preaload_images(obstacle_img))
			Promise.all(promises).then(function(result){
				lane_list = self.create_lane(result)
				rabbit_list = self.get_rabbits(lane_list)
				self.background()
				self.draw_rabbits('sit')
				setTimeout(function(){
				 	self.counter(3)
				}, 500)
			})			
		} else {
			self.background()
			self.draw_rabbits('sit')
			setTimeout(function(){
			 	self.counter(3)
			}, 500)
		}
	}

	this.preaload_images = function(item){
		return new Promise(function(resolve, reject){
			let image = new Image()
			image.src = item.src
			image.addEventListener("load", function() {
				resolve(image)
			}, false)
		})
	}
	this.create_lane = function(img){
		let lanes = []
		for(let i in rabbit_array){
			let rabbit_config = {
				id: rabbit_array[i].id, 
				name: rabbit_array[i].name, 
				color: rabbit_array[i].color, 
				img_sit: img[0], 
				img_move: img[1],
				img_stop: img[2], 
				speed: 0,
				delay: rabbit_array[i].delay,
				max_speed: rabbit_array[i].max_speed,
				min_speed: rabbit_array[i].min_speed,
				x: rabbit_size[0],
				y: rabbit_size[1]+i*(rabbit_size[3]+rabbit_size[4]),
				w: rabbit_size[2],
				h: rabbit_size[3],
			}
			let lane = new Lane({
				id: i,
				x: 0,
				y: rabbit_size[1]+i*(rabbit_size[3]+rabbit_size[4]),
				w: canvas.width,
				h: rabbit_size[3],
				rabbit_config: rabbit_config,
				obstacle_img: img[3],
				obstacle_size: obstacle_size,
			})
			lane.create_rabbit()
			lanes.push(lane)			
		}
		return lanes
	}
	self.get_rabbits = function(lane_list){
		let rabbits = []
		for(let i in lane_list){
			rabbits.push(lane_list[i].rabbit)
		}
		return rabbits
	}

	this.background = function(){
		self.create_background()	
		self.draw_background()	
		self.create_finish_line(finish_line_x)
	}
	this.create_background = function(){
		let i = land_color.length
		landscape = []
		while(i--){
			let config = {
				layer: i,
				y: lanscape_config.y,
				width: {
					min: (i + lanscape_config.width[0]) * lanscape_config.width[1],
					max: (i + lanscape_config.width[2]) * lanscape_config.width[3]
				},
				height: {
					min: lanscape_config.height[0] - (i * lanscape_config.height[1]),
					max: lanscape_config.height[2] - (i * lanscape_config.height[3])
				},
				speed: (i + 1) * 0.5,
				color: land_color[i][0],
				color_stroke: land_color[i][1],
				stroke: land_color[i][2]
			}
			let my_land = new Landscape(config)
			my_land.populate(canvas)
			landscape.push(my_land)
		}	
	}
	this.draw_background = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		self.draw_sun(canvas, ctx)		
		let i = landscape.length
		while (i--) {
			landscape[i].draw(canvas, ctx)
		}
		self.draw_road(canvas, ctx, -100, draw_road_height, 2*canvas.width, draw_road_height, 1, "rgba(255, 215, 0, 0.1)", "rgba(255, 215, 0, 0.5)")		
	}
	this.create_finish_line = function(finish_line_x){
		finish_line = new FinishLine({
			fillStyle: "rgba(255, 215, 0, 0.1)",
			lineWidth: 1,
			strokeStyle: "rgba(255, 215, 0, 0.1)",
			x: finish_line_x,
			y: draw_road_height,
			cube: 10,
		})
		finish_line.draw(canvas, ctx)
	}
	this.draw_sun = function(canvas, ctx){
		draw_dot(ctx, canvas.width-lanscape_config.sun[0], lanscape_config.sun[1], lanscape_config.sun[2], 0, 2 * Math.PI, false, 'rgba(255, 255, 0, 0.1)', 1, 'rgba(255, 255, 0, 0.5)')
	}
	this.draw_road = function(canvas, ctx, x, y, w, h, line, bg, color){
		ctx.clearRect(0, h, canvas.width, canvas.height)
		ctx.beginPath()
		ctx.fillStyle = bg
		ctx.fillRect(x, y, w, canvas.height)
		ctx.strokeStyle = color
		ctx.lineWidth = line
		ctx.strokeRect(x, y, w, canvas.height)
	}

	this.draw_rabbits = function(action, nr, finish_line_x){
		if(action==="run"){
			for(let i in lane_list){
				lane_list[i].action(canvas, ctx, rabbit_list, nr, finish_line_x)
			}
			rabbit_list = self.order_rabbits(rabbit_list)
			self.post_order_rabbits(rabbit_list)
		} else {
			for(let i in lane_list){
				lane_list[i].rabbit.draw(ctx)
			}
		}
	}
	this.order_rabbits = function(list){
		let done = false
		while (!done) { //false
			done = true
			for (let i = 1; i < list.length; i += 1) {
				if (list[i - 1].x < list[i].x) {
					done = false
					let tmp = list[i - 1]
					list[i - 1] = list[i]
					list[i] = tmp
				} 
			}
		}
		return list
	}
	this.post_order_rabbits = function(list){
		if($('#race_order')){
			$('#race_order').empty()
			for(let i in list){
				let place = parseInt(i) + 1
				$('#race_order').append('<div class="rabbit_box_nr shadow_convex '+list[i].color+'">'+ place + '</div>')
			}
		}
	}

	this.counter = function(totalTime){
		let self_counter = this
		self_counter.totaTime = totalTime
		self_counter.timeRemaining = self_counter.totaTime
		let my_counter
		
		timerGame()

		function timerGame(){	
			my_counter = setInterval(function(){
				self_counter.timeRemaining = self_counter.timeRemaining - 1
				if(self_counter.timeRemaining < 0){
					self_counter.timeRemaining = 0
				}
				self.draw_background()
				self.draw_rabbits('sit')
				self.add_text(self_counter.timeRemaining, canvas.width/2,  canvas.height/2-10, font_counter, "rgba(255, 215, 0, 0.5)", "center", "gold", "1")
			  	if(self_counter.timeRemaining <= 0){
					clearInterval(my_counter)
					self.start_race()
			  	}
			}, 1000)
		}
	}
	this.add_text = function(text, x, y, font, color, text_align, stroke, line){
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
	this.check_rabbits = function(line){
		//check if all rabbits passed the finish line
		let passed = true
		for(let i in lane_list){		
			if(lane_list[i].rabbit.x < line){
				passed = false
				break
			}
		}
		return passed
	}
	
	this.start_race = function(){
		let nr = 0
		let time = race_interval
		let move_landscape = false
		game_status = true

		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function( callback ){
			  window.setTimeout(callback, 1000 / 60)
			}
	  	})()
	  
	  	function race(){
			let stop = false

			if(!startGameRace){
				let avg_dist = lane_list[0].rabbit.avg_dist

				if (nr > time) {
					rabbit_list = self.order_rabbits(rabbit_list)			
					let end_rabbit = true
					let end_finish_line = true
					let sit_rabbit = true
					
					if(finish_line_x > canvas.width/2){
						finish_line_x = finish_line_x - 5
						end_finish_line = false
					} 
					
					end_rabbit = self.check_rabbits(finish_line_x)

					if(end_rabbit && end_finish_line){
						for(let i in lane_list){		
							if(lane_list[i].rabbit.frame !== 4){
								sit_rabbit = false
								break
							}
						}

						if(sit_rabbit){
							stop = true
							self.draw_background()
							finish_line.draw(canvas, ctx)

							for(let i in lane_list){		
								lane_list[i].rabbit.stop(ctx, nr)
							}
							self.win_lose()
						} else {
							nr++
							stop = false
							self.draw_background()
							finish_line.draw(canvas, ctx)

							for(let i in lane_list){		
								lane_list[i].rabbit.stop(ctx, nr)
							}
						}
						
					} else {
						nr++
						stop = false
						self.draw_background()
						finish_line.move(finish_line_x)
						finish_line.draw(canvas, ctx)

						if(end_rabbit){
							for(let i in lane_list){		
								lane_list[i].rabbit.stop(ctx, nr, false)
							}
						} else {
							self.draw_rabbits('run', nr, finish_line_x) 
						}
					}			
				} else{
					nr++	
					stop = false
					if(!move_landscape){
						if(avg_dist > canvas.width/2){
							move_landscape = true
						}
					} else {
						let i = landscape.length			
						while (i--) {
							landscape[i].update()
							let my_lands = landscape[i].lands
							for(let j in my_lands){
								my_lands[j].x = my_lands[j].x + landscape[i].x
							}
						}
					}
					self.draw_background()	
					self.draw_rabbits('run', nr)
				}
			} else {
				stop = true
			}			
			
			if(!stop){
				window.requestAnimationFrame(race)
			} else {
				window.cancelAnimationFrame(race)
			}
	  	}

		race()
	}

	this.win_lose = function(){
		rabbit_list = self.order_rabbits(rabbit_list)
		let money_original = props.user.money ? decryptData(props.user.money) : 0 
		let money_history = money_original
		
		for(let i in rabbit_array){
			if(typeof rabbit_array[i].bet !== "undefined" && rabbit_array[i].bet !== "0" && rabbit_array[i].bet !== 0){
				let bet = rabbit_array[i].bet
				let win = money_per_win * bet
				let place = rabbit_array[i].place
				if(rabbit_list[place-1].id === rabbit_array[i].id){
				 	money_history = money_history + win
				} else {
				 	money_history = money_history - bet						
				}
			}
		}

		game_status = false

		let status = "lose"
		if(money_history > money_original){
			status = "win"
		}
		
		let race_payload = {
			uuid: props.user.uuid,
			game: "race",
			money: money_history,
			status: status,
			bet: Math.abs(money_original - money_history)
		}
		if(typeof props.results === "function"){
			props.results(race_payload)
		}
		
		if(typeof props.resetBets === "function"){
			props.resetBets()
		}	
	}

    this.leave = function(){
		startGameRace = true
		if(game_status){
			//the user decided to leave in the middle of the race --> he will lose the bet
			let money = props.user.money ? decryptData(props.user.money) : 0 
			let bet = 0

			for(let i in rabbit_array){
				if(typeof rabbit_array[i].bet !== "undefined" && rabbit_array[i].bet !== "0" && rabbit_array[i].bet !== 0){
					bet = bet + rabbit_array[i].bet
				}
			}		

			let race_payload = {
				uuid: props.user.uuid,
				game: "race",
				money: money - bet,
				status: 'lose',
				bet: bet
			}

			if(typeof props.results === "function"){
				props.results(race_payload)
			}
		} 

		if(typeof props.resetBets === "function"){
			props.resetBets()
		}
	}
}

var startGameRace = true

function RaceGame(props){
	const {settings, bets, socket} = props
    const {lang} = settings
    let dispatch = useDispatch()	
    let options = {...props, dispatch}
    let my_race = new race_game(options)

	function ready(){
		if(my_race && document.getElementById("race_canvas")){
            my_race.ready()
        }
	}

    useEffect(() => {
        ready()
        $(window).resize(function(){
			ready()
		})
		return () => {
			if(my_race){
				my_race.leave()// if the user leaves the game, if he bet, he will lose the bets
				my_race = null
			}
		}
    }, [])

	useEffect(() => {
		const handleRaceRead = function(data) {}
		socket.on('race_read', handleRaceRead)
		return () => {
            socket.off('race_read', handleRaceRead)
        }
    }, [socket])

    return <div className="game_container race_game_container">
		<div className="race_order_container">
			<div id="race_order"></div>
		</div>
		<canvas id="race_canvas" className="shadow_convex" />
		<div className="button_action_group">
			{!bets || bets.length === 0 ? <div className="tooltip">
				<Button 
					type="button" 
					className="mybutton round button_transparent shadow_convex"
					onClick={()=>props.handleStartGame()} 
				><FontAwesomeIcon icon={faPlay} /></Button>
				<span className="tooltiptext">{translate({lang: lang, info: "start"})}</span>
			</div> : null}
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

export default RaceGame