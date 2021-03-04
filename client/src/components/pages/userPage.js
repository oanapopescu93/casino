import React, { Component } from 'react';
import { useSelector} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import $ from 'jquery'; 

import Game from './game';
import UserAccount from './userAccount';
import Panel from './panel_control';

var socket;
var self;

function Child(props) {
	self = this;	
	var visible = useSelector(state => state.visibility);
	var user_id = props.user_id;
	var user = props.user;
	var money = props.money;
	var type = props.type;
	var user_table = props.user_table;
	var game = props.game;
	
	return (			
			<BrowserRouter>
				<div className="userPage"> 
					<Row>
						<Col sm={12}>							
							{ visible ? 
								<Game user_id={user_id} game={game} user={user} money={money} user_table={user_table} type={type} socket={socket}></Game>									
								: 
								<UserAccount user_id={user_id} game={game} user={user} money={money} user_table={user_table} type={type} socket={socket}></UserAccount> 
							}						
						</Col>
					</Row>	
				</div>
				<Panel user_id={user_id} game={game} user={user} money={money} user_table={user_table} type={type} socket={socket}></Panel>
			</BrowserRouter>
		);
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
		self.userPageData()
			.then(res => {						
					self.setState({ user: res});
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

	userPageData(){
		return new Promise(function(resolve, reject){
			var table = window.location.href.split('table/')
			socket.emit('user_page_send', table[1]);	
			socket.on('user_page_read', function(data){
				//console.log('user_page_read--> ', data)
				if(data.user === "" || data.user !== "indefined"){
					data.user = self.getCookie("casino_user")
				}
				resolve(data);	
			});	
		});
	};

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