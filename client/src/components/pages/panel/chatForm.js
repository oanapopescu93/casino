import React, { useEffect, useState, useRef } from 'react'
import $ from 'jquery'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { formatDate } from '../../utils'

let chatmessages = []
function Chat(props){
	let data = props.data
	let lang = props.lang
	const messagesEndRef = useRef(null);	

	useEffect(() => {
		messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
	}, [props])

	if(data){
		if(data.reason && (data.reason === "join" || data.reason === "leave")){
			let exists = false
			for(let i in chatmessages){
				if(chatmessages[i].reason === data.reason && chatmessages[i].from === data.from){
					exists = true
					break
				}
			}
			if(!exists){
				chatmessages.push(data)
			}			
		} else {
			let exists = false
			for(let i in chatmessages){
				if(chatmessages[i].from === data.from && chatmessages[i].text === data.text && chatmessages[i].time === data.time){
					exists = true
					break
				}
			}
			if(!exists){
				chatmessages.push(data)
			}
		}
	}

	return(
		<div id="chatmessages">
			{							
				chatmessages.map(function(item, i){
					if(item.reason && item.reason === "join"){
						if(props.lang === "ro"){
							return <div key={i} className="message"><div className="text"><strong>{item.from} </strong>s-a alaturat chat-lui</div></div>
						} else {
							return <div key={i} className="message"><div className="text"><strong>{item.from} </strong>joined the chat</div></div>
						}
					} else if(item.reason && item.reason === "leave"){
						if(props.lang === "ro"){
							return <div key={i} className="message"><div className="text"><strong>{item.from} </strong>a parasit chat-lui</div></div>
						} else {
							return <div key={i} className="message"><div className="text"><strong>{item.from} </strong>left the chat</div></div>
						}
					} else {
						if(item.from){
							return <div key={i} className="message message01"><div className="chat_header"><span className="user"><strong>{item.from} </strong></span> (<span className="date">{formatDate(item.time)}</span>)</div><div className="chat_body"><span className="text">{item.text}</span></div></div>
						} else {
							return <div key={i} className="message message02"><div className="user"></div><div className="text">{item.text}</div></div>
						}
					}
				})
			}
			<div ref={messagesEndRef} />
		</div>
	)
}

function ChatForm(props) {
	let socket = props.socket
	const [list, setList] = useState([])
	const [message, setMessage] = useState(null)
	const isMounted = useRef(false)
	let game_choice = props.game_choice.table_name ? props.game_choice.table_name : props.game_choice
	if(props.game_choice.table_id){
		game_choice += '_' + props.game_choice.table_id
	}
	if(props.game_choice.table_type){
		game_choice += '_' + props.game_choice.table_type
	}

	useEffect(() => {
		isMounted.current = true
		socket.emit('join_leave_chat_send', {uuid: props.uuid, game_choice: game_choice, reason: "join"})
		socket.emit('chatlist_send', {uuid: props.uuid, game_choice: game_choice})
		return () => {
			isMounted.current = false
			socket.emit('join_leave_chat_send', {uuid: props.uuid, game_choice: game_choice, reason: "leave"})
		}
	}, [])	

	useEffect(() => {
		if(isMounted && isMounted.current){
			socket.on('join_leave_chat_read', function(data){
				setMessage(data)
			})
			socket.on('chatlist_read', function(data){
				setList(data)
			})
		}
	}, [message, socket])	

	function my_click(e){
		if($('#chattext').val() !== ""){
			socket.emit('chat_message_send', {user: props.user, game_choice: game_choice, message: $('#chattext').val()})
			$('#chattext').val('')
		}
	}

	socket.on('chat_message_read', function(data){
		setMessage(data)
	})
	
	return (
		<div className="chat_form_box">
			<div className="chatroom" id="chatform">
				<Chat data={message} lang={props.lang}></Chat>
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
			</div>
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
