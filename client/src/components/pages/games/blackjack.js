import React from 'react';
import $ from 'jquery'; 

import img_cards from '../../img/blackjack/img_cards.png';
import carrot_img from '../../img/icons/carrot_icon.png';

import {blackjack_calculate_money, blackjack_get_history} from '../../actions/actions'
import {connect} from 'react-redux'

import { showResults } from '../../utils';

var canvas;
var ctx;
var socket;
var blackjack_game;
var canvas_width = 900;
var canvas_height = 800;
var blackjack_hand = [];

var button_start = {}
var button_clear = {}
var button_hit = {}
var button_stay = {}
var start_button_coordonates = {};
var clear_button_coordonates = {};
var hit_button_coordonates = {};
var stay_button_coordonates = {};

var card_base = {}
var card = {};
var all_cards_pos = [];
var all_cards_value = [];
var blackjack_pos = [];

var your_bets = [];
var your_last_bet = {};
var bet_value = 1;
var bet_square = 40;
var start_game = false;
var player_nr = [20, 20];
var bet_spot = 30;

var font_bold_10 = 'bold 10px sans-serif';
var font_bold_12 = 'bold 12px sans-serif';
var font_bold_14 = 'bold 14px sans-serif';

var user_info = 0;
var user_join = [];

function blackjack_wheel(props){
	var self = this;
	var user_id = props.user_id;
	var lang = props.lang;
	const dispatch = props.dispatch;
	var reason = "";

	user_info = {money: props.money};	
	if(props.blackjack !== -1){
		user_info = props.blackjack[0];			
	}	
	if($('#user_money').length>0){
		if($('#user_money span').length>0){
			$('#user_money span').text(user_info.money);
		}
	}	
		
	this.ready = function(r){
		reason = r;
		self.createCanvas(canvas_width, canvas_height);		
		self.draw_table();
		if(blackjack_hand.length !== 0){
			self.draw_cards();	
		}
		self.blackjack_table_click();
		if(reason !== "resize"){			
			var blackjack_payload_server = {
				user_id: user_id, 
				user: props.user, 
				user_table: props.user_table, 
				bets: your_bets
			}	
			socket.emit('blackjack_get_users_send', blackjack_payload_server);
			socket.on('blackjack_get_users_read', function(data){
				user_join = data;
			});
		}
	}
	
	this.createCanvas = function(canvas_width, canvas_height){		
		canvas = document.getElementById("blackjack_canvas");		
		ctx = canvas.getContext("2d");	
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas.width = 500;
				canvas.height = 300;

				button_start = {x: 45, y: 45, r: 20, sAngle: 0, eAngle: 50, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'START', text_x: 45, text_y: 49}
				button_clear = {x: 100, y: 45, r: 20, sAngle: 0, eAngle: 50, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'CLEAR', text_x: 102, text_y: 49}
				button_hit = {x: 155, y: 45, r: 20, sAngle: 0, eAngle: 50, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'HIT ME', text_x: 155, text_y: 49}
				button_stay = {x: 155, y: 45, r: 20, sAngle: 0, eAngle: 50, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'STAY', text_x: 155, text_y: 49}
				start_button_coordonates = {x:20, y:20, width:50, height:50};
				clear_button_coordonates = {x:75, y:20, width:50, height:50};
				hit_button_coordonates = {x:130, y:20, width:50, height:50};
				stay_button_coordonates = {x:165, y:20, width:50, height:50};

				card_base = {x: 10, y:140, width: 35, height: 55, fillStyle: 'transparent', lineWidth: 1, strokeStyle: 'white', dealer_y:40}
				card = {width: 30, height: 43};
				bet_square = 5;
				player_nr = [12, 12];
				bet_spot = 20;
			} else {
				//small portrait
				canvas.width = 300;
				canvas.height = 400;
			}
			bet_square = 30;

			font_bold_10 = 'bold 8px sans-serif';
			font_bold_12 = 'bold 10px sans-serif';
			font_bold_14 = 'bold 12px sans-serif';		
		} else {
			//big
			canvas.width = 900;
			canvas.height = 800;			
			
			button_start = {x: 50, y: 50, r: 30, sAngle: 0, eAngle: 50, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'START', text_x: 48, text_y: 54}
			button_clear = {x: 140, y: 50, r: 30, sAngle: 0, eAngle: 50, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'CLEAR', text_x: 140, text_y: 54}
			button_hit = {x: 230, y: 50, r: 30, sAngle: 0, eAngle: 50, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'HIT ME', text_x: 230, text_y: 54}
			button_stay = {x: 320, y: 50, r: 30, sAngle: 0, eAngle: 50, counterclockwise: false, fillStyle: '#eac739', lineWidth: 2, strokeStyle: '#735f0c', text: 'STAY', text_x: 320, text_y: 54}
			start_button_coordonates = {x:20, y:20, width:60, height:60};
			clear_button_coordonates = {x:110, y:20, width:60, height:60};
			hit_button_coordonates = {x:200, y:20, width:60, height:60};
			stay_button_coordonates = {x:290, y:20, width:60, height:60};

			card_base = {x: 20, y:320, width: 100, height: 150, fillStyle: 'transparent', lineWidth: 2, strokeStyle: 'white', dealer_y:100}
			card = {width: 80, height: 120};
			bet_square = 40;
			player_nr = [20, 20];
			bet_spot = 30;

			font_bold_10 = 'bold 10px sans-serif';
			font_bold_12 = 'bold 12px sans-serif';
			font_bold_14 = 'bold 14px sans-serif';
		}
		
		canvas_width = canvas.width;
		canvas_height = canvas.height;		
		canvas.height = canvas_height;
	}

	this.draw_table = function(){
		ctx.clearRect(0,0, canvas_width, canvas_height);
		if(window.innerWidth < 960 && window.innerHeight >= window.innerWidth){
			//small device and portrait
			ctx.beginPath();
			ctx.fillStyle = "gold";
			ctx.textAlign = "center";
			ctx.font = font_bold_14;	

			var txt = 'Please use landscape\nfor a better user experience';
			if(lang === "ro"){
				txt = 'Va rog puneti telefonul pe orizontala\npentru a juca';
			} 
			
			var x = canvas.width/2;
			var y = canvas.height/2;
			var lineheight = 15;
			var lines = txt.split('\n');
			
			for (var i = 0; i<lines.length; i++){
				ctx.fillText(lines[i], x, y + (i*lineheight) );
			}    
			
			ctx.closePath();
		} else {
			//not small device and portrait
			all_cards_pos = [];
			all_cards_value = [];
			self.draw_table_spots();

			ctx.font = font_bold_12; 
			ctx.shadowColor = "black";
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			
			self.drawButton(button_start.x, button_start.y, button_start.r, button_start.sAngle, button_start.eAngle, button_start.counterclockwise, button_start.fillStyle, button_start.lineWidth, button_start.strokeStyle, button_start.text, button_start.text_x, button_start.text_y);
			self.drawButton(button_clear.x, button_clear.y, button_clear.r, button_clear.sAngle, button_clear.eAngle, button_clear.counterclockwise, button_clear.fillStyle, button_clear.lineWidth, button_clear.strokeStyle, button_clear.text, button_clear.text_x, button_clear.text_y);
			self.drawButton(button_hit.x, button_hit.y, button_hit.r, button_hit.sAngle, button_hit.eAngle, button_hit.counterclockwise, button_hit.fillStyle, button_hit.lineWidth, button_hit.strokeStyle, button_hit.text, button_hit.text_x, button_hit.text_y);
			self.drawButton(button_stay.x, button_stay.y, button_stay.r, button_stay.sAngle, button_stay.eAngle, button_stay.counterclockwise, button_stay.fillStyle, button_stay.lineWidth, button_stay.strokeStyle, button_stay.text, button_stay.text_x, button_stay.text_y);
			
			ctx.font = font_bold_14; 
		}
	}

	this.draw_table_spots = function(){
		var my_width = canvas.width;
		var space_after_dealer = 50;
		if (window.innerWidth < 960){
			space_after_dealer = 35;
		}
		var space = (my_width - (card_base.width*7 + card_base.x*6))/2;
		var a = 0;
		var b = 0;
		for(var i=0; i<7; i++){
			//draw rect where the cards will be
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
			
			//draw square with number
			draw_rect(space + a * (card_base.width + card_base.x), card_base.y - player_nr[1], player_nr[0], player_nr[1], card_base.fillStyle, card_base.lineWidth, card_base.strokeStyle)
			self.draw_card_number(i, space + a * (card_base.width + card_base.x), card_base.y + 10, player_nr[0], card_base.height);
			
			//draw bet spot			
			draw_dot(space + a * (card_base.width + card_base.x) + card_base.width/2, card_base.y + card_base.height + space_after_dealer, bet_spot, 0, 2 * Math.PI, false, card_base.fillStyle, card_base.lineWidth, card_base.strokeStyle);
			self.draw_card_text(space + a * (card_base.width + card_base.x), card_base.y+card_base.height + space_after_dealer, card_base.width, card_base.height);

			blackjack_pos.push({x: space + a * (card_base.width + card_base.x), y: card_base.y + card_base.height + space_after_dealer - bet_spot, width: card_base.width, height:2*bet_spot, text: i, value: bet_value}); 
		}
		draw_rect(space + 3 * (card_base.width + card_base.x), card_base.dealer_y, card_base.width, card_base.height, card_base.fillStyle, card_base.lineWidth, card_base.strokeStyle)
	}
	
	this.draw_cards = function(){
		self.draw_table_players();
		self.draw_table_dealer();
		self.draw_card_values('white', card_base.lineWidth, 'white', 'black'); //the white board above	
		self.draw_bets();	
	}

	this.draw_table_players = function(){
		var my_width = canvas_width;
		if (window.innerWidth < 960){
			my_width = $('.blackjack_container').width();
		}
		var space = (my_width - (card_base.width*7 + card_base.x*6))/2;
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
		var my_width = canvas.width;
		var space = (my_width - (card_base.width*7 + card_base.x*6))/2;
		self.draw_card(space + 3 * (card_base.width + card_base.x), card_base.width, card.width, card.height, blackjack_hand[2].hand, "dealer", -1);
		if(blackjack_hand[2].hand.length === 1){ //the dealer's card is still hidden
			self.draw_card(space + 3 * (card_base.width + card_base.x) + 10, card_base.width + 10, card.width, card.height, "hidden", "dealer", -1);
		}
	}

	this.draw_card_values = function(fillStyle, lineWidth, strokeStyle, color){
		for(var i in all_cards_value){				
			var value_hand = all_cards_value[i].value_hand;
			ctx.beginPath();
			ctx.fillStyle = fillStyle;
			
			if(all_cards_value[i].elem === "dealer"){
				if(all_cards_value[i].card !== "hidden"){
					ctx.rect(all_cards_value[i].x, all_cards_value[i].y - 20, card_base.width, 20);
				}
			} else {
				ctx.rect(all_cards_value[i].x + 20, all_cards_value[i].y - 20, card_base.width-20, 20);
			}
			
			if(strokeStyle !== ""){
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = strokeStyle;
				ctx.stroke();
			}
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.textAlign = "center";	
			if(all_cards_value[i].elem === "dealer"){
				if(all_cards_value[i].card !== "hidden"){
					ctx.fillText(value_hand, all_cards_value[i].x + card_base.width/2, all_cards_value[i].y - 5);
				}				
			} else {
				ctx.fillText(value_hand, all_cards_value[i].x + card_base.width/2 + 10, all_cards_value[i].y - 5);
			}
		}
	}

	this.draw_bets = function(){
		for(var i in your_bets){
			self.draw_tokens(your_bets[i]);
		}
	}

	this.draw_card = function(x, y, w, h, hand, elem, id){
		var img = document.getElementById("img_cards");
		var img_x = 0;
		var img_y = 0;
		var a = 75;
		var b = 120;
		var value_hand = 0;
		var space = 5;
		if(hand === "hidden"){
			img_x = 2 * (a + 4)
			img_y = 4 * (b + 4);
			//img.onload = function() {
				ctx.drawImage(img, img_x, img_y, w, h, x, y + space, w, h);
			//};
		} else {
			for(var i in hand){		
				switch (hand[i].Suit) { 
					case "Clubs":
						img_y = 0 * (b + 4);							
						break;
					case "Hearts":
						img_y = 1 * (b + 4);			
						break;
					case "Diamonds":
						img_y = 2 * (b + 4);		
						break;
					case "Spades":
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
				//img.onload = function() {
					ctx.drawImage(img, img_x, img_y, w, h, x + i*12, y + i*12 + space, w, h);
				//};				
				var card_pos = {elem: elem, id: parseInt(id), x: x + i*12, y: y + i*12 + space, card: hand[i]}
				all_cards_pos.push(card_pos);
				value_hand = value_hand + hand[i].Weight;
			}
		}
		
		var card_value = {elem: elem, id: parseInt(id), x: x, y: y, card: hand, value_hand: value_hand}
		all_cards_value.push(card_value);	
	}

	this.draw_card_number = function(text, x, y, w, h){	
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.font = font_bold_12;	
		ctx.fillText(text, x+w/2, y-15);
		ctx.font = font_bold_14;
		ctx.closePath();
	}

	this.draw_card_text = function(x, y, w, h){		
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.font = font_bold_10;	
		ctx.fillText('BET', x+w/2, y);
		ctx.fillText('HERE', x+w/2, y-15);
		ctx.font = font_bold_14;
		ctx.closePath();
	}

	this.drawButton = function(x, y, r,sAngle,eAngle,counterclockwise, fillStyle, lineWidth, strokeStyle, text, text_x, text_y){
		ctx.beginPath();
		ctx.shadowBlur = 10;		
		draw_dot(x, y, r,sAngle,eAngle,counterclockwise, fillStyle, lineWidth, strokeStyle);
		ctx.shadowBlur = 0;
		ctx.fillStyle = strokeStyle;
		ctx.fillText(text, text_x, text_y);
		ctx.closePath();
	}	

	this.blackjack_table_click = function(){			
		$('#blackjack_canvas').off('click').on('click', function(event) {
			self.canvas_click(canvas, event);
		});
		$('#blackjack_canvas').off('mousemove').on('mousemove', function(event) {
			var mousePos = getMousePos(canvas, event);
			if(isInside(mousePos, start_button_coordonates) || isInside(mousePos, clear_button_coordonates) || isInside(mousePos, hit_button_coordonates) || isInside(mousePos, stay_button_coordonates)){
				$('#blackjack_canvas').css('cursor', "pointer")
			} else {
				$('#blackjack_canvas').css('cursor', "default")
			}
		});
	}
	
	this.canvas_click = function(canvas, event){		
		var mousePos = getMousePos(canvas, event);		

		var blackjack_payload_server = {
			user_id: user_id, 
			user: props.user, 
			user_table: props.user_table, 
			bets: your_bets
		}		
		
		if(isInside(mousePos, start_button_coordonates) || isInside(mousePos, clear_button_coordonates) || isInside(mousePos, hit_button_coordonates) || isInside(mousePos, stay_button_coordonates)){
			var click = -1;
			if (isInside(mousePos, start_button_coordonates)) {
				// console.log('START');

				// ctx.beginPath();
				// ctx.lineWidth = "1";
				// ctx.strokeStyle = "red";
				// ctx.rect(start_button_coordonates.x, start_button_coordonates.y, start_button_coordonates.width, start_button_coordonates.height);
				// ctx.stroke();
				
				if(your_bets.length > 0){
					start_game = true;
					socket.emit('blackjack_send', ['start', blackjack_payload_server]);	
				} else {
					if(lang === "ro"){
						showResults("Eroare", "Va rog pariati inainte de a incepe jocul.");
					} else {
						showResults("Error", "Please place your bets before starting the game.");
					}
				}						
			} else if (isInside(mousePos, clear_button_coordonates)) {
				//console.log('CLEAR', your_bets);

				// ctx.beginPath();
				// ctx.lineWidth = "1";
				// ctx.strokeStyle = "red";
				// ctx.rect(clear_button_coordonates.x, clear_button_coordonates.y, clear_button_coordonates.width, clear_button_coordonates.height);
				// ctx.stroke();	

				if(start_game){
					if(lang === "ro"){
						showResults("Eroare", "Nu puteti sa stergeti pariul, jocl deja a inceput.");
					} else {
						showResults("Error", "You can't clear your bets. The game has already begun.");
					}
				} else {
					your_bets = [];
					self.draw_table();
				} 
								
			} else if (isInside(mousePos, hit_button_coordonates)) {
				// console.log('HIT', blackjack_payload_server, start_game);

				// ctx.beginPath();
				// ctx.lineWidth = "1";
				// ctx.strokeStyle = "green";
				// ctx.rect(hit_button_coordonates.x, hit_button_coordonates.y, hit_button_coordonates.width, hit_button_coordonates.height);
				// ctx.stroke();	

				if(your_bets.length > 0){
					if(start_game){
						socket.emit('blackjack_send', ['hit', blackjack_payload_server]);	
					} else {
						if(lang === "ro"){
							showResults("Eroare", "Va rog incepeti jocul inainte de a apasa HIT.");
						} else {
							showResults("Error", "Please start the game first before hitting.");
						}
					} 
				} else {
					if(lang === "ro"){
						showResults("Eroare", "Va rog pariati inainte de a apasa HIT.");
					} else {
						showResults("Error", "Please place your bets before hitting.");
					}
				}
										
			} else if (isInside(mousePos, stay_button_coordonates)) {
				// console.log('STAY', blackjack_payload_server, start_game);
				
				// ctx.beginPath();
				// ctx.lineWidth = "1";				
				// ctx.strokeStyle = "blue";
				// ctx.rect(stay_button_coordonates.x, stay_button_coordonates.y, stay_button_coordonates.width, stay_button_coordonates.height);
				// ctx.stroke();

				if(your_bets.length > 0){
					if(start_game){
						socket.emit('blackjack_send', ['stay', blackjack_payload_server]);
					} else {
						if(lang === "ro"){
							showResults("Eroare", "Va rog incepeti jocul inainte de a apasa STAY.");
						} else {
							showResults("Error", "Please start the game first before staying.");
						}
					} 
				} else {
					if(lang === "ro"){
						showResults("Eroare", "Va rog pariati inainte de a apasa STAY.");
					} else {
						showResults("Error", "Please place your bets before staying.");
					}
				}					
			} 
	
			socket.on('blackjack_read', function(data){
				click++	
				if(click === 0){
					if(typeof data === "string"){
						alert(data)
					} else {
						blackjack_hand = data;
						self.draw_table();
						self.draw_cards();							
						self.check_win_lose();						
					}
				}
			});	
		} else {
			for(var i in blackjack_pos){
				if(isInside(mousePos, blackjack_pos[i])){
					// ctx.strokeStyle = "blue";
					// ctx.rect(blackjack_pos[i].x, blackjack_pos[i].y, blackjack_pos[i].width, blackjack_pos[i].height);
					// ctx.stroke();

					var pos = -1;
					for(var i in user_join){
						if(user_id === user_join[i].id){
							pos = parseInt(i);
						}
					}

					if(pos !== blackjack_pos[i].text){
					 	alert("You can only bet in your spot. Your spot is "+pos);
					} else {
						if(user_info.money>0){
							your_bets.push(blackjack_pos[i]);					
							your_last_bet = blackjack_pos[i];
							blackjack_payload_server.bets = your_bets;
							socket.emit('blackjack_send', ['bet', blackjack_payload_server]);	
							self.draw_tokens(your_bets[your_bets.length-1]);
						} else {
							if(lang === "ro"){
								showResults("Nu ai suficienti morcovi!", "Du-te in contul tau, la sectiunea Market si cumpara.", 600);
							} else {
								showResults("You don't have enough carrots!", "Go to your account, at the Market Section and buy some.", 600);
							}
						}						
					}
					break;
				}
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
			ctx.drawImage(img, x, y, w, h);	
		};		
	}

	this.check_win_lose = function(){	
		if(typeof blackjack_hand[2].win !== "undefined" && blackjack_hand[2].win === true){
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
		start_game = false;
		setTimeout(function(){
			if(obj.id === "dealer"){
				self.pay("dealer");
				if(lang === "ro"){
					showResults('Dealer-ul a castigat!');
				} else {
					showResults('The dealer has won!');
				}				
			} else {
				self.pay(obj);
				if(lang === "ro"){
					showResults('Jucatorul ' + obj.user + ' a castigat!')	
				} else {
					showResults('Player ' + obj.user + ' has won!')	
				}	
			}
			blackjack_hand = [];
			your_last_bet = {}
			your_bets = [];
			self.draw_table();
		}, 300);
	}

	this.pay = function(obj){
		let payload = [];
		for(var i in blackjack_hand[1]){
			if(blackjack_hand[1][i].id === props.user_id){
				console.log('blackjack_read', blackjack_hand)	
				if(obj === "dealer" || obj.id !== blackjack_hand[1][i].id){
					user_info.money = user_info.money - blackjack_hand[1][i].bets.length;
					payload = [
						{
							bet_value: your_bets.length, 
							money_history: user_info.money,
							win: false, 
							blackjack_hand: {
								dealer: blackjack_hand[2], 
								player: blackjack_hand[1][i]
							}
						}
					];			
				} else {
					user_info.money = user_info.money + blackjack_hand[1][i].bets.length;
					payload = [
						{
							bet_value: your_bets.length, 
							money_history: user_info.money,
							win: true, 
							blackjack_hand: {
								dealer: blackjack_hand[2], 
								player: blackjack_hand[1][i]
							}
						}
					];
				}
				dispatch(blackjack_calculate_money(user_info.money));
				dispatch(blackjack_get_history(payload));			
			}
			break;
		}

		var blackjack_payload_server = {
			user_id: props.user_id,
			user: props.user, 
			user_table: props.user_table, 
			user_type: props.type,
			money: user_info.money
		}
		socket.emit('blackjack_results_send', blackjack_payload_server);
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
		$('.full-height').attr('id', 'blackjack');
		
		var title = props.user_table;
		title = title.charAt(0).toUpperCase() + title.slice(1);
		$('.blackjack_title').empty();
		$('.blackjack_title').append(title);

		blackjack_game = new blackjack_wheel(props);
		blackjack_game.ready();		
		$(window).resize(function(){
			blackjack_game.ready('resize');	
		});
	}, 0);
	
	socket = props.socket;
	var lang = props.lang;
	
	return (
		<div className="blackjack_container">
			<h1 className="blackjack_title"></h1>
			<canvas id="blackjack_canvas"></canvas>
			<div className="show_results_container">				
				<div className="show_results">
					<i className="fa fa-times show_results_close" ></i>
					<h1 className="header">{lang === "ro" ? <span>Rezultate</span> : <span>Results</span>}</h1>
					<div className="message"></div>
				</div>
			</div>
			<img style={{'display': 'none'}} id="img_cards" alt="img_cards" src={img_cards} />
		</div>
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Blackjack)