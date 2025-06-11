import React, {useState} from 'react'
import { Button } from 'react-bootstrap'
import { translate } from '../../translations/translate'
import Spinner from '../partials/spinner'

function ForgotPassword(props) {
    const {forgotPasswordResult, sending, settings, text} = props
    const {lang} = settings
    const [email, setEmail] = useState("")

    function handleChange(e){
        setEmail(e.target.value)
    }

    return <div className="forgotPassword">
        {text ? <div className="forgotPassword_text">
            <p>{text}</p>
        </div> : null}
        <div className="forgotPassword_buttons">
            <input 
                className="input_light" 
                type="text" 
                value={email} 
                placeholder={translate({lang, info: "email"})} 
                onChange={(e)=>{handleChange(e)}}
            />
            <Button type="button" id="forgotPassword_btn_ok" className="mybutton button_fullcolor_dark" onClick={()=>props.forgotPasswordClick(email)}>
                {translate({lang, info: "send"})}
            </Button>
            {sending ? <Spinner size="small" color="black"/> : null}
            {(() => {                
                if(forgotPasswordResult === "email_no_send"){
                    return <div className="alert alert-danger">
                        <p className="text_red">{translate({lang, info: forgotPasswordResult})}</p>
                    </div>
                }
                if(forgotPasswordResult === "email_send"){
                    return <div className="alert alert-success">
                        <span>{translate({lang, info: forgotPasswordResult})}</span>
                    </div>
                }
            })()}
        </div>
    </div>
}

export default ForgotPassword