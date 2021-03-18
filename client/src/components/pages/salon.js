import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'; 

import logo_icon from '../img/logo.png';
import under_construction_icon from '../img/icons/under_construction_icon.png'

import Carousel from './carousel'

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
		
		self.handleDropdown = self.handleDropdown.bind(self);	
		self.handleBack = self.handleBack.bind(self);
		self.salonData = self.salonData.bind(self);
		self.getCookie = self.getCookie.bind(self);	
	}	
  
	state = {
		empty: false,
		casino_games: '',
		user: '',
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

	handleDropdown(t) {
		$('.casino_games_table_container').removeClass('open')
		$('.casino_games_table_container').each(function() {
			if($(this).attr('box') === t){
				$(this).addClass('open');
			}
		});
	}

	handleBack() {
		var url = window.location.href;
		url = url.split('/salon');
		window.location.href = url[0];
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
							<Col sm={12} className="salon_page color_yellow">
								<Row>
									<Col sm={12} id="sapou">
										<a href="/"><img id="logo_icon" alt="logo_icon" src={logo_icon} /></a>
										<h1 className="text_stroke">BunnyBet</h1>	
										<h6>Welcome to the salon</h6>								
									</Col>
								</Row>	
								<Row>
									<Col sm={2}></Col>
									<Col sm={8}>
										{
											casino_games_title.map(function(t, i){
												var title = t.split('_').join(' ')
												var box = "casino_games_table_container";
												if(i === 0){
													box = box + " open"
												}

												return(
													<div key={i}>
														<div key={i} className="casino_games_title_container">
															<div className="capitalize casino_games_title shadow_convex" onClick={()=>self.handleDropdown(t)}>{title}</div>
														</div>
														<div box={t} className={box}>
															<div className="casino_games_table">
																{(() => {
																	if (casino_games[t].length === 0) {
																		return (
																			<img className="under_construction_icon" alt="under construction" src={under_construction_icon} />
																		)
																	} else {
																		return (
																			<Carousel template="salon" socket={socket} user={self.state.user} item_list={casino_games[t]}></Carousel>
																		)
																	}
																})()}
															</div>
														</div>	
													</div>													
												)
											})
										}
									</Col>
									<Col sm={2}></Col>
								</Row>																
							</Col>																
						)}			
					</Row>
				)}
			</div>
		);		
	}
}

export default Salon;