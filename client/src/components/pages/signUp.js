import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'; 

var socket;

function submit(){
	if(check_submit()){
		$('#signup_pass_red').empty();
		loader().then(function(data) {
			submit_form();
		});
	} else {
		$('#signup_pass_red').append('<p><b>Invalid password</b></p><p>At least one upper case, one lower case, one digit, one special character and minimum eight in length</p>')
	}
}

function loader(){
	return new Promise(function(resolve, reject){
		$('#loader_container').show();
		$('#home').hide();
		socket.emit('signup_send', {email: $('#signup_user').val(), user: $('#signup_user').val(), pass: $('#signup_pass').val()});	
		socket.on('signup_read', function(data){
			resolve(data);
		});	
	});
}

function check_submit(){
	var signup_pass = $('#signup_pass').val();
	
	var regex_pass = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');		
		
	// At least one upper case English letter, (?=.*?[A-Z])
	// At least one lower case English letter, (?=.*?[a-z])
	// At least one digit, (?=.*?[0-9])
	// At least one special character, (?=.*?[#?!@$%^&*-])
	// Minimum eight in length .{8,}
	
	var pass_result = regex_pass.test(signup_pass);
	pass_result = true;
	
	//console.log('pass_result', pass_result);
	return pass_result;
}

function submit_form(){
	return new Promise(function(resolve, reject){
		setTimeout(function(){
			$("#user_form").submit();
			resolve(true);
		}, 500);
	});
}

function minor_check(check){	
	if(check){
		$('.minor_box').empty();
		$('.minor_box').append('<p>You are too young to enter.</p>');
	} else {
		$('#minor_container').remove();
	}
}

function SignUp(props) {

	socket = props.socket;

	return (
		<div>
		   <Form id="user_form" method="post" action="/registration">
				<Form.Control id="signup_email" className="input_yellow shadow_convex" type="text" name="email" placeholder="Email" />
				<Form.Control id="signup_user" className="input_yellow shadow_convex" type="text" name="user" placeholder="Username" />
				<Form.Control id="signup_pass" className="input_yellow shadow_convex" type="password" name="pass" placeholder="Password" />
				<h6 id="signup_pass_red" className="text_red"></h6>
				<Button className="button_yellow shadow_convex" onClick={submit}>Sign Up</Button>
			</Form>
	
			<div id="minor_container" className="minor_container">
				<div className="minor_inside">
					<div className="minor_box">
						<h1>Are you under 18 years old?</h1>
						<Button id="minor_check_true" className="minor_check minor_check_true" type="button" onClick={() => minor_check(true)}>YES</Button>
						<Button id="minor_check_false" className="minor_check minor_check_false" type="button" onClick={() => minor_check(false)}>NO</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SignUp;