import React from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom'

import Container from 'react-bootstrap/Container'

import '../css/style.css';
import HomePage from './homePage';
import Salon from './salon';
import SignInRecovery from './signIn_recovery';
import Not_found from './not_found';
import UserPage from './userPage';
import Footer from './footer';

import socketIOClient from "socket.io-client/dist/socket.io";
const socket = socketIOClient("/");

function Home(props) {
	return (	
		<div id="home" className="full-height">
			<div className="full-height-content">
				<Container>				
						<BrowserRouter>					
							<Switch>			
								<Route exact path="/table/:name">
									<UserPage socket={socket}></UserPage>
								</Route>
								<Route exact path="/salon">
									<Salon socket={socket}></Salon>
								</Route>
								<Route exact path="/recovery">
									<SignInRecovery></SignInRecovery>
								</Route>								
								<Route exact path="/">
									<HomePage></HomePage>
								</Route>
								<Route path="*">
									<Not_found></Not_found>
								</Route>
							</Switch>			
						</BrowserRouter>
				</Container>
				<Footer></Footer>
			</div>			
		</div>
	);
}

export default Home;
