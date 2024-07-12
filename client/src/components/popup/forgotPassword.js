import React, {useState} from 'react'
import { Button } from 'react-bootstrap'
import { translate } from '../../translations/translate'

function ForgotPassword(props) {
    const {forgotPasswordResult, forgotPasswordSending, settings} = props
    const {lang} = settings
    const [email, setEmail] = useState("")
    let mailtrap_link = "https://www.mailtrap.io"

    function handleChange(e){
        setEmail(e.target.value)
    }

    return <div className="forgotPassword">
        {props.text ? <div className="forgotPassword_text">
            <p>{props.text}</p>
        </div> : null}
        <div className="forgotPassword_buttons">
            <input className="input_light" type="text" value={email} onChange={(e)=>{handleChange(e)}}/>
            <Button type="button" id="forgotPassword_btn_ok" className="mybutton button_fullcolor_dark" onClick={()=>props.forgotPasswordClick(email)}>
                {translate({lang: lang, info: "send"})}
            </Button>
            {forgotPasswordSending ? <p style={{marginTop : "5px"}}>{translate({lang: lang, info: "sending"})}</p> : null}
            {(() => {
                if(forgotPasswordResult === "email_send_mailtrap"){
                    return <div className="alert alert-success">
                        <a href="https://www.mailtrap.io" className="text_green">
                            {translate({lang: lang, info: forgotPasswordResult})} {mailtrap_link}
                        </a>
                    </div>
                } else if(forgotPasswordResult === "email_no_send"){
                    return <div className="alert alert-danger">
                        <p className="text_red">{translate({lang: lang, info: forgotPasswordResult})}</p>
                    </div>
                }
            })()}
        </div>
    </div>
}

export default ForgotPassword