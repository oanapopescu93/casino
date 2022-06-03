import React, {Component} from 'react';
import {connect} from 'react-redux'
import $ from 'jquery';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { bigText, showResults } from '../../utils';

import craps_bets from '../../img/craps/craps.png'
import craps_bets_small from '../../img/craps/craps.png'

function roulette_bets(props){
	let self = this;
	let lang = props.lang;
	this.images = [];
	let reason = "";

	let canvas_bets;
	let ctx_bets;
	let canvas_width_bets = 900;
	let canvas_height_bets = 450;
	let font_bold_10 = 'bold 10px sans-serif';
	let font_bold_12 = 'bold 12px sans-serif';
	let font_bold_14 = 'bold 14px sans-serif';
	let dispatch_nr = 0; //this prevents multiplication
	let items = [
		{id: 'craps', src: craps_bets},
		{id: 'craps_small', src: craps_bets_small},
	];
	let small_image = false;
	let craps_bets_coord = [0, 0, 2243, 1191, 0, 0, 900, 450]; //sx,sy,swidth,sheight,x,y,width,height
	
	
/* 	sx	Optional. The x coordinate where to start clipping	
	sy	Optional. The y coordinate where to start clipping	
	swidth	Optional. The width of the clipped image	
	sheight	Optional. The height of the clipped image	
	x	The x coordinate where to place the image on the canvas	
	y	The y coordinate where to place the image on the canvas	
	width	Optional. The width of the image to use (stretch or reduce the image)	
	height	Optional. The height of the image to use (stretch or reduce the image) */

	$('.craps_bets .close').click(function() {
		$('.craps_bets_container').removeClass('open');
	});
	
	this.ready = function(r){
		reason = r;
		self.createCanvas(canvas_width_bets, canvas_height_bets);
		self.getImage(reason);
	}

	this.createCanvas = function(canvas_width_bets, canvas_height_bets){		
		canvas_bets = document.getElementById("craps_bets_canvas");		
		ctx_bets = canvas_bets.getContext("2d");
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas_bets.width = 400;
				canvas_bets.height = 250;
				small_image = false;
				craps_bets_coord = [0, 0, 2243, 1191, 0, 0, 350, 240];
			} else {
				//small portrait
				canvas_bets.width = 150;
				canvas_bets.height = 400;
				small_image = true;
				craps_bets_coord = [0, 0, 2243, 1191, 0, 0, 525, 280];
			}

			font_bold_10 = 'bold 8px sans-serif';
			font_bold_12 = 'bold 10px sans-serif';
			font_bold_14 = 'bold 12px sans-serif';
			
		} else {
			//big
			canvas_bets.width = 900;
			canvas_bets.height = 450;
			
			font_bold_10 = 'bold 10px sans-serif';
			font_bold_12 = 'bold 12px sans-serif';
			font_bold_14 = 'bold 14px sans-serif';
			
			small_image = false;
			craps_bets_coord = [0, 0, 2243, 1191, 0, 0, 900, 450];
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
				self.choose_craps_bets();
			});	
		} else {
			self.choose_craps_bets();
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

	this.choose_craps_bets = function(){		
		if(!small_image){
			self.draw_craps_bets(self.images[0]);
		} else {
			self.draw_craps_bets(self.images[1]);
		}
	}

	this.draw_craps_bets = function(img){
		ctx_bets.clearRect(0, 0, canvas_bets.width, canvas_bets.height);
		let sx = craps_bets_coord[0];
		let sy = craps_bets_coord[1];
		let swidth = craps_bets_coord[2];
		let sheight = craps_bets_coord[3];
		let x = craps_bets_coord[4];
		let y = craps_bets_coord[5];
		let width = craps_bets_coord[6];
		let height = craps_bets_coord[7];
		ctx_bets.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
	}
}

class Dice extends Component {
	constructor(props) {
		super(props);
		this.state = {
			number: props.number,
			x: Math.floor((Math.random() * 6) + 1)
		}; 
	}	
	render() {
		let number = this.state.number;
		return (
			<div className="dice_box">
				<div id={'dice'+number} className={"dice dice_"+number+" show_"+this.state.x}>
					<div id={"dice_"+number+"_side_one"} className='side one'>
						<div className="dot one_1"></div>
					</div>
					<div id={"dice_"+number+"_side_two"} className='side two'>
						<div className="dot two_1"></div>
						<div className="dot two_2"></div>
					</div>
					<div id={"dice_"+number+"_side_three"} className='side three'>
						<div className="dot three_1"></div>
						<div className="dot three_2"></div>
						<div className="dot three_3"></div>
					</div>
					<div id={"dice_"+number+"_side_four"} className='side four'>
						<div className="dot four_1"></div>
						<div className="dot four_2"></div>
						<div className="dot four_3"></div>
						<div className="dot four_4"></div>
					</div>
					<div id={"dice_"+number+"_side_five"} className='side five'>
						<div className="dot five_1"></div>
						<div className="dot five_2"></div>
						<div className="dot five_3"></div>
						<div className="dot five_4"></div>
						<div className="dot five_5"></div>
					</div>
					<div id={"dice_"+number+"_side_six"} className='side six'>
						<div className="dot six_1"></div>
						<div className="dot six_2"></div>
						<div className="dot six_3"></div>
						<div className="dot six_4"></div>
						<div className="dot six_5"></div>
						<div className="dot six_6"></div>
					</div>					
				</div>
				<div className="dice_shadow shadow_convex"></div>
			</div>
		);
	}
}

class Craps extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props,
			dices_number: [],
			lang: props.lang,
		};
		this.getDiceNumber = this.getDiceNumber.bind(this);
		this.animate = this.animate.bind(this);
		this.roll = this.roll.bind(this);
		this.getNumbers = this.getNumbers.bind(this);
		this.start = this.start.bind(this);
		this.check_win_lose = this.check_win_lose.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.show_on_board = this.show_on_board.bind(this);
		this.craps_rules = this.craps_rules.bind(this);
	}

	handleChange(e){
		let bet = e.target.value;	
		let money = this.state.data.money;			
		if($('#money_total').length>0){
			$('#money_total').text(money-bet);
		}
	}

	getDiceNumber(dice){
		let x;
		var classList = dice.attr('class').split(/\s+/);
		for(let i in classList){
			if(classList[i].indexOf("show_") > -1){
				x = parseInt(classList[i].replace("show_", ""));
				break;
			}
		}
		return x;
	}

	animate(dice, roll){
		if(dice && roll){
			for (var i = 1; i <= 6; i++) {
				dice.removeClass('show_' + i);
				if (roll === i) {
					dice.addClass('show_'+i);
				}
			}
		}
	}

	roll(point){
		let self = this;
		return new Promise(function(resolve, reject){
			self.getNumbers(point)
			.then(function(res){
				$('.dice_container').addClass('jump');
				for(let k in res){
				 	let t = parseInt(k)+1;
				 	let dice = $('#dice'+t);
				 	let roll = res[k];				
				 	self.animate(dice, roll, t);
				}
				self.setState({ dices_number: res });
				resolve(res);
			});
		});
	}

	getNumbers(point){
		let self = this;
		return new Promise(function(resolve, reject){
			let dice1 = $('#dice1');
			let dice2 = $('#dice2');
			let dice_number1 = self.getDiceNumber(dice1);
			let dice_number2 = self.getDiceNumber(dice2);
			let payload={how_many_dices:2, user_table: self.state.data.user_table, point:point, before: [dice_number1, dice_number2]}
			self.state.data.socket.emit('craps_send', payload);
			self.state.data.socket.on('craps_read', function(data){
				if(data){
					resolve(data);
				}
			});	
		});
	};

	show_on_board(dices_number, sum, point){
		if($('#craps_board')){
			if(dices_number === "Craps!!!" || dices_number === "Natural!!!"){
				$('#craps_board').append('<div class="craps_board_text"><span class="text text01">'+dices_number+'</span><div>');
			} else {
				if(point){
					$('#craps_board').append('<div class="craps_board_text"><span class="text text01">Dices:</span><span class="text text02">'+dices_number[0]+', '+dices_number[1]+'</span><span class="text text03">Sum:</span><span class="text text04">'+sum+'</span><span class="text text05">Point:</span><span class="text text06">'+point+'</span><div>');
				} else {
					$('#craps_board').append('<div class="craps_board_text"><span class="text text01">Dices:</span><span class="text text02">'+dices_number[0]+', '+dices_number[1]+'</span><span class="text text03">Sum:</span><span class="text text04">'+sum+'</span><div>');
				}		
			}		
			
			var objDiv = document.getElementById("craps_board");
			objDiv.scrollTop = objDiv.scrollHeight;
		}
	}

	start(){
		let self = this;
		if($('#craps_start').attr('finished') === "yes"){
			if($('#craps_board')){
				$('#craps_board').empty();
			}
			if(parseInt($('#user_money span').text()) > 0){
				let bet = $('#craps_bet').val();
				$('#craps_start').attr('finished', 'no');
				$('#craps_start').prop('disabled', true);
				$('#craps_start').addClass('start');
				let state = 1;
				let point;
				let sum;			
				let timer = setInterval(function () {
					switch(state) {
						case 1:
							self.roll(point).then(function(res){
								$('.dice_container').removeClass('jump');
								sum = self.state.dices_number[0] + self.state.dices_number[1];		
								if(sum === 7|| sum === 11){
									//Natural
									state = 2;
									self.show_on_board("Natural!!!");
								} else {
									point = sum;
									state = 3;
								}
								self.show_on_board(self.state.dices_number, sum, point);
							});
							break;
						case 2:
							self.check_win_lose(true, bet);
							clearInterval(timer);
							break;
						case 3:
							self.roll(point).then(function(res){
								$('.dice_container').removeClass('jump');
								sum = self.state.dices_number[0] + self.state.dices_number[1];			
								self.show_on_board(self.state.dices_number, sum, point);
								if (sum === point) {
									state = 2;
								} else if (sum === 7) {
									state = 4;
								} else if (sum === 2 || sum === 3 || sum === 12) {
									//craps
									state = 4;
									self.show_on_board("Craps!!!");
								} else {
									state = 3;
								}
							});
							break;
						case 4:
							self.check_win_lose(false, bet);
							clearInterval(timer);
							break;
					}
				}, 1500);
			} else {
				if(this.props.lang === "ro"){
					showResults("Nu ai suficienti morcovi!", "Du-te in contul tau, la sectiunea Market si cumpara.", 600);
				} else {
					showResults("You don't have enough carrots!", "Go to your account, at the Market Section and buy some.", 600);
				}
			}			
		}
	}

	bet(){
		if($('.craps_bets_container').length>0){
			$('.craps_bets_container').addClass('open');

			$('.craps_bets .close').click(function() {
				$('.craps_bets_container').removeClass('open');
			});
		}
	}

	check_win_lose(win, bet){
		$('#craps_start').attr('finished', 'yes');
		$('#craps_start').prop('disabled', false);
		$('#craps_start').removeClass('start');

		if(bet){
			if(win){
				if(this.props.lang === "ro"){
					showResults("Resultate", "Ai castigat "+bet+" morcovi!");
				} else {
					showResults("Results", "You won "+bet+" carrots!");
				}			
			} else {
				if(this.props.lang === "ro"){
					showResults("Resultate", "Ai pierdut "+bet+" morcovi!");
				} else {
					showResults("Results", "You lost "+bet+" carrots!");
				}
			}
		}
	}

	craps_rules(){
		if(this.state.lang === "ro"){
			let pay_table = `
			<div id="craps_rules" class="craps_rules">
				<p>
					<b>Pass Line Bet: </b>
					Jucatorul pariaza ca cel care arunca zarurile va obtine 7 sau 11 în prima aruncare. 
					Daca iese 2, 3 sau 12 (Craps) pariul este pierdut. 
					Daca rezultatul este 4, 5, 6, 8, 9 sau 10 se spune ca shooter-ul a rostogolit un punct. 
					Pentru a castiga el trebuie sa încerce sa obţina aceeasi valoare înainte de a rostogoli un 7, indiferent cate runde sunt necesare. 
					De ce 7? Pentru ca acesta este cel mai probabil rezultat în Craps.
				</p>
				<p>
					<b>Don't Pass Line: </b>
					Pariază că jucătorul care aruncă va obține un total de 2 sau 3. 
					Dacă se obţine 7 sau 11 pariul este pierdut, iar dacă totalul este 12 va fi egalitate şi primeşti banii înapoi. 
					Orice alt total va duce spre o rundă următoare, care pornește de la acel număr.
				</p>
				<p>
					<b><b>Come Bet:</b>
					Este câştigător dacă se obţine 7 sau 11, iar dacă rezultatul este 2, 3 sau 4 va fi pierzător. 
					Dacă rezultatul este un punct (4, 5, 6, 8, 9 sau 10), 
					pariul va acoperi acel număr devenind un Pariu Point 
					şi este câştigător dacă numărul punct apare din nou ca rezultat înainte de obţinerea unui 7. 
					Dacă se obţine 7 înaintea numărului punct pariul este pierdut. 
					Pariul poate fi plasat doar după stabilirea unui punct.
				</p>
				<p>
					<b><b>Don't Come:</b>
					Acest pariu este echivalent cu cel Don’t Pass Line, 
					unica diferenţă fiind aceea că miza nu poate fi pusă decât după ce a fost rostogolit primul punct.
				</p>
			</div>`;
			let text = bigText("craps_rules", this.state.lang, pay_table);
			showResults("Rules", text, 400);
		} else {
			let pay_table = `
			<div id="craps_rules" class="craps_rules">
				<b>Pass Line Bet:</b>
					Players are betting that on the first roll 7 or 11 rolls to win, 2, 3, or 12 loses. 
					If a number such as: 4, 5, 6, 8, 9 or 10 rolls, the number must repeat before a seven to win.
				</p>			
				<p>
				<b>Don’t Pass Bet:</b>
					Player betting that on the first roll 2 or 3 rolls to win, 12 is a push, 7 or 11 loses. 
					If a number such as: 4, 5, 6, 8, 9 or 10 rolls, a seven must roll before the number repeats.
				</p>				
				<p>
				<b>Come Bet:</b>
					Is just like the pass line bet, same rules apply. It’s a game within a game.
				</p>				
				<p>
				<b>Don’t Come Bet:</b>
					Is similar to the Don’t Pass bet, same rules apply. It’s a game within a game.
				</p>				
				<p>
				<b>Field Bet:</b>
					If any of the numbers that are in the field box come out, player wins. 
					A field bet can also be referred to as a “ONE ROLL BET.”
				</p>			
				<p>
				<b>Place Bet:</b>
					Wagers made on the point numbers (4, 5, 6, 8, 9 or 10) that are not contract bets. 
					A Place Bet is “off” on the come-out roll unless the player indicates otherwise.
				</p>			
				<p>
				<b>Proposition Bet:</b>
					One roll bet, the numbers are 2, 3, 7, 11 and 12.
				</p>
			</div>`;
			let text = bigText("craps_rules", this.state.lang, pay_table);
			showResults("Craps rules", text, 400);
		}
		
	}

	componentDidMount(){
		$('.full-height').attr('id', 'craps');
		let title = this.state.data.user_table;
		title = title.charAt(0).toUpperCase() + title.slice(1);
		$('.craps_title').empty();
		if (window.innerWidth >= 960){
			$('.craps_title').append(title);
		}

		let my_roulette_bets = new roulette_bets(this.props);
		my_roulette_bets.ready();

		$(window).resize(function(){
			$('.craps_title').empty();
			if (window.innerWidth >= 960){
				$('.craps_title').append(title);
			}
			my_roulette_bets.ready("resize");
		});
	}
	render() {
		let self = this;
		let lang = self.props.lang
		return (
			<>
				{
					!self.state ? <div>Loading...</div> : 
					<>
						<Row className="craps_container">
							<Col sm={2}></Col>
							<Col sm={8}>
								<h1 className="craps_title"></h1>
								<Row>
									<Col className="dice_container" sm={6}>
										<Dice number={1}></Dice>
										<Dice number={2}></Dice>
									</Col>
									<Col sm={6}>
										<div className="craps_board_container">
											<div readOnly id="craps_board" className="craps_board"></div>
										</div>
									</Col>
								</Row>
								<Row className="game_buttons_container">
									<Col sm={12} className="game_buttons">
										<div className="game_text_container">
											<div className="game_buttons_box">
												{lang === "ro" ? 
													<p className="craps_buttons_box_cell craps_buttons_box_text">Ai: <span id="money_total">{this.state.data.money-1}</span> morcovi</p> : 
													<p className="craps_buttons_box_cell craps_buttons_box_text">You have: <span id="money_total">{this.state.data.money-1}</span> carrots</p>
												}
											</div>
											<div className="game_buttons_box">
												{lang === "ro" ? 
													<p className="craps_buttons_box_text">PARIAZA</p> : 
													<p className="craps_buttons_box_text">BET</p>
												}
												<input onChange={(e) => {this.handleChange(e)}} className="craps_input" type="number" id="craps_bet_input" min="1" defaultValue="1" max={this.state.money}></input>
											</div>
										</div>
										<div className="game_start_container">
											<button className="craps_start shadow_convex" finished={"yes"} id="craps_start" onClick={this.start}>{lang === "ro" ? <span>Incepe</span> : <span>Start</span>}</button>
											<button className="craps_bet shadow_convex" finished={"yes"} id="craps_bet" onClick={this.bet}>{lang === "ro" ? <span>Pariaza</span> : <span>Bet</span>}</button>
										</div>
									</Col>
								</Row>
							</Col>
							<Col sm={2}></Col>
						</Row>
						<Row>
							<Col sm={12}>
								{lang === "ro" ? 
									<p id="craps_rules_button" onClick={()=>{self.craps_rules()}}>Click aici pentru a vedea regulile</p> : 
									<p id="craps_rules_button" onClick={()=>{self.craps_rules()}}>Click here to see rules</p>
								}
							</Col>
						</Row>
					</>
				}

				<div class="craps_bets_container">
					<div class="craps_bets shadow_concav">
						<div class="close">x</div>
						{lang === "ro" ? 
								<div><p><b>In constructie</b></p><p>Craps se joaca acum doar ca Pass Line</p></div> : 
								<div><p><b>Under construction</b></p><p>Craps can be played now only as Pass Line</p></div>
							}
						<div class="craps_bets_box">						
							<canvas id="craps_bets_canvas"></canvas>
							<div id="craps_bets_clear" className="shadow_convex">Clear</div>
						</div>
					</div>
				</div>
					
				<div className="show_results_container">				
					<div className="show_results">
						<i className="fa fa-times show_results_close" ></i>
						<h1 className="header"></h1>
						<div className="message"></div>
					</div>
				</div>
			</>
		);
	}
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Craps)