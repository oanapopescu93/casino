import React, { Component } from 'react';
import $ from 'jquery'; 
import { useSelector} from 'react-redux'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import SalonGames from './games/salon_games'
import Sapou from './partials/sapou';

import About from './other_pages/about';
import Support from './other_pages/support';
import Terms from './other_pages/terms';
import Privacy from './other_pages/privacy';
import Questions from './other_pages/questions';
import Career from './other_pages/career';

import { getCookie, setCookie } from '../utils';
import UserRace from './userRace';

var self;
var casino_games = {
	roulette_tables: [], 
	blackjack_tables: [],
	slots_tables: [],
	craps_tables: []
}
var casino_games_title = Object.getOwnPropertyNames(casino_games);

function Child(props){
	var lang = props.lang;
	var casino_games_title = props.casino_games_title;
	var socket = props.socket;
	var user_id = props.user_id;
	var user = props.user;
	var casino_games = props.casino_games;
	var visible = useSelector(state => state.visibility);
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
								<About lang={lang} socket={socket} user_id={user_id} user={user}></About>
							</>
						)	
					case "support":
						return (
							<>
								<Sapou lang={lang} page={visible}></Sapou>
								<Support lang={lang} socket={socket} user_id={user_id} user={user}></Support>
							</>
						)
					case "terms":
						return (
							<>
								<Sapou lang={lang} page={visible}></Sapou>
								<Terms lang={lang} casino_games_title={casino_games_title} socket={socket} user_id={user_id} user={user} casino_games={casino_games}></Terms>
							</>
						)
					case "privacy":
						return (
							<>
								<Sapou lang={lang} page={visible}></Sapou>
								<Privacy lang={lang} socket={socket} user_id={user_id} user={user}></Privacy>
							</>
						)
					case "questions":
						return (
							<>
								<Sapou lang={lang} page={visible}></Sapou>
								<Questions lang={lang} socket={socket} user_id={user_id} user={user}></Questions>
							</>
						)
					case "career":
						return (
							<>
								<Sapou lang={lang} page={visible}></Sapou>
								<Career lang={lang} socket={socket} user_id={user_id} user={user}></Career>
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
			lang: props.lang,
			empty: false,
			casino_games: '',
			user: '',
			open_race: false,
			id: -1,
			money: 0,
	  	};		
		self.handleBack = self.handleBack.bind(self);
		self.handleChange = self.handleChange.bind(self);
		self.salonData = self.salonData.bind(self);
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
							case "craps":
								casino_games.craps_tables.push(res.server_tables[i]);
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
					self.setState({ money: res.money });
					console.log('salon ', res)
				})
			.catch(err => console.log(err));		
	}
	
	salonData(){
		return new Promise(function(resolve, reject){
			self.setState({ user_id: parseInt(getCookie("casino_id")) });
			self.setState({ user: getCookie("casino_user") });
			setTimeout(function(){
				self.state.socket.emit('salon_send', self.state.user_id);	
				self.state.socket.on('salon_read', function(data){
					resolve(data);	
				});	
			}, 1000);
		});
	};

	handleBack() {
		var url = window.location.href;
		url = url.split('/salon');
		window.location.href = url[0];
	}

	handleExit(){
		setCookie("casino_user", '', 1);
		setCookie("casino_email", '', 1);
		var url = window.location.href;
		url = url.split('/salon');
		window.location.href = url[0];
	}

	handleChange(type){
		if(type === "games"){	
			this.setState({ race: false })
		} else if(type === "race"){
			this.setState({ race: true })
		}
	}
  
	render() { 
		let lang = this.props.lang
		if(this.state.race){
			$('.full-height').attr('id', 'race');
		} else {
			$('.full-height').attr('id', 'salon');
		}
		return (
			<>
				{this.state.empty ? (
					<div className="color_yellow">
						{lang === "ro" ? <span>Nu exista mese</span> : <span>No tables</span>}
					</div>
				) : (
					<Row>						
						{this.state.user === '' ? (
							<div className="table_container color_yellow">
								{lang === "ro" ? 
									<>
										<h3>Acces interzis</h3>
										<h4>Intoarce-te si logheaza-te/inregistreaza-te</h4>
										<Button className="button_table shadow_convex" type="button" onClick={()=>this.handleBack()}>
											{lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
										</Button>
									</> : 
									<>
										<h3>No access</h3>
										<h4>Please go back and login in / sign in</h4>
										<Button className="button_table shadow_convex" type="button" onClick={()=>this.handleBack()}>
											{lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
										</Button>
									</>
								}								
							</div>
						) : (
							<>
								<div className="salon_button_container">
									<div className="salon_button_box">
										<div id="salon_buton_games" className="salon_button shadow_convex" onClick={()=>{this.handleChange('games')}}>
											{lang === "ro" ? <span>Jocuri</span> : <span>Games</span>}											
										</div>            
										<div id="salon_buton_race" className="salon_button shadow_convex" onClick={()=>{this.handleChange('race')}}>
											{lang === "ro" ? <span>Curse</span> : <span>Race</span>}	
										</div>
									</div>
								</div>
								<Col sm={12} className="salon_page color_yellow">
									{this.state.race ? (
										<UserRace race={this.state.race} lang={lang} user_id={this.state.user_id} user={this.state.user} money={this.state.money} user_table={"Rabbit Race"} socket={this.state.socket}></UserRace>						
									) : (
										<Child lang={lang} casino_games_title={casino_games_title} socket={this.state.socket} user_id={this.state.user_id} user={this.state.user} casino_games={casino_games}></Child>
									)}											
								</Col>
							</>																
						)}			
					</Row>
				)}
			</>
		);		
	}
}

export default Salon;