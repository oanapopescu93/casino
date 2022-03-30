import React, {Component} from 'react';
import {connect} from 'react-redux'
import $ from 'jquery';
import Button from 'react-bootstrap/Button'

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
		};
		this.getDiceNumber = this.getDiceNumber.bind(this);
		this.animate = this.animate.bind(this);
		this.roll = this.roll.bind(this);
		this.getNumbers = this.getNumbers.bind(this);
		this.start = this.start.bind(this);
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
				if (roll == i) {
					dice.addClass('show_'+i);
				}
			}
		}
	}

	roll(){
		this.getNumbers()
		.then(res => {
			for(let k in res){
				let t = parseInt(k)+1;
				let dice = $('#dice'+t);
				let dice_number = this.getDiceNumber(dice);
				let roll = res[k];				
				this.animate(dice, roll, t);
				if(roll === dice_number){
					roll++;
					if(roll>6){
						roll=1;
					}				
					this.animate(dice, roll, t);
				}
			}
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
		this.roll();
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
		return (
			<>
				<div className="craps_container">
					<h1 className="craps_title"></h1>
					<p>Under construction</p>
					<div className="dice_container">
						<Dice number={1}></Dice>
						<Dice number={2}></Dice>
					</div>			
					<Button id="craps_start" className="button_yellow shadow_convex" onClick={this.start}>{this.state.data.lang === "ro" ? <span>Incepe</span> : <span>Start</span>}</Button>
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