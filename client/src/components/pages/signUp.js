import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'; 

function submit(){
	if(check_submit()){
		loader().then(function(data) {
			submit_form();
		});
	}
}

function loader(){
	return new Promise(function(resolve, reject){
		$('#loader_container').show();
		$('#home').hide();
		resolve(true);	
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
	
	//console.log('pass_result', pass_result);
	return pass_result;
}

function submit_form(){
	return new Promise(function(resolve, reject){
		setTimeout(function(){
			$("#user_form").submit();
			resolve(true);
		}, 5000);
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

function SignIn(props) {
	return (
		<div>
		   <Form id="user_form" method="post" action="/members/submit">
				<Form.Control id="signup_email" className="input_yellow" type="text" name="email" placeholder="Email" />
				<Form.Control id="signup_user" className="input_yellow" type="text" name="user" placeholder="Username" />
				<Form.Control id="signup_pass" className="input_yellow" type="password" name="pass" placeholder="Password" />
				<Button className="button_yellow" onClick={submit}>Sign Up</Button>
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

export default SignIn;