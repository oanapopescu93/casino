import React, {useState} from 'react'
import { translate } from '../../../translations/translate'
import { Form, Button, Col, Row } from 'react-bootstrap'
import { validateInput } from '../../../utils/validate'
import { postData } from '../../../utils/utils'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

function ContactForm(props){
    const {lang} = props

    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [about, setAbout] = useState("choose")
    const [message, setMessage] = useState('')

    const [errorEmail, setErrorEmail] = useState(false)
    const [errorSubject, setErrorSubject] = useState(false)
    const [errorAbout, setErrorAbout] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [sendResults, setSendResults] = useState(null)
    const [emailSending, setEmailSending] = useState(false)    
    
    let questions = ['account_issues', 'payments_and_withdrawals', 'game_issues', 'hiring', 'other']

    function handleDropdown(x){
        setAbout(translate({lang, info: x}))
    }

    function handleChange(type, e){
        switch(type) {
            case "email":
                setEmail(e.target.value)
                break
            case "subject":
                setSubject(e.target.value)
                break
            case "message":
                setMessage(e.target.value)
                break
            default:              
        }
    }

    function handleSubmit(e){
        e.preventDefault()
        setErrorSubject(false)
        setErrorAbout(false)
        setErrorMessage(false)
        setErrorEmail(false)
        
        if(subject !== "" && message !== "" && about !== "choose" && email !== "" && validateInput(email, "email")){
            setEmailSending(true)
            postData("/api/contact", {subject, about, message, email, lang}).then((data) => {
                setEmailSending(false)
                if(data && data.send){
                    setSendResults(data.send)
                    let time = 5000
                    if(data.send === "email_no_send"){
                        time = 3000
                    }
                    setTimeout(() => {
                        setSendResults(null)
                    }, time)
                }
            })
        } else {
            if(subject === ""){
                setErrorSubject(true)
            }
            if(about === "choose"){
                setErrorAbout(true)
            }
            if(message === ""){
                setErrorMessage(true)
            }
            if(email === "" || !validateInput(email, "email")){
                setErrorEmail(true)
            }           
        }
    }

    return <div id="contact_form" className="contact_box shadow_convex">
        <Form className="contact_form">
            <Row>
                <Col sm={12} className="label_container">
                    <div className="label">{translate({lang, info: "email"})}</div>
                </Col>
                <Col sm={12}>
                    <input className="input_light shadow_concav" type="text" value={email} onChange={(e)=>{handleChange('email', e)}}/>
                </Col>
            </Row>
            <Row>
                <Col sm={12} className="label_container">
                    <div className="label">{translate({lang, info: "subject"})}</div>
                </Col>
                <Col sm={12}>
                    <input className="input_light shadow_concav" type="text" value={subject} onChange={(e)=>{handleChange('subject', e)}}/>
                </Col>
            </Row>
            <Row>
                <Col sm={12} className="label_container">
                    <div className="label">{translate({lang, info: "about"})}</div>
                </Col>
                <Col sm={12} className="label_container">
                    <DropdownButton title={translate({lang, info: about})} id="question_button" className="shadow_concav" onSelect={(e)=>handleDropdown(e)}>
                        {questions.map((item, i) => (
                            <Dropdown.Item key={i} eventKey={item}>
                                {translate({ lang, info: item })}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </Col>
            </Row>
            <Row>
                <Col sm={12} className="label_container">
                    <div className="label">{translate({lang, info: "message"})}</div>
                </Col>
                <Col sm={12}>
                    <textarea className="input_light shadow_concav" type="text" value={message} onChange={(e)=>{handleChange('message', e)}}/>
                </Col>
            </Row>
            {(() => {
                if(errorEmail || errorSubject || errorAbout || errorMessage){
                    return <div className="alert alert-danger">
                        {errorEmail ? <p className="text_red">{translate({lang, info: "incorrect_email"})}</p> : null}
                        {errorSubject ? <p className="text_red">{translate({lang, info: "empty_input_subject"})}</p> : null}
                        {errorAbout ? <p className="text_red">{translate({lang, info: "empty_input_about"})}</p> : null}
                        {errorMessage ? <p className="text_red">{translate({lang, info: "empty_input_message"})}</p> : null}
                    </div>
                }
            })()}
            {emailSending ? <p style={{marginBottom : "5px", textAlign: "center"}}>{translate({lang, info: "sending"})}</p> : null}
            {(() => {                
                if(sendResults === "email_send"){
                    return <div className="alert alert-success">
                        <p className="text_green">
                            {translate({lang, info: sendResults})}
                        </p>
                    </div>
                } else if(sendResults === "email_no_send"){
                    return <div className="alert alert-danger">
                        <p className="text_red">{translate({lang, info: sendResults})}</p>
                    </div>
                }
            })()}
            <Row>
                <Col>
                    <Button type="button" onClick={(e)=>handleSubmit(e)} className="mybutton button_fullcolor shadow_convex">
                        {translate({lang, info: "send"})}
                    </Button>
                </Col>
            </Row>
        </Form>
    </div>
}
export default ContactForm