import React, {useEffect} from 'react';
import Button from 'react-bootstrap/Button'
import Roulette from './games/roulette'
import Blackjack from './games/blackjack'
import Slot from './games/slot'
import Craps from './games/craps'
import { game_page } from '../actions/actions';
import { useDispatch } from 'react-redux'

function Game(props){
	console.log('game ', props)
	let game = props.info.game;
	let user_id = props.info.user_id;
	let user = props.info.user;
	let type = props.info.type;
	let money = props.info.money;
	let user_table = props.info.user_table;
	let dispatch = useDispatch();	

	useEffect(() => {
		dispatch(game_page('game'));
		return () => {
		  //console.log('useEffect2 ')
		};
	}, []); 

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
								return (
									<Roulette lang={props.lang} user_id={user_id} user={user} user_table={user_table} type={type} socket={props.socket} money={money}></Roulette>
								)
							case "blackjack":
								return (
									<Blackjack lang={props.lang} user_id={user_id} user={user} user_table={user_table} socket={props.socket} money={money}></Blackjack>
								)	
							case "slots":
								return (
									<Slot lang={props.lang} user_id={user_id} user={user} user_table={user_table} type={type} socket={props.socket} money={money}></Slot>
								)
							case "craps":								
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