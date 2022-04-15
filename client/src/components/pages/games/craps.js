import React, {Component} from 'react';
import {connect} from 'react-redux'
import $ from 'jquery';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { bigText, showResults } from '../../utils';

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

	roll(){
		let self = this;
		let dices_number = [];
		return new Promise(function(resolve, reject){
			self.getNumbers()
			.then(function(res){
				$('.dice_container').addClass('jump');
				for(let k in res){
					let t = parseInt(k)+1;
					let dice = $('#dice'+t);
					let dice_number = self.getDiceNumber(dice);
					let roll = res[k];				
					self.animate(dice, roll, t);
					if(roll === dice_number){
						roll++;
						if(roll>6){
							roll=1;
						}				
						self.animate(dice, roll, t);
					}
					dices_number.push(dice_number)
				}
				self.setState({ dices_number: dices_number });
				resolve(true);
			});
		});
	}

	getNumbers(){
		let self = this;
		return new Promise(function(resolve, reject){
			let payload={how_many_dices:2, user_table: self.state.data.user_table}
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
			if(point){
				$('#craps_board').append('<div class="craps_board_text"><span class="text text01">Dices:</span><span class="text text02">'+dices_number[0]+', '+dices_number[1]+'</span><span class="text text03">Sum:</span><span class="text text04">'+sum+'</span><span class="text text05">Point:</span><span class="text text06">'+point+'</span><div>');
			} else {
				$('#craps_board').append('<div class="craps_board_text"><span class="text text01">Dices:</span><span class="text text02">'+dices_number[0]+', '+dices_number[1]+'</span><span class="text text03">Sum:</span><span class="text text04">'+sum+'</span><div>');
			}		
			$("#craps_board").scrollTop($("#craps_board")[0].scrollHeight);
		}
	}

	start(){
		let self = this;
		if($('#craps_start').attr('finished') === "yes"){
			if($('#craps_input').val() > 0){
				$('#craps_start').attr('finished', 'no');
				$('#craps_start').prop('disabled', true);
				$('#craps_start').addClass('start');
				let state = 1;
				let point;
				let sum;			
				let timer = setInterval(function () {
					switch(state) {
						case 1:
							self.roll().then(function(res){
								$('.dice_container').removeClass('jump');
								sum = self.state.dices_number[0] + self.state.dices_number[1];							
								if(sum === 7|| sum === 11){
									state = 2;
								} else {
									point = sum;
									state = 3;
								}
								self.show_on_board(self.state.dices_number, sum, point);
							});
							break;
						case 2:
							self.check_win_lose(true);
							clearInterval(timer);
							break;
						case 3:
							self.roll().then(function(res){
								$('.dice_container').removeClass('jump');
								sum = self.state.dices_number[0] + self.state.dices_number[1];							
								self.show_on_board(self.state.dices_number, sum, point);
								if (sum == point) {
									state = 2;
								} else if (sum === 7) {
									state = 4;
								} else {
									state = 3;
								}
							});
							break;
						case 4:
							self.check_win_lose(false);
							clearInterval(timer);
							break;
					}
				}, 1500);
			} else {
				if(self.props.lang === "ro"){
					showResults("Nu ai suficienti morcovi!", "Du-te si cumpara din Market", 600);
				} else {
					showResults("You don't have enough carrots!", "Go and buy some from the Market.", 600);
				}
			}			
		}
	}

	check_win_lose(win, bet){
		$('#craps_start').attr('finished', 'yes');
		$('#craps_start').prop('disabled', false);
		$('#craps_start').removeClass('start');

		if(bet){
			if(win){
				if(this.props.lang === "ro"){
					showResults("Resultate", "Ai castigat "+bet);
				} else {
					showResults("Results", "You won "+bet);
				}			
			} else {
				if(this.props.lang === "ro"){
					showResults("Resultate", "Ai pierdut "+bet);
				} else {
					showResults("Results", "You lost "+bet);
				}
			}
		}
	}

	craps_rules(){
		if(this.state.lang === "ro"){
			let pay_table = `
			<div id="craps_rules" class="craps_rules">
				<p>When playing Craps, the most common craps bets are pass line, place bets, hard ways and craps & eleven. Below are several betting terms that you should familiarize yourself while playing craps.</p>
				<p><b>Pass Line Bet:</b> Players are betting that on the first roll 7 or 11 rolls to win, 2, 3, or 12 loses. If a number such as: 4, 5, 6, 8, 9 or 10 rolls, the number must repeat before a seven to win.</p>			
				<p><b>Don’t Pass Bet:</b> Player betting that on the first roll 2 or 3 rolls to win, 12 is a push, 7 or 11 loses. If a number such as: 4, 5, 6, 8, 9 or 10 rolls, a seven must roll before the number repeats.</p>				
				<p><b>Come Bet:</b> Is just like the pass line bet, same rules apply. It’s a game within a game.</p>				
				<p><b>Don’t Come Bet:</b> Is similar to the Don’t Pass bet, same rules apply. It’s a game within a game.</p>				
				<p><b>Field Bet:</b> If any of the numbers that are in the field box come out, player wins. A field bet can also be referred to as a “ONE ROLL BET.”</p>			
				<p><b>Place Bet:</b> Wagers made on the point numbers (4, 5, 6, 8, 9 or 10) that are not contract bets. A Place Bet is “off” on the come-out roll unless the player indicates otherwise.</p>			
				<p><b>Proposition Bet:</b> One roll bet, the numbers are 2, 3, 7, 11 and 12.</p>
			</div>`;
			let text = bigText("craps_rules", this.state.lang, pay_table);
			showResults("Rules", text, 400);
		} else {
			let pay_table = `
			<div id="craps_rules" class="craps_rules">
				<p>When playing Craps, the most common craps bets are pass line, place bets, hard ways and craps & eleven. Below are several betting terms that you should familiarize yourself while playing craps.</p>
				<p><b>Pass Line Bet:</b> Players are betting that on the first roll 7 or 11 rolls to win, 2, 3, or 12 loses. If a number such as: 4, 5, 6, 8, 9 or 10 rolls, the number must repeat before a seven to win.</p>			
				<p><b>Don’t Pass Bet:</b> Player betting that on the first roll 2 or 3 rolls to win, 12 is a push, 7 or 11 loses. If a number such as: 4, 5, 6, 8, 9 or 10 rolls, a seven must roll before the number repeats.</p>				
				<p><b>Come Bet:</b> Is just like the pass line bet, same rules apply. It’s a game within a game.</p>				
				<p><b>Don’t Come Bet:</b> Is similar to the Don’t Pass bet, same rules apply. It’s a game within a game.</p>				
				<p><b>Field Bet:</b> If any of the numbers that are in the field box come out, player wins. A field bet can also be referred to as a “ONE ROLL BET.”</p>			
				<p><b>Place Bet:</b> Wagers made on the point numbers (4, 5, 6, 8, 9 or 10) that are not contract bets. A Place Bet is “off” on the come-out roll unless the player indicates otherwise.</p>			
				<p><b>Proposition Bet:</b> One roll bet, the numbers are 2, 3, 7, 11 and 12.</p>
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

		$(window).resize(function(){
			$('.craps_title').empty();
			if (window.innerWidth >= 960){
				$('.craps_title').append(title);
			}
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
								<p>Under construction</p>
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
												<input onChange={(e) => {this.handleChange(e)}} className="craps_input" type="number" id="craps_bet" min="1" defaultValue="1" max={this.state.money}></input>
											</div>
										</div>
										<div className="game_start_container">
											<button className="craps_start shadow_convex" finished={"yes"} id="craps_start" onClick={this.start}>{lang === "ro" ? <span>Incepe</span> : <span>Start</span>}</button>
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
				
				<div className="show_results_container">
					<div className="show_results">
						<h1></h1>
						<p></p>
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