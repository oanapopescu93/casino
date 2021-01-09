import React from 'react';
import { useSelector} from 'react-redux'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'

function Account_profile(props) {
	var username = props.info.user;
	var roulette_info = useSelector(state => state.roulette);
	
	var money = props.info.money;
	var history = [];
		
	if(roulette_info !== -1){		
		money = roulette_info[0].money;
		history = roulette_info[1].history;	
	}
	var rowspan = history.length.toString();
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
							{history.length === 0 ? (
								<div className="color_yellow">No history</div>
							) : (
								<Table className="history_container">
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
							)}
					</Col>
				</Row>
			</Col>
			<Col sm={2}></Col>
		</Row>
	);
}

export default Account_profile;
