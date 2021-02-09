import React, { Component } from 'react';
import {BrowserRouter} from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'

import $ from 'jquery'; 
import logo_icon from '../img/logo.png';
import carrot_img from '../img/icons/carrot_icon.png';

import Game from './game';
import UserAccount from './userAccount';

var socket;
var self;

class Child extends Component {
	constructor(props) {
		super(props);
		self = this;

		this.handleClick = this.handleClick.bind(self);

		this.state = {
			visible: false,
			user_id: props.user_id,
			user: props.user,
			url: props.url,
			money: props.money,
			type: props.type,
			user_table: props.user_table,
			game: props.game,
		}; 
	}
	
	componentDidMount() {		
		$(window).click(function(e) {		
			if(e.target.id !== "user_icon_path" && e.target.id !== "user_icon" && e.target.id !== "user_details"){
				$('.user_details_container').removeClass('open')
			} 
		});
	}

	handleClick(link) {
		switch (link) {
			case "account":
				this.setState({ visible: true });
			  	break;
			case "casino":
				this.setState({ visible: false });
				break;
			case "user_icon":
				$('.user_details_container').toggleClass('open');
			 	break;
			default:
				var url_back = window.location.href.split('/table/');
				window.location.href = url_back[0];
		  }
	}

	render() {
		return (			
				<BrowserRouter>
					<div className="userPage"> 
						<Navbar bg="light" expand="lg">
							<div className="logo_title">
								<Navbar.Brand href="/">
									<img alt="logo_icon" className="logo_title_img" src={logo_icon} />
									<div className="logo_title_text">BunnyBet</div>
								</Navbar.Brand>							
							</div>
						</Navbar>
						<div id="user_money" className="user_money">
							<div id="nav_money"><span>{this.state.money}</span><img alt="carrot_img" className="currency_img" src={carrot_img} /></div>
						</div>
						<div id="user_details" className="user_details" >
							<svg onClick={()=>self.handleClick('user_icon')} id="user_icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-circle" className="svg-inline--fa fa-user-circle fa-w-16" role="img" viewBox="0 0 496 512">
								<path id="user_icon_path" fill="yellow" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"/>
							</svg>
							<div className="user_details_container">
								<div className="user_details_box">								
									<div id="nav_user" className="nav_user" onClick={()=>self.handleClick('casino')}>{this.state.user}</div>
									<div id="nav_account" className="nav_user" onClick={()=>self.handleClick('account')}>My account</div>
									<div id="nav_logout" className="nav_user" onClick={()=>self.handleClick('logout')}>Logout</div>
								</div>	
							</div>						
						</div>
						<Row>
							<Col sm={12}>
								
										{ !this.state.visible ? 
											<Game user_id={this.state.user_id} game={this.state.game} user={this.state.user} money={this.state.money} user_table={this.state.user_table} type={this.state.type} socket={socket}></Game>									
											: 
											<UserAccount user_id={this.state.user_id} game={this.state.game} user={this.state.user} money={this.state.money} user_table={this.state.user_table} type={this.state.type} socket={socket}></UserAccount> 
										}						
							</Col>
						</Row>	
					</div>
				</BrowserRouter>
			);
	}
}

class UserPage extends Component {
	constructor(props) {
		super(props);
		self = this;
		socket = props.socket;	
	}
	
	state = {
		user: '',
		user_id: -1,
	}; 	
  
	componentDidMount() {
		self.callApi()
			.then(res => {				
					self.setState({ user: res.server_user });
					var table = self.state.user.user_table;
					var table_split = table.split('_');
					var table_user = table_split[0] + ' ' + table_split[1];
					var table_type = table_split[2];
					var payload = {user: self.state.user.user, user_table: table_user, user_type: table_type, time: new Date().getTime()}
					socket.emit('username', payload);
					socket.on('is_online', function(data) {
						$('#chatmessages').append(data);
					});
					socket.on('user_id', function(data) {
						self.setState({ user_id: data })
					});
				})
			.catch(err => console.log(err));  
		
		
		
	}
  
	callApi = async () => {
		var table = window.location.href.split('table/')
		const response = await fetch('/table/'+table[1]);
		const body = await response.json();
		if (response.status !== 200) throw Error(body.message);
		return body;
	};
  
  
	render() {
		var user_id = this.state.user_id		
		if(this.state.user.user === ""){
			var url_back = window.location.href.split('/table/');
			window.location.href = url_back[0];
		}
		
		var username = this.state.user.user;
		var url = '/table/'+this.state.user.user_table;
		var money = this.state.user.money;
		var type = "";
		var user_table = ""
		var game = this.state.user.game;
		
		if(typeof this.state.user.user_table !== "undefined"){
			var user_table_text = this.state.user.user_table.split('_');
			type = user_table_text[2];
			user_table = user_table_text[0] + ' ' + user_table_text[1]
		}		
		
		if(typeof money === "undefined"){
			money = 0;
		}

		return user_id !== -1 ? 
			<Child user_id={user_id} game={game} user={username} money={money} user_table={user_table} type={type} socket={socket} url={url}></Child>
			 : (
				<span className="color_yellow">Loading...</span>
		  	)	
		
	}
}

export default UserPage;