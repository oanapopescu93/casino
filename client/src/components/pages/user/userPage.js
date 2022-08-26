import React, { useEffect, useState } from 'react';
import $ from 'jquery'; 
import { getCookie, isEmpty, showResults } from '../../utils';

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

	useEffect(() => {
		userPageData().then(res => {
			if(res !== null && !isEmpty(res.uuid)){	
				let payload = {id: res.id, uuid: res.uuid, user: res.user, user_table: res.table, user_type: res.type, time: new Date().getTime(), lang: lang}
				socket.emit('username', payload);
				if(res.uuid && typeof $('#chatmessages') !== "undefined"){
					if(lang === "ro"){
						$('#chatmessages').append('<p class="user_join">' + res.user + ' e online</p>');
					} else {
						$('#chatmessages').append('<p class="user_join">' + res.user + ' join the chat</p>');
					}
				}	
			} else {
				if(lang === "ro"){
					showResults("Eroare", "Eroare, ceva s-a intamplat.");
				} else {
					showResults("Error", "Error, something went wrong.");
				}	
			}							
		}).catch(err => console.log('userPageData--> ', err));  
	}, []);  

	function userPageData(){
		return new Promise(function(resolve, reject){	
			let table = choice;
			if(choice === "game"){
				let table_array = window.location.href.split('table/')
				table = table_array[1];	
			}		
			let casino_id = parseInt(getCookie("casino_id"));
			let casino_uuid = getCookie("casino_uuid");
			if(!isEmpty(casino_uuid)){
				socket.emit('user_page_send', [table, casino_id, casino_uuid]);
				socket.on('user_page_read', function(data){
					if(data !== null){
						if(choice === "game"){
							let table_split = data.user_table.split('_');
							data.table = table_split[0] + ' ' + table_split[1];
							data.type = table_split[2];	
						}			
						setData(data);
						resolve(data);	
					} else {
						resolve({id: casino_id, uuid: casino_uuid});	
					}		
				});	
			} else {
				resolve({id: casino_id, uuid: casino_uuid});	
			}
		});
	};		

	return data ? <UserChoice choice={choice} data={data} lang={lang} socket={socket}></UserChoice> : 
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
}

export default UserPage;