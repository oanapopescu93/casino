import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import $ from 'jquery'
import SignIn from './sign/signIn'
import SignUp from './sign/signUp'
import Splash from './splash_screen'
import Sapou from './partials/sapou'
import { getCookie} from '../utils'
import { game_page } from '../actions/actions'
import Salon from './salon/salon'

function HomePage(props){
	let lang = props.lang
	let socket = props.socket
	const [visible, setVisible] = useState(true)
	const [splash, setSplash] = useState(true)
	const [isSalon, setIsSalon] = useState(false)
	const [linkLogin, setLinkLogin] = useState('active')
	const [linkSign, setLinkSign] = useState('')
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(game_page('home'))
		checkCookie()
	}, [])

	function randomIntFromInterval(min, max) { // min and max included 
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	function checkCookie(){
		let uuid = getCookie("casino_uuid")
		if(uuid === ""){
			splash_screen()
		} else {
			setSplash(false)
			setIsSalon(true)
		}
	}
	
	function casino_log(link){
		$('.sign_errors').hide()
		$('.sign_errors').empty()	
		if(link === "sign_in"){			
			setVisible(true)
			setLinkLogin('active')
			setLinkSign('')
		} else if(link === "sign_up"){
			setVisible(false)
			setLinkLogin('')
			setLinkSign('active')
		}
	}

	function splash_screen(){	
		setTimeout(function(){
			progress_move(100, 1000)
		}, 500)
	}	

	function progress_move(progress_frame, progress_timeout){	
		if(typeof $('#myBar') != "undefined"){
			let width = 0
			let id = setInterval(frame, progress_frame)
			function frame() {
				let random = randomIntFromInterval(1, 20)	
				width = width + random
				if (width >= 100){
					$('#myBar').width("100%")
					$('#myBar_text_container').width("100%")
					$('#myBar_text').text("100%")
					clearInterval(id)
					setTimeout(function(){
						setSplash(false)
					}, progress_timeout)
				} else {
					$('#myBar').width( width + "%")
					$('#myBar_text_container').width( width + "%")	
					$('#myBar_text').text( width + "%")	
				}
			}
		}
	}

	function submit(){
		setIsSalon(true)
	}

	function handleBack(){
		setIsSalon(false)
	}
	
	return (
		<>
			{ 
				splash ? <Splash></Splash>  : 
				<>
					{
						isSalon ? <Salon lang={lang} socket={socket} back={handleBack} donationInfo={props.donationInfo}></Salon> : 
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
																<div id="link_login" className={"login_link " + linkLogin} onClick={()=>casino_log("sign_in")}>
																	{lang === "ro" ? <h4>Logare</h4> : <h4>Sign In</h4>}
																</div>	
																<div id="link_sign" className={"login_link " + linkSign} onClick={()=>casino_log("sign_up")}>
																	{lang === "ro" ? <h4>Inregistrare</h4> : <h4>Sign Up</h4>}
																</div>	
															</div>
														</Col>
													</Row>
													<Row>
														<Col sm={12} className="user_form_container">
															{ visible ? <SignIn submit={submit} lang={lang} socket={socket}></SignIn> : 
															<SignUp submit={submit} lang={lang} socket={socket}></SignUp> }
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
			}	
		</>
	)
}

export default HomePage