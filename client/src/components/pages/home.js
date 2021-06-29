import React from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom'

import Container from 'react-bootstrap/Container'

import '../css/style.css';
import HomePage from './homePage';
import Salon from './salon';
import SignInRecovery from './signIn_recovery';
import Not_found from './not_found';
import UserPage from './userPage';
import Donate from './money/donate';
import Language from './partials/language';

import socketIOClient from "socket.io-client/dist/socket.io";
const socket = socketIOClient("/");

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		  var c = ca[i];
		  while (c.charAt(0) === ' ') {
			c = c.substring(1);
		  }
		  if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		  }
	}
	return "";
}

function Home(props) {
	var lang = getCookie("casino_lang");		
	if(lang === ''){
		lang = "eng";
	} 
	return (
		<>	
		<div className="full-height">
			<div className="full-height-content">
				<Container>				
						<BrowserRouter>					
							<Switch>			
								<Route path="/table/:name">
									<UserPage lang={lang} socket={socket}></UserPage>
								</Route>
								<Route path="/salon">
									<Salon lang={lang} socket={socket}></Salon>
								</Route>
								<Route path="/recovery">
									<SignInRecovery lang={lang} socket={socket}></SignInRecovery>
								</Route>							
								<Route exact path="/">
									<HomePage lang={lang} socket={socket}></HomePage>
								</Route>
								<Route path="*">
									<Not_found lang={lang}></Not_found>
								</Route>
							</Switch>			
						</BrowserRouter>
				</Container>				
			</div>			
		</div>
		<Language></Language>
		<Donate lang={lang} socket={socket}></Donate>
		</>
	);
}

export default Home;
