import React, { Component } from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom'

import Container from 'react-bootstrap/Container'

import '../css/style.css';
import HomePage from './homePage';
import Salon from './salon';
import SignInRecovery from './signIn_recovery';
import NotFound from './not_found';
import UserPage from './userPage';
import Donate from './money/donate';
import Language from './partials/language';
import Footer from './partials/footer';

import { getCookie } from '../utils';

import socketIOClient from "socket.io-client/dist/socket.io";
const socket = socketIOClient("/");

var self;
class Home extends Component {
	constructor(props) {
		super(props);
		self = this;
		self.state = {
			lang: getCookie("casino_lang"),
			contact: "",
		};
		self.lang_change = self.lang_change.bind(self);	
	}

	componentDidMount(){
		var id = parseInt(getCookie("casino_id"));
		if(id === "" || id === "indefined"){
			id = -1;
		}
		socket.emit('contact_send', ["contact", id]);
		socket.on('contact_read', function(data){
			self.setState({ contact: data.contact});
		});	    
    }

	lang_change(text){
		self.setState({ lang: text });
	}
	
	render() {
		if(self.state.lang === ''){
			self.setState({ lang: 'eng' });
		} 
		return (
		<>	
			<div className="full-height">
				<div className="full-height-content">
					<Container>				
							<BrowserRouter>					
								<Switch>			
									<Route path="/table/:name">
										<UserPage lang={self.state.lang} socket={socket}></UserPage>
									</Route>
									<Route path="/salon">
										<Salon lang={self.state.lang} socket={socket} contact={self.state.contact}></Salon>
									</Route>
									<Route path="/recovery">
										<SignInRecovery lang={self.state.lang} socket={socket}></SignInRecovery>
									</Route>							
									<Route exact path="/">
										<HomePage lang={self.state.lang} socket={socket}></HomePage>
									</Route>
									<Route path="*">
										<NotFound lang={self.state.lang}></NotFound>
									</Route>
								</Switch>			
							</BrowserRouter>
					</Container>				
				</div>			
			</div>
			<Language lang_change={self.lang_change}></Language>
			<Donate lang={self.state.lang} socket={socket}></Donate>
			<Footer lang={self.state.lang} socket={socket}></Footer>
		</>
		);
	}
}

export default Home;
