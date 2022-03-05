import React, { Component } from 'react';
import { useSelector} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import $ from 'jquery'; 

import Game from './game';
import UserAccount from './userAccount';
import Support from './other_pages/support';
import Panel from './panel_control';
import { getCookie, showResults } from '../utils';

var self;
function Child(props) {
	var visible = useSelector(state => state.visibility);
	var user_id = props.user_id;
	var user = props.user;
	var money = props.money;
	var type = props.type;
	var user_table = props.user_table;
	var game = props.game;
	var socket = props.socket;
	var lang = props.lang;
	var contact = props.contact;
	console.log('userpage--> ', lang, user_id, game, user, money, user_table, type)
	return (			
			<BrowserRouter>
				<div className="userPage"> 
					<Row>
						<Col sm={12}>	
							{(() => {
								switch (visible) {
									case "game":
										return (
											<Game lang={lang} user_id={user_id} game={game} user={user} money={money} user_table={user_table} type={type} socket={socket}></Game>
										)
									case "account":
										return (
											<UserAccount lang={lang} user_id={user_id} game={game} user={user} money={money} user_table={user_table} type={type} socket={socket}></UserAccount> 
										)	
									case "support":
										return (
											<Support contact={contact} lang={lang} user_id={user_id} game={game} user={user} money={money} user_table={user_table} type={type} socket={socket}></Support> 
										)
									default:
										return(
											<Game lang={lang} user_id={user_id} game={game} user={user} money={money} user_table={user_table} type={type} socket={socket}></Game>
										)						
								}
							})()}					
						</Col>
					</Row>	
				</div>
				<Panel lang={lang} user_id={user_id} game={game} user={user} money={money} user_table={user_table} type={type} socket={socket}></Panel>
			</BrowserRouter>
		);
}

class UserPage extends Component {
	constructor(props) {
		super(props);
		self = this;
		self.state = {
			user: '',
			user_id: -1,
			socket: props.socket,
			contact: {},
			lang: props.lang
		};
	}	
  
	componentDidMount() {
		self.userPageData()
			.then(res => {	
					if(res !== null){
						var table = self.state.user.user_table;
						var table_split = table.split('_');
						var table_user = table_split[0] + ' ' + table_split[1];
						var table_type = table_split[2];					
						var payload = {id:self.state.user_id, user: self.state.user.user, user_table: table_user, user_type: table_type, time: new Date().getTime(), lang:self.props.lang}
						self.state.socket.emit('username', payload);
						self.state.socket.on('is_online', function(data) {
							$('#chatmessages').append(data);
						});	
					} else {
						if(self.state.lang === "ro"){
							showResults("Eroare", "Ups, ceva s-a intamplat.");
						} else {
							showResults("Error", "Ups, something went wrong.");
						}	
					}							
				})
			.catch(err => console.log(err));  
	}

	userPageData(){
		return new Promise(function(resolve, reject){
			var table = window.location.href.split('table/')			
			var id = parseInt(getCookie("casino_id"));
			var user = getCookie("casino_user");
			self.state.socket.emit('user_page_send', [table[1], id, user]);
			self.state.socket.on('user_page_read', function(data){
				if(data !== null){
					if(data.user === "" || data.user === "indefined"){
						data.user = getCookie("casino_user")
					}
					self.setState({ user: data});
					self.setState({ user_id: data.id});
					self.setState({ contact: data.contact});						
				} 
				resolve(data);				
			});	
		});
	};
  
	render() {
		var user_id = this.state.user_id;

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
		var contact = this.state.contact;
		
		if(typeof this.state.user.user_table !== "undefined"){
			var user_table_text = this.state.user.user_table.split('_');
			type = user_table_text[2];
			user_table = user_table_text[0] + ' ' + user_table_text[1]
		}		
		
		if(typeof money === "undefined"){
			money = 0;
		}

		return user_id !== -1 ? 
			<Child contact={contact} user_id={user_id} game={game} user={username} money={money} user_table={user_table} type={type} lang={self.props.lang} socket={self.state.socket} url={url}></Child>
			 : (
				<span className="color_yellow">Loading...</span>
		  	)	
		
	}
}

export default UserPage;