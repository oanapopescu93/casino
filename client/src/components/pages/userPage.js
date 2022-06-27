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

function Child(props) {
	let visible = useSelector(state => state.visibility);
	let dispatch = props.dispatch;
	let user_id = props.user_id;
	let user = props.user;
	let money = props.money;
	let type = props.type;
	let user_table = props.user_table;
	let game = props.game;
	let socket = props.socket;
	let lang = props.lang;
	return (			
			<BrowserRouter>
				<div className="userPage"> 
					<Row>
						<Col sm={12}>	
							{(() => {
								console.log('visible--> ', visible)
								switch (visible) {
									case "game":
										return (
											<Game lang={lang} user_id={user_id} game={game} user={user} money={money} user_table={user_table} type={type} socket={socket} dispatch={dispatch}></Game>
										)
									case "account":
										return (
											<UserAccount lang={lang} info={props} socket={socket} dispatch={dispatch}></UserAccount> 
										)	
									case "support":
										return (
											<Support lang={lang} user_id={user_id} game={game} user={user} money={money} user_table={user_table} type={type} socket={socket} dispatch={dispatch}></Support> 
										)
									default:
										return(
											<Game lang={lang} user_id={user_id} game={game} user={user} money={money} user_table={user_table} type={type} socket={socket} dispatch={dispatch}></Game>
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
		this.state = {
			user: '',
			user_id: -1,
			socket: props.socket,
			lang: props.lang
		};
	}	
  
	componentDidMount() {
		let self = this;
		this.userPageData()
			.then(res => {
					if(res !== null){
						let table = self.state.user.user_table;
						let table_split = table.split('_');
						let table_user = table_split[0] + ' ' + table_split[1];
						let table_type = table_split[2];					
						let payload = {id:self.state.user_id, user: self.state.user.user, user_table: table_user, user_type: table_type, time: new Date().getTime(), lang:self.props.lang}
						self.state.socket.emit('username', payload);
						self.state.socket.on('is_online', function(data) {
							if(typeof $('#chatmessages') !== "undefined"){
								$('#chatmessages').append(data);
							}
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
		let self = this;
		return new Promise(function(resolve, reject){			
			let table = window.location.href.split('table/')			
			let id = parseInt(getCookie("casino_id"));
			let user = getCookie("casino_user");
			self.state.socket.emit('user_page_send', [table[1], id, user]);
			self.state.socket.on('user_page_read', function(data){
				if(data !== null){
					if(data.user === "" || data.user === "indefined"){
						data.user = getCookie("casino_user")
					}
					self.setState({ user: data});
					self.setState({ user_id: data.id});
				} 
				resolve(data);				
			});	
		});
	};
  
	render() {
		let user_id = this.state.user_id;

		if(this.state.user.user === ""){
			let url_back = window.location.href.split('/table/');
			window.location.href = url_back[0];
		}
		
		let username = this.state.user.user;
		let url = '/table/'+this.state.user.user_table;
		let money = this.state.user.money;
		let type = "";
		let user_table = ""
		let game = this.state.user.game;
		
		if(typeof this.state.user.user_table !== "undefined"){
			let user_table_text = this.state.user.user_table.split('_');
			type = user_table_text[2];
			user_table = user_table_text[0] + ' ' + user_table_text[1]
		}		
		
		if(typeof money === "undefined"){
			money = 0;
		}

		return user_id !== -1 ? 
			<Child user_id={user_id} game={game} user={username} money={money} profile_pic={this.state.user.profile_pic} user_table={user_table} type={type} lang={this.props.lang} socket={this.state.socket} dispatch={this.props.dispatch} url={url}></Child>
			 : (
				<span className="color_yellow">Loading...</span>
		  	)	
		
	}
}

export default UserPage;