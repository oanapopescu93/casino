import React, { useState, useEffect, useRef }from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import {blackjack_calculate_money, blackjack_get_history} from '../../actions/actions'
import { get_blackjack_cards, showResults } from '../../utils';
import GameBoard from '../partials/game_board';

let items = get_blackjack_cards();
let blackjack_hand = [];
let images = [];
let blackjack_status = false;

function Card(config){
	let self = this;
	self.id = config.id;
	self.name = config.name;
	self.user = config.user;
	self.dealer = config.dealer;
	
	self.x = config.x;
	self.y = config.y;
	self.width = config.width;
	self.height = config.height;
	self.fillStyle = config.fillStyle;
	self.lineWidth = config.lineWidth;
	self.strokeStyle = config.strokeStyle;
	self.card = config.card; //The size of the clipped image
	self.card_img = config.card_img; //The size of the image to use
	self.space = config.space;
	self.player_nr = config.player_nr;
	self.images = config.images;
	self.text = config.text;
	self.font_bold_10 = config.font_bold_10;
	self.font_bold_12 = config.font_bold_12;
	
	self.draw_box = function(ctx){
		//draw rect where the cards will be
		draw_rect(ctx, self.x, self.y, self.width, self.height, self.fillStyle, self.lineWidth, self.strokeStyle)		
		//draw square with number
		if(self.id !== -1){
			draw_rect(ctx, self.x, self.y - self.player_nr[1], self.player_nr[0], self.player_nr[1], self.fillStyle, self.lineWidth, self.strokeStyle)
			self.draw_card_number(ctx, self.id, self.x, self.y + 10, self.player_nr[0], self.height);
		}
	}	

	self.show_cards = function(ctx, hand){
		//buuu
		if(self.id !== -1){
			//player
			let player = hand[1][self.id];			
			if(player){
				self.draw_card(ctx, self.x, self.y, self.card.width, self.card.height, self.card_img, player.hand);
				self.show_cards_value(ctx, player.hand);
			}
		} else {
			//dealer
			let dealer = hand[2];
			if(dealer){
				self.draw_card(ctx, self.x, self.y, self.card.width, self.card.height, self.card_img, dealer.hand);
				self.show_cards_value(ctx, dealer.hand);
			}			
			if(hand[2].hand.length === 1){ //the dealer's card is still hidden
				self.draw_card(ctx, self.x + 5, self.y + 5, self.card.width, self.card.height, self.card_img, "hidden");
			}
		}		
	}

	self.show_cards_value = function(ctx, hand){
		let value_hand = 0;
		for(let i in hand){
			value_hand = value_hand + parseInt(hand[i].Weight);
		}

		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.rect(self.x+self.player_nr[0], self.y - self.player_nr[0], self.width-self.player_nr[0], self.player_nr[1]);
		if(self.strokeStyle !== ""){
			ctx.lineWidth = self.lineWidth;
			ctx.strokeStyle = self.strokeStyle;
			ctx.stroke();
		}
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.fillStyle = self.text;
		ctx.textAlign = "center";
		ctx.font = self.font_bold_12;
		ctx.fillText(value_hand, self.x + self.width/2 + self.player_nr[0]/2, self.y - 5);
		ctx.closePath();
	}

	self.draw_card_number = function(ctx, text, x, y, w, h){	
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.font = self.font_bold_12;	
		ctx.fillText(text, x+w/2, y-15);
		ctx.font = self.font_bold_14;
		ctx.closePath();
	}

	this.draw_card = function(ctx, x, y, w, h, size, hand){
		let img = self.images;
		let space = 5;
		let img_index = 0;
		if(hand === "hidden"){
			ctx.drawImage(img[img_index].src, 0, 0, size.width, size.height, x + 5, y + 5 + space, w, h);
		} else {
			for(let i in hand){		
				switch (hand[i].Suit) { 					
					case "Hearts":
						img_index = 1;			
						break;					
					case "Spades":
						img_index = 14;			
						break;
					case "Diamonds":
						img_index = 27;		
						break;
					case "Clubs":
						img_index = 40;								
						break;
				}		  
				switch (hand[i].Value) {
					case "A":
						img_index = img_index + 0;			
						break;
					case "2":
						img_index = img_index + 1;					
						break;
					case "3":
						img_index = img_index + 2;							
						break;
					case "4":	
						img_index = img_index + 3;				
						break;
					case "5":
						img_index = img_index + 4;					
						break;
					case "6":
						img_index = img_index + 5;						
						break;
					case "7":
						img_index = img_index + 6;				
						break;
					case "8":
						img_index = img_index + 7;							
						break;
					case "9":
						img_index = img_index + 8;				
						break;
					case "10":
						img_index = img_index + 9;						
						break;
					case "J":
						img_index = img_index + 10;					
						break;
					case "Q":	
						img_index = img_index + 11;		
						break;
					case "K":
						img_index = img_index + 12;					
						break;			
				}				
				
				ctx.drawImage(img[img_index].src, 0, 0, size.width, size.height, x + i*12, y + i*12 + space, w, h);
			}
		}
	}
}

function blackjack_game(props){
	let self = this;	
	let socket = props.socket;
	let lang = props.lang;
	let dispatch = props.dispatch;
	

	let canvas;
	let ctx;
	let canvas_width = 900;
	let canvas_height = 500;
	
	let card_list = [];
	let card_base = {}
	let card = {};
	let card_img = {width: 237, height: 365};
	let player_nr = [20, 20];
	let font_bold_12 = 'bold 12px sans-serif';
	let font_bold_14 = 'bold 14px sans-serif';

	let user_info = 0;
	let user_join = [];
	user_info = {money: props.money};
	if(props.blackjack !== -1){
		user_info = props.blackjack[0];		
	}
	let your_bets = 0;

	this.ready = function(game_start, reason){
		card_list = [];
		canvas = document.getElementById("blackjack_canvas");
		if(canvas){
			self.createCanvas(canvas_width, canvas_height);	
			if(reason !== "resize" && !game_start){
				//first time entering
				let blackjack_payload_server = {
					user_id: props.user_id, 
					user: props.user, 
					user_table: props.user_table, 
				}	
				socket.emit('blackjack_get_users_send', blackjack_payload_server);
				socket.on('blackjack_get_users_read', function(data){
					user_join = data;
					let promises = [];
					for(let i in items){				
						promises.push(self.preaload_images(items[i]));
					}
					Promise.all(promises).then(function(result){
						images = result;
						self.create_cards();
						self.draw_cards();
					});	
				});
			} else {
				// the game started and you decided to resize
				self.create_cards();
				self.draw_cards();			
			}
		}
	}

	this.createCanvas = function(canvas_width, canvas_height){		
		ctx = canvas.getContext("2d");
		
		if(window.innerWidth <= 480){
			if(window.innerHeight < window.innerWidth){
				//extra small landscape				
				canvas.width = 400;
				canvas.height = 180;
				card_base = {x: 5, y:120, width: 46, height: 70, fillStyle: 'transparent', lineWidth: 1, strokeStyle: 'white', dealer_y:20}
				card = {width: 33, height: 50};
				player_nr = [12, 12];
			} else {
				//extra small portrait
				canvas.width = 300;
				canvas.height = 400;
			}			
			font_bold_12 = 'bold 10px sans-serif';
			font_bold_14 = 'bold 12px sans-serif';
		} else if (window.innerWidth <= 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas.width = 480;
				canvas.height = 220;
				card_base = {x: 5, y:120, width: 53, height: 80, fillStyle: 'transparent', lineWidth: 1, strokeStyle: 'white', dealer_y:20}
				card = {width: 40, height: 60};
				player_nr = [12, 12];
			} else {
				//small portrait
				canvas.width = 300;
				canvas.height = 400;
			}			
			font_bold_12 = 'bold 10px sans-serif';
			font_bold_14 = 'bold 12px sans-serif';	
		} else if (window.innerWidth <= 1200){
			//big
			canvas.width = 900;
			canvas.height = 500;
			card_base = {x: 20, y:240, width: 100, height: 150, fillStyle: 'transparent', lineWidth: 2, strokeStyle: 'white', dealer_y:40}
			card = {width: 80, height: 120};
			player_nr = [20, 20];
			font_bold_12 = 'bold 12px sans-serif';
			font_bold_14 = 'bold 14px sans-serif';
		} else {
			//extra big
			canvas.width = 1200;
			canvas.height = 600;
			card_base = {x: 20, y:260, width: 120, height: 180, fillStyle: 'transparent', lineWidth: 2, strokeStyle: 'white', dealer_y:40}
			card = {width: 100, height: 150};
			player_nr = [20, 20];
			font_bold_12 = 'bold 12px sans-serif';
			font_bold_14 = 'bold 14px sans-serif';
		}
		
		canvas_width = canvas.width;
		canvas_height = canvas.height;		
		canvas.height = canvas_height;	
	}

	this.preaload_images = function(item){
		return new Promise(function(resolve, reject){
			let image = new Image();
			image.src = item.src;
			image.addEventListener("load", function() {
				resolve({suit: item.suit, value: item.value, src: image})
			}, false);
		});
	}

	this.create_cards = function(x){
		let space = (canvas.width - (card_base.width*7 + card_base.x*6))/2;

		// create dealer
		card_list.push(new Card({
			id: -1,
			name: 'dealer',
			x: space + 3 * (card_base.width + card_base.x), 
			y: card_base.dealer_y, 
			width: card_base.width, 
			height: card_base.height, 
			fillStyle: card_base.fillStyle, 
			lineWidth: card_base.lineWidth, 
			strokeStyle: card_base.strokeStyle, 
			card: card,
			card_img: card_img,
			space: space,
			player_nr: player_nr,
			images: images,
			text: "black",
			text_bg: "white",
			font_bold_12: 'bold 10px sans-serif',
			font_bold_14: 'bold 12px sans-serif',
		}));		

		// create players
		let a = 0;
		let b = 0;
		for(let i=0;i<7;i++){
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
			card_list.push(new Card({
				id: i,
				name: 'player',
				user: user_join[i],
				x: space + a * (card_base.width + card_base.x), 
				y: card_base.y, 
				width: card_base.width, 
				height: card_base.height, 
				fillStyle: card_base.fillStyle, 
				lineWidth: card_base.lineWidth, 
				strokeStyle: card_base.strokeStyle, 
				card: card,
				card_img: card_img,
				space: space,
				player_nr: player_nr,
				images: images,
				text: "black",
				text_bg: "white",
				font_bold_12: 'bold 10px sans-serif',
				font_bold_14: 'bold 12px sans-serif',	
			}));
		}
	}

	this.draw_cards = function(){
		if(blackjack_hand && blackjack_hand.length>0){
			for(let i in card_list){
				card_list[i].draw_box(ctx);
				card_list[i].show_cards(ctx, blackjack_hand);
			}
		} else {
			for(let i in card_list){
				card_list[i].draw_box(ctx);
			}
		}
	}

	this.start = function(bet){		
		if(canvas){
			blackjack_status = true;
			your_bets = bet;
			let blackjack_payload_server = {
				user_id: props.user_id, 
				user: props.user, 
				user_table: props.user_table, 
				bets: your_bets
			}
			socket.emit('blackjack_send', ["start", blackjack_payload_server]);
			socket.on('blackjack_read', function(data){
				if(typeof data === "string"){
					alert(data)
				} else {
					blackjack_hand = data;
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					self.draw_cards();
				}
			});	
		}
	}
	this.hit = function(){
		if(canvas && blackjack_status){
			let blackjack_payload_server = {
				user_id: props.user_id, 
				user: props.user, 
				user_table: props.user_table, 
				bets: your_bets
			}
			socket.emit('blackjack_send', ['hit', blackjack_payload_server]);
			socket.on('blackjack_read', function(data){
				if(typeof data === "string"){
					alert(data)
				} else {
					blackjack_hand = data;
					self.draw_cards();
					self.check_win_lose();
				}
			});
		}
	}
	this.stay = function(){
		if(canvas && blackjack_status){
			let blackjack_payload_server = {
				user_id: props.user_id, 
				user: props.user, 
				user_table: props.user_table, 
				bets: your_bets
			}
			socket.emit('blackjack_send', ["stay", blackjack_payload_server]);
			socket.on('blackjack_read', function(data){
				if(typeof data === "string"){
					alert(data)
				} else {
					blackjack_hand = data;
					self.draw_cards();
					self.check_win_lose();
				}
			});
		}
	}

	this.check_win_lose = function(){		
		if(typeof blackjack_hand[2].win !== "undefined" && blackjack_hand[2].win === true){
			self.end_game(blackjack_hand[2]);		
		} else {
			let all_lose = 0;
			for(let i in blackjack_hand[1]){
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
		blackjack_status = false;
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
	}

	this.pay = function(obj){
		let payload = [];
		for(let i in blackjack_hand[1]){
			if(blackjack_hand[1][i].id === props.user_id){				
				if(obj === "dealer" || obj.id !== blackjack_hand[1][i].id){
					user_info.money = user_info.money - blackjack_hand[1][i].bets;
					payload = [
						{
							bet_value: your_bets, 
							money_history: user_info.money,
							win: false, 
							blackjack_hand: {
								dealer: blackjack_hand[2], 
								player: blackjack_hand[1][i]
							}
						}
					];			
				} else {
					user_info.money = user_info.money + blackjack_hand[1][i].bets;					
					payload = [
						{
							bet_value: your_bets, 
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

		let blackjack_payload_server = {
			user_id: props.user_id,
			user: props.user, 
			user_table: props.user_table, 
			user_type: props.type,
			money: user_info.money
		}
		socket.emit('blackjack_results_send', blackjack_payload_server);
	}
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
}

function Blackjack(props) {
	let my_blackjack
	let lang = props.lang;	
	let money = props.money;
	const [title, setTitle] = useState('');
	const [gameStart, setGameStart] = useState(false);
	const isInitialMount = useRef(true);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			let user_table = props.user_table;
			user_table = user_table.charAt(0).toUpperCase() + user_table.slice(1);
			if (window.innerWidth >= 960){
				setTitle(user_table);
			} else {
				setTitle('');
			}				
		}
		my_blackjack = new blackjack_game(props);
		my_blackjack.ready(gameStart);
	});

	$(window).resize(function(){
		if(my_blackjack){
			my_blackjack.ready(gameStart, "resize");	
		}
	});

	function choice(x, bet){
		switch (x) {
			case "start":
				if(my_blackjack){
					my_blackjack.start(bet);
				}
				break;
			case "hit":	
				if(my_blackjack){
					my_blackjack.hit();
				}
				break;			
			case "stay":				
				if(my_blackjack){
					my_blackjack.stay();
				}
				break;
		}
	}

	return (
		<div className="blackjack_container">
			<h1 className="blackjack_title">{title}</h1>
			<canvas id="blackjack_canvas"></canvas>
			<GameBoard title={"blackjack"} money={money} lang={lang} choice={choice}></GameBoard>
			<div className="show_results_container">				
				<div className="show_results">
					<i className="fa fa-times show_results_close" ></i>
					<h1 className="header">{lang === "ro" ? <span>Rezultate</span> : <span>Results</span>}</h1>
					<div className="message"></div>
				</div>
			</div>
		</div>
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Blackjack)