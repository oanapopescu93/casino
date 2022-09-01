import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'; 
import { getCookie, setCookie, showResults } from '../../utils';

function SignUp(props){
	let lang = props.lang;
	let socket = props.socket;
	const [minor, setMinor] = useState(true);

	useEffect(() => {
		setMinor(getCookie('user_minor'));
	}, []); 

	function submit(){
		$('.sign_errors').hide();
		$('.sign_errors').empty();
		if(check_submit('email') && check_submit('pass')){
			loader().then(function(data) {
				if(data[0]){
					if($('#loader_container')){
						$('#loader_container').hide(); 
					}
					if($('#home')){
						$('#home').show();	
					}	
					if(lang === "ro"){
						showResults('Alerta', 'Esti deja inregistrat.');
					} else {
						showResults('Alert', 'You are already registered.');
					}					
				} else {
					setCookie("casino_id", data[1].id);
					setCookie("casino_uuid", data[1].uuid);
					setCookie("casino_email", $('#signup_email').val());
					setCookie("casino_user", $('#signup_user').val());
					submit_form();
				}
			});
		} else {
			if(!check_submit('email')){
				$('.sign_errors').show();
				$('.sign_errors').append('<h6 id="signup_email_red" class="text_red"></h6>');
				if(lang === "ro"){
					$('#signup_email_red').append('<p><b>Email invalid</b></p><p>exemplu@mail.com</p>')
				} else {
					$('#signup_email_red').append('<p><b>Invalid email</b></p><p>example@mail.com</p>')
				}	
			}	

			if(!check_submit('pass')){
				$('.sign_errors').show();
				$('.sign_errors').append('<h6 id="signup_pass_red" class="text_red"></h6>');
				if(lang === "ro"){
					$('#signup_pass_red').append('<p><b>Parola invalida</b></p><p>Minim o litera mare, o litera mica, o cifra, un caracter special si lungimea totala minima de opt caractere</p>')
				} else {
					$('#signup_pass_red').append('<p><b>Invalid password</b></p><p>At least one upper case, one lower case, one digit, one special character and minimum eight in length</p>')
				}	
			}	
		}
	}
	
	function loader(){
		return new Promise(function(resolve, reject){
			if($('#loader_container')){
				$('#loader_container').show(); 
			}
			if($('#home')){
				$('#home').hide();	
			}		
			socket.emit('signup_send', {email: $('#signup_email').val(), user: $('#signup_user').val(), pass: $('#signup_pass').val()});	
			socket.on('signup_read', function(data){
				resolve(data);
			});	
		});
	}
	
	function check_submit(type){
		let signup_input = "";
		let regex = "";
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
		let regex_exp = new RegExp(regex);					
		let pass_result = regex_exp.test(signup_input);
		//pass_result = true;
		return pass_result;
	}

	function submit_form(){
		setTimeout(function(){
			if($("#user_form")){
				$("#user_form").submit();
			}
		}, 1000);
	}
	
	function minor_check(check){
		$('#minor_container').remove();	
		if(check){
			setCookie("user_minor", true, 336); //will expire after 14 days
		} else {		
			setCookie("user_minor", false, 336); //will expire after 14 days
		}
	}
	
	return (
		<>
			{(() => {
				if (minor === "true") {
					$('.user_form_container').css('height', 'auto');
					$('.login_link_container').remove();
					return (
						<div className="color_yellow">
							{lang === "ro" ? <p>Esti prea tanar ca sa intri.</p> : <p>You are too young to enter.</p>}
						</div>
					)
				} else if (minor === "false") {
					return (
						<>
							<Form id="user_form" method="post" action="/registration">
								<Form.Control id="signup_email" className="input_yellow shadow_convex" type="text" name="email" placeholder="Email" />									
								<Form.Control id="signup_user" className="input_yellow shadow_convex" type="text" name="user" placeholder="Username" />									
								<Form.Control id="signup_pass" className="input_yellow shadow_convex" type="password" name="pass" placeholder="Password" />									
								<Button className="button_yellow shadow_convex" onClick={() => submit()}>{lang === "ro" ? <span>Inregistrare</span> : <span>Sign Up</span>}</Button>
							</Form>	
						</>
					)
				} else {
					return (
						<div>
							<Form id="user_form" method="post" action="/registration">
									<Form.Control id="signup_email" className="input_yellow shadow_convex" type="text" name="email" placeholder="Email" />
									<Form.Control id="signup_user" className="input_yellow shadow_convex" type="text" name="user" placeholder="Username" />
									<Form.Control id="signup_pass" className="input_yellow shadow_convex" type="password" name="pass" placeholder="Password" />										
									<Button className="button_yellow shadow_convex" onClick={() => submit()}>{lang === "ro" ? <span>Inregistrare</span> : <span>Sign Up</span>}</Button>
							</Form>
					
							<div id="minor_container" className="minor_container">
								<div className="minor_inside">
									{(() => {
										switch (lang) {
											case "ro":
												return (
													<div className="minor_box">
														<h1>Verificare varsta</h1>
														<p>Trebuie sa ai cel putin 18 ani pentru a accesa acest site.</p>
														<p>Ai 18 ani sau mai mult?</p>
														<Button id="minor_check_false" className="minor_check minor_check_false" type="button" onClick={() => minor_check(false)}>DA</Button>
														<Button id="minor_check_true" className="minor_check minor_check_true" type="button" onClick={() => minor_check(true)}>NU</Button>
													</div>
												)
											case "eng":
											default:
												return(
													<div className="minor_box">
														<h1>Age Verification</h1>
														<p>You must be 18 or over to access this website.</p>
														<p>Are you 18 or older?</p>
														<Button id="minor_check_false" className="minor_check minor_check_false" type="button" onClick={() => minor_check(false)}>YES</Button>
														<Button id="minor_check_true" className="minor_check minor_check_true" type="button" onClick={() => minor_check(true)}>NO</Button>
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
		</>
	)
}

export default SignUp;