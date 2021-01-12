import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'; 
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import logo_icon from '../img/logo.png';

function submit(){
	if($('#signin_user').val() !== "" && $('#signin_pass').val() !== ""){
		loader().then(function(data) {
			submit_form();
		});
	} else {
		if($('#signin_user').val() === ""){
			$('#signin_user_red').show();
		} else {
			$('#signin_user_red').hide();
		}
		if($('#signin_pass').val() === ""){
			$('#signin_pass_red').show();
		} else {
			$('#signin_pass_red').hide();
		}
	}	
}

function loader(){
	return new Promise(function(resolve, reject){
		$('#loader_container').show(); 
		$('#home').hide();
		resolve(true);	
	});
}

function submit_form(){
	return new Promise(function(resolve, reject){
		setTimeout(function(){
			$("#user_form").submit();
			resolve(true);
		}, 1500);
	});
}

function SignIn(props) {
	return (
        <Row>
            <Col sm={12} className="HomePage color_yellow">
                <Row>
                    <Col sm={12}>
                        <img id="logo_icon" alt="logo_icon" src={logo_icon} />
                        <h1>BunnyBet</h1>
						<h2>Recovery</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} md={4} lg={4}></Col>
                    <Col sm={4} md={4} lg={4}>					
                        <Row>
                            <Col sm={12}>
                                <Form id="user_form" method="post" action="/registration">
                                    <Form.Control id="signin_user" className="input_yellow shadow_convex" type="text" name="user" placeholder="Username" defaultValue=""/>
                                    <h6 id="signin_user_red" className="text_red">You didn't write the username</h6>
                                    <Form.Control id="signin_pass" className="input_yellow shadow_convex" type="password" name="pass" placeholder="Password" defaultValue=""/>
                                    <h6 id="signin_pass_red" className="text_red">You didn't write the password</h6>
                                    <Button className="button_yellow shadow_convex" onClick={submit}>Sign In</Button>
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={4} md={4} lg={4}></Col>
                </Row>	
            </Col>
        </Row>
	);
}

export default SignIn;