import React, { useEffect, useState } from 'react'
import $ from 'jquery'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function ChatForm(props) {
	let click = 0
	let socket = props.socket
	const [list, setList] = useState([])
	let game_choice = props.game_choice.table_name ? props.game_choice.table_name : props.game_choice
	if(props.game_choice.table_id){
		game_choice += '_' + props.game_choice.table_id
	}
	if(props.game_choice.table_type){
		game_choice += '_' + props.game_choice.table_type
	}

	useEffect(() => {
		socket.on('chat_message_read', function(data){
			click++
			if(click === 1){
				if(data.from){
					$('#chatmessages').append('<div class="message message01"><div class="chat_header"><span class="user"><strong>' + data.from + '</strong></span> (<span class="date">' + formatDate(data.time) + '</span>)</div><div class="chat_body"><span class="text">' + data.text + '</span></div></div>')
				} else {
					$('#chatmessages').append('<div class="message message02"><div class="user"></div><div class="text">' + data.text + '</div></div>')
				}	
				let objDiv = document.getElementById("chatmessages")
				objDiv.scrollTop = objDiv.scrollHeight
			}
		})
		
		socket.emit('chatlist_send', {user: props.uuid, game_choice: game_choice})
		socket.on('chatlist_read', function(data) {
			setList(data)
		})
	}, [])
	
	function formatDate(date) {	
		let d = new Date(date)
		let dateString = new Date(d.getTime() - (d.getTimezoneOffset() * 60000 )).toISOString().split(".")[0].replace(/T/g, " ").replace(/-/g, "/")
		return dateString
	}
	
	function my_click(e){
		if($('#chattext').val() !== ""){
			socket.emit('chat_message_send', {user: props.user, game_choice: game_choice, message: $('#chattext').val()})
			$('#chattext').val('')
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
							{props.lang === "ro" ? <span>Trimite</span> : <span>Send</span>}
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
										)
									})
								}
							</>
						)
					} 	
				})()}
			</ul>
		</div>
	)
}

export default ChatForm
