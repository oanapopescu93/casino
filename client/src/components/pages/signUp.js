import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'; 
import { getCookie, setCookie, showResults } from '../utils';

var self; 
class SignUp extends Component {	
	constructor(props) {
		super(props);
		self = this;
		self.state = {
			socket: props.socket,
			lang: props.lang,
			user_minor: null,
			client_id: '',
	  	};				
		self.submit = self.submit.bind(self);	
		self.loader = self.loader.bind(self);	
		self.check_submit = self.check_submit.bind(self);	
		self.submit_form = self.submit_form.bind(self);	
		self.minor_check = self.minor_check.bind(self);	
	}

	componentDidMount() {
		self.state.socket.emit('client_id_send', '');
		self.state.socket.on('client_id_read', function(data){
			self.setState({ client_id: data });
		});	
		self.setState({ user_minor: getCookie('user_minor') });
	}

	submit = function(){
		$('#signup_email_red').empty();
		$('#signup_pass_red').empty();
		if(self.check_submit('email') && self.check_submit('pass')){
			self.loader().then(function(data) {
				if(data[0]){
					$('#loader_container').hide(); 
					$('#home').show();
					if(self.state.lang === "ro"){
						showResults('Esti deja inregistrat.');
					} else {
						showResults('You are already registered.');
					}					
				} else {
					setCookie("casino_email", $('#signup_email').val(), 1);
					setCookie("casino_user", $('#signup_user').val(), 1);
					self.submit_form();
				}
			});
		} else {
			if(!self.check_submit('email')){
				if(self.state.lang === "ro"){
					$('#signup_email_red').append('<p><b>Email invalid</b></p><p>exemplu@mail.com</p>')
				} else {
					$('#signup_email_red').append('<p><b>Invalid email</b></p><p>example@mail.com</p>')
				}	
			}	

			if(!self.check_submit('pass')){
				if(self.state.lang === "ro"){
					$('#signup_pass_red').append('<p><b>Parola invalida</b></p><p>Minim o litera mare, o litera mica, o cifra, un caracter special si lungimea totala minima de opt caractere</p>')
				} else {
					$('#signup_pass_red').append('<p><b>Invalid password</b></p><p>At least one upper case, one lower case, one digit, one special character and minimum eight in length</p>')
				}	
			}	
		}
	}
	
	loader = function(){
		return new Promise(function(resolve, reject){
			$('#loader_container').show();
			$('#home').hide();	
			self.state.socket.emit('signup_send', {email: $('#signup_email').val(), user: $('#signup_user').val(), pass: $('#signup_pass').val()});	
			self.state.socket.on('signup_read', function(data){
				resolve(data);
			});	
		});
	}
	
	check_submit = function(type){
		var signup_input = "";
		var regex = "";
		switch(type){
			case "email":
				signup_input = $('#signup_email').val();
				regex = '^[a-zA-Z0-9]+[@]+[a-zA-Z0-9]+[.]+[a-zA-Z]{2,4}$'
				//letters+numbers+"."+"_" + @ + letters+numbers+"."+"_" + letters(2-4 characters)
			   	break;
			case "pass":
				signup_input = $('#signup_pass').val();		
				regex = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';	
				// At least one upper case English letter, (?=.*?[A-Z])
				// At least one lower case English letter, (?=.*?[a-z])
				// At least one digit, (?=.*?[0-9])
				// At least one special character, (?=.*?[#?!@$%^&*-])
				// Minimum eight in length .{8,}
				break;
		}
		var regex_exp = new RegExp(regex);					
		var pass_result = regex_exp.test(signup_input);
		//pass_result = true;
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
			setCookie("user_minor", true, 1);
		} else {		
			setCookie("user_minor", false, 1);
		}
	}

	render() {
		return (
			<div>
				{(() => {
					if (self.state.user_minor === "true") {
						$('.user_form_container').css('height', 'auto');
						$('.login_link_container').remove();
						return (
							<div className="color_yellow">
								{this.state.lang === "ro" ? <p>Esti prea tanar ca sa intri.</p> : <p>You are too young to enter.</p>}
							</div>
						)
					} else if (self.state.user_minor === "false") {
						return (
							<>
								<Form id="user_form" method="post" action="/registration">
									<Form.Control id="signup_email" className="input_yellow shadow_convex" type="text" name="email" placeholder="Email" />
									<h6 id="signup_email_red" className="text_red"></h6>
									<Form.Control id="signup_user" className="input_yellow shadow_convex" type="text" name="user" placeholder="Username" />									
									<Form.Control id="signup_pass" className="input_yellow shadow_convex" type="password" name="pass" placeholder="Password" />
									<h6 id="signup_pass_red 111" className="text_red"></h6>
									<Button className="button_yellow shadow_convex" onClick={() => self.submit()}>{this.state.lang === "ro" ? <span>Inregistrare</span> : <span>Sign Up</span>}</Button>
								</Form>
								<div className="show_results_container">
									<div className="show_results">
										<h1>{self.state.lang === "ro" ? <span>Alerta</span> : <span>Alert</span>}</h1>
										<p></p>
									</div>
								</div>
							</>
						)
					} else {
						return (
							<div>
								<Form id="user_form" method="post" action="/registration">
										<Form.Control id="signup_email" className="input_yellow shadow_convex" type="text" name="email" placeholder="Email" />
										<Form.Control id="signup_user" className="input_yellow shadow_convex" type="text" name="user" placeholder="Username" />
										<Form.Control id="signup_pass" className="input_yellow shadow_convex" type="password" name="pass" placeholder="Password" />
										<h6 id="signup_pass_red 222" className="text_red"></h6>
										<Button className="button_yellow shadow_convex" onClick={() => self.submit()}>{this.state.lang === "ro" ? <span>Inregistrare</span> : <span>Sign Up</span>}</Button>
								</Form>
						
								<div id="minor_container" className="minor_container">
									<div className="minor_inside">
										{(() => {
											switch (this.state.lang) {
												case "ro":
													return (
														<div className="minor_box">
															<h1>Verificare varsta</h1>
															<p>Trebuie sa ai cel putin 18 ani pentru a accesa acest site.</p>
															<p>Ai 18 ani sau mai mult?</p>
															<Button id="minor_check_false" className="minor_check minor_check_false" type="button" onClick={() => self.minor_check(false)}>DA</Button>
															<Button id="minor_check_true" className="minor_check minor_check_true" type="button" onClick={() => self.minor_check(true)}>NU</Button>
														</div>
													)
												case "eng":
												default:
													return(
														<div className="minor_box">
															<h1>Age Verification</h1>
															<p>You must be 18 or over to access this website.</p>
															<p>Are you 18 or older?</p>
															<Button id="minor_check_false" className="minor_check minor_check_false" type="button" onClick={() => self.minor_check(false)}>YES</Button>
															<Button id="minor_check_true" className="minor_check minor_check_true" type="button" onClick={() => self.minor_check(true)}>NO</Button>
														</div>
													)						
											}
										})()}											
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