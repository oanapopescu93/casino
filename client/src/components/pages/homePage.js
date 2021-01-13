import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import $ from 'jquery'; 

import SignIn from './signIn';
import SignUp from './signUp';

import logo_icon from '../img/logo.png';

class HomePage extends React.Component {
	state = {
		visible: true,
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
	
	render(){
		return (
			<Row>
				<Col sm={4} md={4} lg={4}></Col>
				<Col sm={4} md={4} lg={4} className="HomePage color_yellow">
					<Row>
						<Col sm={12}>
							<img id="logo_icon" alt="logo_icon" src={logo_icon} />
							<h1>BunnyBet</h1>
						</Col>
					</Row>					
					<Row>
						<Col sm={12}>					
							<Row>
								<Col sm={12}>
									<div className="login_link_container shadow_convex">
										<div id="link_login" className="login_link active" onClick={()=>this.casino_log("sign_in")}><h4>Sign In</h4></div>	
										<div id="link_sign" className="login_link" onClick={()=>this.casino_log("sign_up")}><h4>Sign Up</h4></div>	
									</div>
								</Col>
							</Row>
							<Row>
								<Col sm={12} className="user_form_container">
									{ this.state.visible ? <SignIn></SignIn> : null }
									{ !this.state.visible ? <SignUp></SignUp> : null }
								</Col>
							</Row>
						</Col>
					</Row>					
				</Col>
				<Col sm={4} md={4} lg={4}></Col>
			</Row>
		);
	};
}

export default HomePage;