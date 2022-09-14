import React, {useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import $ from 'jquery'
import {game_page} from '../../actions/actions'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function Support(props){
    let lang = props.info.lang
	let socket = props.info.socket
	let contact = props.info.contact
    let dispatch = useDispatch()
    const support_email_red = useRef()
    const support_message_red = useRef()
    const support_result = useRef()

	useEffect(() => {
		dispatch(game_page('user_account'))	
	}, [])

    function submit(event){
        if(support_email_red){
            if(support_email_red.current){
                support_email_red.empty()
            }
        }
        if(support_message_red){
            if(support_message_red.current){
                support_message_red.empty()
            }
        }       

        if(check_submit('email') && $('#support_message').val() !== ""){
            if(event.target.getAttribute("finished") === "yes"){
                event.target.setAttribute("finished", "no")
                submit_form(event);
            } 
        } else {
            if(!check_submit('email')){
                if(lang === "ro"){
                    if(support_email_red){
                        if(support_email_red.current){
                            support_email_red.append('<p><b>Email invalid</b></p><p>exemplu@mail.com</p>')
                        }
                    }
                } else {
                    if(support_email_red){
                        if(support_email_red.current){
                            support_email_red.append('<p><b>Invalid email</b></p><p>example@mail.com</p>')
                        }
                    }
                }	
            }
            if($('#support_message').val() === ""){
                if(lang === "ro"){
                    if(support_message_red){
                        if(support_message_red.current){
                            support_message_red.append('<p>Nu ai scris nimic in mesaj</p>')
                        }
                    }  
                    $('#support_message_red').append('<p>Nu ai scris nimic in mesaj</p>')
                } else {
                    if(support_message_red){
                        if(support_message_red.current){
                            support_message_red.append('<p>No message</p>')
                        }
                    }
                }	
            }	
        }
    }

    function submit_form(event){        
        let target = event.target
        let obj = {email: $('#support_email').val(), message: $('#support_message').val(), lang: lang}
        socket.emit('support_send', obj)
        socket.on('support_read', function(data){
            if(support_result){
                if(support_result.current){
                    support_result.empty()
                    support_result.append(data)
                }
            }
            setTimeout(function(){ 	
                if(support_email_red){
                    if(support_email_red.current){
                        support_email_red.empty()
                    }
                }
                if(support_message_red){
                    if(support_message_red.current){
                        support_message_red.empty()
                    }
                } 
                if(support_result){
                    if(support_result.current){
                        support_result.empty()
                    }
                }
                target.setAttribute("finished", "yes")
            }, 1000)
        })	
    }
    
    function check_submit(type){
        let signup_input = ""
        let regex = ""
            switch(type){
                case "email":
                    signup_input = $('#support_email').val()
                    regex = '^[a-zA-Z0-9]+[@]+[a-zA-Z0-9]+[.]+[a-zA-Z]{2,4}$'
                    //letters+numbers+"."+"_" + @ + letters+numbers+"."+"_" + letters(2-4 characters)
                    break
            }
            let regex_exp = new RegExp(regex)				
            let pass_result = regex_exp.test(signup_input)
            //pass_result = true
            return pass_result
    }
       
    return (
            <Row>
                <Col sm={2}></Col>
                <Col sm={8}>
                    <div className="support_container color_yellow">
                        <div className="deco">
                            <Col sm={6}>
                                <div className="support_info">
                                    {(() => {
                                        if (contact.length>0) {
                                            let info, location, email, phone, website, linkedin, github;
                                            for(let i in contact){
                                                switch(contact[i].title){
                                                    case "info":
                                                        info = contact[i];
                                                        break;
                                                    case "location":
                                                        location = contact[i];
                                                        break;
                                                    case "email":
                                                        email = contact[i];
                                                        break;
                                                    case "phone":
                                                        phone = contact[i];
                                                        break;
                                                    case "website":
                                                        website = contact[i];
                                                        break;
                                                    case "linkedin":
                                                        linkedin = contact[i];
                                                        break;
                                                    case "github":
                                                        github = contact[i];
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
                                                    <ul id="contact_list_social" className="text-center">
                                                        <li><a href={github.link}><i className={github.icon}></i></a></li>
                                                        <li><a href={linkedin.link}><i className={linkedin.icon}></i></a></li>
                                                    </ul>
                                                </>
                                            );
                                        } else {
                                            return(
                                                <div>Loading...</div>
                                            )
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
                                    <h6 ref={support_email_red} id="support_email_red" className="text_red"></h6>
                                    <Form.Control id="support_message" className="input_yellow shadow_convex" as="textarea" name="message"/>
                                    <h6 ref={support_message_red} id="support_message_red" className="text_red"></h6>
                                    <Button finished="yes" className="button_yellow shadow_convex" onClick={()=>submit()}>{lang === "ro" ? <span>Trimite</span> : <span>Send</span>}</Button>
                                    <p ref={support_result} id="support_result"></p>
                                </div>
                            </div>
                        </Form>  
                    </div>                                              
                </Col>
                <Col sm={2}></Col>
            </Row>
    )
}

export default Support