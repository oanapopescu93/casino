import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'; 

var socket;
var self; 

class SignUp extends Component {	
	constructor(props) {
		super(props);
		self = this;
		socket = props.socket;
		
		self.getCookie = self.getCookie.bind(self);	
		self.setCookie = self.setCookie.bind(self);			
		self.submit = self.submit.bind(self);	
		self.loader = self.loader.bind(self);	
		self.check_submit = self.check_submit.bind(self);	
		self.submit_form = self.submit_form.bind(self);	
		self.minor_check = self.minor_check.bind(self);	
	}	
  
	state = {
		user_minor: null,
	}; 

	componentDidMount() {		
		self.setState({ user_minor: self.getCookie('user_minor') });
	}

	getCookie = function (cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i < ca.length; i++) {
		  	var c = ca[i];
		  	while (c.charAt(0) === ' ') {
				c = c.substring(1);
		  	}
		  	if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
		  	}
		}
		return "";
	}

	setCookie = function(cname,cvalue,exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	submit = function(){
		if(self.check_submit()){
			$('#signup_pass_red').empty();
			self.loader().then(function(data) {
				if(data){
					$('#loader_container').hide(); 
					$('#home').show();
					alert('You are already registered.')
				} else {
					self.setCookie("casino_email", $('#signin_email').val(), 1);
					self.setCookie("casino_user", $('#signin_user').val(), 1);
					self.submit_form();
				}
			});
		} else {
			$('#signup_pass_red').append('<p><b>Invalid password</b></p><p>At least one upper case, one lower case, one digit, one special character and minimum eight in length</p>')
		}
	}
	
	loader = function(){
		return new Promise(function(resolve, reject){
			$('#loader_container').show();
			$('#home').hide();		
			socket.emit('signup_send', {email: $('#signup_email').val(), user: $('#signup_user').val(), pass: $('#signup_pass').val()});	
			socket.on('signup_read', function(data){
				resolve(data);
			});	
		});
	}
	
	check_submit = function(){
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

	submit_form = function(){
		return new Promise(function(resolve, reject){
			setTimeout(function(){
				$("#user_form").submit();
				resolve(true);
			}, 500);
		});
	}
	
	minor_check = function(check){
		$('#minor_container').remove();	
		if(check){
			self.setCookie("user_minor", true, 1);
		} else {		
			self.setCookie("user_minor", false, 1);
		}
	}

	render() {
		console.log('state', self.state, self.state.user_minor, typeof self.state.user_minor)		
		return (
			<div>
				{(() => {
					if (self.state.user_minor === "true") {
						//console.log('111', self.state.user_minor === "true")
						$('.user_form_container').css('height', 'auto');
						$('.login_link_container').remove();
						return (
							<div className="color_yellow"><p>You are too young to enter.</p></div>
						)
					} else if (self.state.user_minor === "false") {
						//console.log('222', self.state.user_minor === "false")
						return (
							<Form id="user_form" method="post" action="/registration">
								<Form.Control id="signup_email" className="input_yellow shadow_convex" type="text" name="email" placeholder="Email" />
								<Form.Control id="signup_user" className="input_yellow shadow_convex" type="text" name="user" placeholder="Username" />
								<Form.Control id="signup_pass" className="input_yellow shadow_convex" type="password" name="pass" placeholder="Password" />
								<h6 id="signup_pass_red" className="text_red"></h6>
								<Button className="button_yellow shadow_convex" onClick={() => self.submit()}>Sign Up</Button>
							</Form>
						)
					} else {
						//console.log('333', self.state.user_minor === "true", self.state.user_minor === "false")
						return (
							<div>
								<Form id="user_form" method="post" action="/registration">
										<Form.Control id="signup_email" className="input_yellow shadow_convex" type="text" name="email" placeholder="Email" />
										<Form.Control id="signup_user" className="input_yellow shadow_convex" type="text" name="user" placeholder="Username" />
										<Form.Control id="signup_pass" className="input_yellow shadow_convex" type="password" name="pass" placeholder="Password" />
										<h6 id="signup_pass_red" className="text_red"></h6>
										<Button className="button_yellow shadow_convex" onClick={() => self.submit()}>Sign Up</Button>
								</Form>
						
								<div id="minor_container" className="minor_container">
									<div className="minor_inside">
										<div className="minor_box">
											<h1>Age Verification</h1>
											<p>You must be 18 or over to access this website.</p>
											<p>Are you 18 or older?</p>
											<Button id="minor_check_false" className="minor_check minor_check_false" type="button" onClick={() => self.minor_check(false)}>YES</Button>
											<Button id="minor_check_true" className="minor_check minor_check_true" type="button" onClick={() => self.minor_check(true)}>NO</Button>
										</div>
									</div>
								</div>
							</div>
						)
					}
				})()}
			</div>
	  	)
	}
}

export default SignUp;