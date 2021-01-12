import React, { useState }from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'; 
import Modal from 'react-bootstrap/Modal'

// import floorplanData from "./floor_plan/floorplan-data";
// import Floorplan from "./floor_plan/Floorplan";

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

function submit_recovery(){
	if($('#signin_email').val() !== "" && check_submit()){
		$("#recovery_form").submit();
	} else {
		if($('#signin_email').val() === ""){
			$('#signin_email_red').show();
			$('#signin_email_red').text("Please provide an email address")
		} else if(!check_submit()){
			$('#signin_email_red').show();
			$('#signin_email_red').text("Please provide a valid email")
		} else {
			$('#signin_email_red').hide();
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
		}, 500);
	});
}

function check_submit(){
	var email = $('#signin_email').val();
	
	var regex_pass = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    var pass_result = regex_pass.test(email);
	
	//console.log('pass_result', email, regex_pass, pass_result);
	return pass_result;
}

function SignIn(props) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
  	const handleShow = () => setShow(true);

	return (
		<div>
			<Form id="user_form" method="post" action="/registration">
				<Form.Control id="signin_user" className="input_yellow shadow_convex" type="text" name="user" placeholder="Username" defaultValue=""/>
				<h6 id="signin_user_red" className="text_red">You didn't write the username</h6>
				<Form.Control id="signin_pass" className="input_yellow shadow_convex" type="password" name="pass" placeholder="Password" defaultValue=""/>
				<h6 id="signin_pass_red" className="text_red">You didn't write the password</h6>
				<Button className="button_yellow shadow_convex" onClick={submit}>Sign In</Button>
				<div className="login_link_container">
					<div onClick={handleShow} id="link_forget"><h6>Forgot Username/Password?</h6></div>	
				</div>
			</Form>

			<Modal className="casino_modal" id="casino_modal" show={show} onHide={handleClose} size="sm">
				<Modal.Header closeButton>
					<Modal.Title>Forgot Username/Password?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>If you forgot your username or password you can reset it here</p>
					<Form id="recovery_form" method="post" action="/recovery">						
						<Form.Control id="signin_email" className="input_yellow" type="text" name="email" placeholder="Email" />
						<h6 id="signin_email_red" className="text_red"> </h6>
						<Button className="minor_check" onClick={submit_recovery}>Recover</Button>							
					</Form>
				</Modal.Body>				
			</Modal>

		{/* <svg viewBox="-1000 -1000 14000 11000" shape-rendering="geometricPrecision">
        	<Floorplan data={floorplanData}></Floorplan>
		</svg> */}
		</div>		
	);
}

export default SignIn;