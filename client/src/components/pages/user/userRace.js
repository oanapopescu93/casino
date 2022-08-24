import React, { useEffect, useState } from 'react';
import { useSelector} from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import $ from 'jquery'; 
import Race from '../games/race';
import UserAccount from '../account/userAccount';
import Support from '../other_pages/support';
import Panel from '../panel/panel_control';
import { getCookie, showResults } from '../../utils';
import { useDispatch } from 'react-redux'
import race_loading_icon from '../../img/icons_other/icons/yellow/race.png'

function Child(props) {
	let visible = useSelector(state => state.visibility);
	let socket = props.socket;
	let lang = props.lang;
	let data = props.data;
    let dispatch = useDispatch();
	console.log('userRace-child ', props)
	return (
		<div className="userRace"> 
			<Row>
				<Col sm={12}>	
					{(() => {
						if(!data){
							return (
								<span className="color_yellow">Loading...</span>
							)
						} else {
							if(data.uuid === -1){
								return (
									<span className="color_yellow">No user</span>
								)
							} else {
								data.url = "/table/"+data.user_table;
								switch (visible) {
									case "game":
										return (
											<>
												<Race lang={lang} socket={socket} info={data} dispatch={dispatch}></Race>
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
												<Race lang={lang} socket={socket} info={data} dispatch={dispatch}></Race>
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

function UserRace(props){
	let socket = props.socket;
	let lang = props.lang;
	const [data, setData] = useState(null);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		userPageData().then(res => {
			if(res !== null){	
				let payload = {id: res.id, uuid: res.uuid, user: res.user, user_table: 'salon', time: new Date().getTime(), lang: lang}
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
	}, []);  

	function userPageData(){
		return new Promise(function(resolve, reject){		
			let casino_id = parseInt(getCookie("casino_id"));
			let casino_uuid = getCookie("casino_uuid");
			let casino_user = getCookie("casino_user");
			socket.emit('user_page_send', ["race", casino_id, casino_uuid, casino_user]);
			socket.on('user_page_read', function(data){
				setData(data);	
				resolve(data);				
			});	
		});
	};		

	return loaded ? <Child data={data} lang={lang} socket={socket}></Child> : 
			<div>
				<img className="loading_icon" alt="loading_icon" src={race_loading_icon} />
				<p className="color_yellow">Loading</p>
			</div>
}

export default UserRace;