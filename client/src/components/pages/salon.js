import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'; 

import logo_icon from '../img/logo.png';
import SalonGames from './games/salon_games'
import Sports from './games/sports'

var self;
var socket;
var casino_games = {
	roulette_tables: [], 
	blackjack_tables: [],
	slots_tables: []
}
var casino_games_title = Object.getOwnPropertyNames(casino_games)

class Salon extends Component {	
	constructor(props) {
		super(props);
		self = this;
		socket = props.socket;	
		
		self.handleBack = self.handleBack.bind(self);
		self.handleChange = self.handleChange.bind(self);
		self.salonData = self.salonData.bind(self);
		self.getCookie = self.getCookie.bind(self);	
	}	
  
	state = {
		empty: false,
		casino_games: '',
		user: '',
		sports: false,
	}; 
  
	componentDidMount() {
		self.salonData()
			.then(res => {	
					for(var i in res.server_tables){
						switch (res.server_tables[i].table_name) {
							case "roulette":
								casino_games.roulette_tables.push(res.server_tables[i]);
							  	break;
							case "blackjack":
								casino_games.blackjack_tables.push(res.server_tables[i]);
							  	break;
							case "slots":
								casino_games.slots_tables.push(res.server_tables[i]);
								break;	
							default:
								break;						
						  }
					}
					
					var empty = 0;
					for(var j in casino_games_title){
						if(casino_games[casino_games_title[j]].length === 0){
							empty++;
						}
					}

					if(empty === casino_games_title.length){
						self.setState({ empty: true }); 
					}
					
					self.setState({ casino_games: casino_games }); 

					if(res.server_user === "" || res.server_user === null || typeof res.server_user === "undefined"){
						var server_user = self.getCookie("casino_user");
						self.setState({ user: server_user });	
					} else {
						self.setState({ user: res.server_user });	
					}					
				})
			.catch(err => console.log(err)); 
		
	}

	getCookie = function (cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i < ca.length; i++) {
		  	var c = ca[i];
		  	while (c.charAt(0) === ' ') {
				c = c.substring(1);
		  	}
		  	if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
		  	}
		}
		return "";
	}
	
	salonData(){
		return new Promise(function(resolve, reject){
			socket.emit('salon_send', 'salon');	
			socket.on('salon_read', function(data){
				resolve(data);	
			});	
		});
	};

	handleBack() {
		var url = window.location.href;
		url = url.split('/salon');
		window.location.href = url[0];
	}

	handleChange(type){
		if(type === "games"){			
			this.setState({ sports: false })
		} else if(type === "sports"){
			this.setState({ sports: true })
		}
	}
  
	render() {	
		$('.full-height').attr('id', 'salon')		
		return (
			<div>
				{self.state.empty ? (
					<div className="color_yellow">No tables</div>
				) : (
					<Row>						
						{self.state.user === '' ? (
							<div className="table_container color_yellow">
								<h3>No access</h3>
								<h4>Please go back and login in / sign in</h4>
								<Button className="button_table shadow_convex" type="button" onClick={()=>self.handleBack()}>Back</Button>
							</div>
						) : (
							<>
								<div className="salon_button_container">
									<div className="salon_button_box">
										<div id="salon_buton_games" className="salon_button" onClick={()=>{self.handleChange('games')}}>
											<span>Games</span>
										</div>            
										<div id="salon_buton_sports" className="salon_button" onClick={()=>{self.handleChange('sports')}}>
											<span>Sports</span>
										</div>
									</div>
								</div>
								<Col sm={12} className="salon_page color_yellow">
									<Row>
										<Col sm={12} id="sapou">
											<a href="/">
												<img id="logo_icon" alt="logo_icon" src={logo_icon} />
												<h1>BunnyBet</h1>
												<h6>Welcome to the salon</h6>
											</a>								
										</Col>
									</Row>
									{self.state.sports ? (
										<Sports socket={socket} user={self.state.user}></Sports>									
									) : (
										<SalonGames casino_games_title={casino_games_title} socket={socket} user={self.state.user} casino_games={casino_games}></SalonGames>
									)}														
								</Col>
							</>																
						)}			
					</Row>
				)}
			</div>
		);		
	}
}

export default Salon;