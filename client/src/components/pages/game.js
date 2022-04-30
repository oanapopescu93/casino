import React, {Component} from 'react'
import Button from 'react-bootstrap/Button'

import Roulette from './games/roulette'
import Blackjack from './games/blackjack'
import Slot from './games/slot'
import Craps from './games/craps'

var finish = false;
var self;

class Game extends Component {	
	constructor(props) {
		super(props);
		self = this;		
		this.handleBack = this.handleBack.bind(self);

		this.state = {
			user_id: '',
			user: '',
			type: '',
			money: '',
			user_table: '',
			game: '',
		}; 		
	}
	
	componentDidMount() {
		self = this;
		this.setState({ game: this.props.game });
		this.setState({ user_id: this.props.user_id });
		this.setState({ user: this.props.user });
		this.setState({ type: this.props.type });
		this.setState({ money: this.props.money });
		this.setState({ user_table: this.props.user_table });
		finish = true;		
	}

	handleBack() {
		var url = window.location.href;
		url = url.split('/table/');
		window.location.href = url[0];
	}
  
	render() {	
		var user = false;
		
		if(this.state.user !== ""){
			user = true;
		}
		
		return (
			<div className="color_yellow">
				{finish ? (
					<div>
						{user ? (
							<div className="casino_container color_yellow">
								{(() => {
									switch (this.state.game) {
										case "roulette":
											return (
												<Roulette lang={this.props.lang} user_id={this.state.user_id} user={this.state.user} user_table={this.state.user_table} type={this.state.type} socket={this.props.socket} money={this.state.money}></Roulette>
											)
										case "blackjack":
											return (
												<Blackjack lang={this.props.lang} user_id={this.state.user_id} user={this.state.user} user_table={this.state.user_table} socket={this.props.socket} money={this.state.money}></Blackjack>
											)	
										case "slots":
											return (
												<Slot lang={this.props.lang} user_id={this.state.user_id} user={this.state.user} user_table={this.state.user_table} type={this.state.type} socket={this.props.socket} money={this.state.money}></Slot>
											)
										case "craps":
											return (
												<Craps lang={this.props.lang} user_id={this.state.user_id} user={this.state.user} user_table={this.state.user_table} type={this.state.type} socket={this.props.socket} money={this.state.money}></Craps>
											)
										default:
											return(
												<div>
													{self.props.lang === "ro" ? 
														<>
															<p>Eroare</p>
															<Button className="button_table shadow_convex" type="button" onClick={()=>self.handleBack()}>Inapoi</Button>
														</> : 
														<>
															<p>Somethig went wrong</p>
															<Button className="button_table shadow_convex" type="button" onClick={()=>self.handleBack()}>Back</Button>
														</>
													}														
												</div>
											)						
									}
								})()}
							</div>
						) : (
							<div>
								{self.state.lang === "ro" ? <span>Nu exista user</span> : <span>No user</span>}	
							</div>
						)}
					</div>
				) : (
					<div>{self.state.lang === "ro" ? <span>Eroare</span> : <span>Error loading page</span>}</div>
				)}
			</div>
		);
		
	}
}

export default Game;