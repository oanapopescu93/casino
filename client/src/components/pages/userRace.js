import React, { useEffect, useState } from 'react';
import { useSelector} from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import $ from 'jquery'; 
import Race from './games/race';
import UserAccount from './account/userAccount';
import Support from './other_pages/support';
import Panel from './panel_control';
import { getCookie, showResults } from '../utils';
import { useDispatch } from 'react-redux'

function Child(props) {
	let visible = useSelector(state => state.visibility);
	let socket = props.socket;
	let lang = props.lang;
    let race = props.race;
	let data = props.data;
    let dispatch = useDispatch();
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
							if(data.id === -1){
								return (
									<span className="color_yellow">No user</span>
								)
							} else {
								data.url = "/table/"+data.user_table;	
								console.log(visible)
								switch (visible) {
									case "game":
										return (
											<>
												<Race open_race={race} lang={lang} socket={socket} info={data} dispatch={dispatch}></Race>
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
												<Race open_race={race} lang={lang} socket={socket} info={data} dispatch={dispatch}></Race>
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
    let race = props.race;
	const [data, setData] = useState(null);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		userPageData().then(res => {
			if(res !== null){
				let table = res.user_table;
				let table_split = table.split('_');
				let table_user = table_split[0] + ' ' + table_split[1];
				let table_type = table_split[2];					
				let payload = {id: res.id, user: res.user, user_table: table_user, user_type: table_type, time: new Date().getTime(), lang: lang}
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
			let casino_id = parseInt(getCookie("casino_id"));
			let casino_user = getCookie("casino_user");
			socket.emit('user_page_send', ["race", casino_id, casino_user]);
			socket.on('user_page_read', function(data){
				if(data !== null){
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

	return loaded ? <Child data={data} lang={lang} socket={socket} race={race}></Child> : <span className="color_yellow">Loading...</span>
}

export default UserRace;