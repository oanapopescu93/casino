import React from 'react';
import { useSelector} from 'react-redux'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'

function Account_profile(props) {
	var username = props.info.user;
	var roulette_info = useSelector(state => state.roulette);
	var blackjack_info = useSelector(state => state.blackjack);
	
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
	
	//console.warn('history00--> ', money, history, rowspan)
	
	return (
		<Row className="account_box_container color_yellow">
			<Col sm={2}></Col>
			<Col sm={8}>					
				<Row>
					<Col sm={12}><h2>Profile</h2></Col>
				</Row>
				<Row className="profile_container">
					<Col sm={4}>
						<h3>User info: </h3>
						<p className="profile_user"><b>Username: </b>{username}</p>
						<p className="profile_money"><b>Money: </b>{money}</p>
					</Col>
					<Col sm={8}>
						<h3>History: </h3>
							{(() => {
								if (roulette_info === -1 && blackjack_info === -1) {
									//console.log('zzz00', history, history.length)
									return (
										<p>There is no history.</p>
									)
								} else {
									if(roulette_info !== -1){
										//console.log('zzz01', history, history.length)
										if(history.length === 0){	
											return (
													<div className="color_yellow 111">No history</div>
											)
										} else {
											return (
												<Table className="history_container 111">
															<thead>
																<tr>
																	<th>Lucky nr</th>
																	<th>Your bet</th>
																	<th>Status</th>
																	<th>Money</th>
																</tr>
															</thead>
															<tbody>
																{																					
																	history.map(function(item, i){
																		var history_elem = item
																		//console.warn('history01--> ', history_elem, i)	
																		if(i === 0){
																			if(history_elem.win){
																				return(
																					<tr key={i} className="history_box">
																						<td rowSpan={rowspan}>{history_elem.lucky_nr}</td>
																						<td>{history_elem.text}</td>	
																						<td>Win {history_elem.bet_value} carrot</td>
																						<td>{history_elem.money_history}</td>																				
																					</tr>
																				)
																			} else {
																				return(
																					<tr key={i} className="history_box">
																						<td rowSpan={rowspan}>{history_elem.lucky_nr}</td>
																						<td>{history_elem.text}</td>
																						<td>Lose {history_elem.bet_value} carrot</td>
																						<td>{history_elem.money_history}</td>																						
																					</tr>
																				)
																			}													
																		} else {
																			if(history_elem.win){
																				return(
																					<tr key={i} className="history_box">
																						<td>{history_elem.text}</td>	
																						<td>Win {history_elem.bet_value} carrot</td>
																						<td>{history_elem.money_history}</td>																				
																					</tr>
																				)
																			} else {
																				return(
																					<tr key={i} className="history_box">
																						<td>{history_elem.text}</td>
																						<td>Lose {history_elem.bet_value} carrot</td>
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
													<div className="color_yellow 222">No history</div>
											)
										} else {
											return (
												<Table className="history_container 222">
													<thead>
														<tr>
															<th>Status</th>
															<th>Money</th>
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
					</Col>
				</Row>
			</Col>
			<Col sm={2}></Col>
		</Row>
	);
}

export default Account_profile;
