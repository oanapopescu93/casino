import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'; 
import { getCookie, setCookie, showResults } from '../utils';

class SignUp extends Component {	
	constructor(props) {
		super(props);
		this.state = {
			socket: props.socket,
			lang: props.lang,
			user_minor: null,
			client_id: '',
	  	};				
		this.submit = this.submit.bind(this);	
		this.loader = this.loader.bind(this);	
		this.check_submit = this.check_submit.bind(this);	
		this.submit_form = this.submit_form.bind(this);	
		this.minor_check = this.minor_check.bind(this);	
	}

	componentDidMount() {
		this.setState({ user_minor: getCookie('user_minor') });
	}

	submit = function(){
		let self = this;
		$('.sign_errors').hide();
		$('.sign_errors').empty();
		if(self.check_submit('email') && self.check_submit('pass')){
			self.loader().then(function(data) {
				if(data[0]){
					$('#loader_container').hide(); 
					$('#home').show();
					if(self.state.lang === "ro"){
						showResults('Alerta', 'Esti deja inregistrat.');
					} else {
						showResults('Alert', 'You are already registered.');
					}					
				} else {
					setCookie("casino_id", data[1].id, 1);
					setCookie("casino_email", $('#signup_email').val(), 1);
					setCookie("casino_user", $('#signup_user').val(), 1);
					self.submit_form();
				}
			});
		} else {
			if(!self.check_submit('email')){
				$('.sign_errors').show();
				$('.sign_errors').append('<h6 id="signup_email_red" class="text_red"></h6>');
				if(self.state.lang === "ro"){
					$('#signup_email_red').append('<p><b>Email invalid</b></p><p>exemplu@mail.com</p>')
				} else {
					$('#signup_email_red').append('<p><b>Invalid email</b></p><p>example@mail.com</p>')
				}	
			}	

			if(!self.check_submit('pass')){
				$('.sign_errors').show();
				$('.sign_errors').append('<h6 id="signup_pass_red" class="text_red"></h6>');
				if(self.state.lang === "ro"){
					$('#signup_pass_red').append('<p><b>Parola invalida</b></p><p>Minim o litera mare, o litera mica, o cifra, un caracter special si lungimea totala minima de opt caractere</p>')
				} else {
					$('#signup_pass_red').append('<p><b>Invalid password</b></p><p>At least one upper case, one lower case, one digit, one special character and minimum eight in length</p>')
				}	
			}	
		}
	}
	
	loader = function(){
		let self = this;
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
		let self = this;
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
									<Form.Control id="signup_user" className="input_yellow shadow_convex" type="text" name="user" placeholder="Username" />									
									<Form.Control id="signup_pass" className="input_yellow shadow_convex" type="password" name="pass" placeholder="Password" />									
									<Button className="button_yellow shadow_convex" onClick={() => self.submit()}>{this.state.lang === "ro" ? <span>Inregistrare</span> : <span>Sign Up</span>}</Button>
								</Form>																
								<div className="show_results_container">
									<div className="show_results">
										<i className="fa fa-times show_results_close" ></i>
										<h1 className="header">{self.state.lang === "ro" ? <span>Alerta</span> : <span>Alert</span>}</h1>
										<div className="message"></div>
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