import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import SalonGames from './games/salon_games'
import Sapou from './partials/sapou';

import About from './other_pages/about';
import Support from './other_pages/support';
import Terms from './other_pages/terms';
import Privacy from './other_pages/privacy';
import Questions from './other_pages/questions';
import Career from './other_pages/career_empty';

import { getCookie, setCookie, showResults, isEmpty } from '../utils';
import UserRace from './user/userRace';
import { game_load, game_page } from '../actions/actions';
import UserKeno from './user/userKeno';

function Child(props){
	let visible = useSelector(state => state.visibility);
	return(
		<>	
			{(() => {
				if(!props){
					return (
						<>
							{props.lang === "ro" ? <span className="color_yellow">Ceva s-a intamplat</span> : <span className="color_yellow">Something went wrong</span>}
						</>
					)
				} else {
					if(isEmpty(props.user_uuid)){
						return (
							<>
								{props.lang === "ro" ? <span className="color_yellow">Nu exista utilizator</span> : <span className="color_yellow">No user</span>}
							</>
						)
					} else {
						switch (visible) {
							case "game":
								return (
									<>
										<Sapou lang={props.lang} page="salon"></Sapou>
										<SalonGames info={props}></SalonGames>
									</>
								)
							case "about":
								return (
									<>
										<Sapou lang={props.lang} page={visible}></Sapou>
										<About info={props}></About>
									</>
								)	
							case "support":
								return (
									<>
										<Sapou lang={props.lang} page={visible}></Sapou>
										<Support info={props}></Support>
									</>
								)
							case "terms":
								return (
									<>
										<Sapou lang={props.lang} page={visible}></Sapou>
										<Terms info={props}></Terms>
									</>
								)
							case "privacy":
								return (
									<>
										<Sapou lang={props.lang} page={visible}></Sapou>
										<Privacy info={props}></Privacy>
									</>
								)
							case "questions":
								return (
									<>
										<Sapou lang={props.lang} page={visible}></Sapou>
										<Questions info={props}></Questions>
									</>
								)
							case "career":
								return (
									<>
										<Sapou lang={props.lang} page={visible}></Sapou>
										<Career info={props}></Career>
									</>
								)
							default:
								return(
									<>
										<Sapou lang={props.lang} page="salon"></Sapou>
										<SalonGames info={props}></SalonGames>
									</>						
								)						
						}
					}
				}
			})()}					
		</>		
	);
}

function Salon(props){	
	let dispatch = useDispatch();
	let socket = props.socket;
	let lang = props.lang;	
	
	const [change, setChange] = useState('games'); //games, race, keno
	const [empty, setEmpty] = useState(false);
	const [user, seUser] = useState("");
	const [id, setId] = useState(-1);
	const [uuid, setUuid] = useState(-1);
	const [money, setMoney] = useState(0);
	const [loaded, setLoaded] = useState(false);
	const [open, setOpen] = useState('');
	const [casinoGames, setCasinoGames] = useState('');

	let casino_games = {
		roulette_tables: [], 
		blackjack_tables: [],
		slots_tables: [],
		craps_tables: []
	}
	let casino_games_title = Object.getOwnPropertyNames(casino_games);

	useEffect(() => {
		dispatch(game_page("salon"));
		dispatch(game_load(true));
		salonData().then(res => {		
			if(res){
				if(user === ''){
					seUser(res.user);
				}
				for(let i in res.server_tables){
					switch (res.server_tables[i].table_name) {
						case "roulette":
							casino_games.roulette_tables.push(res.server_tables[i]);
							break;
						case "blackjack":
							casino_games.blackjack_tables.push(res.server_tables[i]);
							break;
						case "slots":
							casino_games.slots_tables.push(res.server_tables[i]);
							break;
						case "craps":
							casino_games.craps_tables.push(res.server_tables[i]);
							break;	
						default:
							break;						
						}
				}
				
				let empty = 0;
				for(let j in casino_games_title){
					if(casino_games[casino_games_title[j]].length === 0){
						empty++;
					}
				}

				if(res.first_enter_salon){
					if(lang === "ro"){
						showResults('Cadou de bun-venit', 'Ai 100 de morcovi cadou de bun-venit.', 300);
					} else {
						showResults('Welcome gift', 'First time players get 100 carrots!', 300);
					}						
				}

				if(empty === casino_games_title.length){
					setEmpty(true);
				} else {
					setCasinoGames(casino_games)
					setMoney(res.money);						
				}
			} else {
				setCookie("casino_user", '');
				seUser('');
			}
			setLoaded(true);
			dispatch(game_load(false));
			setOpen("open");
		}).catch(err => console.log(err));	
	}, []); 
	
	function salonData(){
		return new Promise(function(resolve, reject){
			let casino_id = getCookie("casino_id");
			let casino_uuid = getCookie("casino_uuid");
			let casino_user = getCookie("casino_user");
			setId(parseInt(casino_id));
			setUuid(casino_uuid);
			seUser(casino_user);
			setTimeout(function(){
				socket.emit('salon_send', [parseInt(casino_id), casino_uuid]);	
				socket.on('salon_read', function(data){
					resolve(data);	
				});
			}, 1000);
		});
	};

	function handleBack(){
		setCookie("casino_id", '');
		setCookie("casino_uuid", '');
		setCookie("casino_user", '');
		setCookie("casino_email", '');
		let url = window.location.href;
		url = url.split('/salon');
		window.location.href = url[0];
	}

	function handleChange(type){
		setChange(type);
	}
		
	return (
		<>
			{empty ? (
				<div className="color_yellow">
					{lang === "ro" ? <span>Nu exista mese</span> : <span>No tables</span>}
				</div>
			) : (
				<Row>						
					{isEmpty(uuid) === '' &&  loaded ? (
						<div className="table_container color_yellow">
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
					) : (
						<>
							<div className={"salon_button_container "+open}>
								<div className="salon_button_box">
									<div id="salon_buton_games" className="salon_button shadow_convex" onClick={()=>{handleChange('games')}}>
										{lang === "ro" ? <span><i className="fa fa-smile-o"></i><span className="salon_button_text">Jocuri</span></span> : <span><i className="fa fa-smile-o"></i><span className="salon_button_text">Games</span></span>}											
									</div>            
									<div id="salon_buton_race" className="salon_button shadow_convex" onClick={()=>{handleChange('race')}}>
										{lang === "ro" ? <span><i className="fa fa-flag-checkered"></i><span className="salon_button_text">Curse</span></span> : <span><i className="fa fa-flag-checkered"></i><span className="salon_button_text">Race</span></span>}	
									</div>
									<div id="salon_buton_keno" className="salon_button shadow_convex" onClick={()=>{handleChange('keno')}}>
										<span><i className="fa fa-ticket "></i><span className="salon_button_text">Keno</span></span>	
									</div>
								</div>
							</div>
							{loaded ? <Col sm={12} className="salon_page color_yellow">	
								{(() => {
									switch(change){
										case "game":
											return <Child lang={lang} dispatch={dispatch} casino_games_title={casino_games_title} socket={socket} user_id={id} user_uuid={uuid} user={user} casino_games={casinoGames}></Child>
										case "race":
											return <UserRace lang={lang} user_id={id}  user_uuid={uuid} user={user} money={money} user_table={"Rabbit Race"} socket={socket}></UserRace>
										case "keno":
											return <UserKeno lang={lang} dispatch={dispatch} casino_games_title={casino_games_title} socket={socket} user_id={id}  user_uuid={uuid} user={user} casino_games={casinoGames}></UserKeno>
										default: 
											return <Child lang={lang} dispatch={dispatch} casino_games_title={casino_games_title} socket={socket} user_id={id}  user_uuid={uuid} user={user} casino_games={casinoGames}></Child>
									}	
								})()}
							</Col> : null}
						</>																
					)}			
				</Row>
			)}
		</>
	);
}

export default Salon;