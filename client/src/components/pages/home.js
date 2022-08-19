import React, { useEffect, useState } from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Container from 'react-bootstrap/Container'

import '../css/style.css';
import HomePage from './homePage';
import Salon from './salon';
import SignInRecovery from './sign/signIn_recovery';
import NotFound from './other_pages/not_found';
import UserPage from './user/userPage';
import Donate from './money/donate';
import Page from './money/page';
import Language from './partials/language';
import Footer from './partials/footer';

import { getCookie, setCookie, showResults } from '../utils';

import socketIOClient from "socket.io-client/dist/socket.io";
import Cookies from './partials/cookies_modal';
import ShowResults from './partials/show_results';
const socket = socketIOClient("/");

function Home(props){
	let dispatch = useDispatch();
	const [cookies, setCookies] = useState(false);	
	const [lang, setLang] = useState(getCookie("casino_lang"));	
	const [donationShow, setDonationShow] = useState(false);
	const [donationInfo, setDonationInfo] = useState(null);
	let page = props.page;
	let show_loader = props.show;
	let open = "open";
    if(show_loader){
        open = "";
    }

	useEffect(() => {
		let casino_cookies = getCookie("casino_cookies"); 
		if(casino_cookies !== ""){
			setCookies(true);
		}
		if(lang === ''){
			setLang('eng');
		}
		setInterval(function () {		  
			socket.emit('heartbeat', { data: "ping" });
		}, 15000)
		socket.on('server_error', function (text) {
			showResults("Error", text)
			console.log('server_error ', text);
		}); 
	}); 

	function lang_change(text){
		setLang(text);
	}

	function my_donation(donations){
		setDonationShow(true);
		setDonationInfo(donations);
	}
	
	function back(){
		setDonationShow(false);
	}

	function casino_cookies(){
		setCookie("casino_cookies", true, 30);
		setCookies(true);
	}
	
	return (
		<>	
			<div className={"full-height "+open} id={page}>
				<div className="full-height-content">
					{ 
						donationShow ? <Page back={back} info={donationInfo} lang={lang} socket={socket}></Page> : 
						<Container>				
							<BrowserRouter>					
								<Switch>			
									<Route path="/table/:name">
										<UserPage lang={lang} socket={socket} dispatch={dispatch}></UserPage>
									</Route>
									<Route path="/salon">
										<Salon lang={lang} socket={socket}></Salon>
									</Route>
									<Route path="/recovery">
										<SignInRecovery lang={lang} socket={socket} dispatch={dispatch}></SignInRecovery>
									</Route>							
									<Route exact path="/">
										<HomePage lang={lang} socket={socket}></HomePage>
									</Route>
									<Route path="*">
										<NotFound lang={lang}></NotFound>
									</Route>
								</Switch>			
							</BrowserRouter>
						</Container>
					}									
				</div>			
			</div>
			{!cookies ? <Cookies casino_cookies={casino_cookies} lang={lang}></Cookies>  : null}
			<Language lang_change={lang_change}></Language>
			<Donate my_donation={my_donation} info={donationInfo} socket={socket}></Donate>
			<ShowResults lang={lang}></ShowResults>
			<Footer lang={lang} socket={socket}></Footer>
		</>
	);
}

export default Home;
