import React, { Component } from 'react';
import {race_calculate_money, race_get_history} from '../../actions/actions'
import $ from 'jquery'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {connect} from 'react-redux';
import rabbit_img_board from '../../img/race_imgs/rabbit.jpg';
import { getCookie, setCookie, showResults } from '../../utils';
import rabbit_sit from '../../img/rabbit_move/rabbit000.png';
import rabbit_move from '../../img/rabbit_move/rabbit_move_colored.png';

var canvas;
var ctx;
var canvas_width = 900;
var canvas_height = 800;
var my_race;
var landscape = [];
var lanscape_config = {};
var land_color = [
	['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.5)', 1], 
	['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.5)', 1], 
	['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.5)', 1]
]
var distance = 1;
var draw_road_height;

var font_title = 'bold 30px sans-serif';
var font_counter = 'bold 40px sans-serif';

var dispatch_nr = 0;
var socket;

var rabbit_array = [];
var rabbit_list = [];
var rabbit_img_sit = {src: rabbit_sit};
var rabbit_img_move = {src: rabbit_move};
var rabbit_img_stop = {src: rabbit_sit};
var rabbit_size;

var finish_line;
var finish_line_x = 0;

var font_bold_10 = 'bold 10px sans-serif';
var font_bold_12 = 'bold 12px sans-serif';
var font_bold_14 = 'bold 14px sans-serif';
var font_bold_16 = 'bold 16px sans-serif';

function Land(config) {
	var self = this;
    self.layer = config.layer;
    self.x = config.x;
    self.y = config.y;
    self.width = config.width;
    self.height = config.height;
};

function Landscape(config){
	var self = this;
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
	var self = this;

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
			
			ctx.drawImage(self.img_move, self.frame * self.frameWidth, 2 * self.frameHeight, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h);
		} else {
			ctx.drawImage(self.img_sit, 0, 0, self.frameWidth, self.frameHeight, self.x, self.y, self.w, self.h);
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
		var random_speed = Math.floor(Math.random() * self.max_speed) + self.min_speed;
		self.speed = random_speed;
	}
	self.move_view = function(all, nr){
		var sum_dist = 0;
		for(var i in all){
			sum_dist = sum_dist + all[i].x;
		}
		self.avg_dist = sum_dist/all.length;
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
	var self = this;
	socket = props.data.socket;
	dispatch_nr = 0;
	var lang = props.lang;
	const dispatch = props.data.dispatch;
		
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
			rabbit_size = [5, 100, 50, 50, -3];
			font_title = 'bold 20px sans-serif';
			font_counter = 'bold 30px sans-serif';
			font_bold_10 = 'bold 8px sans-serif';
			font_bold_12 = 'bold 10px sans-serif';
			font_bold_14 = 'bold 12px sans-serif';
			font_bold_16 = 'bold 12px sans-serif';
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
			font_bold_10 = 'bold 10px sans-serif';
			font_bold_12 = 'bold 12px sans-serif';
			font_bold_14 = 'bold 14px sans-serif';
			font_bold_16 = 'bold 16px sans-serif';		
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
			Promise.all(promises).then(function(result){
				rabbit_list = self.get_rabbits(result);				
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

	this.preaload_images = function(item){
		return new Promise(function(resolve, reject){
			var image = new Image();
			image.src = item.src;
			image.addEventListener("load", function() {
				resolve(image)
			}, false);
		});
	}

	this.get_rabbits = function(img){
		var rabbits = []
		for(var i in rabbit_array){
			var config = {
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
			var rabbit = new Rabbit(config);
			rabbits.push(rabbit);
		}
		return rabbits;
	}

	this.draw_rabbits = function(action, nr, finish_line_x){
		if(action==="run"){
			for(var i in rabbit_list){				
				rabbit_list[i].change_speed();
				rabbit_list[i].move_view(rabbit_list, nr);
				rabbit_list[i].run(ctx, nr, finish_line_x);
			}
			rabbit_list = self.order_rabbits(rabbit_list);
			self.post_order_rabbits(rabbit_list);
		} else {
			for(var i in rabbit_list){
				rabbit_list[i].draw(ctx);
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
				self.add_text(self_counter.timeRemaining, canvas.width/2,  canvas.height/2-10, font_counter, "'rgba(255, 215, 0, 0.5)'", "center", "gold", "1");
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
		//time = 100;
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
			console.log(rabbit_list)			
			var avg_dist = rabbit_list[0].avg_dist;
			

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
					for(var i in rabbit_list){		
						if(rabbit_list[i].frame !== 4){
							sit_rabbit = false;
							break;
						}
					}

					if(sit_rabbit){
						stop = true;
						self.draw_background();
						finish_line.draw(ctx);

						for(var i in rabbit_list){		
							rabbit_list[i].stop(ctx, nr);
						}
						self.win_lose();
					} else {
						nr++; 		
						stop = false;
						self.draw_background();
						finish_line.draw(ctx);

						for(var i in rabbit_list){		
							rabbit_list[i].stop(ctx, nr);
						}
					}
					
				} else {
					nr++; 		
					stop = false;
					self.draw_background();
					finish_line.move(finish_line_x);
					finish_line.draw(ctx);

					if(end_rabbit){
						for(var i in rabbit_list){		
							rabbit_list[i].stop(ctx, nr, false);
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
				}				
				if(move_landscape){
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
					elem = {win: true, get:win, remaining: money, history: rabbit_array[i]}				
				} else {
					money = money - bet;
					elem = {win: false, get:-bet, remaining: money, history: rabbit_array[i]}							
				}
				win_lose.push(elem);
			}
		}
		
		var get = props.data.money - win_lose[win_lose.length-1].remaining;
		var remaining_money = win_lose[win_lose.length-1].remaining;

		if(lang === "ro"){
			if(props.data.money<remaining_money){
				showResults("Rezultate", "Ai pierdut " + get + " morcovi. Mai ai " + remaining_money + " morcovi!");
			} else if(get>0){
				showResults("Rezultate", "Ai castigat " + get + " morcovi. Mai ai " + remaining_money + " morcovi!");
			} else {
				showResults("Rezultate", "Ai " + remaining_money + " morcovi!");
			}			
		} else {
			if(props.data.money<remaining_money){
				showResults("Results", "You lost " + get + " carrots. You have " + remaining_money + " carrots!");
			} else if(get>0){
				showResults("Results", "you won " + get + " carrots. You have " + remaining_money + " carrots!");
			} else {
				showResults("Results", "You have " + remaining_money + " carrots!");
			}
		}
		self.pay(win_lose);	
	}

	this.pay = function(win_lose){
		var money = win_lose[win_lose.length-1].remaining;
		var date = new Date();
		var history = {where: "race", when: date, data: win_lose}			
		var race_payload_server = {
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
		for(var i in rabbit_list){		
			if(rabbit_list[i].x < line){
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
	var lang = props.lang;
	$('.full-height').attr('id', 'race')
	setTimeout(function(){ 
		$('.full-height').attr('id', 'race')		
		my_race = new race_game(props);
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
					<h1>{lang === "ro" ? <span>Rezultate</span> : <span>Results</span>}</h1>
					<p></p>
				</div>
			</div>
		</div>
	)
}

var self_race_tables;
class RaceTables extends Component {
	constructor(props) {
		super(props);
		self_race_tables = this;
		self_race_tables.state = {
			money: props.data.money,
			socket: props.data.socket,
			user: props.data.user,
			get_data: props.get_data,
		};
		rabbit_array = this.props.data.rabbit_array;
		self_race_tables.check_bets = self_race_tables.check_bets.bind(self_race_tables);
		self_race_tables.handleExit = self_race_tables.handleExit.bind(self_race_tables);
	}

	check_bets(){
		var start = false;
		$(".race_input").each(function(e) {
			var elem = $(this);
			var bet = parseInt(elem.val());			
			if(bet !== 0){
				start = true;
				var place_header = elem.closest('.rabbit_box_input').find('.place_header');
				var place = parseInt(place_header.attr('place'));
				rabbit_array[e].bet = bet;
				rabbit_array[e].place = place;
			}
		});
		return start;
	}

	handleExit() {
        setCookie("casino_user", '', 1);
		setCookie("casino_email", '', 1);
		var url = window.location.href;
		url = url.split('/salon');
		window.location.href = url[0];
	}

	componentDidMount() {	
		var lang = this.props.lang;		
		$('.full-height').attr('id', 'race');

		$('body').off('click', '#race_clear_bets').on('click', '#race_clear_bets', function () {
			$('.race_input').val('0');
		})	

		$('body').off('click', '.rabbit_box_minus').on('click', '.rabbit_box_minus', function () {
			var input_value = parseInt($(this).parent().find('.race_input').val());
			if(input_value > 0){
				$(this).parent().find('.race_input').val(input_value-1);
			}
		})	

		$('body').off('click', '.rabbit_box_plus').on('click', '.rabbit_box_plus', function () {				
			var input_value = parseInt($(this).parent().find('.race_input').val());
			if(input_value < self_race_tables.state.money){
				$(this).parent().find('.race_input').val(input_value+1);
			}
		})

		$('body').off('click', '.dropdown-content li').on('click', '.dropdown-content li', function () {
			var value = parseInt($(this).attr('place'));
			var text = '';
			if(lang === 'ro'){
				text = 'Locul' + value;
			} else {
				switch(value) {
					case 1:
						text = value + 'st place';
						break;
					case 2:
						text = value + 'nd place';
						break;
					case 3:
						text = value + 'rd place';
						break;
					default:
						text = value + 'th place';
				}
			}
			$(this).closest('.dropdown').find('.place_header').html(text);
			$(this).closest('.dropdown').find('.place_header').attr('place', value);
		})

		$('body').off('click', '#race_start').on('click', '#race_start', function () {
			var start = self_race_tables.check_bets();				
			if(start){
				self_race_tables.state.get_data('start')
			} else {
				if(lang === "ro"){
					showResults("", "Pariati pe un iepure pentru a intra in joc.");	
				} else {
					showResults("", "Please place your bet before playing.");	
				}							
			}			
		})
	}

	render() {
		var lang = this.props.lang;	
		$('.full-height').attr('id', 'race')
		return (
			<>
				<Row>
					<Col sm={2}></Col>
					<Col sm={8} className="race_table_container">
						<Row>
							<Col sm={12}>
								<div className="race_table_header shadow_convex">
									<h3>
										{lang === "ro" ? <p>Lista iepuri</p> : <p>Rabbit list</p>}
									</h3>
								</div>
								<div className="race_table_body_container">
									<div className="race_table_body shadow_convex">
										<div>
											{
												rabbit_array.map(function(item, i){
													if(i%2===0){
														var rabbit01 = rabbit_array[i];
														var rabbit02 = rabbit_array[i+1];
														var rabbit_box_nr01 = "rabbit_box_nr shadow_convex " + rabbit01.color;
														var rabbit_box_nr02 = "rabbit_box_nr shadow_convex " + rabbit02.color;
														var t = 1;
														if(i%2===0){
															t=i+1;
														}
														var a = t;
														var b = a+1;
														return(
															<div className="rabbit_box_container" key={i}>
																<div id={"rabbit_box_"+a} className="rabbit_box">
																	<div className="rabbit_box_left">
																		<div className="rabbit_box_pic">																			
																			<div className={rabbit_box_nr01}><p>{rabbit01.id}</p></div>
																			<img className="shadow_convex" src={rabbit_img_board} alt="rabbit_img_board" />																			
																		</div>
																		<div className="rabbit_box_name shadow_convex"><p>{rabbit01.name}</p></div>
																		<div className="rabbit_box_info">
																			<p className="rabbit_info rabbit_delay">Delay: {rabbit01.delay}</p>
																			<p className="rabbit_info rabbit_max_speed">Max speed: {rabbit01.max_speed}</p>
																			<p className="rabbit_info rabbit_min_speed">Min speed: {rabbit01.min_speed}</p>
																		</div>																		
																	</div>
																	<div className="rabbit_box_right">
																		<div className="rabbit_box_input">
																			{lang === "ro" ? <p>Pariaza:</p> : <p>Bet:</p>}
																			<div>
																				<span className="rabbit_box_minus">-</span>
																				<input className="race_input" readOnly value="0" type="text"></input>
																				<span className="rabbit_box_plus">+</span>
																			</div>
																			{lang === "ro" ? <p>Loc:</p> : <p>Place:</p>}
																			<div className="dropdown">
																				{lang === "ro" ? <span place="1" className="place_header">Locul 1</span> : <span place="1" className="place_header">1st place</span>}
																				<ul className="dropdown-content shadow_convex">
																				<li place="1">{lang === "ro" ? <span>Locul 1</span> : <span>1st place</span>}</li>
																					<li place="2">{lang === "ro" ? <span>Locul 2</span> : <span>2nd place</span>}</li>
																					<li place="3">{lang === "ro" ? <span>Locul 3</span> : <span>3rd place</span>}</li>
																					<li place="4">{lang === "ro" ? <span>Locul 4</span> : <span>4th place</span>}</li>
																					<li place="5">{lang === "ro" ? <span>Locul 5</span> : <span>5th place</span>}</li>
																					<li place="6">{lang === "ro" ? <span>Locul 6</span> : <span>6th place</span>}</li>
																				</ul>
																			</div>
																		</div>																		
																	</div>																													
																</div>
																<div id={"rabbit_box_"+b} className="rabbit_box">
																	<div className="rabbit_box_left">
																		<div className="rabbit_box_pic">																			
																			<div className={rabbit_box_nr02}><p>{rabbit02.id}</p></div>
																			<img className="shadow_convex" src={rabbit_img_board} alt="rabbit_img_board" />
																		</div>
																		<div className="rabbit_box_name shadow_convex"><p>{rabbit02.name}</p></div>	
																		<div className="rabbit_box_info">
																			<p className="rabbit_info rabbit_delay">Delay: {rabbit02.delay}</p>
																			<p className="rabbit_info rabbit_max_speed">Max speed: {rabbit02.max_speed}</p>
																			<p className="rabbit_info rabbit_min_speed">Min speed: {rabbit02.min_speed}</p>
																		</div>																																			
																	</div>
																	<div className="rabbit_box_right">
																		<div className="rabbit_box_input">
																			{lang === "ro" ? <p>Pariaza:</p> : <p>Bet:</p>}
																			<div>
																				<span className="rabbit_box_minus">-</span>
																				<input className="race_input" readOnly value="0" type="text"></input>
																				<span className="rabbit_box_plus">+</span>
																			</div>
																			{lang === "ro" ? <p>Loc:</p> : <p>Place:</p>}
																			<div className="dropdown">
																				{lang === "ro" ? <span place="1" className="place_header">Locul 1</span> : <span place="1" className="place_header">1st place</span>}
																				<ul className="dropdown-content shadow_convex">
																					<li place="1">{lang === "ro" ? <span>Locul 1</span> : <span>1st place</span>}</li>
																					<li place="2">{lang === "ro" ? <span>Locul 2</span> : <span>2nd place</span>}</li>
																					<li place="3">{lang === "ro" ? <span>Locul 3</span> : <span>3rd place</span>}</li>
																					<li place="4">{lang === "ro" ? <span>Locul 4</span> : <span>4th place</span>}</li>
																					<li place="5">{lang === "ro" ? <span>Locul 5</span> : <span>5th place</span>}</li>
																					<li place="6">{lang === "ro" ? <span>Locul 6</span> : <span>6th place</span>}</li>
																				</ul>
																			</div>
																		</div>
																	</div>																														
																</div>																													
															</div>
														)
													}
												})
											}
										</div>
									</div>
								</div>
							</Col>
						</Row>
						<Row>				
							<Col sm={12} className="race_bets_container">
								<div className="race_clear_bets shadow_convex" id="race_clear_bets">Clear Bets</div>
								<div className="race_buttons_box">
									{self_race_tables.state.lang === "ro" ? 
										<p className="slot_buttons_box_cell slot_buttons_box_text">Ai: <span>{self_race_tables.state.money} morcovi</span></p> : 
										<p className="slot_buttons_box_cell slot_buttons_box_text">You have: <span>{self_race_tables.state.money} carrots</span></p>
									}
								</div>
								<div className="race_buttons_box">
									<div className="race_start shadow_convex" id="race_start">START</div>
								</div>
							</Col>
						</Row>
						<Row>
							<Col sm={12}>
								{self.state.lang === "ro" ? 
									<p id="exit_salon" className="shadow_convex" onClick={() => self_race_tables.handleExit()}>Iesi din salon</p> : 
									<p id="exit_salon" className="shadow_convex" onClick={() => self_race_tables.handleExit()}>Exit salon</p>	
								}																			
							</Col>
						</Row>
					</Col>
					<Col sm={2}></Col>
				</Row>
			</>
		)
	}
}

var self; 
class Race extends Component {	
	constructor(props) {
		super(props);
		self = this;
		self.state = {
			socket: props.socket,
			rabbit_array: [],
			ready: false,
			start_race: false,
			user: props.user,
			id: -1,
			money:0,
			dispatch: props.dispatch
	  	};
	}	

	componentDidMount() {		
		var id = parseInt(getCookie("casino_id"));
		if(id === "" || id === "indefined"){
			id = -1;
		}

		var payload = {id: id, user: this.state.user}
		self.state.socket.emit('race_board_send', payload);
		self.state.socket.on('race_board_read', function(data){	
		 	self.setState({ rabbit_array: data.rabbit_race })
			self.setState({ money: data.money })
			self.setState({ id: data.id })
		 	self.setState({ ready: true })
		});
	}
	
	get_data = function(x){
		if(x === "start"){
			self.setState({ start_race: true })
		}
	}

	render() {
		var lang = this.props.lang;
		$('.full-height').attr('id', 'race')
		return (
			<>
				{(() => {
					if (self.state.ready) {
						if (self.state.start_race) {
							return <RaceGame lang={lang} data={self.state}></RaceGame>
						} else {
							return <RaceTables lang={lang} data={self.state} get_data={self.get_data}></RaceTables>
						}						
					} else {
						return (
							<div>Loading...</div>
						)
					}
				})()}
				<div className="show_results_container">
					<div className="show_results">
						<h1></h1>
						<p></p>
					</div>
				</div>
			</>
	  	)
	}
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Race)