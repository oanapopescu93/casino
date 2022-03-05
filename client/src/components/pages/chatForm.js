import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'

import $ from 'jquery'; 

var socket_click = 0;

function ChatForm(props) {
	const socket = props.socket;
	var user = props.user;
	
	socket.on('chat_message_read', function(data){
		socket_click++
		if(socket_click === 1){
			if(data.from){
				$('#chatmessages').append('<div class="message message01"><div class="chat_header"><span class="user"><strong>' + data.from + '</strong></span> (<span class="date">' + formatDate(data.time) + '</span>)</div><div class="chat_body"><span class="text">' + data.text + '</span></div></div>');
			} else {
				$('#chatmessages').append('<div class="message message02"><div class="user"></div><div class="text">' + data.text + '</div></div>');
			}	
			var objDiv = document.getElementById("chatmessages");
			objDiv.scrollTop = objDiv.scrollHeight;
		}
	});
	
	socket.on('chatlist', function(data) {	
		$('#user_list table').empty();
		for(var i in data){
			$('#user_list table').append('<tr><td class="left">' + data[i].user + '</td><td class="right">' + formatDate(data[i].time) + '</td></tr>');
		}	
	});
	
	function formatDate(date) {	
		var d = new Date(date);
		var dateString = new Date(d.getTime() - (d.getTimezoneOffset() * 60000 )).toISOString().split(".")[0].replace(/T/g, " ").replace(/-/g, "/");
		return dateString;
	}
	
	function my_click(e){
		if($('#chattext').val() !== ""){
			socket.emit('chat_message_send', {user: user, user_table: props.user_table, user_type: props.type, message: $('#chattext').val()});
			$('#chattext').val('');
		}
		socket_click = 0;
	}
	
	return (
		<div className="chat_form_box">
		   <Form className="chatroom" id="chatform" method="post" action="/members/chat">
				<div id="chatmessages"></div>
				<Row className="chattext_container">
					<Col sm={8}>
						<Form.Control type="text" name="chattext" id="chattext" placeholder="type here" />
					</Col>
					<Col sm={4}>
						<Button className="button_green" id="chatsend" onClick={(e)=>{e.preventDefault(); my_click()}}>Send</Button>
					</Col>
				</Row>
			</Form>
			<div id="user_list">
				<Table></Table>
			</div>
		</div>
	);
}

export default ChatForm;
