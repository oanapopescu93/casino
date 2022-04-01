import React, {Component} from 'react';
import {connect} from 'react-redux'
import $ from 'jquery';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { showResults } from '../../utils';

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
		};
		this.getDiceNumber = this.getDiceNumber.bind(this);
		this.animate = this.animate.bind(this);
		this.roll = this.roll.bind(this);
		this.getNumbers = this.getNumbers.bind(this);
		this.start = this.start.bind(this);
		this.check_win_lose = this.check_win_lose.bind(this);
		this.handleChange = this.handleChange.bind(this);
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

	start(){
		let self = this;
		if($('#craps_start').attr('finished') === "yes"){
			console.log('START')
			$('#craps_start').attr('finished', 'no');
			$('#craps_start').prop('disabled', true);
			$('#craps_start').addClass('start');
			let state = 1;
			let point;
			let sum;			
			let timer = setInterval(function () {
				switch(state) {
					case 1:
						console.log('state', state)
						self.roll().then(function(res){
							$('.dice_container').removeClass('jump');
							sum = self.state.dices_number[0] + self.state.dices_number[1];
							console.log(self.state.dices_number[0] + ", " + self.state.dices_number[1], sum);
							if(sum === 7|| sum === 11){
								state = 2;
							} else {
								point = sum;
								state = 3;
							}
						});
						break;
					case 2:
						console.log('state', state)
						self.check_win_lose(true);
						clearInterval(timer);
						break;
					case 3:
						console.log('state', state)
						self.roll().then(function(res){
							$('.dice_container').removeClass('jump');
							sum = self.state.dices_number[0] + self.state.dices_number[1];
							console.log(self.state.dices_number[0] + ", " + self.state.dices_number[1], sum, point);
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
						console.log('state', state)
						self.check_win_lose(false);
						clearInterval(timer);
						break;
				}
			}, 1500);
		}
	}

	check_win_lose(win, bet){
		$('#craps_start').attr('finished', 'yes');
		$('#craps_start').prop('disabled', false);
		$('#craps_start').removeClass('start');

		if(bet){
			if(win){
				if(this.state.data.lang === "ro"){
					showResults("Resultate", "Ai castigat "+bet);
				} else {
					showResults("Results", "You won "+bet);
				}			
			} else {
				if(this.state.data.lang === "ro"){
					showResults("Resultate", "Ai pierdut "+bet);
				} else {
					showResults("Results", "You lost "+bet);
				}
			}
		}
	}

	componentDidMount(){
		console.log('aaa', this.state)
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
		return (
			<>
				<div className="craps_container">
					<h1 className="craps_title"></h1>
					<p>Under construction</p>
					<Row>
						<Col className="dice_container" sm={6}>
							<Dice number={1}></Dice>
							<Dice number={2}></Dice>
						</Col>
						<Col sm={6}>
							<div className="craps_board_container">
								<div id="craps_board" className="craps_board"></div>
							</div>
						</Col>
					</Row>
					<Row className="craps_buttons_container">
						<Col sm={12} className="craps_buttons">
							<Row>
								<Col className="craps_buttons_box" sm={5}>
									{this.state.data.lang === "ro" ? 
										<p className="craps_buttons_box_cell craps_buttons_box_text">Ai: <span id="money_total">{this.state.money-1}</span> morcovi</p> : 
										<p className="craps_buttons_box_cell craps_buttons_box_text">You have: <span id="money_total">{this.state.money-1}</span> carrots</p>
									}
								</Col>
								<Col className="craps_buttons_box" sm={5}>
									{this.state.data.lang === "ro" ? 
										<p className="craps_buttons_box_text">PARIAZA</p> : 
										<p className="craps_buttons_box_text">BET</p>
									}
									<input onChange={(e) => {this.handleChange(e)}} className="craps_input" type="number" id="craps_bet" min="1" defaultValue="1" max={this.state.money}></input>
								</Col>
								<Col sm={2} className="craps_spin_container">
									<Button id="craps_start" finished={"yes"} className="button_yellow shadow_convex" onClick={this.start}>{this.state.data.lang === "ro" ? <span>Incepe</span> : <span>Start</span>}</Button>
								</Col>
							</Row>
						</Col>
					</Row>
				</div>
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