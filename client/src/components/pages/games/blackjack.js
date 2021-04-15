import React from 'react';
import $ from 'jquery'; 

import img_cards from '../../img/img_cards.png';

import {connect} from 'react-redux'

var canvas;
var ctx;
var socket;
var blackjack_game;
var canvas_width = 900;
var canvas_height = 800;

var blackjack_hand = [];
var button_start = {x: 50, y: 50, r: 30, sAngle: 0, eAngle: 50, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'START', text_x: 48, text_y: 54}
var button_hit = {x: 140, y: 50, r: 30, sAngle: 0, eAngle: 50, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'HIT ME', text_x: 140, text_y: 54}
var button_stay = {x: 230, y: 50, r: 30, sAngle: 0, eAngle: 50, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'STAY', text_x: 230, text_y: 54}
var start_button_coordonates = {};
var hit_button_coordonates = {};
var stay_button_coordonates = {};

start_button_coordonates = {x:20, y:20, width:60, height:60};
hit_button_coordonates = {x:110, y:20, width:60, height:60};
stay_button_coordonates = {x:200, y:20, width:60, height:60};

var card_base = {x: 20, y:500, width: 100, height: 150, fillStyle: 'transparent', lineWidth: 1, strokeStyle: 'white'}
var card = {width: 80, height: 120};
var all_cards_pos = [];
var all_cards_value = [];

var font_bold_10 = 'bold 10px sans-serif';
var font_bold_12 = 'bold 12px sans-serif';
var font_bold_14 = 'bold 14px sans-serif';
var font_bold_16 = 'bold 16px sans-serif';

function blackjack_wheel(props){
	var self = this;
		
	this.ready = function(){
		self.createCanvas(canvas_width, canvas_height);		
		self.draw_table();
		if(blackjack_hand.length !== 0){
			self.draw_cards(false);	
		}
		self.blackjack_table_click();
	}
	
	this.createCanvas = function(canvas_width, canvas_height){		
		canvas = document.getElementById("blackjack_canvas");		
		ctx = canvas.getContext("2d");	
		
		if (window.innerWidth < 900){
			canvas.width = window.innerWidth - 30;
			canvas.height = 300;			
			
			font_bold_10 = 'bold 8px sans-serif';
			font_bold_12 = 'bold 10px sans-serif';
			font_bold_14 = 'bold 12px sans-serif';
			font_bold_16 = 'bold 12px sans-serif';			
		} else {
			canvas.width = 900;	
			canvas.height = 800;
			
			font_bold_10 = 'bold 10px sans-serif';
			font_bold_12 = 'bold 12px sans-serif';
			font_bold_14 = 'bold 14px sans-serif';
			font_bold_16 = 'bold 16px sans-serif';			
		}
		
		canvas_width = canvas.width;
		canvas_height = canvas.height;		
		canvas.height = canvas_height;
	}

	this.draw_table = function(){
		ctx.clearRect(0,0, canvas_width, canvas_height);
		all_cards_pos = [];
		all_cards_value = [];
		self.draw_table_spots();

		ctx.font = font_bold_12; 
		ctx.shadowColor = "black";
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		
		self.drawButton(button_start.x, button_start.y, button_start.r, button_start.sAngle, button_start.eAngle, button_start.counterclockwise, button_start.fillStyle, button_start.lineWidth, button_start.strokeStyle, button_start.text, button_start.text_x, button_start.text_y);
		self.drawButton(button_hit.x, button_hit.y, button_hit.r, button_hit.sAngle, button_hit.eAngle, button_hit.counterclockwise, button_hit.fillStyle, button_hit.lineWidth, button_hit.strokeStyle, button_hit.text, button_hit.text_x, button_hit.text_y);
		self.drawButton(button_stay.x, button_stay.y, button_stay.r, button_stay.sAngle, button_stay.eAngle, button_stay.counterclockwise, button_stay.fillStyle, button_stay.lineWidth, button_stay.strokeStyle, button_stay.text, button_stay.text_x, button_stay.text_y);
		
		ctx.font = font_bold_14; 
	}

	this.draw_table_spots = function(){
		var space = (canvas_width - (card_base.width*7 + card_base.x*6))/2;
		var a = 0;
		var b = 0;
		for(var i=0; i<7; i++){
			draw_rect(space + i * (card_base.width + card_base.x), card_base.y, card_base.width, card_base.height, card_base.fillStyle, card_base.lineWidth, card_base.strokeStyle)
			if(i === 0){
				a = 3;
			} else {
				if(i%2 !== 0){
					b++;
					a = 3 - b;
				} else {
					a = 3 + b;
				}				
			}			
			self.draw_card_number(i, space + a * (card_base.width + card_base.x), card_base.y, card_base.width, card_base.height);
		}
		draw_rect(space + 3 * (card_base.width + card_base.x), 100, card_base.width, card_base.height, card_base.fillStyle, card_base.lineWidth, card_base.strokeStyle)
	}
	
	this.draw_cards = function(dealer){
		self.draw_table_players();
		self.draw_table_dealer();
		self.draw_card_values('white', 'black', dealer);		
	}

	this.draw_table_players = function(){
		var space = (canvas_width - (card_base.width*7 + card_base.x*6))/2;
		var a = 0;
		var b = 0;
		for(var i in blackjack_hand[1]){
			if(i === 0){
				a = 3;
			} else {
				if(i%2 !== 0){
					b++;
					a = 3 - b;	
				} else {
					a = 3 - b;
				}
			}			
			self.draw_card(space + a * (card_base.width + card_base.x), card_base.y, card.width, card.height, blackjack_hand[1][i].hand, "player", parseInt(i));
		}
	}

	this.draw_table_dealer = function(){
		var space = (canvas_width - (card_base.width*7 + card_base.x*6))/2;
		self.draw_card(space + 3 * (card_base.width + card_base.x), 100, card.width, card.height, blackjack_hand[2].hand, "dealer", -1);
	}

	this.draw_card_values = function(fillStyle, color, dealer){
		for(var i in all_cards_value){
			var value_hand = all_cards_value[i].value_hand;
			if(dealer){
				if(all_cards_value[i].elem !== "dealer"){					
					ctx.beginPath();
					ctx.fillStyle = fillStyle;
					ctx.rect(all_cards_value[i].x, all_cards_value[i].y + card_base.height + 10, 100, 20);
					ctx.fill();
					ctx.beginPath();
					ctx.fillStyle = color;
					ctx.textAlign = "center";	
					ctx.fillText(value_hand, all_cards_value[i].x+50, all_cards_value[i].y + card_base.height + 25);
				}
			} else {
				ctx.beginPath();
				ctx.fillStyle = fillStyle;
				ctx.rect(all_cards_value[i].x, all_cards_value[i].y + card_base.height + 10, 100, 20);
				ctx.fill();
				ctx.beginPath();
				ctx.fillStyle = color;
				ctx.textAlign = "center";	
				ctx.fillText(value_hand, all_cards_value[i].x+50, all_cards_value[i].y + card_base.height + 25);
			}
		}
	}

	this.draw_card = function(x, y, w, h, hand, elem, id){
		var img = document.getElementById("img_cards");
		var img_x = 0;
		var img_y = 0;
		var a = 75;
		var b = 120;
		var value_hand = 0;
		for(var i in hand){		
			switch (hand[i].Suit) { 
				case "Spades":
					img_y = 0 * (b + 4);							
					break;
				case "Hearts":
					img_y = 1 * (b + 4);			
					break;
				case "Diamonds":
					img_y = 2 * (b + 4);		
					break;
				case "Clubs":
					img_y = 3 * (b + 4);		
					break;
			}		  
			switch (hand[i].Value) {
				case "A":
					img_x = 0 * (a + 4);						
					break;
				case "2":
					img_x = 1 * (a + 4);						
					break;
				case "3":
					img_x = 2 * (a + 4);							
					break;
				case "4":
					img_x = 3 * (a + 4);						
					break;
				case "5":
					img_x = 4 * (a + 4);						
					break;
				case "6":
					img_x = 5 * (a + 4);						
					break;
				case "7":
					img_x = 6 * (a + 4);					
					break;
				case "8":
					img_x = 7 * (a + 4);							
					break;
				case "9":
					img_x = 8 * (a + 4);					
					break;
				case "10":
					img_x = 9 * (a + 4);						
					break;
				case "J":
					img_x = 10 * (a + 4);						
					break;
				case "Q":
					img_x = 11 * (a + 4);				
					break;
				case "K":
					img_x = 12 * (a + 4);						
					break;			
			}
			ctx.drawImage(img, img_x, img_y, w, h, x + i*12, y + i*12, w, h);
			var card_pos = {elem: elem, id: parseInt(id), x: x + i*12, y: y + i*12, card: hand[i]}
			all_cards_pos.push(card_pos);
			value_hand = value_hand + hand[i].Weight;
		}
		var card_value = {elem: elem, id: parseInt(id), x: x, y: y, card: hand, value_hand: value_hand}
		all_cards_value.push(card_value);	
	}

	this.draw_card_number = function(text, x, y, w, h){		
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.font = font_bold_16;	
		ctx.fillText(text, x+w/2, y-15);
		ctx.font = font_bold_14;
	}

	this.drawButton = function(x, y, r,sAngle,eAngle,counterclockwise, fillStyle, lineWidth, strokeStyle, text, text_x, text_y){
		ctx.beginPath();
		ctx.shadowBlur = 10;		
		draw_dot(x, y, r,sAngle,eAngle,counterclockwise, fillStyle, lineWidth, strokeStyle);
		ctx.shadowBlur = 0;
		ctx.fillStyle = strokeStyle;
		ctx.fillText(text, text_x, text_y);
	}	

	this.blackjack_table_click = function(){			
		$('#blackjack_canvas').off('click').on('click', function(event) {
			self.canvas_click(canvas, event);
		});
		$('#blackjack_canvas').off('mousemove').on('mousemove', function(event) {
			var mousePos = getMousePos(canvas, event);
			if(isInside(mousePos, start_button_coordonates) || isInside(mousePos, hit_button_coordonates) || isInside(mousePos, stay_button_coordonates)){
				$('#blackjack_canvas').css('cursor', "pointer")
			} else {
				$('#blackjack_canvas').css('cursor', "default")
			}
		});
	}
	
	this.canvas_click = function(canvas, event){		
		var mousePos = getMousePos(canvas, event);		

		var blackjack_payload_server = {
			user_id: props.user_id, 
			user: props.user, 
			user_table: props.user_table, 
		}

		// ctx.beginPath();
		// ctx.lineWidth = "1";
		// ctx.strokeStyle = "red";
		// ctx.rect(start_button_coordonates.x, start_button_coordonates.y, start_button_coordonates.width, start_button_coordonates.height);
		// ctx.stroke();	
		// ctx.strokeStyle = "green";
		// ctx.rect(hit_button_coordonates.x, hit_button_coordonates.y, hit_button_coordonates.width, hit_button_coordonates.height);
		// ctx.stroke();	
		// ctx.strokeStyle = "blue";
		// ctx.rect(stay_button_coordonates.x, stay_button_coordonates.y, stay_button_coordonates.width, stay_button_coordonates.height);
		// ctx.stroke();
		
		if(isInside(mousePos, start_button_coordonates) || isInside(mousePos, hit_button_coordonates) || isInside(mousePos, stay_button_coordonates)){
			var click = -1;
			if (isInside(mousePos, start_button_coordonates)) {
				//console.log('START');			
				socket.emit('blackjack_send', ['start', blackjack_payload_server]);							
			} else if (isInside(mousePos, hit_button_coordonates)) {
				//console.log('HIT');	
				socket.emit('blackjack_send', ['hit', blackjack_payload_server]);							
			} else if (isInside(mousePos, stay_button_coordonates)) {
				//console.log('STAY');
				socket.emit('blackjack_send', ['stay', blackjack_payload_server]);								
			} 
	
			socket.on('blackjack_read', function(data){
				click++	
				if(click === 0){
					if(typeof data === "string"){
						alert(data)
					} else {
						blackjack_hand = data;
						console.log('blackjack_hand00 ', blackjack_hand)
						self.draw_table();						
						switch(data[0]){
							case 'start':	
								self.draw_cards(false);					
								self.check_win_lose('start');									
								break;						
							case 'hit':
								self.draw_cards(false);		
								self.check_win_lose('hit');	
								break;
							case 'stay':
								self.draw_cards(true);		
								self.check_win_lose('stay');		
								break;
						}						
					}
				}
			});	
		}		
	}

	this.check_win_lose = function(type){		
		if(typeof blackjack_hand[2].win != "undefined" && blackjack_hand[2].win === true){
			self.end_game(blackjack_hand[2]);		
		} else {
			var all_lose = 0;
			for(var i in blackjack_hand[1]){
				if(blackjack_hand[1][i].win){
					self.end_game(blackjack_hand[1][i]);	
					break;
				}
				if(blackjack_hand[1][i].lose){
					all_lose++;
				}				
			}
			if(all_lose === blackjack_hand[1].length){
				self.end_game(blackjack_hand[2]);
			}
		}
	}

	this.end_game = function(obj){
		if(obj.id === "dealer"){
			setTimeout(function(){
				alert('The dealer has won')
			}, 500);			
		} else {
			setTimeout(function(){
				alert('Player ' + obj.user + 'has won')
			}, 500);				
		}
		
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
}

function Blackjack(props) {	
	setTimeout(function(){ 	
		$('.full-height').attr('id', 'blackjack')	
		blackjack_game = new blackjack_wheel(props);
		blackjack_game.ready();
		
		$(window).resize(function(){
			blackjack_game.ready();	
		});
	}, 0);
	
	socket = props.socket;
	
	return (
		<div className="blackjack_container">
			<canvas id="blackjack_canvas"></canvas>
			<img style={{'display': 'none'}} id="img_cards" alt="img_cards" src={img_cards} />
		</div>
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Blackjack)