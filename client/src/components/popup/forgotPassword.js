import React, {useState} from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { translate } from '../../translations/translate'

function ForgotPassword(props) {
    const {forgotPasswordResult, lang} = props
    const [email, setEmail] = useState("")

    function handleChange(e){
        setEmail(e.target.value)
    }

    return <div className="forgotPassword">
        {props.text ? <div className="forgotPassword_text">                    
            <p>{props.text}</p>
        </div> : null}		
        <Row>
            <Col sm={2} md={2} lg={4}></Col>
            <Col sm={8} md={8} lg={4}>
                <div className="forgotPassword_buttons">
                    <input className="input_dark" type="text" value={email} onChange={(e)=>{handleChange(e)}}/>
                    <Button type="button" id="forgotPassword_btn_ok" className="mybutton button_fullcolor_dark" onClick={()=>props.forgotPasswordClick(email)}>
                        {translate({lang: lang, info: "send"})}
                    </Button>
                    {(() => {
                        if(forgotPasswordResult === "email_send"){
                            return <div className="alert alert-success">
                                <p className="text_green">{translate({lang: lang, info: forgotPasswordResult})}</p>   
                            </div>
                        } else if(forgotPasswordResult === "email_no_send" || forgotPasswordResult === "no_user"){
                            return <div className="alert alert-danger">
                                <p className="text_red">{translate({lang: lang, info: forgotPasswordResult})}</p>              
                            </div>
                        }
                    })()}                 
                </div>
            </Col>
            <Col sm={2} md={2} lg={4}></Col>
        </Row>
    </div>
}

export default ForgotPassword