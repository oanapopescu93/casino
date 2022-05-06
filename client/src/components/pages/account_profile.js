import React, { useState } from 'react';
import { useSelector} from 'react-redux'
import $ from 'jquery'; 

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { setCookie } from '../utils';
import History from './partials/history';

function Account_profile(props) {
	var username = props.info.user;
	var lang = props.lang;
	var socket = props.info.socket; 

	var roulette_info = useSelector(state => state.roulette);
	var blackjack_info = useSelector(state => state.blackjack);
	var slots_info = useSelector(state => state.slot);
	var craps_info = useSelector(state => state.craps);
	var race_info = useSelector(state => state.race);

	// console.log('roulette_info', roulette_info)
	// console.log('blackjack_info', blackjack_info)
	// console.log('slots_info', slots_info)
	// console.log('craps_info', craps_info)
	// console.log('race_info', race_info)

	socket.on('change_username_read', function(data){
		console.log('change_username_read ', data)
	});	

	const [show, setShow] = useState(false);

	function handleClose(){ setShow(false) };
    function handleShow(){ setShow(true) };
	
	let money = props.info.money;
	let history_short = {
		roulette: null,
		blackjack: null,
		slots: null,
		craps: null,
		race: null
	};
	let history_long = [];	
	if(roulette_info !== -1){		
		money = roulette_info[0].money;
		history_short.roulette = roulette_info[1].history;
	}
	if(blackjack_info !== -1){		
		money = blackjack_info[0].money;
		history_short.blackjack = blackjack_info[1].history;
	}
	if(slots_info !== -1){		
		money = slots_info[0].money;
		history_short.slots = slots_info[1].history;
	}
	if(craps_info !== -1){		
		money = craps_info[0].money;
		history_short.craps = craps_info[1].history;
	}
	if(race_info !== -1){		
		money = race_info[0].money;
		history_short.race = race_info[1].history;
	}

	//console.log('history_short000', history_short)

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
						<Col sm={4} className="profile_container_left">
							<div className="profile_left shadow_concav">								
								{lang === "ro" ? <h3>Informatii utilizator</h3> : <h3>User info</h3>}
								<p className="profile_user">{lang === "ro" ? <b>User: </b> : <b>Username: </b>}<span id="profile_user_text">{username}</span></p>
								<p className="profile_money">{lang === "ro" ? <b>Morcovi: </b> : <b>Carrots: </b>}{money}</p>
								<div id="profile_change_username" className="profile_button button_yellow" onClick={handleShow}>Change username</div>
								<div id="profile_buy_carrots" className="profile_button button_yellow" onClick={buy_carrots}>Buy carrots</div>
							</div>
						</Col>
						<Col sm={8} className="profile_container_left hidden-xs">
							<div className="profile_right shadow_concav">								
								<History lang={lang} history_short={history_short} history_long={history_long}></History>
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
