import React from 'react';
import $ from 'jquery'; 

import {calculate_money, get_history} from '../../actions/actions'
import {connect} from 'react-redux'

import carrot_img from '../../img/icons/carrot_icon.png';

var canvas;
var ctx;
var socket;
var my_roulette;
var canvas_width = 900;
var canvas_height = 750;
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

var button_spin  = {x: roulette_radius_x - 270, y: roulette_radius_y+200, r: 25, sAngle: 0, eAngle: 40, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'SPIN', text_x: roulette_radius_x - 284, text_y: roulette_radius_y+205};
var button_clear = {x: roulette_radius_x - 210, y: roulette_radius_y+200, r: 25, sAngle: 0, eAngle: 40, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'CLEAR', text_x: roulette_radius_x - 232, text_y: roulette_radius_y+205};
var spin_button_coordonates = {};
var clear_button_coordonates = {};
var spin_clear = [0, 0];

var radiantLine01 = [];
var radiantLine02 = [];
var radiantLine03 = [];
var text_offset = 0;

var font_bold_10 = 'bold 10px sans-serif';
var font_bold_12 = 'bold 12px sans-serif';
var font_bold_14 = 'bold 14px sans-serif';
var font_bold_16 = 'bold 16px sans-serif';

var user_info = 0;
var dispatch_nr = 0; //this prevents multiplication

function roulette_game(props){
	var self = this;
	const dispatch = props.dispatch;
	roulette_type = props.type;	
	
	user_info = {money: props.money};	
	if(props.roulette !== -1){
		user_info = props.roulette[0];			
	}
	
	//console.log('history000b--> ', props, user_info.money)	
	$('#nav_money span').text(user_info.money);	
	
	this.ready = function(){
		self.createCanvas(canvas_width, canvas_height);
		self.choose_roulette_type();

		socket.on('roulette_spin_read', function(data){	
			//console.log('roulette_spin_read', spin_click, data.monkey)
			if(typeof data.arc !== "undefined" || typeof data.spin_time !== "undefined" || typeof data.ball_speed !== "undefined"){
				spin_time = data.spin_time;
				ball.speed = data.ball_speed;
				// console.log('spin_read', ball.speed);
				if (window.innerWidth < 900){
					ball.speed = ball.speed/2
				} 
				self.spin(data.arc, spin_time, data.monkey);
			}				
		});	
	}
	
	this.createCanvas = function(canvas_width, canvas_height){		
		canvas = document.getElementById("wheelcanvas");		
		ctx = canvas.getContext("2d");	
		
		if (window.innerWidth < 900){
			canvas.width = window.innerWidth - 30;
			canvas.height = 300;
			
			roulette_radius_x = 130;
			roulette_radius_y = 130;
			outsideRadius = 100;
			textRadius = outsideRadius-15;
			insideRadius = outsideRadius-20;
			
			circle = {radius: textRadius-15, angle:0}
			ball = {x:70, y:roulette_radius_x, speed:0.05, width:6};
			
			bet_x = 285;
			bet_y = 130;
			bet_square = 25;
			
			font_bold_10 = 'bold 8px sans-serif';
			font_bold_12 = 'bold 10px sans-serif';
			font_bold_14 = 'bold 12px sans-serif';
			font_bold_16 = 'bold 12px sans-serif';
			
			button_spin  = {x: bet_x, y: roulette_radius_y+100, r: 20, sAngle: 0, eAngle: 40, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'SPIN', text_x: bet_x-11, text_y: roulette_radius_y+105};
			button_clear = {x: bet_x+55, y: roulette_radius_y+100, r: 20, sAngle: 0, eAngle: 40, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'CLEAR', text_x: bet_x+39, text_y: roulette_radius_y+105};
			
			spin_button_coordonates = {x:roulette_radius_x + 130, y:roulette_radius_y + 75, width:45, height:45};
			clear_button_coordonates = {x:roulette_radius_x + 180, y:roulette_radius_y + 75, width:45, height:45};
			spin_clear = [[0,0, 255, canvas.height], [roulette_radius_x + 120, roulette_radius_y + 65, 150, 120]];

			radiantLine01 = [-65, 15];
			radiantLine02 = [-65, -32];
			radiantLine03 = [-105, -80];
			text_offset = 15;

			//hide if not landscape
			if(window.innerHeight > window.innerWidth){
				$('#wheelcanvas').hide()
				alert("Please use Landscape!");
			} else {
				$('#wheelcanvas').show()
			}
		} else {
			canvas.width = 900;	
			canvas.height = 750;
			
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
			font_bold_16 = 'bold 16px sans-serif';
			
			button_spin  = {x: bet_x, y: roulette_radius_y+200, r: 25, sAngle: 0, eAngle: 40, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'SPIN', text_x: roulette_radius_x - 284, text_y: roulette_radius_y+205};
			button_clear = {x: bet_x+60, y: roulette_radius_y+200, r: 25, sAngle: 0, eAngle: 40, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'CLEAR', text_x: roulette_radius_x - 232, text_y: roulette_radius_y+205};
			
			spin_button_coordonates = {x:roulette_radius_x - 300, y:roulette_radius_y+170, width:50, height:50};
			clear_button_coordonates = {x:roulette_radius_x - 240, y:roulette_radius_y+170, width:50, height:50};
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
		self.roulette_table_click();
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
		self.drawButton(button_clear.x, button_clear.y, button_clear.r, button_clear.sAngle, button_clear.eAngle, button_clear.counterclockwise, button_clear.fillStyle, button_clear.lineWidth, button_clear.strokeStyle, button_clear.text, button_clear.text_x, button_clear.text_y);
		ctx.font = font_bold_14; 
		
		self.create_roulette_bets();	
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
				var text = numbers[i];
				ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
				roulette_pos.push({x: roulette_radius_x + Math.cos(angle + arc / 2) * (textRadius-text_offset), y: roulette_radius_y + Math.sin(angle + arc / 2) * (textRadius-text_offset), nr: text, color: colors[i]}); 
			}
		  
			ctx.restore();
			ctx.closePath();
		}	
	}
	
	function radiantLine(how_many, line, color, offset, startAngle){
		for(var i = 0; i < how_many; i++) {
			arc = Math.PI / (how_many/2);
			var angle = startAngle + i * arc;			
		  
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
	
	function draw_rect(x, y, width, height, fillStyle, lineWidth, strokeStyle){
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
	
	function drawDiamond(x, y, width, height, color){
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(x, y);

		// top left edge
		ctx.lineTo(x - width / 2, y + height / 2);

		// bottom left edge
		ctx.lineTo(x, y + height);

		// bottom right edge
		ctx.lineTo(x + width / 2, y + height / 2);

		// closing the path automatically creates
		// the top right edge
		ctx.closePath();

		ctx.fillStyle = color;
		ctx.fill();
		ctx.restore();
	}
	
	this.drawButton = function(x, y, r,sAngle,eAngle,counterclockwise, fillStyle, lineWidth, strokeStyle, text, text_x, text_y){
		ctx.shadowBlur = 10;		
		draw_dot(x, y, r,sAngle,eAngle,counterclockwise, fillStyle, lineWidth, strokeStyle);
		ctx.shadowBlur = 0;
		ctx.fillStyle = strokeStyle;
		ctx.fillText(text, text_x, text_y);
	}	
		
	this.roulette_table_click = function(){			
		$('#wheelcanvas').off('click').on('click', function(event) {
			self.canvas_click(canvas, event);
		});
	}
	
	this.canvas_click = function(canvas, event){		
		var mousePos = getMousePos(canvas, event);

		// ctx.beginPath();
		// ctx.lineWidth = "1";
		// ctx.strokeStyle = "red";
		// ctx.rect(spin_button_coordonates.x, spin_button_coordonates.y, spin_button_coordonates.width, spin_button_coordonates.height);
		// ctx.stroke();
		// ctx.lineWidth = "1";
		// ctx.strokeStyle = "blue";
		// ctx.rect(clear_button_coordonates.x, clear_button_coordonates.y, clear_button_coordonates.width, clear_button_coordonates.height);
		// ctx.stroke();
		
		if (isInside(mousePos, spin_button_coordonates)) {
			//console.log('SPIN');
			dispatch_nr = 0;	
			if(JSON.stringify(your_bets) === JSON.stringify([])){
				alert("Please place your bet before betting.");
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
			}				
		} else if (isInside(mousePos, clear_button_coordonates)) {
			//console.log('CLEAR');
			your_last_bet = {}
			your_bets = [];
			self.start();	
		} else {			
			for(var i in list_bets){
				var obj03 = list_bets[i];
				obj03.bet_value = bet_value;
				
				if (isInside(mousePos,obj03)) {
					//console.log('BETS', spin_click);
					if(spin_click !== 0){

					} else {
						your_bets.push(obj03);					
						your_last_bet = obj03;
						self.draw_tokens(your_bets[your_bets.length-1]);
					}
					break;
				} 
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
				self.drawButton(button_clear.x, button_clear.y, button_clear.r, button_clear.sAngle, button_clear.eAngle, button_clear.counterclockwise, button_clear.fillStyle, button_clear.lineWidth, button_clear.strokeStyle, button_clear.text, button_clear.text_x, button_clear.text_y);
				ctx.font = font_bold_14; 
				
				roulette_index = parseInt(self.closest_nr(ball, roulette_pos, "nr"));
				win_nr = roulette_pos[roulette_index];									
				
				self.drawBall(win_nr.x, win_nr.y, ball.width, 0, 2 * Math.PI, false);
				
				self.check_win_lose(your_bets,win_nr);
				
				setTimeout(function(){ 						
					alert("The win number is " + win_nr.nr);
					your_last_bet = {}
					your_bets = [];
					spin_click = 0;
					self.start();	
				}, 500);
				
				stop = true
				
			} else {
				spin_nr++; 
				rotateWheel(arc-0.04);		
				
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
					rotateWheel(arc);
					circle.angle += ball.speed;		
					break;
				case (spin_nr > spin_time/2 && spin_nr <= 2*spin_time/3):
					rotateWheel(arc-0.01);
					circle.angle += ball.speed-0.01;	
					break;
				case (spin_nr > 2*spin_time/3 && spin_nr <= 5*spin_time/6):
					rotateWheel(arc-0.02);
					circle.angle += ball.speed-0.02;		
					break;
				case (spin_nr > 5*spin_time/6 && spin_nr <= spin_time-20):
					rotateWheel(arc-0.03);
					circle.angle += ball.speed-0.03;	
					break;
				case (spin_nr > spin_time-20 && spin_nr <= spin_time-10):
					rotateWheel(arc-0.04);
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
	
	function rotateWheel(x) {
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
		self.drawButton(button_clear.x, button_clear.y, button_clear.r, button_clear.sAngle, button_clear.eAngle, button_clear.counterclockwise, button_clear.fillStyle, button_clear.lineWidth, button_clear.strokeStyle, button_clear.text, button_clear.text_x, button_clear.text_y);
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
	
	this.create_roulette_bets = function(){	
		ctx.font = font_bold_12; 
		var box_nr = {x:bet_x, y:bet_y, width:bet_square, height:bet_square};
		var dot = bet_square/4+2;		
		list_bets = [];
		
		//console.log('box_nr ', box_nr);
		
		var a = 0;
		var color = ['red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red'];
		var k = 0;
				
		if(roulette_type === "european"){			
			draw_rect(bet_x - box_nr.width, bet_y - 3*bet_square, box_nr.width, 3*bet_square, 'transparent', 2, 'white');
			ctx.fillStyle = 'white';
			ctx.fillText("0", bet_x - bet_square/2-4, bet_y - bet_square - 12);	
			list_bets.push({x: bet_x - box_nr.width, y: bet_y - 3*bet_square, width: box_nr.width, height: 3*bet_square, color:"green", text: "0"});	
				
		} else if(roulette_type === "american"){
			k = 1;
			
			draw_rect(bet_x - box_nr.width, bet_y - 3*bet_square, box_nr.width, 3*bet_square/2, 'transparent', 2, 'white');
			ctx.fillStyle = 'white';			
			ctx.fillText("0", bet_x - bet_square/2-4, bet_y - 3*bet_square + 32);	
			list_bets.push({x: bet_x - box_nr.width, y: bet_y - 3*bet_square, width: box_nr.width, height: 3*bet_square/2, color:"green", text: "0"});
			
			draw_rect(bet_x - box_nr.width, bet_y - 3*bet_square/2, box_nr.width, 3*bet_square/2, 'transparent', 2, 'white');
			ctx.fillStyle = 'white';
			ctx.fillText("00", bet_x - bet_square/2-6, bet_y - bet_square + 12);	
			list_bets.push({x: bet_x - box_nr.width, y: bet_y - 3*bet_square/2, width: box_nr.width, height: 3*bet_square/2, color:"green", text: "00"});
		}
		
		for(var i = 1; i < numbers.length-k; i++) {	
			a++
			if(a > 3){
				box_nr.x = box_nr.x + box_nr.width;	
				box_nr.y = box_nr.y + 2 * box_nr.width;
				a = 1;
			} else {
				// box_nr.x = box_nr.x;	
				box_nr.y = box_nr.y - box_nr.width;
			}				
			
			draw_rect(box_nr.x, box_nr.y, box_nr.width, box_nr.width, 'transparent', 2, 'white');
			draw_dot(box_nr.x+box_nr.width/2, box_nr.y+box_nr.width/2, dot, 0, dot-2, false, color[i-1], 2, '');
			ctx.fillStyle = 'white';
			if(i>9){
				ctx.fillText(i.toString(), box_nr.x+bet_square/4+3, box_nr.y+bet_square/2+4);
			} else {
				ctx.fillText(i.toString(), box_nr.x+bet_square/4+6, box_nr.y+bet_square/2+4);
			}
			
			list_bets.push({x: box_nr.x, y: box_nr.y, width: box_nr.width, height: box_nr.height, color: color[i-1], text: i.toString()});			
		}
		
		draw_rect(bet_x+0*4*bet_square, bet_y, 4*bet_square, box_nr.width, 'transparent', 2, 'white');		
		draw_rect(bet_x+1*4*bet_square, bet_y, 4*bet_square, box_nr.width, 'transparent', 2, 'white');
		draw_rect(bet_x+2*4*bet_square, bet_y, 4*bet_square, box_nr.width, 'transparent', 2, 'white');
		ctx.font = font_bold_16; 
		ctx.fillStyle = 'white';
		ctx.fillText("1st 12", bet_x+0*4*bet_square+60, bet_y+25);
		ctx.fillText("2st 12", bet_x+1*4*bet_square+60, bet_y+25);
		ctx.fillText("3st 12", bet_x+2*4*bet_square+60, bet_y+25);
		list_bets.push({x: bet_x+0*4*bet_square, y: bet_y, width: 4*bet_square, height: box_nr.width, color: "", text: "1st 12"});	
		list_bets.push({x: bet_x+1*4*bet_square, y: bet_y, width: 4*bet_square, height: box_nr.width, color: "", text: "2st 12"});	
		list_bets.push({x: bet_x+2*4*bet_square, y: bet_y, width: 4*bet_square, height: box_nr.width, color: "", text: "3st 12"});	
		
		
		draw_rect(bet_x+0*2*bet_square, bet_y+box_nr.width, 2*bet_square, box_nr.width, 'transparent', 2, 'white');	
		draw_rect(bet_x+1*2*bet_square, bet_y+box_nr.width, 2*bet_square, box_nr.width, 'transparent', 2, 'white');	
		draw_rect(bet_x+2*2*bet_square, bet_y+box_nr.width, 2*bet_square, box_nr.width, 'transparent', 2, 'white');	
		draw_rect(bet_x+3*2*bet_square, bet_y+box_nr.width, 2*bet_square, box_nr.width, 'transparent', 2, 'white');	
		draw_rect(bet_x+4*2*bet_square, bet_y+box_nr.width, 2*bet_square, box_nr.width, 'transparent', 2, 'white');	
		draw_rect(bet_x+5*2*bet_square, bet_y+box_nr.width, 2*bet_square, box_nr.width, 'transparent', 2, 'white');	
		ctx.font = font_bold_12; 
		ctx.fillStyle = 'white';
		ctx.fillText("1-18", bet_x+0*2*bet_square+25, bet_y+3*bet_square/2+5);
		ctx.fillText("Even", bet_x+1*2*bet_square+25, bet_y+3*bet_square/2+5);		
		ctx.fillText("Odd", bet_x+4*2*bet_square+25, bet_y+3*bet_square/2+5);
		ctx.fillText("19-36", bet_x+5*2*bet_square+25, bet_y+3*bet_square/2+5);
		list_bets.push({x: bet_x+0*2*bet_square, y: bet_y+box_nr.width, width: 2*bet_square, height: box_nr.width, color: "", text: "1-18"});	
		list_bets.push({x: bet_x+1*2*bet_square, y: bet_y+box_nr.width, width: 2*bet_square, height: box_nr.width, color: "", text: "Even"});	
		list_bets.push({x: bet_x+2*2*bet_square, y: bet_y+box_nr.width, width: 2*bet_square, height: box_nr.width, color: "", text: "reds"});	
		list_bets.push({x: bet_x+3*2*bet_square, y: bet_y+box_nr.width, width: 2*bet_square, height: box_nr.width, color: "", text: "blacks"});	
		list_bets.push({x: bet_x+4*2*bet_square, y: bet_y+box_nr.width, width: 2*bet_square, height: box_nr.width, color: "", text: "Odd"});	
		list_bets.push({x: bet_x+5*2*bet_square, y: bet_y+box_nr.width, width: 2*bet_square, height: box_nr.width, color: "", text: "19-36"});	
		drawDiamond(bet_x+2*2*bet_square+box_nr.width, bet_y+bet_square+5, bet_square+10, bet_square-10, 'red');
		drawDiamond(bet_x+3*2*bet_square+box_nr.width, bet_y+bet_square+5, bet_square+10, bet_square-10, 'black');
		
		draw_rect(bet_x+12*box_nr.width, bet_y-3*box_nr.width, 2*bet_square, box_nr.width, 'transparent', 2, 'white');		
		draw_rect(bet_x+12*box_nr.width, bet_y-2*box_nr.width, 2*bet_square, box_nr.width, 'transparent', 2, 'white');
		draw_rect(bet_x+12*box_nr.width, bet_y-1*box_nr.width, 2*bet_square, box_nr.width, 'transparent', 2, 'white');
		ctx.font = font_bold_16; 
		ctx.fillStyle = 'white';
		ctx.fillText("2 to 1", bet_x+12*box_nr.width+20, bet_y-2*box_nr.width-15);
		ctx.fillText("2 to 1", bet_x+12*box_nr.width+20, bet_y-1*box_nr.width-15);
		ctx.fillText("2 to 1", bet_x+12*box_nr.width+20, bet_y-0*box_nr.width-15);
		list_bets.push({x: bet_x+12*box_nr.width, y: bet_y-3*box_nr.width, width: 2*bet_square, height: box_nr.width, color: "", text: "2 to 1a"});	
		list_bets.push({x: bet_x+12*box_nr.width, y: bet_y-2*box_nr.width, width: 2*bet_square, height: box_nr.width, color: "", text: "2 to 1b"});	
		list_bets.push({x: bet_x+12*box_nr.width, y: bet_y-1*box_nr.width, width: 2*bet_square, height: box_nr.width, color: "", text: "2 to 1c"});
	}
		
	this.draw_tokens = function(your_last_bet){
		//console.log('your_last_bet', your_last_bet);
		
		var x = your_last_bet.x + your_last_bet.width/2 - bet_square/4;
		var y = your_last_bet.y + your_last_bet.height/2 - bet_square/4 - 5;
		var w = bet_square/2;
		var h = bet_square/2+10;		
		
		var img = new Image();
		img.src = carrot_img; 
		ctx.drawImage(img, x, y, w, h);		
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
		//console.log('win', arr, user_info)
		if(Object.keys(user_info).length !== 0 || !isNaN(user_info.money)){			
			for(var i in arr){			
				if(arr[i].win){		
					user_info.money = user_info.money + arr[i].bet_value;	
				} else {
					user_info.money = user_info.money - arr[i].bet_value;	
				}
			}
			dispatch(calculate_money(user_info.money))
			dispatch(get_history(your_bets))
		}
		//console.log('history000a--> ', user_info.money)	
		$('#nav_money span').text(user_info.money);
	}	
}

function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
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
		my_roulette = new roulette_game(props);
		my_roulette.ready();
		
		$(window).resize(function(){
			my_roulette.ready();
		});
	}, 0);
	
	socket = props.socket;
	
	return (
		<div className="roulette_container">
			<canvas id="wheelcanvas"></canvas>
		</div>
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Roulette)