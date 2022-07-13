import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import $ from 'jquery';
import SignIn from './signIn';
import SignUp from './signUp';
import Splash from './splash_screen';
import Sapou from './partials/sapou';
import { getCookie} from '../utils';
import { game_page } from '../actions/actions';

function HomePage(props){
	let lang = props.lang;
	let socket = props.socket;
	const [visible, setVisible] = useState(true);	
	const [splash, setSplash] = useState(true);
	const dispatch = useDispatch();
	dispatch(game_page('home'));

	useEffect(() => {
		checkCookie();
	}, []); 

	function randomIntFromInterval(min, max) { // min and max included 
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function checkCookie(){
		let user = getCookie("casino_user");
		if(user === ""){
			splash_screen();
		} else {
			window.location.href = '/salon';
		}
	}
	
	function casino_log(link){
		$('.sign_errors').hide();
		$('.sign_errors').empty();	
		if(link === "sign_in"){			
			setVisible(true);
			$('#link_login').addClass('active');
			$('#link_sign').removeClass('active');
		} else if(link === "sign_up"){
			setVisible(false);
			$('#link_login').removeClass('active');
			$('#link_sign').addClass('active');
		}
	}

	function splash_screen(){	
		setTimeout(function(){
			progress_move(100, 2000);
		}, 1000);
	}	

	function progress_move(progress_frame, progress_timeout){	
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
						setSplash(false);
					}, progress_timeout);
				} else {
					$('#myBar').width( width + "%");
					$('#myBar_text_container').width( width + "%");	
					$('#myBar_text').text( width + "%");	
				}
			}
		}
	}
	
	return (
		<>
			{ 
				splash ? <Splash></Splash>  : 
				<Row>
					<Col sm={2} md={4} lg={4}></Col>
					<Col sm={8} md={4} lg={4} className="color_yellow">
						<div className="HomePage">
							<div className="deco">
								<div className="HomePage_box">
									<Sapou lang={lang} page="home"></Sapou>													
									<Row>
										<Col sm={12}>					
											<Row>
												<Col sm={12}>
													<div className="login_link_container shadow_convex">
														<div id="link_login" className="login_link active" onClick={()=>casino_log("sign_in")}>
															{lang === "ro" ? <h4>Logare</h4> : <h4>Sign In</h4>}
														</div>	
														<div id="link_sign" className="login_link" onClick={()=>casino_log("sign_up")}>
															{lang === "ro" ? <h4>Inregistrare</h4> : <h4>Sign Up</h4>}
														</div>	
													</div>
												</Col>
											</Row>
											<Row>
												<Col sm={12} className="user_form_container">
													{ visible ? <SignIn lang={lang} socket={socket}></SignIn> : <SignUp lang={lang} socket={socket}></SignUp> }
												</Col>
											</Row>
										</Col>
									</Row>
								</div>
							</div>
						</div>
						<div className="sign_errors"></div>
					</Col>
					<Col sm={2} md={4} lg={4}></Col>
				</Row> 
			}			
		</>
	);
}

export default HomePage;