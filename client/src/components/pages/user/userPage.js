import React, { useEffect, useState } from 'react';
import $ from 'jquery'; 
import Button from 'react-bootstrap/Button'
import { getCookie, isEmpty, setCookie } from '../../utils';

import roulette_loading_icon from '../../img/icons_other/icons/yellow/roulette.png'
import blackjack_loading_icon from '../../img/icons_other/icons/yellow/blackjack.png'
import slots_loading_icon from '../../img/icons_other/icons/yellow/slots.png'
import craps_loading_icon from '../../img/icons_other/icons/yellow/craps.png'
import race_loading_icon from '../../img/icons_other/icons/yellow/race.png'
import keno_loading_icon from '../../img/icons_other/icons/yellow/keno.png'

import UserChoice from './userChoice';

function UserPage(props){	
	let socket = props.socket;
	let lang = props.lang;
	let choice = props.choice;
	const [data, setData] = useState(null);
	const [empty, setEmpty] = useState(false);

	useEffect(() => {
		let casino_uuid = getCookie("casino_uuid");
		let table = choice;
		if(choice === "game"){
			let table_array = window.location.href.split('table/')
			table = table_array[1];	
		}		
		if(!isEmpty(casino_uuid)){
			socket.emit('user_page_send', {table: table, uuid: casino_uuid, lang: lang});
			socket.on('user_page_read', function(data){
				if(data !== null){
					if(choice === "game"){
						let table_split = data.user_table.split('_');
						data.table = table_split[0] + ' ' + table_split[1];
						data.type = table_split[2];	
					}
					setData(data);
					if(typeof $('#chatmessages') !== "undefined"){
						if(lang === "ro"){
							$('#chatmessages').append('<p class="user_join">' + data.user + ' e online</p>');
						} else {
							$('#chatmessages').append('<p class="user_join">' + data.user + ' join the chat</p>');
						}
					}	
				} else {					
					setEmpty(true);
				}		
			});	
		} else {
			setEmpty(true);
		}
	}, []);  

	function handleBack(){
		setCookie("casino_id", '');
		setCookie("casino_uuid", '');
		setCookie("casino_user", '');
		setCookie("casino_email", '');
		let url = window.location.href;
		url = url.split('/table/');
		window.location.href = url[0];
	}
	
	return(
		<>
			{(() => {
				if(empty){
					return(
						<div className="userPage_error">
							{lang === "ro" ? 
								<>
									<h3>Acces interzis</h3>
									<h4>Intoarce-te si logheaza-te/inregistreaza-te</h4>
									<Button className="button_table shadow_convex" type="button" onClick={()=>handleBack()}>
										{lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
									</Button>
								</> : 
								<>
									<h3>No access</h3>
									<h4>Please go back and login in / sign in</h4>
									<Button className="button_table shadow_convex" type="button" onClick={()=>handleBack()}>
										{lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
									</Button>
								</>
							}								
						</div>
					);
				} else {
					if(data){
						return <UserChoice choice={choice} data={data} lang={lang} socket={socket}></UserChoice>
					} else {
						return(
							<div className="userPage_loading">
								{(() => {
									switch (choice) { 					
										case "game":
											let table = window.location.href.split('table/')
											let game = table[1];
											let type = game.split('_')[0];
											switch(type){
												case "roulette":
													return (
														<>
															<img className="loading_icon" alt="loading_icon" src={roulette_loading_icon} />
															<p className="color_yellow">Loading Roulette</p>
														</>
													);
												case "blackjack":
													return (
														<>
															<img className="loading_icon" alt="loading_icon" src={blackjack_loading_icon} />
															<p className="color_yellow">Loading Blackjack</p>
														</>
													);
												case "slots":
													return (
														<>
															<img className="loading_icon" alt="loading_icon" src={slots_loading_icon} />
															<p className="color_yellow">Loading Slots</p>
														</>
													);
												case "craps":
													return (
														<>
															<img className="loading_icon" alt="loading_icon" src={craps_loading_icon} />
															<p className="color_yellow">Loading Craps</p>
														</>
													);
												default: 
													return (
														<>
															<span className="color_yellow">Loading...</span>
														</>
													);
											}					
										case "race":
											return(
												<>
													<img className="loading_icon" alt="loading_icon" src={race_loading_icon} />
													<p className="color_yellow">Loading Race</p>
												</>
											);
										case "keno":
											return(
												<>
													<img className="loading_icon" alt="loading_icon" src={keno_loading_icon} />
													<p className="color_yellow">Loading Keno</p>
												</>
											);
										default: 
												return (
													<>
														<span className="color_yellow">Loading...</span>
													</>
												);
									}	
								})()}
							</div>
						);
					}
				}
			})()}
		</>
	);
}

export default UserPage;