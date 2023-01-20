import React, {useEffect, useRef, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'

function ContactForm(props){   
    let lang = props.info.lang
	let socket = props.info.socket 
    const contact_email_red = useRef()
    const contact_message_red = useRef()
    const contact_result = useRef()
    const contact_submit_button = useRef()
    const [sending, setSending] = useState(false)

    useEffect(() => {
		return () => {            
            if(contact_email_red && contact_email_red.current){
                contact_email_red.current = null
            }
            if(contact_message_red && contact_message_red.current){
                contact_message_red.current = null
            } 
            if(contact_result && contact_result.current){
                contact_result.current = null
            }
        }
	}, [])

    function submit(event){
        if(!sending){
            setSending(true)

            if(contact_email_red && contact_email_red.current){
                $(contact_email_red.current).empty()
            }
            if(contact_message_red && contact_message_red.current){
                $(contact_message_red.current).empty()
            }    
    
            if(check_submit($('#contact_email').val(), 'email') && $('#contact_message').val() !== ""){
                submit_form(event)
            } else {
                if(!check_submit($('#contact_email').val(), 'email')){
                    if(lang === "ro"){
                        if(contact_email_red && contact_email_red.current){
                            $(contact_email_red.current).append('<p><b>Email invalid</b> exemplu@mail.com</p>')
                        }
                    } else {
                        if(contact_email_red && contact_email_red.current){
                            $(contact_email_red.current).append('<p><b>Invalid email</b> example@mail.com</p>')
                        }
                    }	
                }
                if($('#contact_message').val() === ""){
                    if(lang === "ro"){
                        if(contact_message_red && contact_message_red.current){
                            $(contact_message_red.current).append('<p>Nu ai scris nimic in mesaj</p>')
                        }
                    } else {
                        if(contact_message_red && contact_message_red.current){
                            $(contact_message_red.current).append('<p>No message</p>')
                        }
                    }	
                }	
            }
        }
        
    }

    function submit_form(){
        let obj = {email: $('#contact_email').val(), message: $('#contact_message').val()}
        socket.emit('contact_send', obj)
        socket.on('contact_read', function(data){
            if(contact_result && contact_result.current){
                $(contact_result.current).empty()
                $(contact_result.current).append(data)
            }
            setTimeout(function(){ 	
                if(contact_email_red && contact_email_red.current){
                    $(contact_email_red.current).empty()
                }
                if(contact_message_red && contact_message_red.current){
                    $(contact_message_red.current).empty()
                } 
                if(contact_result && contact_result.current){
                    $(contact_result.current).empty()
                }
                setSending(false)
            }, 1000)
        })	
    }
    
    function check_submit(input, type){
        let regex = ""
            switch(type){
                case "email":
                    regex = '^[a-zA-Z0-9]+[@]+[a-zA-Z0-9]+[.]+[a-zA-Z]{2,4}$'
                    //letters+numbers+"."+"_" + @ + letters+numbers+"."+"_" + letters(2-4 characters)
                    break
            }
            let regex_exp = new RegExp(regex)				
            let pass_result = regex_exp.test(input)
            //pass_result = true
            return pass_result
    }

    return (
        <div id="contact_form">
            {lang === "ro" ? <h4>Formular de contact</h4> : <h4>Contact form</h4>}
            <Form method="post">
                <Form.Control id="contact_email" className="input_yellow shadow_convex" type="text" name="email" placeholder="email" defaultValue=""/>
                <h6 ref={contact_email_red} id="contact_email_red" className="text_red"></h6>
                <Form.Control id="contact_message" className="input_yellow shadow_convex" as="textarea" name="message"/>
                <h6 ref={contact_message_red} id="contact_message_red" className="text_red"></h6>
                <Button className="button_yellow shadow_convex" onClick={(e)=>submit(e)}>{lang === "ro" ? <span>Trimite</span> : <span>Send</span>}</Button>
                <p ref={contact_result} id="contact_result"></p>
            </Form>
        </div>
    )
}

export default ContactForm