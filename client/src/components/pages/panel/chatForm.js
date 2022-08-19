import React, { useEffect, useState } from 'react';
import $ from 'jquery'; 
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function ChatForm(props) {
	const lang = props.lang;
	const socket = props.socket;
	let user = props.user;
	const [list, setList] = useState([]);

	useEffect(() => {
		socket.on('chat_message_read', function(data){
			if(data.from){
				$('#chatmessages').append('<div class="message message01"><div class="chat_header"><span class="user"><strong>' + data.from + '</strong></span> (<span class="date">' + formatDate(data.time) + '</span>)</div><div class="chat_body"><span class="text">' + data.text + '</span></div></div>');
			} else {
				$('#chatmessages').append('<div class="message message02"><div class="user"></div><div class="text">' + data.text + '</div></div>');
			}	
			let objDiv = document.getElementById("chatmessages");
			objDiv.scrollTop = objDiv.scrollHeight;
		});
		
		socket.on('chatlist', function(data) {
			setList(data);
		});
	}, []);  
	
	function formatDate(date) {	
		let d = new Date(date);
		let dateString = new Date(d.getTime() - (d.getTimezoneOffset() * 60000 )).toISOString().split(".")[0].replace(/T/g, " ").replace(/-/g, "/");
		return dateString;
	}
	
	function my_click(e){
		if($('#chattext').val() !== ""){
			socket.emit('chat_message_send', {user: user, user_table: props.user_table, user_type: props.type, message: $('#chattext').val()});
			$('#chattext').val('');
		}
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
						<Button className="button_green" id="chatsend" onClick={(e)=>{e.preventDefault(); my_click()}}>
							{lang === "ro" ? <span>Trimite</span> : <span>Send</span>}
						</Button>
					</Col>
				</Row>
			</Form>
			<ul id="user_list">
				{(() => {
					if(list && list.length > 0){
						return (
							<>
								{							
									list.map(function(item, i){
										let date = formatDate(item.time)
										return(
											<li key={i}>
												<span className="left">{item.user}</span>
												<span className="right">{date}</span>
											</li>
										);
									})
								}
							</>
						);
					} 	
				})()}
			</ul>
		</div>
	);
}

export default ChatForm;
