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
import Donate from './money/donate'

import socketIOClient from "socket.io-client/dist/socket.io";
const socket = socketIOClient("/");

function Home(props) {
	return (
		<>	
		<div className="full-height">
			<div className="full-height-content">
				<Container>				
						<BrowserRouter>					
							<Switch>			
								<Route path="/table/:name">
									<UserPage socket={socket}></UserPage>
								</Route>
								<Route path="/salon">
									<Salon socket={socket}></Salon>
								</Route>
								<Route path="/recovery">
									<SignInRecovery socket={socket}></SignInRecovery>
								</Route>							
								<Route exact path="/">
									<HomePage socket={socket}></HomePage>
								</Route>
								<Route path="*">
									<Not_found></Not_found>
								</Route>
							</Switch>			
						</BrowserRouter>
				</Container>				
			</div>			
		</div>
		<Donate></Donate>
		</>
	);
}

export default Home;
