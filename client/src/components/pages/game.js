import React, { useState, useEffect, useRef }from 'react';
import Button from 'react-bootstrap/Button'

import Roulette from './games/roulette'
import Blackjack from './games/blackjack'
import Slot from './games/slot'
import Craps from './games/craps'
import { game_page } from '../actions/actions';

function Game(props){
	let game = props.game;
	let user_id = props.user_id;
	let user = props.user;
	let type = props.type;
	let money = props.money;
	let user_table = props.user_table;
	let dispatch = props.dispatch;	

	function handleBack(){
		let url = window.location.href;
		url = url.split('/table/');
		window.location.href = url[0];
	}  
	
	return (
		<div className="color_yellow">
			{user ? (
				<div className="casino_container color_yellow">
					{(() => {
						switch (game) {
							case "roulette":
								if(dispatch){
									dispatch(game_page('roulette'));
								}
								return (
									<Roulette lang={props.lang} user_id={user_id} user={user} user_table={user_table} type={type} socket={props.socket} money={money}></Roulette>
								)
							case "blackjack":
								if(dispatch){
									dispatch(game_page('blackjack'));
								}
								return (
									<Blackjack lang={props.lang} user_id={user_id} user={user} user_table={user_table} socket={props.socket} money={money}></Blackjack>
								)	
							case "slots":
								if(dispatch){
									dispatch(game_page('slots'));
								}
								return (
									<Slot lang={props.lang} user_id={user_id} user={user} user_table={user_table} type={type} socket={props.socket} money={money}></Slot>
								)
							case "craps":
								if(dispatch){
									dispatch(game_page('craps'));
								}
								return (
									<Craps lang={props.lang} user_id={user_id} user={user} user_table={user_table} type={type} socket={props.socket} money={money}></Craps>
								)
							default:
								return(
									<div>
										{props.lang === "ro" ? 
											<>
												<p>Eroare</p>
												<Button className="button_table shadow_convex" type="button" onClick={handleBack}>Inapoi</Button>
											</> : 
											<>
												<p>Somethig went wrong</p>
												<Button className="button_table shadow_convex" type="button" onClick={handleBack}>Back</Button>
											</>
										}														
									</div>
								)						
						}
					})()}
				</div>
			) : (
				<div>
					{props.lang === "ro" ? <span>Nu exista user</span> : <span>No user</span>}	
				</div>
			)}			
		</div>
	);
}

export default Game;