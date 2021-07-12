import React, { Component } from 'react';
import $ from 'jquery'; 

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

var self;
class Support extends Component {
	constructor(props) {
		super(props);
		self = this;
		self.state = {
			lang: props.lang,
			socket: props.socket,
            contact: props.contact,
            contact_title: Object.getOwnPropertyNames(props.contact)
		};
        self.submit = self.submit.bind(self);
        self.submit_form = self.submit_form.bind(self);
        self.check_submit = self.check_submit.bind(self);
	}

    submit = function(){
        $('#support_email_red').empty();
        $('#support_message_red').empty();
        $('#support_result').empty();

        if(self.check_submit('email') && $('#support_message').val() !== ""){
            self.submit_form();
        } else {
            if(!self.check_submit('email')){
                if(self.state.lang === "ro"){
                    $('#support_email_red').append('<p><b>Email invalid</b></p><p>exemplu@mail.com</p>')
                } else {
                    $('#support_email_red').append('<p><b>Invalid email</b></p><p>example@mail.com</p>')
                }	
            }
            if($('#support_message').val() === ""){
                if(self.state.lang === "ro"){
                    $('#support_message_red').append('<p>Nu ai scris nimic in mesaj</p>')
                } else {
                    $('#support_message_red').append('<p>No message</p>')
                }	
            }	
        }
    }

    submit_form = function(){
        var obj = {email: $('#support_email').val(), message: $('#support_message').val(), lang:self.state.lang}
        self.state.socket.emit('support_send', obj);	
        self.state.socket.on('support_read', function(data){
            $('#support_result').append(data);
            setTimeout(function(){ 	
                $('#support_result').empty();
            }, 1000);
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
        $('.full-height').attr('id', 'support')
        return (
                <Row>
                    <Col sm={2}></Col>
                    <Col sm={8}>
                        <div className="support_container color_yellow">
                            <div className="deco">
                                <Col sm={6}>
                                    <div className="support_info">
                                        {																					
                                            self.state.contact_title.map(function(item, i){
                                                var info_title = self.capitalizeFirstLetter(item);
                                                var info = self.state.contact[item];
                                                return <p key={i}><span><b>{info_title}: </b></span><span>{info}</span></p>                                                                                                                           
                                            })
                                        }
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <Form id="support_form" method="post">
                                        <div className="box">
                                            <Form.Control id="support_email" className="input_yellow shadow_convex" type="text" name="email" placeholder="email" defaultValue=""/>
                                            <h6 id="support_email_red" className="text_red"></h6>
                                            <Form.Control id="support_message" className="input_yellow shadow_convex" as="textarea" name="message"/>
                                            <h6 id="support_message_red" className="text_red"></h6>
                                            <Button className="button_yellow shadow_convex" onClick={() => self.submit()}>{self.state.lang === "ro" ? <span>Trimite</span> : <span>Send</span>}</Button>
                                        </div>
                                    </Form>
                                </Col>
                                <p id="support_result"></p>
                            </div>
                        </div>                        
                    </Col>
                    <Col sm={2}></Col>
                </Row>
        );
    }
}

export default Support;