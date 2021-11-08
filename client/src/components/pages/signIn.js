import React, { useState }from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'; 
import Modal from 'react-bootstrap/Modal'
import { setCookie, showResults } from '../utils';

var socket;
function submit(){
	if($('#signin_user').val() !== "" && $('#signin_pass').val() !== ""){
		loader().then(function(data) {
			if(data[0]){
				setCookie("casino_id", data[1].id, 1);
				setCookie("casino_user", $('#signin_user').val(), 1);
				submit_form();
			} else {
				$('#loader_container').hide(); 
				$('#home').show();
				showResults('You are not registered.');
			}
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
		socket.emit('signin_send', {user: $('#signin_user').val(), pass: $('#signin_pass').val()});	
		socket.on('signin_read', function(data){			
			resolve(data);
		});
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

	socket = props.socket;
	var lang = props.lang;

	$('.full-height').attr('id', 'home');

	return (
		<div>
			<Form id="user_form" method="post" action="/registration">
				<Form.Control id="signin_user" className="input_yellow shadow_convex" type="text" name="user" placeholder="Username" defaultValue=""/>
				<h6 id="signin_user_red" className="hidden_red text_red">{lang === "ro" ? <span>Nu ai scris user-ul</span> : <span>You didn't write the username</span>}</h6>
				<Form.Control id="signin_pass" autoComplete="off" className="input_yellow shadow_convex" type="password" name="pass" placeholder="Password" defaultValue=""/>
				<h6 id="signin_pass_red" className="hidden_red text_red">{lang === "ro" ? <span>Nu ai scris parola</span> : <span>You didn't write the password</span>}</h6>
				<Button className="button_yellow shadow_convex" onClick={submit}>{lang === "ro" ? <span>Logare</span> : <span>Sign In</span>}</Button>
				<div className="login_link_container">
					<div onClick={handleShow} id="link_forget">{lang === "ro" ? <span>Am uitat user/parola</span> : <span>Forgot Username/Password</span>}</div>	
				</div>
			</Form>

			<div className="show_results_container">
				<div className="show_results">
					<h1>{lang === "ro" ? <span>Alerta</span> : <span>Alert</span>}</h1>
					<p></p>
				</div>
			</div>

			<Modal className="casino_modal" id="casino_modal" show={show} onHide={handleClose} size="sm">
				<Modal.Header closeButton>
					<Modal.Title>
						{lang === "ro" ? <span>Am uitat user/parola</span> : <span>Forgot Username/Password</span>}						
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{lang === "ro" ? <p>Daca ai uitat user-ul sau parola, poti sa o resetezi aici</p> : 
						<p>If you forgot your username or password you can reset it here</p>}					
					<Form id="recovery_form" method="post" action="/recovery">						
						<Form.Control id="signin_email" className="input_yellow" type="text" name="email" placeholder="Email" />
						<h6 id="signin_email_red" className="text_red"> </h6>
						<Button className="minor_check" onClick={submit_recovery}>{lang === "ro" ? <span>Recupereaza</span> : <span>Recover</span>}</Button>							
					</Form>
				</Modal.Body>				
			</Modal>
		</div>		
	);
}

export default SignIn;