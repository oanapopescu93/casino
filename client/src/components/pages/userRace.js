import React, { Component } from 'react';
import $ from 'jquery'; 
import Panel from './panel_control';
import Race from './games/race';

var self;
class UserRace extends Component {
	constructor(props) {
		super(props);
		self = this;
		self.state = {
			user: props.user,
			user_id: props.user_id,
			socket: props.socket,
			lang: props.lang,
            money: props.money,
            user_table: props.user_table,
		};
	}	
  
	componentDidMount() {
		var payload = {
            id:self.state.user_id, 
            user: self.state.user, 
            user_table: self.state.user_table, 
            time: new Date().getTime(), 
            lang:self.state.lang
        }
        self.state.socket.emit('username', payload);
        self.state.socket.on('is_online', function(data) {
            if(typeof $('#chatmessages') !== "undefined"){
                $('#chatmessages').append(data);
            }
        });	
	}
  
	render() {
		return(
            <>
                <Race lang={self.state.lang} socket={self.state.socket} user={self.state.user}></Race>
				<Panel lang={self.state.lang} user_id={self.state.user_id} user={self.state.user} money={self.state.money} user_table={self.state.user_table} socket={self.state.socket}></Panel>
            </>
        );		
	}
}

export default UserRace;