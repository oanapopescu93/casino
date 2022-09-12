import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import SalonGames from './salon_games'
import Sapou from '../partials/sapou';

import About from '../other_pages/about';
import Support from '../other_pages/support';
import Terms from '../other_pages/terms';
import Privacy from '../other_pages/privacy';
import Questions from '../other_pages/questions';
import Career from '../other_pages/career_empty';

import { getCookie, setCookie, showResults, isEmpty, bigText } from '../../utils';
import { game_load, game_page } from '../../actions/actions';
import UserPage from '../user/userPage';

import giftPic from '../../img/chest/chest.gif';

function Child(props){
	let visible = useSelector(state => state.visibility);
	return(
		<>	
			{(() => {
				if(!props.info){
					return (
						<>
							{props.lang === "ro" ? <span className="color_yellow">Ceva s-a intamplat</span> : <span className="color_yellow">Something went wrong</span>}
						</>
					)
				} else {
					if(isEmpty(props.info.uuid)){
						return (
							<>
								{props.lang === "ro" ? <span className="color_yellow">Nu exista utilizator</span> : <span className="color_yellow">No user</span>}
							</>
						)
					} else {
						let data = props.info;
						data.lang = props.lang;
						data.socket = props.socket;
						data.casino_games_title = props.casino_games_title;
						data.casino_games = props.casino_games;
						switch (visible) {
							case "game":
								return (
									<>
										<Sapou lang={props.lang} page="salon"></Sapou>
										<SalonGames info={data}></SalonGames>
									</>
								)
							case "about":
								return (
									<>
										<Sapou lang={props.lang} page={visible}></Sapou>
										<About info={data}></About>
									</>
								)	
							case "support":
								return (
									<>
										<Sapou lang={props.lang} page={visible}></Sapou>
										<Support info={data}></Support>
									</>
								)
							case "terms":
								return (
									<>
										<Sapou lang={props.lang} page={visible}></Sapou>
										<Terms info={data}></Terms>
									</>
								)
							case "privacy":
								return (
									<>
										<Sapou lang={props.lang} page={visible}></Sapou>
										<Privacy info={data}></Privacy>
									</>
								)
							case "questions":
								return (
									<>
										<Sapou lang={props.lang} page={visible}></Sapou>
										<Questions info={data}></Questions>
									</>
								)
							case "career":
								return (
									<>
										<Sapou lang={props.lang} page={visible}></Sapou>
										<Career info={data}></Career>
									</>
								)
							default:
								return(
									<>
										<Sapou lang={props.lang} page="salon"></Sapou>
										<SalonGames info={data}></SalonGames>
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
	const [id, setId] = useState(-1);
	const [uuid, setUuid] = useState(-1);
	const [loaded, setLoaded] = useState(false);
	const [open, setOpen] = useState('');
	const [casinoGames, setCasinoGames] = useState('');
	const [data, setData] = useState(null);

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
				setCasinoGames(casino_games)
				if(res.first_enter_salon){
					let gift_title = 'Welcome gift';
					let gift_text = 'First time players get 100 carrots!';
					if(lang === "ro"){
						gift_title = 'Cadou de bun-venit';
						gift_text = 'Ai 100 de morcovi cadou de bun-venit.';
					}

					let pay_table = `<div id="first_enter_salon" class="first_enter_salon">
						<img alt="gift_img" class="gift_img" src="` + giftPic + `"/>
						<p><b>` + gift_text + `</b></p>
					</div>`;
					let text = bigText("first_enter_salon", lang, pay_table); 
					showResults(gift_title, text, 600);					
				}				
			} 
			setLoaded(true);
			dispatch(game_load(false));
			setOpen("open");
		}).catch(err => console.log(err));	
	}, []); 
	
	function salonData(){
		return new Promise(function(resolve, reject){
			let casino_uuid = getCookie("casino_uuid");
			setUuid(casino_uuid);
			setTimeout(function(){
				socket.emit('salon_send', casino_uuid);	
				socket.on('salon_read', function(result){
					setData(result);
					resolve(result);	
				});
			}, 500);
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
			{ loaded ? (
				<Row>
					{isEmpty(uuid) ? (
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
							<Col sm={12} className="salon_page color_yellow">	
								{(() => {
									switch(change){
										case "game":
											return <Child info={data} lang={lang} socket={socket} casino_games_title={casino_games_title} casino_games={casinoGames}></Child>
										case "race":
											return <UserPage choice="race" info={data} lang={lang} socket={socket} user_id={id} user_uuid={uuid} user_table={"Rabbit Race"}></UserPage>
										case "keno":
											return <UserPage choice="keno" info={data} lang={lang} socket={socket} user_id={id} user_uuid={uuid} user_table={"Keno"}></UserPage>
										default: 
											return <Child info={data} lang={lang} socket={socket} casino_games_title={casino_games_title} casino_games={casinoGames}></Child>
									}	
								})()}
							</Col>
						</>
					)}
				</Row>
			) : null }
		</>
	);
}

export default Salon;