import React, { Component } from 'react';
import $ from 'jquery'; 
import { useSelector} from 'react-redux'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import SalonGames from './games/salon_games'
import Sports from './games/sports'
import Sapou from './partials/sapou';

import About from './other_pages/about';
import Support from './other_pages/support';
import Terms from './other_pages/terms';
import Privacy from './other_pages/privacy';
import Questions from './other_pages/questions';
import Career from './other_pages/career';

var self;
var casino_games = {
	roulette_tables: [], 
	blackjack_tables: [],
	slots_tables: []
}
var casino_games_title = Object.getOwnPropertyNames(casino_games);

function Child(props){
	var lang = props.lang;
	var casino_games_title = props.casino_games_title;
	var socket = props.socket;
	var user = props.user;
	var casino_games = props.casino_games;
	var visible = useSelector(state => state.visibility);
	var contact = props.contact;
	return(
		<>	
			{(() => {
				switch (visible) {
					case "game":
						return (
							<>
								<Sapou lang={lang} page="salon"></Sapou>
								<SalonGames lang={lang} casino_games_title={casino_games_title} socket={socket} user={user} casino_games={casino_games}></SalonGames>
							</>
						)
					case "about":
						return (
							<>
								<Sapou lang={lang} page={visible}></Sapou>
								<About lang={lang} socket={socket} user={user}></About>
							</>
						)	
					case "support":
						return (
							<>
								<Sapou lang={lang} page={visible}></Sapou>
								<Support contact={contact} lang={lang} socket={socket} user={user}></Support>
							</>
						)
					case "terms":
						return (
							<>
								<Sapou lang={lang} page={visible}></Sapou>
								<Terms lang={lang} casino_games_title={casino_games_title} socket={socket} user={user} casino_games={casino_games}></Terms>
							</>
						)
					case "privacy":
						return (
							<>
								<Sapou lang={lang} page={visible}></Sapou>
								<Privacy lang={lang} socket={socket} user={user}></Privacy>
							</>
						)
					case "questions":
						return (
							<>
								<Sapou lang={lang} page={visible}></Sapou>
								<Questions lang={lang} socket={socket} user={user}></Questions>
							</>
						)
					case "career":
						return (
							<>
								<Sapou lang={lang} page={visible}></Sapou>
								<Career lang={lang} socket={socket} user={user}></Career>
							</>
						)
					default:
						return(
							<>
								<Sapou lang={lang} page="salon"></Sapou>
								<SalonGames lang={lang} casino_games_title={casino_games_title} socket={socket} user={user} casino_games={casino_games}></SalonGames>
							</>
						)						
				}
			})()}					
		</>		
	);
}

class Salon extends Component {	
	constructor(props) {
		super(props);
		self = this;
		self.state = {
			socket: props.socket,
			empty: false,
			casino_games: '',
			user: '',
			sports: false,
	  	};		
		self.handleBack = self.handleBack.bind(self);
		self.handleChange = self.handleChange.bind(self);
		self.salonData = self.salonData.bind(self);
		self.getCookie = self.getCookie.bind(self);	
	}
  
	componentDidMount(a) {
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
			self.state.socket.emit('salon_send', 'salon');	
			self.state.socket.on('salon_read', function(data){
				resolve(data);	
			});	
		});
	};

	handleBack() {
		var url = window.location.href;
		url = url.split('/salon');
		window.location.href = url[0];
	}

	handleExit(){
		self.setCookie("casino_user", '', 1);
		self.setCookie("casino_email", '', 1);
		var url = window.location.href;
		url = url.split('/salon');
		window.location.href = url[0];
	}

	setCookie(cname,cvalue,exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	handleChange(type){
		if(type === "games"){			
			this.setState({ sports: false })
		} else if(type === "sports"){
			this.setState({ sports: true })
		}
	}
  
	render() {	
		$('.full-height').attr('id', 'salon');
		var lang = self.props.lang;
		return (
			<div>
				{self.state.empty ? (
					<div className="color_yellow">
						{lang === "ro" ? <span>Nu exista mese</span> : <span>No tables</span>}
					</div>
				) : (
					<Row>						
						{self.state.user === '' ? (
							<div className="table_container color_yellow">
								{lang === "ro" ? 
									<>
										<h3>Acces interzis</h3>
										<h4>Intoarce-te si logheaza-te/inregistreaza-te</h4>
										<Button className="button_table shadow_convex" type="button" onClick={()=>self.handleBack()}>
											{lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
										</Button>
									</> : 
									<>
										<h3>No access</h3>
										<h4>Please go back and login in / sign in</h4>
										<Button className="button_table shadow_convex" type="button" onClick={()=>self.handleBack()}>
											{lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
										</Button>
									</>
								}								
							</div>
						) : (
							<>
								<div className="salon_button_container">
									<div className="salon_button_box">
										<div id="salon_buton_games" className="salon_button shadow_convex" onClick={()=>{self.handleChange('games')}}>
											{lang === "ro" ? <span>Jocuri</span> : <span>Games</span>}											
										</div>            
										<div id="salon_buton_sports" className="salon_button shadow_convex" onClick={()=>{self.handleChange('sports')}}>
											{lang === "ro" ? <span>Sport</span> : <span>Sport</span>}	
										</div>
									</div>
								</div>
								<Col sm={12} className="salon_page color_yellow">
									{self.state.sports ? (
										<Sports lang={lang} socket={self.state.socket} user={self.state.user}></Sports>									
									) : (
										<Child contact={self.props.contact} lang={lang} casino_games_title={casino_games_title} socket={self.state.socket} user={self.state.user} casino_games={casino_games}></Child>
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