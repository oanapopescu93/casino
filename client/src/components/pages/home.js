import React from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom'

import Container from 'react-bootstrap/Container'

import '../css/style.css';
import HomePage from './homePage';
import Salon from './salon';
import SignInRecovery from './signIn_recovery';
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
								<Route path="/table">
									<UserPage socket={socket}></UserPage>
								</Route>
								<Route path="/salon">
									<Salon socket={socket}></Salon>
								</Route>
								<Route path="/recovery">
									<SignInRecovery></SignInRecovery>
								</Route>
								<Route path="/">
									<HomePage></HomePage>
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
