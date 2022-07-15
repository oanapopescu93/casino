import React, { useEffect, useState } from 'react';
import { useSelector} from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import $ from 'jquery'; 
import Game from './game';
import UserAccount from './userAccount';
import Support from './other_pages/support';
import Panel from './panel_control';
import { getCookie, showResults } from '../utils';

function Child(props) {
	let visible = useSelector(state => state.visibility);
	let user_id = props.user_id;
	let user = props.user;
	let money = props.money;
	let type = props.type;
	let user_table = props.user_table;
	let game = props.game;
	let socket = props.socket;
	let lang = props.lang;
	return (			
		<>
			<div className="userPage"> 
				<Row>
					<Col sm={12}>	
						{(() => {								
							switch (visible) {
								case "game":
									return (
										<Game lang={lang} info={props} socket={socket}></Game>
									)
								case "account":
									return (
										<UserAccount lang={lang} info={props} socket={socket}></UserAccount> 
									)	
								case "support":
									return (
										<Support lang={lang} info={props} socket={socket}></Support> 
									)
								default:
									return(
										<Game lang={lang} info={props} socket={socket}></Game>
									)						
							}
						})()}					
					</Col>
				</Row>	
			</div>
			<Panel lang={lang} user_id={user_id} game={game} user={user} money={money} user_table={user_table} type={type} socket={socket}></Panel>
		</>
	);
}

function UserPage(props){
	let socket = props.socket;
	let lang = props.lang;
	
	const [user, setUser] = useState('');
	const [userId, setUserId] = useState(-1);
	const [money, setMoney] = useState(0);
	const [username, setUsername] = useState('');
	const [url, setUrl] = useState('');
	const [game, setGame] = useState('');
	const [type, setType] = useState('');
	const [userTable, setUserTable] = useState('');

	useEffect(() => {
		userPageData().then(res => {
			if(res !== null){
				let table = res.user_table;
				let table_split = table.split('_');
				let table_user = table_split[0] + ' ' + table_split[1];
				let table_type = table_split[2];					
				let payload = {id: userId, user: user, user_table: table_user, user_type: table_type, time: new Date().getTime(), lang: lang}
				socket.emit('username', payload);
				socket.on('is_online', function(data) {
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
					if(data.user === "" || data.user === "indefined"){
						data.user = getCookie("casino_user")
					}
					setUser(data);
					setUserId(data.id);
					setMoney(data.money);
					setUsername(data.user);
					setUrl('/table/'+data.user_table);
					setGame(data.game);
					
					if(data.id === ""){
						let url_back = window.location.href.split('/table/');
						window.location.href = url_back[0];
					}			
					
					if(typeof data.user_table !== "undefined"){						
						let user_table_text = data.user_table.split('_');
						setType(user_table_text[2]);
						setUserTable(user_table_text[0] + ' ' + user_table_text[1]);
					}
				} 
				resolve(data);				
			});	
		});
	};		

	return userId !== -1 ? 
		<Child user_id={userId} game={game} user={username} money={money} profile_pic={user.profile_pic} user_table={userTable} type={type} lang={lang} socket={socket} url={url}></Child> : 
		<span className="color_yellow">Loading...</span>
}

export default UserPage;