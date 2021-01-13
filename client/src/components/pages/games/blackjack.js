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
var button_start = {x: 50, y: 50, r: 30, sAngle: 0, eAngle: 50, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'START', text_x: 32, text_y: 53}
var button_hit = {x: 140, y: 50, r: 30, sAngle: 0, eAngle: 50, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'HIT ME', text_x: 122, text_y: 53}
var button_stay = {x: 230, y: 50, r: 30, sAngle: 0, eAngle: 50, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'STAY', text_x: 215, text_y: 53}
var start_button_coordonates = {};
var hit_button_coordonates = {};
var stay_button_coordonates = {};

start_button_coordonates = {x:20, y:20, width:60, height:60};
hit_button_coordonates = {x:110, y:20, width:60, height:60};
stay_button_coordonates = {x:200, y:20, width:60, height:60};

var card_base = {x: 20, y:500, width: 100, height: 150, fillStyle: 'transparent', lineWidth: 1, strokeStyle: 'white'}
var card = {width: 80, height: 120}

var font_bold_10 = 'bold 10px sans-serif';
var font_bold_12 = 'bold 12px sans-serif';
var font_bold_14 = 'bold 14px sans-serif';
var font_bold_16 = 'bold 16px sans-serif';

function blackjack_wheel(props){
	var self = this;
		
	this.ready = function(){
		self.createCanvas(canvas_width, canvas_height);		
		self.start();	
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

	this.start = function(){
		// self.createHand();		
		socket.on('blackjack_read', function(data){	
			if(typeof data === "string"){
				alert(data)
			} else {
				switch(data[0]){
					case 'start':						
						blackjack_hand = data;
						self.draw_table();						
						break;
					case 'hit':
						break;
					case 'stay':
						break;
					default:
						break;
				}
			}	
		});	

		self.draw_table();	

		self.blackjack_table_click();
	}

	this.draw_table = function(){
		ctx.clearRect(0,0, canvas_width, canvas_height);

		ctx.font = font_bold_12; 
		ctx.shadowColor = "black";
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;		
		
		self.drawButton(button_start.x, button_start.y, button_start.r, button_start.sAngle, button_start.eAngle, button_start.counterclockwise, button_start.fillStyle, button_start.lineWidth, button_start.strokeStyle, button_start.text, button_start.text_x, button_start.text_y);
		self.drawButton(button_hit.x, button_hit.y, button_hit.r, button_hit.sAngle, button_hit.eAngle, button_hit.counterclockwise, button_hit.fillStyle, button_hit.lineWidth, button_hit.strokeStyle, button_hit.text, button_hit.text_x, button_hit.text_y);
		self.drawButton(button_stay.x, button_stay.y, button_stay.r, button_stay.sAngle, button_stay.eAngle, button_stay.counterclockwise, button_stay.fillStyle, button_stay.lineWidth, button_stay.strokeStyle, button_stay.text, button_stay.text_x, button_stay.text_y);
		
		ctx.font = font_bold_14; 
		
		self.draw_table_spots();
		
		if(blackjack_hand.length !== 0){
			self.draw_table_players();
			self.draw_table_dealer();
		}
	}

	this.draw_table_spots = function(){
		var space = (canvas_width - (card_base.width*7 + card_base.x*6))/2;
		for(var i=0; i<7; i++){
			draw_rect(space + i * (card_base.width + card_base.x), card_base.y, card_base.width, card_base.height, card_base.fillStyle, card_base.lineWidth, card_base.strokeStyle)
		}
	}	

	this.draw_table_players = function(){
		var space = (canvas_width - (card_base.width*7 + card_base.x*6))/2;
		console.log('blackjack_read2--> ', blackjack_hand)
		for(var i in blackjack_hand[1]){
			draw_card(space + i * (card_base.width + card_base.x), card_base.y, card.width, card.height, blackjack_hand[1][i].hand)
		}
	}

	this.draw_table_dealer = function(){
		//console.log('blackjack_read--> ', blackjack_hand)
	}

	this.drawButton = function(x, y, r,sAngle,eAngle,counterclockwise, fillStyle, lineWidth, strokeStyle, text, text_x, text_y){
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
		
		if (isInside(mousePos, start_button_coordonates)) {
			console.log('START');			
			socket.emit('blackjack_send', ['start', blackjack_payload_server]);							
		} else if (isInside(mousePos, hit_button_coordonates)) {
			console.log('HIT');	
			socket.emit('blackjack_send', ['hit', blackjack_payload_server]);							
		} else if (isInside(mousePos, stay_button_coordonates)) {
			console.log('STAY');
			socket.emit('blackjack_send', ['stay', blackjack_payload_server]);								
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

function draw_card(x, y, w, h, hand){
	var img = document.getElementById("img_cards");
	var img_x = 0;
	var img_y = 0;
	for(var i in hand){
		switch (hand[i].Suit) {
			case "Spades":
				img_y = 0;							
				break;
			case "Hearts":
				img_y = 120;		
				break;
			case "Diamonds":
				img_y = 240;		
				break;
			case "Clubs":
				img_y = 360;		
				break;
		  }	
		console.log(img_x, img_y, hand[i])
		ctx.drawImage(img, img_x, img_y, w, h, x + i*10, y + i*10, w, h);
	}	
}

function handleBack(){
    var url = window.location.href;
    url = url.split('/table/');
    window.location.href = url[0];
}

function Blackjack(props) {	
	setTimeout(function(){ 	
		blackjack_game = new blackjack_wheel(props);
		blackjack_game.ready();		
		
		function open_chat(){
			$('.chat_container').toggleClass('open');
		}
		
		$('.chat_button_container').click(function(){
			open_chat();
		});
	}, 0);
	
	socket = props.socket;
	
	return (
		<div className="blackjack_container">
            {/* <p>Sorry, </p>
            <p>no blackjack table available yet</p>
            <Button className="button_table shadow_convex" type="button" onClick={handleBack}>Back</Button> */}
			<canvas id="blackjack_canvas"></canvas>
			<img style={{'display': 'none'}} id="img_cards" alt="img_cards" src={img_cards} />
		</div>
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Blackjack)