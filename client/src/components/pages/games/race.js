import React, { Component } from 'react';
import {race_calculate_money, race_get_history} from '../../actions/actions'
import $ from 'jquery'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import rabbit_img_board from '../../img/race_imgs/rabbit.jpg';
import { getCookie, showResults } from '../../utils';
import rabbit_sit from '../../img/rabbit_move/rabbit000.png';
import rabbit_move from '../../img/rabbit_move/rabbit_move_colored.png';
import obstacle from '../../img/icons/obstacle.png';
import Carousel from '../partials/carousel';

let canvas;
let ctx;

function Land(config) {
	let self = this;
    self.layer = config.layer;
    self.x = config.x;
    self.y = config.y;
    self.width = config.width;
    self.height = config.height;
};

function Landscape(config){
	let self = this;
	let distance = 1;

	self.x = -config.speed * distance;
	self.y = config.y;
    self.lands = [];
	self.layer = config.layer;
	self.width = {
		min: config.width.min,
    	max: config.width.max
	}
	self.height = {
		min: config.height.min,
    	max: config.height.max
	}  
	self.speed = config.speed;
	self.color = config.color;
	self.color_stroke = config.color_stroke;
	self.stroke = config.stroke;
	self.populate = function (){
		var totalWidth = 0;
		var x = 0;
		while (totalWidth <= 2*canvas.width + (10 * self.width.max)) {
			var newWidth = Math.floor(Math.random() * self.width.max) + self.width.min;
			var newHeight = Math.floor(Math.random() * self.height.max) + self.height.min;
			if(self.lands.length !== 0){
				x = self.lands[self.lands.length - 1].x + self.lands[self.lands.length - 1].width + self.x;
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
			}));

			totalWidth = totalWidth + newWidth;
		}
	}
	self.draw = function(){
		ctx.save();
		ctx.translate(self.x, 0);
		ctx.beginPath();
		var lands = self.lands;
		ctx.moveTo(self.lands[0].x, self.lands[0].y);
		
		for(var i=0; i<lands.length-1; i++){
			var point01 = (self.lands[i].x + self.lands[i + 1].x) / 2;
			var point02 = (self.lands[i].y + self.lands[i + 1].y) / 2;
			ctx.quadraticCurveTo(self.lands[i].x, self.lands[i].y, point01, point02);
		}
		ctx.lineTo(canvas.width - self.x, canvas.height);
    	ctx.lineTo(0 - self.x, canvas.height);

		ctx.fillStyle = self.color;
		ctx.lineWidth = self.stroke;
		ctx.strokeStyle = self.color_stroke;
		ctx.fill();
		ctx.stroke();
		ctx.restore()
	}
	self.update = function(){
		var x = 0;
		var newWidth = Math.floor(Math.random() * self.width.max) + self.width.min;
		var newHeight = Math.floor(Math.random() * self.height.max) + self.height.min;
		
		if(self.lands.length !== 0){
			x = self.lands[self.lands.length - 1].x + self.lands[self.lands.length - 1].width + self.x;
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
		}));
	}
}

function Rabbit(config){
	let self = this;

	self.id = config.id;
	self.name = config.name;
	self.color = config.color;

	self.speed = config.speed;
	self.delay = config.delay;
	self.max_speed = config.max_speed;
	self.min_speed = config.min_speed;

	self.img_sit = config.img_sit;
	self.img_move = config.img_move;
	self.img_stop = config.img_stop;

	self.x = config.x;
	self.y = config.y;
	self.w = config.w;
	self.h = config.h;
	self.y_original = config.y;	

	self.frameWidth = 672;
	self.frameHeight = 592;
	self.frame = 0;
	self.avg_dist = 0;
	
	self.draw = function(ctx){
		ctx.drawImage(self.img_sit, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h);
	}
	self.run = function(ctx, nr, finish_line_x){
		if(nr >= self.delay){
			if(typeof finish_line_x === "undefined"){
				if(self.avg_dist > canvas.width/2){
					self.x = self.x-3;
				}
			} 
			
			if(nr % self.speed === 0){
				self.frame++;
				self.x = self.x+3;				
			}

			if(self.frame > 7){
				self.frame = 0;
			}

			// let font_obstacle = 'bold 10px sans-serif';
			// self.add_text(self.x+'/'+self.y, self.x,  self.y, font_obstacle, "white", "center");			
			ctx.drawImage(self.img_move, self.frame * self.frameWidth, 2 * self.frameHeight, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h);
		} else {
			ctx.drawImage(self.img_sit, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h);
		}		
	}

	self.add_text = function(text, x, y, font, color, text_align, stroke, line){
		ctx.font = font;
		if(stroke && line){
			ctx.strokeStyle = stroke;
    		ctx.lineWidth = line;
			ctx.strokeText(text, x, y);
			ctx.fillStyle = color;
			ctx.textAlign = text_align;
			ctx.fillText(text, x, y);
		} else {
			ctx.fillStyle = color;
			ctx.textAlign = text_align;
			ctx.fillText(text, x, y);
		}
	}

	self.stop = function(ctx, nr){
		if(self.frame !== 4){	
			if(nr % self.speed === 0){
				self.frame++;
				self.x = self.x+5;				
			}		
			if(self.frame > 7){
				self.frame = 0;
			}						
			ctx.drawImage(self.img_move, self.frame * self.frameWidth, 2 * self.frameHeight, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h);
		} else {
			ctx.drawImage(self.img_stop, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h);
		}
	}

	self.change_speed = function(){
		let random_speed = Math.floor(Math.random() * self.max_speed) + self.min_speed;
		self.speed = random_speed;
	}

	self.move_view = function(all){
		let sum_dist = 0;
		for(let i in all){
			sum_dist = sum_dist + all[i].x;
		}
		self.avg_dist = sum_dist/all.length;
	}
}

function Obstacle(config){
	let self = this;
	self.id = config.id+1;
	self.img = config.img;
	self.color = config.color;
	self.border = config.border;
	self.border_color = config.border_color;
	self.x = config.x;
	self.y = config.y + config.w;
	self.w = config.w;
	self.h = config.h;
	self.frameWidth = 816;
	self.frameHeight = 635;

	self.draw = function(ctx){
		let y001 = self.y+self.h/2;
		ctx.drawImage(self.img, 0, 0, self.frameWidth, self.frameHeight, self.x, y001, self.w, self.h);
		//draw_dot(self.x, y001, self.w/2, 0, 2 * Math.PI, false, self.color, self.border, self.border_color);
		// let font_obstacle = '10px sans-serif';
		// self.add_text(self.x+'/'+self.y, self.x,  y001, font_obstacle, "black", "center");
	}
	self.add_text = function(text, x, y, font, color, text_align, stroke, line){
		ctx.font = font;
		if(stroke && line){
			ctx.strokeStyle = stroke;
    		ctx.lineWidth = line;
			ctx.strokeText(text, x, y);
			ctx.fillStyle = color;
			ctx.textAlign = text_align;
			ctx.fillText(text, x, y);
		} else {
			ctx.fillStyle = color;
			ctx.textAlign = text_align;
			ctx.fillText(text, x, y);
		}
	}
}

function Lane(config){
	let self = this;
	self.id = config.id;

	self.x = config.x;
	self.y = config.y;
	self.w = config.w;
	self.h = config.h;
	self.min_speed = 0;

	self.rabbit = null;
	self.rabbit_config = config.rabbit_config;

	self.obstacles = [];
	self.obstacle_img = config.obstacle_img;	
	self.obstacle_size = config.obstacle_size;	
	
	self.create_rabbit = function(){
		self.rabbit = new Rabbit(self.rabbit_config);
	}

	self.create_obstacles = function(){		
		let chance = Math.random() < 0.01;//probability of 1%		
		if(chance){
			let x = canvas.width + self.obstacle_size[0];
			let t = self.obstacles.length+1;
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
					});
					self.obstacles.push(obstacle);
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
				});
				self.obstacles.push(obstacle);
			}
		}
	}

	self.lane_update = function(obstacle){
		obstacle.x = obstacle.x-3;	
	}

	self.draw_obstacle = function(ctx, obstacle){
		obstacle.draw(ctx);
	}

	self.move_obstacles = function(ctx, nr){
		for(let i in self.obstacles){
			self.lane_update(self.obstacles[i], nr);
			self.draw_obstacle(ctx, self.obstacles[i]);
			if(self.obstacles[i].x < -50){
				self.obstacles.splice(i, 1); 
				i--;
			}
		}
	}

	self.collision = function(){
		let collision = false;	
		for(let i in self.obstacles){
			if(self.collision_entities(self.rabbit, self.obstacles[i])){
				collision = true;
				break;
			}
		}
		return collision;
	}
	self.collision_entities = function(rect01, rect02){	
		let cond01 = rect01.x <= rect02.x + rect02.w;
		let cond02 = rect01.y <= rect02.y + rect02.h;
		let cond03 = rect02.x <= rect01.x + rect01.w;
		let cond04 = rect02.y <= rect01.y + rect01.h;		
		return cond01 && cond02 && cond03 && cond04;
	}

	self.action = function(rabbit_list, nr, finish_line_x){	
		//check collision
		self.rabbit.y = self.rabbit.y_original;			
		if(self.collision()){					
			self.rabbit.y_original = self.rabbit.y;
			self.rabbit.y = self.rabbit.y - 2*self.obstacle_size[0];
		}

		//create and move obstacle
		self.create_obstacles(nr, finish_line_x);
		self.move_obstacles(ctx, nr);

		//make rabbit run
		self.rabbit.change_speed();
		self.rabbit.move_view(rabbit_list, nr);
		self.rabbit.run(ctx, nr, finish_line_x);

		self.get_min_speed(rabbit_list, nr);
	}

	self.get_min_speed = function(all){
		let min_speed = all[0].speed;
		for(let i in all){
			if(min_speed > all[i].speed){
				min_speed = all[i].speed
			}
		}
		self.min_speed = min_speed;
	}
}

function FinishLine(config){
	var self = this;
	
	self.fillStyle = config.fillStyle;
	self.lineWidth = config.lineWidth;
	self.strokeStyle = config.strokeStyle;
	self.x = config.x;
	self.y = config.y;
	self.cube = config.cube;

	var space = 2;

	self.draw = function(ctx){
		//line01
		draw_rect(ctx, self.x, self.y, self.cube/2, canvas.height, self.fillStyle, self.lineWidth, self.strokeStyle);
		
		//cubes
		var t = self.y-self.cube;
		var z = 0;
		while(t<canvas.height){
			t = t+self.cube;
			z++;
			if(z%2===0){
				draw_rect(ctx, self.x+1*self.cube+space, t, self.cube, self.cube, self.fillStyle, self.lineWidth, self.strokeStyle);
			} else {
				draw_rect(ctx, self.x+2*self.cube, t, self.cube, self.cube, self.fillStyle, self.lineWidth, self.strokeStyle);
			}
		}		

		//line03
		draw_rect(ctx, self.x + 4*self.cube-space, self.y, self.cube/2, canvas.height, self.fillStyle, self.lineWidth, self.strokeStyle);	
	}
	self.move = function(x){
		self.x = x;
	}
}

function race_game(props){
	let self = this;
	let socket = props.data.socket;
	let lang = props.lang;
	let dispatch = props.data.dispatch;
	let dispatch_nr = 0;
	let rabbit_array = props.data.rabbit_array;	
	let lane_list = [];
	let rabbit_list = [];
	
	let canvas_width = 900;
	let canvas_height = 800;
	
	let font_title = 'bold 30px sans-serif';
	let font_counter = 'bold 40px sans-serif';

	let landscape = [];
	let lanscape_config = {};
	let land_color = [
		['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.5)', 1], 
		['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.5)', 1], 
		['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.5)', 1]
	]	
	let draw_road_height;

	let rabbit_img_sit = {src: rabbit_sit};
	let rabbit_img_move = {src: rabbit_move};
	let rabbit_img_stop = {src: rabbit_sit};
	let obstacle_img = {src: obstacle};
	let rabbit_size;
	let obstacle_size;

	let finish_line;
	let finish_line_x = 0;
		
	this.ready = function(reason){
		self.createCanvas(canvas_width, canvas_height);	
		self.start(reason);
	}

	this.createCanvas = function(canvas_width, canvas_height){	
		canvas = document.getElementById("race_canvas");	
		ctx = canvas.getContext("2d");
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas.width = 300;
				canvas.height = 300;			
			} else {
				//small portrait
				canvas.width = 280;
				canvas.height = 300;		
			}
			lanscape_config = {
				y: 100,
				width: [1, 5, 1, 7],
				height: [20, 4, 30, 4],
				sun: [35, 35, 15],
			}
			draw_road_height = 101;
			rabbit_size = [5, 100, 35, 35, -5];
			obstacle_size = [10, 10];
			font_title = 'bold 20px sans-serif';
			font_counter = 'bold 30px sans-serif';
		} else {
			//big
			canvas.width = 900;
			canvas.height = 800;
			font_title = 'bold 30px sans-serif';
			font_counter = 'bold 40px sans-serif';
			if (window.innerWidth >= 1200){
				canvas.width = 1000;	
			} 
			if (window.innerWidth >= 1400){
				canvas.width = 1200;
			} 
			lanscape_config = {
				y: 500,
				width: [1, 50, 1, 70],
				height: [200, 40, 300, 40],
				sun: [50, 50, 30],
			}
			draw_road_height = canvas.height/2;
			rabbit_size = [10, 350, 80, 80, -10];
			obstacle_size = [20, 20];		
		}
		
		canvas_width = canvas.width;
		canvas_height = canvas.height;		
		canvas.height = canvas_height;		
		$('#race_order_container').css("width", canvas_width+"px");	
		finish_line_x = canvas_width;
	}

	this.start = function(reason){
		var promises = [];
		if(reason !== "resize"){
			promises.push(self.preaload_images(rabbit_img_sit));
			promises.push(self.preaload_images(rabbit_img_move));
			promises.push(self.preaload_images(rabbit_img_stop));
			promises.push(self.preaload_images(obstacle_img));
			Promise.all(promises).then(function(result){
				lane_list = self.create_lane(result);
				rabbit_list = self.get_rabbits(lane_list);
				self.background();
				self.draw_rabbits('sit');
				self.add_text("Rabbit Race", canvas.width/2,  30, font_title, "gold", "center");				
				setTimeout(function(){
					self.counter(3);
				}, 500);
			});			
		} else {
			self.background();
			self.draw_rabbits('sit');
			self.add_text("Rabbit Race", canvas.width/2,  30, font_title, "gold", "center");
			setTimeout(function(){
				self.counter(3);
			}, 500);
		}
	}

	self.get_rabbits = function(lane_list){
		let rabbits = [];
		for(let i in lane_list){
			rabbits.push(lane_list[i].rabbit);
		}
		return rabbits;
	}

	this.preaload_images = function(item){
		return new Promise(function(resolve, reject){
			var image = new Image();
			image.src = item.src;
			image.addEventListener("load", function() {
				resolve(image)
			}, false);
		});
	}

	this.create_lane = function(img){
		let lanes = [];
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
			lane.create_rabbit();
			lanes.push(lane);			
		}
		return lanes;
	}

	this.draw_rabbits = function(action, nr, finish_line_x){
		if(action==="run"){
			for(let i in lane_list){
				lane_list[i].action(rabbit_list, nr, finish_line_x);
			}
			rabbit_list = self.order_rabbits(rabbit_list);
			self.post_order_rabbits(rabbit_list);
		} else {
			for(let i in lane_list){
				lane_list[i].rabbit.draw(ctx);
			}
		}
	}

	this.post_order_rabbits = function(list){
		$('#race_order').empty();
		for(var i in list){
			var x = parseInt(i)+1;
			if(x === 1){
				x = x + 'st';
			} else if(x === 2){
				x = x + 'nd';
			} else if(x === 3){
				x = x + 'rd';
			} else {
				x = x + 'th';
			}
			$('#race_order').append('<div class="race_order_elem_container"><div class="race_order_elem '+list[i].color+'"><span class="order">'+x+': </span><span class="color">'+list[i].name+'</span></div></div>');
		}
	}

	this.add_text = function(text, x, y, font, color, text_align, stroke, line){
		ctx.font = font;
		if(stroke && line){
			ctx.strokeStyle = stroke;
    		ctx.lineWidth = line;
			ctx.strokeText(text, x, y);
			ctx.fillStyle = color;
			ctx.textAlign = text_align;
			ctx.fillText(text, x, y);
		} else {
			ctx.fillStyle = color;
			ctx.textAlign = text_align;
			ctx.fillText(text, x, y);
		}		
	}

	this.background = function(){
		self.create_background();	
		self.draw_background();	
		self.create_finish_line();
	}

	this.create_background = function(){
		var i = land_color.length;
		landscape = [];
		while(i--){
			var config = {
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
			var my_land = new Landscape(config)
			my_land.populate();
			landscape.push(my_land)
		}	
	}
	this.draw_background = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		self.draw_sun();		
		var i = landscape.length;
		while (i--) {
			landscape[i].draw();
		}
		self.draw_road(-100, draw_road_height, 2*canvas.width, draw_road_height, 1, "rgba(255, 215, 0, 0.1)", "rgba(255, 215, 0, 0.5)");		
	}

	this.create_finish_line = function(){
		finish_line = new FinishLine({
			fillStyle: "rgba(255, 215, 0, 0.1)",
			lineWidth: 1,
			strokeStyle: "rgba(255, 215, 0, 0.1)",
			x: finish_line_x,
			y: draw_road_height,
			cube: 10,
		});
		finish_line.draw(ctx);
	}

	this.draw_sun = function(){
		draw_dot(canvas.width-lanscape_config.sun[0], lanscape_config.sun[1], lanscape_config.sun[2], 0, 2 * Math.PI, false, 'rgba(255, 255, 0, 0.1)', 1, 'rgba(255, 255, 0, 0.5)');
	}

	this.draw_road = function(x, y, w, h, line, bg, color){
		ctx.clearRect(0, h, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.fillStyle = bg;
		ctx.fillRect(x, y, w, canvas.height);
		ctx.strokeStyle = color;
		ctx.lineWidth = line;
		ctx.strokeRect(x, y, w, canvas.height);
	}

	this.counter = function(totalTime){
		var self_counter = this;
		self_counter.totaTime = totalTime;
		self_counter.timeRemaining = self_counter.totaTime;
		var my_counter;

		timerGame();

		function timerGame(){	
			my_counter = setInterval(function(){
				self_counter.timeRemaining = self_counter.timeRemaining - 1;
				if(self_counter.timeRemaining < 0){
					self_counter.timeRemaining = 0;
				}
				self.draw_background();
				self.draw_rabbits('sit');
				self.add_text("Rabbit Race", canvas.width/2,  30, font_title, "gold", "center");
				self.add_text(self_counter.timeRemaining, canvas.width/2,  canvas.height/2-10, font_counter, "rgba(255, 215, 0, 0.5)", "center", "gold", "1");
			  	if(self_counter.timeRemaining <= 0){
					clearInterval(my_counter);
					self.start_race(1500);
			  	}
			}, 1000);
		}
	}
	
	this.start_race = function(time, monkey){
		var nr = 0;
		dispatch_nr++;
		time = 100;
		var move_landscape = false;

		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function( callback ){
			  window.setTimeout(callback, 1000 / 60);
			};
	  	})();
	  
	  	function race() {			
			var stop = false;
			var avg_dist = lane_list[0].rabbit.avg_dist;

			if (nr > time) {
				rabbit_list = self.order_rabbits(rabbit_list);			
				var end_rabbit = true;
				var end_finish_line = true;
				var sit_rabbit = true;
				
				if(finish_line_x > canvas.width/2){
					finish_line_x = finish_line_x - 5;
					end_finish_line = false;
				} 
				
				end_rabbit = self.check_rabbits(finish_line_x);

				if(end_rabbit && end_finish_line){
					for(var i in lane_list){		
						if(lane_list[i].rabbit.frame !== 4){
							sit_rabbit = false;
							break;
						}
					}

					if(sit_rabbit){
						stop = true;
						self.draw_background();
						finish_line.draw(ctx);

						for(let i in lane_list){		
							lane_list[i].rabbit.stop(ctx, nr);
						}
						self.win_lose();
					} else {
						nr++; 		
						stop = false;
						self.draw_background();
						finish_line.draw(ctx);

						for(let i in lane_list){		
							lane_list[i].rabbit.stop(ctx, nr);
						}
					}
					
				} else {
					nr++; 		
					stop = false;
					self.draw_background();
					finish_line.move(finish_line_x);
					finish_line.draw(ctx);

					if(end_rabbit){
						for(let i in lane_list){		
							lane_list[i].rabbit.stop(ctx, nr, false);
						}
					} else {
						self.draw_rabbits('run', nr, finish_line_x); 
					}
				}			
			} else{
				nr++; 		
				stop = false;
				if(!move_landscape){
					if(avg_dist > canvas.width/2){
						move_landscape = true;
					}
				} else {
					var i = landscape.length;				
					while (i--) {
						landscape[i].update();
						var my_lands = landscape[i].lands;
						for(var j in my_lands){
							my_lands[j].x = my_lands[j].x + landscape[i].x;
						}
					}
				}
				self.draw_background();	
				self.draw_rabbits('run', nr);
			} 	
			
			if(!stop){
				window.requestAnimFrame(race);
			} else {
				window.cancelAnimationFrame(race);
			}
	  	};

	  	if(dispatch_nr === 1){
			race();
	  	}	  
	}

	this.win_lose = function(){
		rabbit_list = self.order_rabbits(rabbit_list);
		let win_lose = [];
		let money = props.data.money;
		for(let i in rabbit_array){
			if(typeof rabbit_array[i].bet !== "undefined" && rabbit_array[i].bet !== "0" && rabbit_array[i].bet !== 0){
				let bet = rabbit_array[i].bet;
				let win = 10 * bet;
				let place = rabbit_array[i].place;
				let elem = {};
				if(rabbit_list[place-1].id === rabbit_array[i].id){
					money = money + win;
					elem = {win: true, get:win, money_history: money, history: rabbit_array[i], rabbit_list: rabbit_list}				
				} else {
					money = money - bet;
					elem = {win: false, get:bet, money_history: money, history: rabbit_array[i], rabbit_list: rabbit_list}							
				}
				win_lose.push(elem);
			}
		}
		
		var get = props.data.money - win_lose[win_lose.length-1].money_history;
		var remaining_money = win_lose[win_lose.length-1].money_history;

		dispatch(race_calculate_money(remaining_money));
		dispatch(race_get_history(win_lose));

		if($('#user_money').length>0){
			if($('#user_money span').length>0){
				$('#user_money span').text(remaining_money);
			}
		}

		if(lang === "ro"){
			if(props.data.money<remaining_money){
				showResults("Rezultate", "Ai castigat " + get + " morcovi. Mai ai " + remaining_money + " morcovi!");
			} else if(get>0){
				showResults("Rezultate", "Ai pierdut " + get + " morcovi. Mai ai " + remaining_money + " morcovi!");
			} else {
				showResults("Rezultate", "Ai " + remaining_money + " morcovi!");
			}			
		} else {
			if(props.data.money<remaining_money){
				showResults("Results", "you won " + get + " carrots. You have " + remaining_money + " carrots!");
			} else if(get>0){
				showResults("Results", "You lost " + get + " carrots. You have " + remaining_money + " carrots!");
			} else {
				showResults("Results", "You have " + remaining_money + " carrots!");
			}
		}
		self.pay(win_lose);	
	}

	this.pay = function(win_lose){
		let money = win_lose[win_lose.length-1].remaining;
		let date = new Date();
		let history = {where: "race", when: date, data: win_lose}			
		let race_payload_server = {
			user_id: props.data.id,
			user: props.data.user, 
			money: money,
			history: JSON.stringify(history)
		}
		//console.log('race_payload_server', props, money, race_payload_server)
		socket.emit('race_results_send', race_payload_server);
	}

	this.check_rabbits = function(line){
		//check if all rabbits passed the finish line
		var passed = true;
		for(var i in lane_list){		
			if(lane_list[i].rabbit.x < line){
				passed = false;
				break;
			}
		}
		return passed;
	}

	this.order_rabbits = function(list){
		var done = false;
		while (!done) { //false
			done = true;
			for (var i = 1; i < list.length; i += 1) {
				if (list[i - 1].x < list[i].x) {
					done = false;
					var tmp = list[i - 1];
					list[i - 1] = list[i];
					list[i] = tmp;
				} 
			}
		}
		return list;
	}
}

function draw_dot(x, y, r,sAngle,eAngle,counterclockwise, fillStyle, lineWidth, strokeStyle){
	ctx.beginPath();
	ctx.arc(x, y, r, sAngle, eAngle, counterclockwise);
	ctx.fillStyle = fillStyle;
	if(strokeStyle !== ""){
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = strokeStyle;
		ctx.stroke();
	}		
	ctx.fill();
	ctx.closePath();
}
function draw_rect(ctx, x, y, width, height, fillStyle, lineWidth, strokeStyle){
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.fillStyle = fillStyle;
	if(strokeStyle !== ""){
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = strokeStyle;
		ctx.stroke();
	}		
	ctx.fill();
	ctx.closePath();
}

function RaceGame(props){
	let lang = props.lang;
	setTimeout(function(){	
		let my_race = new race_game(props);
		my_race.ready();	
		$(window).resize(function(){
			my_race.ready("resize");	
		});
	}, 0);	

	return (
		<div className="race_container">
			<canvas className="shadow_convex" id="race_canvas"></canvas>
			<div id="race_order_container" className="shadow_convex">
				<div id="race_order_box">
					<h3>{lang === "ro" ? <span>Ordine</span> : <span>Order</span>}</h3>
					<div id="race_order"></div>
				</div>
			</div>
			<div className="show_results_container">				
				<div className="show_results">
					<i className="fa fa-times show_results_close" ></i>
					<h1 className="header"></h1>
					<div className="message"></div>
				</div>
			</div>
		</div>
	)
}

class RaceTables extends Component {
	constructor(props) {
		super(props);
		this.state = {
			money: props.data.money,
			socket: props.data.socket,
			user: props.data.user,
			get_data: props.get_data,
			rabbit_array: this.props.data.rabbit_array,
		};
		
		this.check_bets = this.check_bets.bind(this);
		this.race_start = this.race_start.bind(this);
		this.race_clear_bets = this.race_clear_bets.bind(this);

		this.carousel = React.createRef();
	}

	check_bets(){
		//check to see if at least one rabbit has a bet
		var start = false;
		let rabbit_array = this.state.rabbit_array;
		for(let i in rabbit_array){
			if(rabbit_array[i].bet > 0){
				start = true;
				break;
			}
		}
		return start;
	}

	race_start(){
		let item_list_changed = this.carousel.current.item_list_changed
		this.setState({ rabbit_array: item_list_changed })		
		let start = this.check_bets();				
		if(start){
		 	this.state.get_data(this.state.rabbit_array);
		} else {
		 	if(this.props.lang === "ro"){
		 		showResults("", "Pariati pe un iepure pentru a intra in joc.");	
		 	} else {
				showResults("", "Please place your bet before playing.");	
		 	}							
		}
	}

	race_clear_bets(){
		let rabbit_array = this.state.rabbit_array;
		for(let i in rabbit_array){
			rabbit_array[i].bet = 0;
		}
		this.setState({ rabbit_array: rabbit_array })
		if($(".race_input").length>0){
			$(".race_input").val(0)
		}
	}

	render() {
		let self_race_tables = this;
		let lang = self_race_tables.props.lang;
		let rabbit_array = self_race_tables.state.rabbit_array;
		return (
			<>
				<Row>
					<Col sm={2}></Col>
					<Col xs={10} sm={8} className="race_table_container spacing_small">						
						<Row>
							<Col sm={12}>
								<div className="race_table_header shadow_convex">
									<h3>
										{lang === "ro" ? <p>Lista iepuri</p> : <p>Rabbit list</p>}
									</h3>
								</div>
								<div className="race_table_body_container">
									<div className="race_table_body shadow_convex">
										<Carousel ref={this.carousel} template="race" lang={lang} socket={this.state.socket} user={this.state.user} item_list={rabbit_array} money={this.state.money}></Carousel>
									</div>
								</div>
							</Col>
						</Row>
						<Row>				
							<Col sm={12} className="race_bets_container shadow_convex">
								<div className="race_text_box">
									{lang === "ro" ? 
										<p className="slot_buttons_box_cell slot_buttons_box_text">Ai: <span>{this.state.money} morcovi</span></p> : 
										<p className="slot_buttons_box_cell slot_buttons_box_text">You have: <span>{this.state.money} carrots</span></p>
									}
								</div>
								<div className="race_buttons_box">
									<div onClick={()=>{this.race_start()}} className="race_start shadow_convex" id="race_start">START</div>
									<div onClick={()=>{this.race_clear_bets()}} className="race_clear_bets shadow_convex" id="race_clear_bets"><i className="fa fa-trash"></i></div>
								</div>
							</Col>
						</Row>
					</Col>
					<Col sm={2}></Col>
				</Row>
			</>
		)
	}
}

class Race extends Component {	
	constructor(props) {
		super(props);
		this.state = {
			socket: props.socket,
			rabbit_array: [],
			ready: false,
			start_race: false,
			user: props.user,
			id: -1,
			money:0,
			lang: props.lang,
			open_race: props.open_race,
			dispatch: props.dispatch,
	  	};
		this.get_data = this.get_data.bind(this);
	}	

	componentDidMount() {
		let self = this;
		let id = parseInt(getCookie("casino_id"));
		if(id === "" || id === "indefined"){
			id = -1;
		}
		let payload = {id: id, user: this.state.user}
		this.state.socket.emit('race_board_send', payload);
		this.state.socket.on('race_board_read', function(data){
			self.setState({ rabbit_array: data.rabbit_race })		
			self.setState({ money: data.money })
			self.setState({ id: data.id })
			self.setState({ ready: true })
		});
	}
	
	get_data = function(rabbit_array){
		this.setState({ rabbit_array: rabbit_array })
		this.setState({ start_race: true })
	}

	render() {		
		let lang = this.props.lang
		let start_race = this.state.start_race; 
		if(this.state.open_race && this.state.start_race){
			start_race = true;
		}
		return (
			<>
				{(() => {
					if (this.state.ready) {
						if (start_race) {
							return <RaceGame lang={lang} data={this.state}></RaceGame>
						} else {
							return <RaceTables lang={lang} data={this.state} get_data={this.get_data}></RaceTables>
						}						
					} else {
						return (
							<div>Loading...</div>
						)
					}
				})()}
				<div className="show_results_container">				
					<div className="show_results">
						<i className="fa fa-times show_results_close" ></i>
						<h1 className="header"></h1>
						<div className="message"></div>
					</div>
				</div>
			</>
	  	)
	}
}

export default Race;