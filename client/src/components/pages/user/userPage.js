import React, { useEffect, useState } from 'react';
import { useSelector} from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import $ from 'jquery'; 
import Game from '../games/game';
import UserAccount from '../account/userAccount';
import Support from '../other_pages/support';
import Panel from '../panel/panel_control';
import { getCookie, isEmpty, showResults } from '../../utils';
import roulette_loading_icon from '../../img/icons_other/icons/yellow/roulette.png'
import blackjack_loading_icon from '../../img/icons_other/icons/yellow/blackjack.png'
import slots_loading_icon from '../../img/icons_other/icons/yellow/slots.png'
import craps_loading_icon from '../../img/icons_other/icons/yellow/craps.png'

function Child(props) {	
	let visible = useSelector(state => state.visibility);
	let socket = props.socket;
	let lang = props.lang;
	let data = props.data;
	return (
		<div className="userPage"> 
			<Row>
				<Col sm={12}>	
					{(() => {
						if(!data){
							return (
								<>
									{lang === "ro" ? <span className="color_yellow">Ceva s-a intamplat</span> : <span className="color_yellow">Something went wrong</span>}
								</>
							)
						} else {
							if(isEmpty(data.uuid)){
								return (
									<>
										{lang === "ro" ? <span className="color_yellow">Nu exista utilizator</span> : <span className="color_yellow">No user</span>}
									</>
								)
							} else {
								data.url = "/table/"+data.user_table;	
								switch (visible) {
									case "game":
										return (
											<>
												<Game lang={lang} info={data} socket={socket}></Game>
												<Panel lang={lang} info={data} socket={socket}></Panel>
											</>
										)
									case "account":
										return (
											<>
												<UserAccount lang={lang} info={data} socket={socket}></UserAccount> 
												<Panel lang={lang} info={data} socket={socket}></Panel>
											</>												
										)	
									case "support":
										return (
											<>
												<Support lang={lang} info={data} socket={socket}></Support> 
												<Panel lang={lang} info={data} socket={socket}></Panel>
											</>
										)
									default:
										return(
											<>
												<Game lang={lang} info={data} socket={socket}></Game>
												<Panel lang={lang} info={data} socket={socket}></Panel>
											</>
										)						
								}
							}								
						}
					})()}					
				</Col>
			</Row>
		</div>
	);
}

function UserPage(props){	
	let socket = props.socket;
	let lang = props.lang;
	const [data, setData] = useState(null);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		userPageData().then(res => {
			if(res !== null){		
				let payload = {id: res.id, uuid: res.uuid, user: res.user, user_table: res.table, user_type: res.type, time: new Date().getTime(), lang: lang}
				socket.emit('username', payload);
				socket.on('is_online', function(user) {
					setLoaded(true);
					if(user && typeof $('#chatmessages') !== "undefined"){
						if(lang === "ro"){
							$('#chatmessages').append('<p class="user_join">' + user + ' e online</p>');
						} else {
							$('#chatmessages').append('<p class="user_join">' + user + ' join the chat</p>');
						}
					}
				});	
			} else {
				if(lang === "ro"){
					showResults("Eroare", "Ups, ceva s-a intamplat.");
				} else {
					showResults("Error", "Ups, something went wrong.");
				}	
			}							
		}).catch(err => console.log('userPageData--> ', err));  
	}, [props]);  

	function userPageData(){
		return new Promise(function(resolve, reject){			
			let table = window.location.href.split('table/')			
			let casino_id = parseInt(getCookie("casino_id"));
			let casino_uuid = getCookie("casino_uuid");
			let casino_user = getCookie("casino_user");
			socket.emit('user_page_send', [table[1], casino_id, casino_uuid, casino_user]);
			socket.on('user_page_read', function(data){
				if(data !== null){
					let table_split = data.user_table.split('_');
					data.table = table_split[0] + ' ' + table_split[1];
					data.type = table_split[2];					
					setData(data);
					if(data.user === "" || data.user === "indefined"){
						data.user = getCookie("casino_user")
					}					
					if(data.id === ""){
						let url_back = window.location.href.split('/table/');
						window.location.href = url_back[0];
					}
				} 
				resolve(data);				
			});	
		});
	};		

	return loaded ? <Child data={data} lang={lang} socket={socket}></Child> : 
		<div style={{'textAlign': 'center'}}>
			{(() => {
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
			})()}
		</div>
}

export default UserPage;