import React, { useState } from 'react';
import { useSelector} from 'react-redux'
import $ from 'jquery'; 

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function Account_profile(props) {
	var username = props.info.user;
	var roulette_info = useSelector(state => state.roulette);
	var blackjack_info = useSelector(state => state.blackjack);
	var lang = props.lang;
	var socket = props.info.socket; 
	var info = props.info;

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
		console.log($)
		var input = $('#change_username').val();
		if(typeof input != "undefned" && input != "null" && input != null && input != ""){
			socket.emit('change_username_send', {id: props.info.user_id, input: input});
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
						<Col  className="profile_left shadow_concav" sm={4}>
							<h3>User info: </h3>
							<p className="profile_user">{lang === "ro" ? <b>User: </b> : <b>Username: </b>}{username}</p>
							<p className="profile_money">{lang === "ro" ? <b>Morcovi: </b> : <b>Carrots: </b>}{money}</p>
							<div id="profile_change_username" className="button_yellow" onClick={handleShow}>Change username</div>
							<div id="profile_buy_carrots" className="button_yellow" onClick={buy_carrots}>Buy carrots</div>
						</Col>
						<Col className="profile_right shadow_concav" sm={8}>
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
						</Col>
					</Row>
				</Col>
				<Col sm={2}></Col>
			</Row>

			<Modal className="casino_modal" id="settings_modal" show={show} onHide={handleClose} size="sm">
				<Modal.Header closeButton>
					<Modal.Title>{lang === "ro" ? <span>Setari</span> : <span>Settings</span>}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<input className="change_username" type="text" id="change_username"></input>
					<Button className="button_table shadow_convex" type="button" onClick={() => change_username()}>
						{lang === "ro" ? <span>Trimite</span> : <span>Send</span>}
					</Button>
				</Modal.Body>				
			</Modal>
		</>
	);
}

export default Account_profile;
