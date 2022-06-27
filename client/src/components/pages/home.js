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

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lang: getCookie("casino_lang"),
			donation_show: false,
			donation_info: null,
			cookies:false,
			page: props.page,
		};
		this.lang_change = this.lang_change.bind(this);	
		this.my_donation = this.my_donation.bind(this);
		this.casino_cookies = this.casino_cookies.bind(this);
	}

	componentDidMount(){
		let casino_cookies = getCookie("casino_cookies");  
		if(casino_cookies !== ""){
			this.setState({ cookies: true });
		}
		if(this.state.lang === ''){
			this.setState({ lang: 'eng' });
		}

		setInterval(function () {		  
			socket.emit('heartbeat', { data: "ping" });
		}, 15000)
    }

	lang_change(text){
		this.setState({ lang: text });
	}

	my_donation(donations){
		this.setState({ donation_show: true});
		this.setState({ donation_info: donations});
	}
	
	back(){
		this.setState({ donation_show: false});
	}

	casino_cookies = function(){
		setCookie("casino_cookies", true, 30);
		this.setState({ cookies: true });
	}

	render() {
		let page = this.props.page;
		return (
			<>	
				<div className="full-height" id={page}>
					<div className="full-height-content">
						{ 
							this.state.donation_show ? <Page back={this.back} info={this.state.donation_info} lang={this.state.lang} socket={socket}></Page> : 
							<Container>				
								<BrowserRouter>					
									<Switch>			
										<Route path="/table/:name">
											<UserPage lang={this.state.lang} socket={socket} dispatch={this.props.dispatch}></UserPage>
										</Route>
										<Route path="/salon">
											<Salon lang={this.state.lang} socket={socket} page={page} dispatch={this.props.dispatch}></Salon>
										</Route>
										<Route path="/recovery">
											<SignInRecovery lang={this.state.lang} socket={socket} dispatch={this.props.dispatch}></SignInRecovery>
										</Route>							
										<Route exact path="/">
											<HomePage lang={this.state.lang} socket={socket} dispatch={this.props.dispatch}></HomePage>
										</Route>
										<Route path="*">
											<NotFound lang={this.state.lang} dispatch={this.props.dispatch}></NotFound>
										</Route>
									</Switch>			
								</BrowserRouter>
							</Container>
						}									
					</div>			
				</div>
				{!this.state.cookies ? <Cookies casino_cookies={this.casino_cookies} lang={this.state.lang}></Cookies>  : null}
				<Language lang_change={this.lang_change}></Language>
				<Donate my_donation={this.my_donation} info={this.state.donation_info} socket={socket}></Donate>
				<Footer lang={this.state.lang} socket={socket}></Footer>
			</>
		);
	}
}

export default Home;
