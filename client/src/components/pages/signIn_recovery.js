import React from 'react';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'; 
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Sapou from './partials/sapou';

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
		if($('#loader_container')){
			$('#loader_container').show();
		}
		$('.full-height').hide();
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

function SignInRecovery(props) {
	var lang = props.lang;
	return (
        <Row>
			<Col sm={4} md={4} lg={4}></Col>
			<Col sm={4} md={4} lg={4} className="HomePage color_yellow">
				<div className="deco">
					<div className="HomePage_box">
						<Sapou page="recovery"></Sapou>	
                        <Row>
                            <Col sm={12}>
                                <Form id="user_form" method="post" action="/registration">
                                    <Form.Control id="signin_user" className="input_yellow shadow_convex" type="text" name="user" placeholder="Username" defaultValue=""/>
                                    <h6 id="signin_user_red" className="text_red">{lang === "ro" ? <span>Nu ai scris user-ul</span> : <span>You didn't write the username</span>}</h6>
                                    <Form.Control id="signin_pass" className="input_yellow shadow_convex" type="password" name="pass" placeholder="Password" defaultValue=""/>
                                    <h6 id="signin_pass_red" className="text_red">{lang === "ro" ? <span>Nu ai scris parola</span> : <span>You didn't write the password</span>}</h6>
                                    <Button className="button_yellow shadow_convex" onClick={submit}>{lang === "ro" ? <span>Logare</span> : <span>Sign In</span>}</Button>
                                </Form>
                            </Col>
                        </Row>
					</div>
				</div>
				<Col sm={4} md={4} lg={4}></Col>
			</Col>
		</Row>
	);
}

export default SignInRecovery;