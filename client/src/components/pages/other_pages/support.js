import React, { Component } from 'react';
import $ from 'jquery'; 

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class Support extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lang: props.lang,
			socket: props.socket,
            contact: [],
		};
        this.submit = this.submit.bind(this);
        this.submit_form = this.submit_form.bind(this);
        this.check_submit = this.check_submit.bind(this);
	}

    componentDidMount(){
        let self = this;
        this.state.socket.emit('contact_send', "contact");
		this.state.socket.on('contact_read', function(data){
            if(data){
                self.setState({ contact: data});
            }
		});	 
    }

    submit = function(event){          
        $('#support_email_red').empty();
        $('#support_message_red').empty();        

        if(this.check_submit('email') && $('#support_message').val() !== ""){
            if(event.target.getAttribute("finished") === "yes"){
                event.target.setAttribute("finished", "no");
                this.submit_form(event);
            } 
        } else {
            if(!this.check_submit('email')){
                if(this.state.lang === "ro"){
                    $('#support_email_red').append('<p><b>Email invalid</b></p><p>exemplu@mail.com</p>')
                } else {
                    $('#support_email_red').append('<p><b>Invalid email</b></p><p>example@mail.com</p>')
                }	
            }
            if($('#support_message').val() === ""){
                if(this.state.lang === "ro"){
                    $('#support_message_red').append('<p>Nu ai scris nimic in mesaj</p>')
                } else {
                    $('#support_message_red').append('<p>No message</p>')
                }	
            }	
        }
    }

    submit_form = function(event){        
        var target = event.target;
        var obj = {email: $('#support_email').val(), message: $('#support_message').val(), lang:this.state.lang}
        this.state.socket.emit('support_send', obj);	
        this.state.socket.on('support_read', function(data){
            $('#support_result').empty();
            $('#support_result').append(data);
            setTimeout(function(){ 	
                $('#support_email_red').empty();
                $('#support_message_red').empty();
                $('#support_result').empty();
                target.setAttribute("finished", "yes");
            }, 2000);
        });	
    }
    
    check_submit = function(type){
        var signup_input = "";
            var regex = "";
            switch(type){
                case "email":
                    signup_input = $('#support_email').val();
                    regex = '^[a-zA-Z0-9]+[@]+[a-zA-Z0-9]+[.]+[a-zA-Z]{2,4}$'
                    //letters+numbers+"."+"_" + @ + letters+numbers+"."+"_" + letters(2-4 characters)
                    break;
            }
            var regex_exp = new RegExp(regex);					
            var pass_result = regex_exp.test(signup_input);
            //pass_result = true;
            return pass_result;
    }

    capitalizeFirstLetter = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
        $('.full-height').attr('id', 'support');
        return (
                <Row>
                    <Col sm={2}></Col>
                    <Col sm={8}>
                        <div className="support_container color_yellow">
                            <div className="deco">
                                <Col sm={6}>
                                    <div className="support_info">
                                        {(() => {
                                            let self = this;
                                            if (self.state.contact.length>0) {
                                                let info, location, email, phone, website, linkedin, github;
                                                for(let i in self.state.contact){
                                                    switch(self.state.contact[i].title){
                                                        case "info":
                                                            info = self.state.contact[i];
                                                            break;
                                                        case "location":
                                                            location = self.state.contact[i];
                                                            break;
                                                        case "email":
                                                            email = self.state.contact[i];
                                                            break;
                                                        case "phone":
                                                            phone = self.state.contact[i];
                                                            break;
                                                        case "website":
                                                            website = self.state.contact[i];
                                                            break;
                                                        case "linkedin":
                                                            linkedin = self.state.contact[i];
                                                            break;
                                                        case "github":
                                                            github = self.state.contact[i];
                                                            break;
                                                    }   
                                                }
                                                return(
                                                    <>
                                                        <p id="contact_items_info">{info.text}</p>
                                                        <ul id="contact_list_info">
                                                            <li><a href={email.link}><i className={email.icon}></i> <span>{email.text}</span></a></li>
                                                            <li><a href={phone.link}><i className={phone.icon}></i> <span>{phone.text}</span></a></li>
                                                            <li><a href={website.link}><i className={website.icon}></i> <span>{website.link}</span></a></li>
                                                            <li><i className={location.icon}></i> <span>{location.text}</span></li>
                                                        </ul>
                                                        {this.state.lang === "ro" ? <p id="contact_items_social" className="text-center">Social media:</p> : <p id="contact_items_social" className="text-center">Or get social with me:</p>}                                                        
                                                        <ul id="contact_list_social" className="text-center">
                                                            <li><a href={github.link}><i className={github.icon}></i></a></li>
                                                            <li><a href={linkedin.link}><i className={linkedin.icon}></i></a></li>
                                                        </ul>
                                                    </>
                                                );
                                            } else {
                                                return(
                                                    <div>Loading...</div>
                                                );
                                            }
                                        })()}
                                    </div>
                                </Col>
                                <Col sm={6}></Col>                                
                            </div>
                            <Form id="support_form" method="post">
                                <div className="deco">
                                    <div className="box">
                                        <Form.Control id="support_email" className="input_yellow shadow_convex" type="text" name="email" placeholder="email" defaultValue=""/>
                                        <h6 id="support_email_red" className="text_red"></h6>
                                        <Form.Control id="support_message" className="input_yellow shadow_convex" as="textarea" name="message"/>
                                        <h6 id="support_message_red" className="text_red"></h6>
                                        <Button finished="yes" className="button_yellow shadow_convex" onClick={this.submit}>{this.state.lang === "ro" ? <span>Trimite</span> : <span>Send</span>}</Button>
                                        <p id="support_result"></p>
                                    </div>
                                </div>
                            </Form>  
                        </div>                                              
                    </Col>
                    <Col sm={2}></Col>
                </Row>
        );
    }
}

export default Support;