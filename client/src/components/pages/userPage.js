import React, { useEffect, useState } from 'react';
import { useSelector} from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import $ from 'jquery'; 
import Game from './game';
import UserAccount from './account/userAccount';
import Support from './other_pages/support';
import Panel from './panel_control';
import { getCookie, showResults } from '../utils';
import roulette_loading_icon from '../img/icons_other/icons/yellow/roulette_yellow.png'
import blackjack_loading_icon from '../img/icons_other/icons/yellow/blackjack_yellow.png'
import slots_loading_icon from '../img/icons_other/icons/yellow/slots_yellow.png'
import craps_loading_icon from '../img/icons_other/icons/yellow/craps_yellow.png'

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
								<span className="color_yellow">Loading...</span>
							)
						} else {
							if(data.id === -1){
								return (
									<span className="color_yellow">No user</span>
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
				let payload = {id: res.id, user: res.user, user_table: res.table, user_type: res.type, time: new Date().getTime(), lang: lang}
				socket.emit('username', payload);
				socket.on('is_online', function(data) {
					setLoaded(true);
					if(typeof $('#chatmessages') !== "undefined"){
						$('#chatmessages').append(data);
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
	}, []);  

	function userPageData(){
		return new Promise(function(resolve, reject){			
			let table = window.location.href.split('table/')			
			let casino_id = parseInt(getCookie("casino_id"));
			let casino_user = getCookie("casino_user");
			socket.emit('user_page_send', [table[1], casino_id, casino_user]);
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
								<p className="color_yellow">Loading</p>
							</>
						);
					case "blackjack":
						return (
							<>
								<img className="loading_icon" alt="loading_icon" src={blackjack_loading_icon} />
								<p className="color_yellow">Loading</p>
							</>
						);
					case "slots":
						return (
							<>
								<img className="loading_icon" alt="loading_icon" src={slots_loading_icon} />
								<p className="color_yellow">Loading</p>
							</>
						);
					case "craps":
						return (
							<>
								<img className="loading_icon" alt="loading_icon" src={craps_loading_icon} />
								<p className="color_yellow">Loading</p>
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