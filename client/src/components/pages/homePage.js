import React from 'react';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import $ from 'jquery'; 

import SignIn from './signIn';
import SignUp from './signUp';
import Splash from './splash_screen';
import Sapou from './partials/sapou';
import { getCookie, setCookie } from '../utils';

var self;
var socket;

function randomIntFromInterval(min, max) { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min);
}

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		self = this;
		socket = props.socket;
		self.state = {
			  visible: true,
			  splash: true,
			  cookies:false,
		};
		self.splash_screen = self.splash_screen.bind(self);
		self.progress_move = self.progress_move.bind(self);
		self.casino_log = self.casino_log.bind(self);
		self.casino_cookies = self.casino_cookies.bind(self);
		self.checkCookie = self.checkCookie.bind(self);
	}

	componentDidMount() {
		self.checkCookie();			
	}

	checkCookie = function(){
		var cookies = getCookie("casino_cookies");
		
		if(cookies !== ''){
			self.setState({ cookies: true });
		} 

		var user = getCookie("casino_user");
		if(user === ""){
			self.splash_screen();
		} else {
			window.location.href = '/salon';
		}
	}
	
	casino_log = function(link){	
		if(link === "sign_in"){			
			this.setState({ visible: true })
			$('#link_login').addClass('active');
			$('#link_sign').removeClass('active');
		} else if(link === "sign_up"){
			this.setState({ visible: false })
			$('#link_login').removeClass('active');
			$('#link_sign').addClass('active');
		}
	}	

	casino_cookies = function(){
		setCookie("casino_cookies", true, 30);
		self.setState({ cookies: true });
	}

	splash_screen = function(){	
		setTimeout(function(){
			self.progress_move(100, 2000);
		}, 2000);
	}	

	progress_move = function(progress_frame, progress_timeout){	
		if(typeof $('#myBar') != "undefined"){
			var width = 0;
			var id = setInterval(frame, progress_frame);
			function frame() {
				var random = randomIntFromInterval(1, 20)	
				width = width + random;
				if (width >= 100) {
					$('#myBar').width("100%");
					$('#myBar_text_container').width("100%");	
					$('#myBar_text').text("100%");
					clearInterval(id);
					setTimeout(function(){
						self.setState({ splash: false });
					}, progress_timeout);
				} else {
					$('#myBar').width( width + "%");
					$('#myBar_text_container').width( width + "%");	
					$('#myBar_text').text( width + "%");	
				}
			}
		}
	}
	
	render(){
		var lang = this.props.lang;
		return (
			<>
			{ 
				this.state.splash ? <Splash></Splash>  : 
				<Row>
					<Col sm={4} md={4} lg={4}></Col>
					<Col sm={4} md={4} lg={4} className="color_yellow">
						<div className="HomePage">
							<div className="deco">
								<div className="HomePage_box">
									<Sapou lang={lang} page="home"></Sapou>													
									<Row>
										<Col sm={12}>					
											<Row>
												<Col sm={12}>
													<div className="login_link_container shadow_convex">
														<div id="link_login" className="login_link active" onClick={()=>this.casino_log("sign_in")}>
															{lang === "ro" ? <h4>Logare</h4> : <h4>Sign In</h4>}
														</div>	
														<div id="link_sign" className="login_link" onClick={()=>this.casino_log("sign_up")}>
															{lang === "ro" ? <h4>Inregistrare</h4> : <h4>Sign Up</h4>}
														</div>	
													</div>
												</Col>
											</Row>
											<Row>
												<Col sm={12} className="user_form_container">
													{ this.state.visible ? <SignIn lang={lang} socket={socket}></SignIn> : <SignUp lang={lang} socket={socket}></SignUp> }
												</Col>
											</Row>
										</Col>
									</Row>
								</div>
							</div>
						</div>
					</Col>
					<Col sm={4} md={4} lg={4}></Col>					
					{
						!this.state.cookies ? 
						<div className="cookies_msg_container" id ="cookies_msg">
							<div className="cookies_msg">
								{(() => {
									switch (this.state.lang) {
										case "ro":
											return (
												<div className="cookies_text">
													<h4>Notificari de cookies</h4>
													<h6>
														Pentru a va oferi cele mai relevante informatii si pentru o performanta optima a sistemul,
														noi folosim cookies pentru a colecta informatii din activitatea dumneavoatra.
													</h6>
												</div>
											)
										case "eng":
										default:
											return(
												<div className="cookies_text">
													<h4>Cookies Notification</h4>
													<h6>
														In order to offer you the most relevant information and for optimal system performance,
														we use cookies that collect information from your game activity.
													</h6>
												</div>
											)						
									}
								})()}								
								<div className="confirm_cookies">
									<button type="button" id="cookies_btn_ok" onClick={()=>this.casino_cookies()}>OK</button>
								</div>
							</div>
						</div>  : null
					}
				</Row> 
			}			
			</>
		);
	};
}

export default HomePage;