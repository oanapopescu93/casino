import React, { useState } from 'react';
import { useSelector} from 'react-redux'
import $ from 'jquery'; 

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { setCookie } from '../utils';

function Account_profile(props) {
	var username = props.info.user;
	var roulette_info = useSelector(state => state.roulette);
	var blackjack_info = useSelector(state => state.blackjack);
	var lang = props.lang;
	var socket = props.info.socket; 

	socket.on('change_username_read', function(data){
		console.log(data)
	});	

	const [show, setShow] = useState(false);

	function handleClose(){ setShow(false) };
    function handleShow(){ setShow(true) };
	
	var money = props.info.money;
	var history = [];
	var rowspan = 0;
		
	if(roulette_info !== -1){		
		money = roulette_info[0].money;
		history = roulette_info[1].history;	
		rowspan = history.length.toString();
	}
	if(blackjack_info !== -1){		
		money = blackjack_info[0].money;
		history = blackjack_info[1].history;	
	}

	function buy_carrots(){
		if(lang === "ro"){
			alert('Nu exista metoda de plata inca.')
		} else {
			alert('No payment methods yet.')
		}
	}
	function change_username(){
		var input = $('#change_username').val();
		if(typeof input !== "undefined" && input !== "null" && input !== null && input !== ""){
			setCookie("casino_user", input, 1);
			$('#profile_user_text').text(input);
			socket.emit('change_username_send', {id: props.info.user_id, user_new: input});
			handleClose();
		}
    }   
	
	return (
		<>
			<Row className="account_box_container color_yellow">
				<Col sm={2}></Col>
				<Col sm={8}>					
					<Row>				
						<Col sm={12}>{lang === "ro" ? <h2>Profil</h2> : <h2>Profile</h2>}</Col>
					</Row>
					<Row className="profile_container">
						<Col sm={4}>
							<div className="profile_left shadow_concav">
								<h3>User info: </h3>
								<p className="profile_user">{lang === "ro" ? <b>User: </b> : <b>Username: </b>}<span id="profile_user_text">{username}</span></p>
								<p className="profile_money">{lang === "ro" ? <b>Morcovi: </b> : <b>Carrots: </b>}{money}</p>
								<div id="profile_change_username" className="profile_button button_yellow" onClick={handleShow}>Change username</div>
								<div id="profile_buy_carrots" className="profile_button button_yellow" onClick={buy_carrots}>Buy carrots</div>
							</div>
						</Col>
						<Col sm={8}>
							<div className="profile_right shadow_concav">
								<h3>History: </h3>
								<div className="history_box">
									{(() => {
										if (roulette_info === -1 && blackjack_info === -1) {
											return (
												<p>{lang === "ro" ? <span>Nu exista istoric</span> : <span>There is no history</span>}</p>
											)
										} else {
											if(roulette_info !== -1){
												if(history.length === 0){	
													return (
															<div className="color_yellow 111">{lang === "ro" ? <span>Nu exista istoric</span> : <span>There is no history</span>}</div>
													)
												} else {
													return (
														<Table className="history_container 111">
																	<thead>
																		<tr>
																			<th>{lang === "ro" ? <span>Nr. norocos</span> : <span>Lucky no.</span>}</th>
																			<th>{lang === "ro" ? <span>Nr. tau</span> : <span>Your no.</span>}</th>
																			<th>{lang === "ro" ? <span>Status</span> : <span>Status</span>}</th>
																			<th>{lang === "ro" ? <span>Morcovi</span> : <span>Carrots</span>}</th>
																		</tr>
																	</thead>
																	<tbody>
																		{																					
																			history.map(function(item, i){
																				var history_elem = item	
																				if(i === 0){
																					if(history_elem.win){
																						return(
																							<tr key={i} className="history_box">
																								<td rowSpan={rowspan}>{history_elem.lucky_nr}</td>
																								<td>{history_elem.text}</td>	
																								<td>{lang === "ro" ? <span>Ai castigat </span> : <span>Won </span>}{history_elem.bet_value}</td>
																								<td>{history_elem.money_history}</td>																				
																							</tr>
																						)
																					} else {
																						return(
																							<tr key={i} className="history_box">
																								<td rowSpan={rowspan}>{history_elem.lucky_nr}</td>
																								<td>{history_elem.text}</td>
																								<td>{lang === "ro" ? <span>Ai pierdut </span> : <span>Lost </span>}{history_elem.bet_value}</td>
																								<td>{history_elem.money_history}</td>																						
																							</tr>
																						)
																					}													
																				} else {
																					if(history_elem.win){
																						return(
																							<tr key={i} className="history_box">
																								<td>{history_elem.text}</td>	
																								<td>{lang === "ro" ? <span>Ai castigat </span> : <span>Won </span>}{history_elem.bet_value} carrot</td>
																								<td>{history_elem.money_history}</td>																				
																							</tr>
																						)
																					} else {
																						return(
																							<tr key={i} className="history_box">
																								<td>{history_elem.text}</td>
																								<td>{lang === "ro" ? <span>Ai pierdut </span> : <span>Lost </span>}{history_elem.bet_value} carrot</td>
																								<td>{history_elem.money_history}</td>																					
																							</tr>
																						)
																					}	
																				}																																		
																			})
																		}
																	</tbody>
																</Table>	
													)
												}
											}

											if(blackjack_info !== -1){
												if(history.length === 0){	
													return (
															<div className="color_yellow 222">{lang === "ro" ? <span>Nu exista istoric</span> : <span>There is no history</span>}</div>
													)
												} else {
													return (
														<Table className="history_container 222">
															<thead>
																<tr>
																	<th>{lang === "ro" ? <span>Status</span> : <span>Status</span>}</th>
																	<th>{lang === "ro" ? <span>Morcovi</span> : <span>Carrots</span>}</th>
																</tr>
															</thead>
															<tbody>
																<tr>
																	{(() => {
																		var text = history[0].charAt(0).toUpperCase() + history[0].slice(1);
																		var carot = 'carot';
																		if(history[1] > 1){
																			carot = 'carots';
																		}
																		return(
																			<>
																				<td>{text}</td>
																				<td>{text} {history[1]} {carot}</td>
																			</>
																		)
																	})()}
																</tr>
															</tbody>
														</Table>
													)
												}
											}
										}
									})()}
								</div>
							</div>
						</Col>
					</Row>
				</Col>
				<Col sm={2}></Col>
			</Row>

			<Modal className="casino_modal" id="change_username_modal" show={show} onHide={handleClose} size="sm">
				<Modal.Header closeButton>
					<Modal.Title>{lang === "ro" ? <span>Schimba nume user</span> : <span>Change username</span>}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<input className="change_username_input" type="text" id="change_username"></input>
					<Button className="change_username_button shadow_convex" type="button" onClick={() => change_username()}>
						{lang === "ro" ? <span>Schimba</span> : <span>Change</span>}
					</Button>
				</Modal.Body>				
			</Modal>
		</>
	);
}

export default Account_profile;
