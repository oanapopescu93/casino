import React from 'react';
import $ from 'jquery'; 

import {roulette_calculate_money, roulette_get_history} from '../../actions/actions'
import {connect} from 'react-redux'

import { showResults } from '../../utils'

import carrot_img from '../../img/icons/carrot_icon.png';
import roulette_bets_european from '../../img/roulette/roulette_bets_european.png'
import roulette_bets_american from '../../img/roulette/roulette_bets_american.png'
import roulette_bets_european_small from '../../img/roulette/roulette_bets_european_small.png'
import roulette_bets_american_small from '../../img/roulette/roulette_bets_american_small.png'

var canvas, canvas_bets;
var ctx, ctx_bets;
var socket;
var my_roulette;
var my_roulette_bets;
var canvas_width = 900;
var canvas_height = 800;
var canvas_width_bets = 900;
var canvas_height_bets = 300;
var roulette_radius_x = canvas_width/2;
var roulette_radius_y = 250;

var colors = [];
var numbers = [];
var startAngle = -1.65;
var startAngle01 = 0;
var arc = 0;
var outsideRadius = 200;
var textRadius = outsideRadius-20;
var insideRadius = outsideRadius-30; 

var spin_time = 0;
var spin_click = 0;
var my_click = -1;

var roulette_pos = [];
var roulette_type = "";

var circle = {radius: textRadius*0.6, angle:0}
var ball = {x:70, y:roulette_radius_x, speed:0.05, width:10};

var bet_x = roulette_radius_x - 270;
var bet_y = 620;
var bet_square = 40;

var list_bets = [];
var roulette_index = 0;
var win_nr = "";
var your_bets = [];
var your_last_bet = {};
var bet_value = 1;

var button_spin  = {};
var button_show_bets = {};
var bet_button_coordonates = {};
var spin_button_coordonates = {};
var show_bets_button_coordonates = {};
var spin_clear = [0, 0];

var radiantLine01 = [];
var radiantLine02 = [];
var radiantLine03 = [];
var text_offset = 0;

var font_bold_10 = 'bold 10px sans-serif';
var font_bold_12 = 'bold 12px sans-serif';
var font_bold_14 = 'bold 14px sans-serif';

var user_info;
var dispatch_nr = 0; //this prevents multiplication

var items = [
	{id: 'european', src: roulette_bets_european},
	{id: 'european_small', src: roulette_bets_european_small},
	{id: 'american', src: roulette_bets_american},
	{id: 'american_small', src: roulette_bets_american_small},
];
var small_image = false;
var roulette_bets_coord = [0, 0, 795, 268, 0, 0, 795, 268];

function roulette_game(props){
	var self = this;
	var lang = props.lang;
	const dispatch = props.dispatch;
	roulette_type = props.type;	
	
	user_info = {money: props.money};	
	if(props.roulette !== -1){
		user_info = props.roulette[0];			
	}
	if($('#user_money').length>0){
		if($('#user_money span').length>0){
			$('#user_money span').text(user_info.money);	
		}
	}
	
	this.ready = function(){
		self.createCanvas(canvas_width, canvas_height);
		self.choose_roulette_type();

		socket.on('roulette_spin_read', function(data){	
			if(typeof data.arc !== "undefined" || typeof data.spin_time !== "undefined" || typeof data.ball_speed !== "undefined"){
				spin_time = data.spin_time;
				ball.speed = data.ball_speed;				
				if (window.innerWidth < 900){
					if(window.innerHeight < window.innerWidth){
						//landscape
						ball.speed = 0.0173
					} else {
						//portrait
						ball.speed = 0.018
					}					
				} 
				self.spin(data.arc, spin_time, data.monkey);
			}				
		});	
	}
	
	this.createCanvas = function(canvas_width, canvas_height){		
		canvas = document.getElementById("roulette_canvas");		
		ctx = canvas.getContext("2d");
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas.width = 260;
				canvas.height = 300;

				roulette_radius_x = 130;
				roulette_radius_y = 130;
				outsideRadius = 100;
				textRadius = outsideRadius-15;
				insideRadius = outsideRadius-20;

				radiantLine01 = [-65, 15];
				radiantLine02 = [-65, -32];
				radiantLine03 = [-105, -80];
				
				bet_x = 330;
				bet_y = 130;
				bet_square = 30;

				button_spin  = {x: 100, y: roulette_radius_y+140, r: 20, sAngle: 0, eAngle: 40, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'SPIN', text_x: 88, text_y: roulette_radius_y+144};
				button_show_bets = {x: 150, y: roulette_radius_y+140, r: 20, sAngle: 0, eAngle: 40, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'BET', text_x: 140, text_y: roulette_radius_y+144}
				
				spin_button_coordonates = {x:80, y:roulette_radius_y+120, width:45, height:45};
				show_bets_button_coordonates = {x:130, y:roulette_radius_y+120, width:45, height:45};

				spin_clear = [[0,0, 260, canvas.height], [roulette_radius_x + 120, roulette_radius_y + 65, 150, 120]];
			} else {
				//small portrait
				canvas.width = 290;
				canvas.height = 400;
				roulette_radius_x = 150;
				roulette_radius_y = 150;
				outsideRadius = 120;
				textRadius = outsideRadius-15;
				insideRadius = outsideRadius-20;

				radiantLine01 = [-65, 15];
				radiantLine02 = [-105, -35];
				radiantLine03 = [-105, -85];
				
				bet_x = 330;
				bet_y = 130;
				bet_square = 30;				
				
				button_spin  = {x: 115, y: roulette_radius_y+180, r: 20, sAngle: 0, eAngle: 40, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'SPIN', text_x: 102, text_y: roulette_radius_y+184};
				button_show_bets = {x: 170, y: roulette_radius_y+180, r: 20, sAngle: 0, eAngle: 40, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'BET', text_x: 160, text_y: roulette_radius_y+184}
				
				spin_button_coordonates = {x:90, y:roulette_radius_y+160, width:45, height:45};
				show_bets_button_coordonates = {x:150, y:roulette_radius_y+160, width:45, height:45};

				spin_clear = [[0,0, 298, canvas.height], [roulette_radius_x + 120, roulette_radius_y + 65, 150, 120]];
			}

			circle = {radius: textRadius-15, angle:0}
			ball = {x:70, y:roulette_radius_x, speed:0.05, width:6};

			font_bold_10 = 'bold 8px sans-serif';
			font_bold_12 = 'bold 10px sans-serif';
			font_bold_14 = 'bold 12px sans-serif';
			text_offset = 15;			
			
		} else {
			//big
			canvas.width = 900;
			canvas.height = 500;
			
			roulette_radius_x = canvas_width/2;	
			roulette_radius_y = 250;
			outsideRadius = 200;
			textRadius = outsideRadius-20;
			insideRadius = outsideRadius-30;
			
			circle = {radius: textRadius-22, angle:0}	
			ball = {x:70, y:roulette_radius_x, speed:0.05, width:10};
			
			bet_x = canvas.width/2 - 270;
			bet_y = 620;
			bet_square = 40;
			
			font_bold_10 = 'bold 10px sans-serif';
			font_bold_12 = 'bold 12px sans-serif';
			font_bold_14 = 'bold 14px sans-serif';
			
			button_spin  = {x: bet_x, y: roulette_radius_y+200, r: 25, sAngle: 0, eAngle: 40, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'SPIN', text_x: roulette_radius_x - 284, text_y: roulette_radius_y+205};
			button_show_bets = {x: bet_x+60, y: roulette_radius_y+200, r: 25, sAngle: 0, eAngle: 40, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'BET', text_x: roulette_radius_x - 220, text_y: roulette_radius_y+205};
						
			spin_button_coordonates = {x:roulette_radius_x - 300, y:roulette_radius_y+170, width:50, height:50};
			show_bets_button_coordonates = {x:roulette_radius_x - 240, y:roulette_radius_y+170, width:50, height:50};
			spin_clear = [[0, 0, canvas.width, 490]];

			radiantLine01 = [-60, 20];
			radiantLine02 = [-60, -160];
			radiantLine03 = [-160, -200];
			text_offset = 25;
		}
		
		canvas_width = canvas.width;
		canvas_height = canvas.height;		
		canvas.height = canvas_height;
	}
	
	this.choose_roulette_type = function(){			
		self.nr_colors();	
		self.start();
		self.roulette_click();
	}
	
	this.nr_colors = function(){
		if(roulette_type === 'european'){
			colors = ["green", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red"];
			numbers = ["0", "32", "15", "19", "4", "21", "2", "25", "17", "34", "6", "27", "13", "36", "11", "30", "8", "23", "10", "5", "24", "16", "33", "1", "20", "14", "31", "9", "22", "18", "29", "7", "28", "12", "35", "3", "26"]; //37
			arc = Math.PI / (numbers.length/2);			
		} else {
			colors = ["green", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "green", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red", "black", "red"];
			numbers = ["0", "28", "9", "26", "30", "11", "7", "20", "32", "17", "5", "22", "34", "15", "3", "24", "36", "13", "1", "00", "27", "10", "25", "29", "12", "8", "19", "31", "18", "6", "21", "33", "16", "4", "23", "35", "14", "2"]; //38
			arc = Math.PI / (numbers.length/2);
		}
	}

	this.start = function(){			
		ctx.clearRect(0,0, canvas_width, canvas_height);

		ctx.font = font_bold_10; 
		ctx.shadowColor = "black";
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;

		self.drawRoulette();		
		ctx.font = font_bold_12; 		
		
		self.drawButton(button_spin.x, button_spin.y, button_spin.r, button_spin.sAngle, button_spin.eAngle, button_spin.counterclockwise, button_spin.fillStyle, button_spin.lineWidth, button_spin.strokeStyle, button_spin.text, button_spin.text_x, button_spin.text_y);
		self.drawButton(button_show_bets.x, button_show_bets.y, button_show_bets.r, button_show_bets.sAngle, button_show_bets.eAngle, button_show_bets.counterclockwise, button_show_bets.fillStyle, button_show_bets.lineWidth, button_show_bets.strokeStyle, button_show_bets.text, button_show_bets.text_x, button_show_bets.text_y);
		ctx.font = font_bold_14; 
	}
	
	this.drawRoulette = function(){		
		roulette_pos = [];
		
		ctx.shadowBlur = 10;
		draw_dot(roulette_radius_x, roulette_radius_y, outsideRadius*1.05, 0, 2 * Math.PI, false, '#a87b51', 15, '#5e391c');		
		draw_dot(roulette_radius_x, roulette_radius_y, outsideRadius*0.97, 0, 2 * Math.PI, false, 'black', 15, 'black');			
		ctx.shadowBlur = 0;

		ctx.font = font_bold_12; 	
		draw_roulette_holes(outsideRadius, insideRadius, numbers.length, colors, true, startAngle);
		ctx.font = font_bold_14; 
		draw_roulette_holes(insideRadius-1, insideRadius*0.7, numbers.length, "dark", false, startAngle)
		
		radiantLine(numbers.length, 1, "yellow", radiantLine01, startAngle);		
		
		draw_roulette_holes(insideRadius*0.7-1, 0, 12, "grey", false, startAngle01)
		radiantLine(12, 1, "#4d4d4d", radiantLine02, startAngle01);	

		draw_roulette_holes(20, 0, 8, "yellow", false, startAngle01)	
		radiantLine(8, 1, "#b99813", radiantLine03, startAngle01);
	}
	
	function draw_roulette_holes(outsideRadius, insideRadius, how_many, colors, text, startAngle){			
		for(var i = 0; i < how_many; i++) {
			arc = Math.PI / (how_many/2);
			var angle = startAngle + i * arc;			
		  
			ctx.beginPath();		  
			ctx.arc(roulette_radius_x, roulette_radius_y, outsideRadius, angle, angle + arc, false);   //ctx.arc(x,y,r,sAngle,eAngle,counterclockwise);
			ctx.arc(roulette_radius_x, roulette_radius_y, insideRadius, angle + arc, angle, true);	
			
			if(colors === "grey"){
				if(i%2 === 0){
					ctx.fillStyle = "gray";
				} else {
					ctx.fillStyle = "#999";
				}
			} else if(colors === "yellow"){
				if(i%2 === 0){
					ctx.fillStyle = "#f0d875";
				} else {
					ctx.fillStyle = "#eac739";
				}		
			} else if(colors === "dark"){
				if(roulette_type === "european"){
					if(i === 0){
						ctx.fillStyle = "darkgreen";
					} else {
						if(i%2 === 0){
							ctx.fillStyle = "black";
						} else {
							ctx.fillStyle = "darkred";
						}
					}
				} else if(roulette_type === "american"){
					if(i === 0 || i === 19){
						ctx.fillStyle = "darkgreen";
					} else {
						if(i%2 === 0){
							ctx.fillStyle = "darkred";
						} else {
							ctx.fillStyle = "black";
						}
					}
				}
				
			} else {
				ctx.fillStyle = colors[i];
			}
			
			ctx.fill(); 
			ctx.save(); 		 

			if(text){
				ctx.fillStyle = "white";
				ctx.translate(roulette_radius_x + Math.cos(angle + arc / 2) * textRadius, roulette_radius_y + Math.sin(angle + arc / 2) * textRadius);
				ctx.rotate(angle + arc / 2 + Math.PI / 2);
				let text = numbers[i];
				ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
				roulette_pos.push({x: roulette_radius_x + Math.cos(angle + arc / 2) * (textRadius-text_offset), y: roulette_radius_y + Math.sin(angle + arc / 2) * (textRadius-text_offset), nr: text, color: colors[i]}); 
			}
		  
			ctx.restore();
			ctx.closePath();
		}	
	}
	
	function radiantLine(how_many, line, color, offset, startAngle){
		for(let i = 0; i < how_many; i++) {
			arc = Math.PI / (how_many/2);
			let angle = startAngle + i * arc;			
		  
			ctx.beginPath();
			
			ctx.strokeStyle = color;
			ctx.lineWidth = line; 
			ctx.moveTo(roulette_radius_x + Math.cos(angle + arc) * (textRadius+offset[0]), roulette_radius_y + Math.sin(angle + arc) * (textRadius+offset[0]));
			ctx.lineTo(roulette_radius_x + Math.cos(angle + arc) * (textRadius+offset[1]), roulette_radius_y + Math.sin(angle + arc) * (textRadius+offset[1]));
			ctx.stroke();
			ctx.closePath();
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
	
	this.drawButton = function(x, y, r,sAngle,eAngle,counterclockwise, fillStyle, lineWidth, strokeStyle, text, text_x, text_y){
		ctx.shadowBlur = 10;		
		draw_dot(x, y, r,sAngle,eAngle,counterclockwise, fillStyle, lineWidth, strokeStyle);
		ctx.shadowBlur = 0;
		ctx.fillStyle = strokeStyle;
		ctx.fillText(text, text_x, text_y);
	}	
		
	this.roulette_click = function(){			
		$('#roulette_canvas').off('click').on('click', function(event) {
			self.canvas_click(canvas, event);
		});
		
		$('#roulette_canvas').off('mousemove').on('mousemove', function(event) {
			let mousePos = getMousePos(canvas, event);
			$('#roulette_canvas').css('cursor', "default")
			if (isInside(mousePos, spin_button_coordonates) || isInside(mousePos, show_bets_button_coordonates)) {
				$('#roulette_canvas').css('cursor', "pointer")				
			} 
		});
	}
	
	this.canvas_click = function(canvas, event){		
		var mousePos = getMousePos(canvas, event);
		// ctx.beginPath();
		// ctx.lineWidth = "1";
		// ctx.strokeStyle = "green";
		// ctx.rect(bet_button_coordonates.x, bet_button_coordonates.y, bet_button_coordonates.width, bet_button_coordonates.height);
		// ctx.stroke();
		// ctx.lineWidth = "1";
		// ctx.strokeStyle = "red";
		// ctx.rect(spin_button_coordonates.x, spin_button_coordonates.y, spin_button_coordonates.width, spin_button_coordonates.height);
		// ctx.stroke();
		// ctx.lineWidth = "1";
		// ctx.strokeStyle = "blue";
		// ctx.rect(show_bets_button_coordonates.x, show_bets_button_coordonates.y, show_bets_button_coordonates.width, show_bets_button_coordonates.height);
		// ctx.stroke();
		
		if (isInside(mousePos, bet_button_coordonates)) {
			//console.log('BET');			
			var width = $('.roulette_container').width();
			$('.roulette_container').animate({
				scrollLeft: width
			}, 500);	
		} else if (isInside(mousePos, spin_button_coordonates)) {
			//console.log('SPIN', your_bets);
			dispatch_nr = 0;	
			if(JSON.stringify(your_bets) === JSON.stringify([])){
				showResults("", "Please place your bet before playing.");			
			} else {
				spin_click++;
				my_click++;
				var roulette_payload_server = {
					spin_click: spin_click,
					my_click: my_click,
					user: props.user, 
					user_table: props.user_table, 
					user_type: props.type
				}
				socket.emit('roulette_spin_send', roulette_payload_server);
				$('.roulette_container').animate({
					scrollLeft: 0
				}, 500);
			}				
		} else if (isInside(mousePos, show_bets_button_coordonates)) {
			//console.log('SHOW')
			if($('.roulette_bets_container').length>0){
				$('.roulette_bets_container').addClass('open');
			}
		} 
	}
	
	this.spin = function(arc, spin_time, monkey){
		var spin_nr = 0;
		//var spin_time = 10;
		var monkey_wait = 200;	
		
		dispatch_nr++;		

		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function( callback ){
			  window.setTimeout(callback, 1000 / 60);
			};
	  })();	  
	  
	  function spin_roulette() {		
		for(var i in spin_clear){
			ctx.clearRect(spin_clear[i][0], spin_clear[i][1], spin_clear[i][2], spin_clear[i][3]);
		}
		
		var stop = false;
		if (spin_nr > spin_time) {
			if(spin_nr > spin_time + 500){								
				self.drawRoulette();
				
				ctx.font = font_bold_12; 				
				self.drawButton(button_spin.x, button_spin.y, button_spin.r, button_spin.sAngle, button_spin.eAngle, button_spin.counterclockwise, button_spin.fillStyle, button_spin.lineWidth, button_spin.strokeStyle, button_spin.text, button_spin.text_x, button_spin.text_y);
				self.drawButton(button_show_bets.x, button_show_bets.y, button_show_bets.r, button_show_bets.sAngle, button_show_bets.eAngle, button_show_bets.counterclockwise, button_show_bets.fillStyle, button_show_bets.lineWidth, button_show_bets.strokeStyle, button_show_bets.text, button_show_bets.text_x, button_show_bets.text_y);
				ctx.font = font_bold_14; 
				
				roulette_index = parseInt(self.closest_nr(ball, roulette_pos, "nr"));
				win_nr = roulette_pos[roulette_index];									
				
				self.drawBall(win_nr.x, win_nr.y, ball.width, 0, 2 * Math.PI, false);
				
				self.check_win_lose(your_bets,win_nr);
				
				setTimeout(function(){ 
					if(lang === "ro"){
						showResults("Resultate", "Numarul norocos este " + win_nr.nr);
					} else {
						showResults("Results", "The lucky number is " + win_nr.nr);
					}						
					your_last_bet = {}
					your_bets = [];
					spin_click = 0;
					self.start();	
				}, 500);
				
				stop = true
				
			} else {
				spin_nr++; 
				self.rotateWheel(arc-0.04);		
				
				roulette_index = parseInt(self.closest_nr(ball, roulette_pos, "nr"));
				win_nr = roulette_pos[roulette_index];
				
				circle.angle -= arc-0.04;		
				self.rotateBall(win_nr.x, win_nr.y);
				
				stop = false
			}
		} else {
			spin_nr++; 
			
			switch (true) {
				case (spin_nr <= spin_time/2):						
					self.rotateWheel(arc);
					circle.angle += ball.speed;		
					break;
				case (spin_nr > spin_time/2 && spin_nr <= 2*spin_time/3):
					self.rotateWheel(arc-0.01);
					circle.angle += ball.speed-0.01;	
					break;
				case (spin_nr > 2*spin_time/3 && spin_nr <= 5*spin_time/6):
					self.rotateWheel(arc-0.02);
					circle.angle += ball.speed-0.02;		
					break;
				case (spin_nr > 5*spin_time/6 && spin_nr <= spin_time-20):
					self.rotateWheel(arc-0.03);
					circle.angle += ball.speed-0.03;	
					break;
				case (spin_nr > spin_time-20 && spin_nr <= spin_time-10):
					self.rotateWheel(arc-0.04);
					circle.angle += ball.speed-0.04;	
					break;
				default:
					break;
			}

			if(typeof monkey !== "undefined" || monkey !== []){							
				roulette_index = parseInt(self.closest_nr(ball, roulette_pos, "nr"));
				win_nr = roulette_pos[roulette_index];
				
				if(typeof monkey === "number"){
					monkey = monkey.toString();
				}	

				if(monkey === win_nr.nr && spin_nr > spin_time -  monkey_wait){
					self.rotateBall(win_nr.x, win_nr.y);
					spin_nr = spin_time + 1;
				} else {
					self.rotateBall(ball.x,ball.y);
				}					
			} else {
				self.rotateBall(ball.x,ball.y);
			}
			
			stop = false
		}		
		
		if(!stop){
			window.requestAnimFrame(spin_roulette);
		} else {
			window.cancelAnimationFrame(spin_roulette);
		}
	  };

	  if(dispatch_nr === 1){
		spin_roulette();
	  }	  
	}
	
	this.rotateWheel = function(x) {
		startAngle  = startAngle + x;
		startAngle01  = startAngle01 + x;
		ball.y = roulette_radius_y + Math.cos(circle.angle) * circle.radius;
		ball.x = roulette_radius_x + Math.sin(circle.angle) * circle.radius;		
	}	
	
	this.drawBall = function(x, y, r, sAngle, eAngle, counterclockwise){
		draw_dot(x, y, r, sAngle, eAngle, counterclockwise, 'white', 1, 'grey');  //ctx.arc(x, y, r, sAngle, eAngle, counterclockwise);
	}
	
	this.rotateBall = function(a, b){
		self.drawRoulette();
		
		ctx.font = font_bold_12; 
		self.drawButton(button_spin.x, button_spin.y, button_spin.r, button_spin.sAngle, button_spin.eAngle, button_spin.counterclockwise, button_spin.fillStyle, button_spin.lineWidth, button_spin.strokeStyle, button_spin.text, button_spin.text_x, button_spin.text_y);
		self.drawButton(button_show_bets.x, button_show_bets.y, button_show_bets.r, button_show_bets.sAngle, button_show_bets.eAngle, button_show_bets.counterclockwise, button_show_bets.fillStyle, button_show_bets.lineWidth, button_show_bets.strokeStyle, button_show_bets.text, button_show_bets.text_x, button_show_bets.text_y);
		ctx.font = font_bold_14; 
		
		self.drawBall(a, b, ball.width, 0, 2 * Math.PI, false);
	}
	
	this.closest_nr = function(nr, arr, text){
		var closest = 1000;
		var obj = {};
		var index = 0;
		for(var i in arr){
			if(closest > self.getDistance_between_entities(nr, arr[i])){
				closest = self.getDistance_between_entities(nr, arr[i]);
				obj = arr[i];
				index = i;
			}
		}
		
		if(text === "nr"){
			return index;
		} else {
			return obj;
		}		
	}
	
	this.getDistance_between_entities = function(entity01, entity02){
		var distance_x = entity01.x - entity02.x;
		var distance_y = entity01.y - entity02.y;
		return Math.sqrt(distance_x * distance_x + distance_y * distance_y);
	}
	
	this.check_win_lose = function(elem01, elem02){	
		var money_history = user_info.money;
		for(var i in elem01){	
			elem01[i].lucky_nr = elem02.nr;			
			if(isNaN(elem01[i].text) === false){
				if(parseInt(elem01[i].text) === parseInt(elem02.nr)){
					//console.log('case-a', elem01[i].text, elem02.nr);
					elem01[i].win = true;
					money_history = money_history + 1;					
				} else {
					//console.log('case-b', elem01[i].text, elem02.nr);
					elem01[i].win = false;
					money_history = money_history - 1;
				}
				elem01[i].money_history = money_history;
			} else {
				switch (elem01[i].text) {
					case "1st 12":	
						if(elem02.nr > 0 && elem02.nr < 13){
							//console.log('case01-a', elem02);
							elem01[i].win = true;
							money_history = money_history + 1;
						} else {
							//console.log('case01-b', elem02);
							elem01[i].win = false;
							money_history = money_history - 1;	
						}
						break;
					case "2st 12":	
						if(elem02.nr > 12 && elem02.nr < 25){
							//console.log('case02-a', elem02);
							elem01[i].win = true;
							money_history = money_history + 1;	
						} else {
							//console.log('case02-b', elem02);
							elem01[i].win = false;
							money_history = money_history - 1;	
						}
						break;
					case "3st 12":	
						if(elem02.nr > 24 && elem02.nr < 37){
							//console.log('case03-a', elem02);
							elem01[i].win = true;
							money_history = money_history + 1;	
						} else {
							//console.log('case03-b', elem02);
							elem01[i].win = false;
							money_history = money_history - 1;	
						}
						break;
					case "1-18":
						if(elem02.nr > 0 && elem02.nr < 19){
							//console.log('case04-a', elem02);
							elem01[i].win = true;
							money_history = money_history + 1;	
						} else {
							//console.log('case04-b', elem02);
							elem01[i].win = false;
							money_history = money_history - 1;	
						}
						break;
					case "Even":
						if(elem02.nr % 2 === 0){
							//console.log('case05-a', elem02);
							elem01[i].win = true;
							money_history = money_history + 1;	
						} else {
							//console.log('case05-b', elem02);
							elem01[i].win = false;
							money_history = money_history - 1;	
						}
						break;
					case "reds":
						if(elem02.color === "red"){
							//console.log('case06-a', elem02);
							elem01[i].win = true;
							money_history = money_history + 1;	
						} else {
							//console.log('case06-b', elem02);
							elem01[i].win = false;
							money_history = money_history - 1;	
						}
						break;
					case "blacks":
						if(elem02.color === "black"){
							//console.log('case06-a', elem02);
							elem01[i].win = true;
							money_history = money_history + 1;	
						} else {
							//console.log('case06-b', elem02);
							elem01[i].win = false;
							money_history = money_history - 1;	
						}
						break;
					case "Odd":
						if(elem02.nr % 2 !== 0){
							//console.log('case08-a', elem02);
							elem01[i].win = true;
							money_history = money_history + 1;	
						} else {
							//console.log('case08-b', elem02);
							elem01[i].win = false;
							money_history = money_history - 1;	
						}
						break;
					case "19-36":
						if(elem02.nr > 18 && elem02.nr < 37){
							//console.log('case09-a', elem02);
							elem01[i].win = true;
							money_history = money_history + 1;	
						} else {
							//console.log('case09-b', elem02);
							elem01[i].win = false;
							money_history = money_history - 1;	
						}
						break;
					case "2 to 1a":						
						for(var k=0; k<12; k++){
							var x = 3*k+3;
							//console.log('case10', x, parseInt(elem02.nr), x === parseInt(elem02.nr));
							if(x === parseInt(elem02.nr)){
								//console.log('case10-a', elem02);
								elem01[i].win = true;
								money_history = money_history + 1;	
							} else {
								//console.log('case10-b', elem02);
								elem01[i].win = true;
								money_history = money_history - 1;	
							}							
						}
						break;
					case "2 to 1b":
						for(var k=0; k<12; k++){
							var x = 3*k+2;
							//console.log('case11', x, parseInt(elem02.nr), x === parseInt(elem02.nr));
							if(x === parseInt(elem02.nr)){
								//console.log('case11-a', elem02);
								elem01[i].win = true;
								money_history = money_history + 1;	
							} else {
								//console.log('case11-b', elem02);
								elem01[i].win = true;
								money_history = money_history - 1;	
							}							
						}
						break;
					case "2 to 1c":
						for(var k=0; k<12; k++){
							var x = 3*k+1;
							//console.log('case12', x, parseInt(elem02.nr), x === parseInt(elem02.nr));
							if(x === parseInt(elem02.nr)){
								//console.log('case12-a', elem02);
								elem01[i].win = true;
								money_history = money_history + 1;	
							} else {
								//console.log('case12-b', elem02);
								elem01[i].win = true;
								money_history = money_history - 1;	
							}							
						}
						break;
					default:
						break;
				}	
				elem01[i].money_history = money_history;
			}
		}
		
		self.win_lose(elem01)
	}
	
	this.win_lose = function(arr){
		if(Object.keys(user_info).length !== 0 || !isNaN(user_info.money)){			
			for(var i in arr){			
				if(arr[i].win){		
					user_info.money = user_info.money + arr[i].bet_value;	
				} else {
					user_info.money = user_info.money - arr[i].bet_value;	
				}
			}
			dispatch(roulette_calculate_money(user_info.money))
			dispatch(roulette_get_history(your_bets))
		}
		if($('#user_money').length>0){
			if($('#user_money span').length>0){
				$('#user_money span').text(user_info.money);
			}
		}

		var roulette_payload_server = {
			user_id: props.user_id,
			user: props.user, 
			user_table: props.user_table, 
			user_type: props.type,
			money: user_info.money
		}
		socket.emit('roulette_results_send', roulette_payload_server);
	}	
}

function roulette_bets(props){
	var self = this;
	var lang = props.lang;
	this.images = [];
	var reason = "";

	$('.roulette_bets .close').click(function() {
		$('.roulette_bets_container').removeClass('open');
	});
	
	this.ready = function(r){
		reason = r;
		self.createCanvas(canvas_width_bets, canvas_height_bets);
		self.getImage(reason);
	}

	this.createCanvas = function(canvas_width_bets, canvas_height_bets){		
		canvas_bets = document.getElementById("roulette_bets_canvas");		
		ctx_bets = canvas_bets.getContext("2d");
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas_bets.width = 400;
				canvas_bets.height = 150;
				small_image = false;
				roulette_bets_coord = [0, 0, 795, 268, 0, 0, 400, 135];
			} else {
				//small portrait
				canvas_bets.width = 150;
				canvas_bets.height = 400;
				small_image = true;
				roulette_bets_coord = [0, 0, 382, 1136, 0, 0, 191, 568];
			}

			font_bold_10 = 'bold 8px sans-serif';
			font_bold_12 = 'bold 10px sans-serif';
			font_bold_14 = 'bold 12px sans-serif';
			
		} else {
			//big
			canvas_bets.width = 900;
			canvas_bets.height = 280;
			
			font_bold_10 = 'bold 10px sans-serif';
			font_bold_12 = 'bold 12px sans-serif';
			font_bold_14 = 'bold 14px sans-serif';
			
			small_image = false;
			roulette_bets_coord = [0, 0, 795, 268, 0, 0, 795, 268];
		}
		
		canvas_width_bets = canvas_bets.width;
		canvas_height_bets = canvas_bets.height;		
		canvas_bets.height = canvas_height_bets;
	}

	this.getImage = function(reason){
		if(reason !== "resize"){
			var promises = [];
			for(var i in items){				
				promises.push(self.preaload_images(items[i]));
			}

			Promise.all(promises).then(function(result){
				self.images = result;
				self.choose_roulette_bets();
				self.create_roulette_bets();
				self.roulette_click();
			});	
		} else {
			self.choose_roulette_bets();
			self.create_roulette_bets();
			self.roulette_click();
		}
	}

	this.preaload_images = function(item){
		return new Promise(function(resolve, reject){
			let image = new Image();
			image.id = item.id;
			image.src = item.src;
			image.addEventListener("load", function() {
				resolve(image)
			}, false);
		});
	}

	this.roulette_click = function(){			
		$('#roulette_bets_canvas').off('click').on('click', function(event) {
			let money = user_info.money;
			//console.log('BET', money)
			if(money>0){
				self.canvas_click(canvas_bets, event);
			} else {
				if(lang === "ro"){
					showResults("Nu ai suficienti morcovi!", "Du-te in contul tau, la sectiunea Market si cumpara.", 600);
				} else {
					showResults("You don't have enough carrots!", "Go to your account, at the Market Section and buy some.", 600);
				}
			}
		});

		$('#roulette_bets_clear').off('click').on('click', function(event) {
			//console.log('CLEAR')
			your_last_bet = {}
			your_bets = [];
			self.choose_roulette_bets();
			self.create_roulette_bets();
			self.roulette_click();
		});
		
		$('#roulette_bets_canvas').off('mousemove').on('mousemove', function(event) {
			var mousePos = getMousePos(canvas_bets, event);
			$('#roulette_bets_canvas').css('cursor', "default");			
			for(var i in list_bets){
				var obj = list_bets[i];	
				obj.bet_value = bet_value;				
				if (isInside(mousePos,obj)) {
					$('#roulette_bets_canvas').css('cursor', "pointer")
				} 
			}
		});
	}
	
	this.canvas_click = function(canvas, event){		
		var mousePos = getMousePos(canvas, event);
		for(var i in list_bets){
			var obj = list_bets[i];
			obj.bet_value = bet_value;			
			if (isInside(mousePos,obj)) {
				if(spin_click === 0){
					your_bets.push(obj);					
					your_last_bet = obj;
					self.draw_tokens(your_last_bet);
				}
				break;
			} 
		}	
	}

	this.draw_tokens = function(your_last_bet){		
		var x = your_last_bet.x + your_last_bet.width/2 - bet_square/4;
		var y = your_last_bet.y + your_last_bet.height/2 - bet_square/4 - 5;
		var w = bet_square/2;
		var h = bet_square/2+10;		
		
		var img = new Image();
		img.src = carrot_img; 
		img.onload = function() {
			ctx_bets.drawImage(img, x, y, w, h);	
		};
	}

	this.create_roulette_bets = function(){
		var color = ['red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red'];
		var k = 0;
		var squares;
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape					
				if(roulette_type === "european"){
					//console.log('type01a--> european small landscape')
					squares = {
						a: {x:0, y:0, w:27, h:78}, //0
						b: {}, //00
						c: {x:26, y:80, w:27, h:27}, //first square
						d: {x:27, y:80, w:106, h:27}, //first 12
						e: {x:27, y:110, w:53, h:27}, //1-18
						f: {x:345, y:0, w:53, h:27}, //2 to 1
					}					
				} else {
					//console.log('type01b--> american small landscape')
					k = 1;
					squares = {
						a: {x:0, y:0, w:27, h:40}, //0
						b: {x:0, y:40, w:27, h:40}, //00
						c: {x:26, y:80, w:27, h:27}, //first square
						d: {x:27, y:80, w:106, h:27}, //first 12
						e: {x:27, y:110, w:53, h:27}, //1-18
						f: {x:345, y:0, w:53, h:27}, //2 to 1
					}	
				}
			} else {
				//small portrait
				if(roulette_type === "european"){
					//console.log('type02a--> european small portrait')
					squares = {
						a: {x:53, y:0, w:78, h:27}, //0
						b: {}, //00
						c: {x:53, y:346, w:27, h:27}, //first square
						d: {x:27, y:27, w:27, h:106}, //first 12
						e: {x:0, y:27, w:27, h:53}, //1-18
						f: {x:53, y:345, w:27, h:53}, //2 to 1
					}
				} else {
					k = 1;
					//console.log('type02b--> american small portrait')
					squares = {
						a: {x:53, y:0, w:40, h:27}, //0
						b: {x:93, y:0, w:40, h:27}, //00
						c: {x:53, y:346, w:27, h:27}, //first square
						d: {x:27, y:27, w:27, h:106}, //first 12
						e: {x:0, y:27, w:27, h:53}, //1-18
						f: {x:53, y:345, w:27, h:53}, //2 to 1
					}
				}
			}			
		} else {
			//big
			if(roulette_type === "european"){
				//console.log('type03a--> european big')
				squares = {
					a: {x:0, y:0, w:53, h:160}, //0
					b: {}, //00
					c: {x:50, y:160, w:53, h:57}, //first square
					d: {x:50, y:160, w:212, h:57}, //first 12
					e: {x:50, y:212, w:106, h:57}, //1-18
					f: {x:685, y:0, w:106, h:53}, //2 to 1
				}
			} else {
				k = 1;
				//console.log('type03b--> american big')
				squares = {
					a: {x:0, y:0, w:53, h:80}, //0
					b: {x:0, y:80, w:53, h:80}, //00
					c: {x:50, y:160, w:53, h:57}, //first square
					d: {x:50, y:160, w:212, h:57}, //first 12
					e: {x:50, y:212, w:106, h:57}, //1-18
					f: {x:685, y:0, w:106, h:53}, //2 to 1
				}
			}
		}

		my_bets(squares, k, color);
	}
	
	function my_bets(squares, k, color, up){
		var a = 0;
		list_bets = [];
		//draw_rect(ctx_bets, squares.a.x, squares.a.y, squares.a.w, squares.a.h, 'transparent', 1, 'red');
		list_bets.push({x: squares.a.x, y: squares.a.y, width: squares.a.w, height: squares.a.h, color:"green", text: "0"});
		
		if(Object.keys(squares.b).length !== 0){ // it means it is american roulette and has 00
			//draw_rect(ctx_bets, squares.b.x, squares.b.y, squares.b.w, squares.b.h, 'transparent', 1, 'red');
			list_bets.push({x: squares.b.x, y: squares.b.y, width: squares.b.w, height: squares.b.h, color:"green", text: "00"});
		}
		
		if(!small_image){
			//big or small landscape
			//console.log('type001')
			for(var i = 1; i < numbers.length-k; i++) {	
				a++
				if(a > 3){
					squares.c.x = squares.c.x + squares.c.w;	
					squares.c.y = squares.c.y + 2 * squares.c.w;
					a = 1;
				} else {
					squares.c.y = squares.c.y - squares.c.w;
				}
				//draw_rect(ctx_bets, squares.c.x, squares.c.y, squares.c.w, squares.c.h, 'transparent', 1, 'red');
				list_bets.push({x: squares.c.x, y: squares.c.y, width: squares.c.w, height: squares.c.h, color: color[i-1], text: i.toString()});
			}

			// draw_rect(ctx_bets, 0*squares.d.w + squares.d.x, squares.d.y, squares.d.w, squares.d.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, 1*squares.d.w + squares.d.x, squares.d.y, squares.d.w, squares.d.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, 2*squares.d.w + squares.d.x, squares.d.y, squares.d.w, squares.d.h, 'transparent', 1, 'red');
			list_bets.push({x: 0*squares.d.w + squares.d.x, y: squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "1st 12"});	
			list_bets.push({x: 1*squares.d.w + squares.d.x, y: squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "2st 12"});	
			list_bets.push({x: 2*squares.d.w + squares.d.x, y: squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "3st 12"});	
		
			// draw_rect(ctx_bets, 0*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, 1*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, 2*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, 3*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, 4*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, 5*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red');				
			list_bets.push({x: 0*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "1-18"});	
			list_bets.push({x: 1*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "Even"});	
			list_bets.push({x: 2*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "reds"});	
			list_bets.push({x: 3*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "blacks"});	
			list_bets.push({x: 4*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "Odd"});	
			list_bets.push({x: 5*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "19-36"});

			// draw_rect(ctx_bets, squares.f.x, 0*squares.f.h + squares.f.y, squares.f.w, squares.f.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, squares.f.x, 1*squares.f.h + squares.f.y, squares.f.w, squares.f.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, squares.f.x, 2*squares.f.h + squares.f.y, squares.f.w, squares.f.h, 'transparent', 1, 'red');
			list_bets.push({x: squares.f.x, y: 0*squares.f.h + squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1a"});	
			list_bets.push({x: squares.f.x, y: 1*squares.f.h + squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1b"});	
			list_bets.push({x: squares.f.x, y: 2*squares.f.h + squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1c"});
		} else {
			//small portrait
			//console.log('type002')
			for(var i = 1; i < numbers.length-k; i++) {	
				a++
				if(a > 12){
					squares.c.x = squares.c.x + squares.c.w;	
					squares.c.y = squares.c.y + 11 * squares.c.w;
					a = 1;
				} else {
					squares.c.y = squares.c.y - squares.c.w;
				}
				//draw_rect(ctx_bets, squares.c.x, squares.c.y, squares.c.w, squares.c.h, 'transparent', 1, 'red');
				list_bets.push({x: squares.c.x, y: squares.c.y, width: squares.c.w, height: squares.c.h, color: color[i-1], text: i.toString()});
			}

			// draw_rect(ctx_bets, squares.d.x, 0 * squares.d.h + squares.d.y, squares.d.w, squares.d.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, squares.d.x, 1 * squares.d.h + squares.d.y, squares.d.w, squares.d.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, squares.d.x, 2 * squares.d.h + squares.d.y, squares.d.w, squares.d.h, 'transparent', 1, 'red');
			list_bets.push({x: squares.d.x, y: 0 * squares.d.h + squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "1st 12"});	
			list_bets.push({x: squares.d.x, y: 1 * squares.d.h + squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "2st 12"});	
			list_bets.push({x: squares.d.x, y: 2 * squares.d.h + squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "3st 12"});	

			// draw_rect(ctx_bets, squares.e.x, 0 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, squares.e.x, 1 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, squares.e.x, 2 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, squares.e.x, 3 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, squares.e.x, 4 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, squares.e.x, 5 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red');				
			list_bets.push({x: squares.e.x, y: 0 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "1-18"});	
			list_bets.push({x: squares.e.x, y: 1 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "Even"});	
			list_bets.push({x: squares.e.x, y: 2 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "reds"});	
			list_bets.push({x: squares.e.x, y: 3 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "blacks"});	
			list_bets.push({x: squares.e.x, y: 4 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "Odd"});	
			list_bets.push({x: squares.e.x, y: 5 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "19-36"});

			// draw_rect(ctx_bets, 0 * squares.f.w + squares.f.x, squares.f.y, squares.f.w, squares.f.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, 1 * squares.f.w + squares.f.x, squares.f.y, squares.f.w, squares.f.h, 'transparent', 1, 'red');
			// draw_rect(ctx_bets, 2 * squares.f.w + squares.f.x, squares.f.y, squares.f.w, squares.f.h, 'transparent', 1, 'red');
			list_bets.push({x: 0 * squares.f.w + squares.f.x, y: squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1a"});	
			list_bets.push({x: 1 * squares.f.w + squares.f.x, y: squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1b"});	
			list_bets.push({x: 2 * squares.f.w + squares.f.x, y: squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1c"});
		}
	}	

	this.choose_roulette_bets = function(){
		if(roulette_type === "european"){
			if(!small_image){
				self.draw_roulette_bets(self.images[0]);
			} else {
				self.draw_roulette_bets(self.images[1]);
			}
		} else if(roulette_type === "american"){
			if(!small_image){
				self.draw_roulette_bets(self.images[2]);
			} else {
				self.draw_roulette_bets(self.images[3]);
			}
		}
	}

	this.draw_roulette_bets = function(img){
		ctx_bets.clearRect(0, 0, canvas.width, canvas.height);
		let sx = roulette_bets_coord[0];
		let sy = roulette_bets_coord[1];
		let swidth = roulette_bets_coord[2];
		let sheight = roulette_bets_coord[3];
		let x = roulette_bets_coord[4];
		let y = roulette_bets_coord[5];
		let width = roulette_bets_coord[6];
		let height = roulette_bets_coord[7];
		ctx_bets.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
	}
}

function getMousePos(canvas, event) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}	
function isInside(mousePos, obj){
	return mousePos.x > obj.x && mousePos.x < obj.x + obj.width && mousePos.y < obj.y + obj.height && mousePos.y > obj.y
}

function Roulette(props) {
	setTimeout(function(){ 
		$('.full-height').attr('id', 'roulette');

		let title = props.user_table;
		title = title.charAt(0).toUpperCase() + title.slice(1);
		$('.roulette_title').empty();
		if (window.innerWidth >= 960){
			$('.roulette_title').append(title);
		}		
		
		my_roulette = new roulette_game(props);
		my_roulette.ready();
		my_roulette_bets = new roulette_bets(props);
		my_roulette_bets.ready();

		$(window).resize(function(){
			if(document.getElementById("roulette_canvas") !== null){
				my_roulette.ready('resize');
			}
			if(document.getElementById("roulette_bets_canvas") !== null){
				my_roulette_bets.ready('resize');
			}
		});
	}, 0);	
	socket = props.socket;
	
	return (
		<>
			<div className="roulette_container">
				<h1 className="roulette_title"></h1>
				<canvas id="roulette_canvas"></canvas>
			</div>
			<div className="show_results_container">				
				<div className="show_results">
					<i className="fa fa-times show_results_close" ></i>
					<h1 className="header"></h1>
					<div className="message"></div>
				</div>
			</div>
			<div className="roulette_bets_container">
				<div className="roulette_bets shadow_concav">
					<div className="close">x</div>
					<div className="roulette_bets_box">						
						<canvas id="roulette_bets_canvas"></canvas>	
						<div id="roulette_bets_clear" className="shadow_convex">Clear</div>
					</div>
				</div>
			</div>
		</>
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Roulette)