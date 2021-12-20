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
import Page from './money/page';
import Language from './partials/language';
import Footer from './partials/footer';

import { getCookie, setCookie } from '../utils';

import socketIOClient from "socket.io-client/dist/socket.io";
import Cookies from './partials/cookies_modal';
const socket = socketIOClient("/");

var self;
class Home extends Component {
	constructor(props) {
		super(props);
		self = this;
		self.state = {
			lang: getCookie("casino_lang"),
			contact: "",
			donation_show: false,
			donation_info: null,
			cookies:false,
		};
		self.lang_change = self.lang_change.bind(self);	
		self.my_donation = self.my_donation.bind(self);
	  	self.casino_cookies = self.casino_cookies.bind(self);
	}

	componentDidMount(){
		let id = parseInt(getCookie("casino_id"));
		if(id === "" || id === "indefined"){
			id = -1;
		}
		socket.emit('contact_send', ["contact", id]);
		socket.on('contact_read', function(data){
			self.setState({ contact: data.contact});
		});	 
		let casino_cookies = getCookie("casino_cookies");  
		if(casino_cookies !== ""){
			self.setState({ cookies: true });
		}
    }

	lang_change(text){
		self.setState({ lang: text });
	}

	my_donation(donations){
		self.setState({ donation_show: true});
		self.setState({ donation_info: donations});
	}
	
	back(){
		self.setState({ donation_show: false});
	}

	casino_cookies = function(){
		setCookie("casino_cookies", true, 30);
		self.setState({ cookies: true });
	}

	render() {
		if(self.state.lang === ''){
			self.setState({ lang: 'eng' });
		} 
		return (
			<>	
				<div className="full-height">
					<div className="full-height-content">
						{ 
							self.state.donation_show ? <Page back={self.back} info={self.state.donation_info} lang={self.state.lang} socket={socket}></Page> : 
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
						}									
					</div>			
				</div>
				{!self.state.cookies ? <Cookies casino_cookies={self.casino_cookies} lang={self.state.lang}></Cookies>  : null}
				<Language lang_change={self.lang_change}></Language>
				<Donate my_donation={self.my_donation} info={self.state.donation_info} socket={socket}></Donate>
				<Footer lang={self.state.lang} socket={socket}></Footer>
			</>
		);
	}
}

export default Home;
