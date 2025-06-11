import React from 'react'
import { translate } from '../../translations/translate'
import { Button } from 'react-bootstrap'
import Spinner from '../partials/spinner'

function VerificationSend(props) {
    const { template, settings, data, resendVerificationResult, sending, handleResendVerification } = props
    const { lang } = settings
    
    return <div className="verificationSend">
        {template === "verificationSendSuccess" ? <p>
            {translate({lang, info: "email_send_validation_text"})}
        </p> : <p>
            {translate({lang, info: "token_is_not_verified"})}
        </p>}        

        <Button type="button" onClick={()=>handleResendVerification(data.email)} className="mybutton button_fullcolor shadow_convex">
            <span>{translate({lang, info: "email_send_validation_button"})}</span>           
        </Button>
        
        {sending ? <div className="resendVerificationResult"><Spinner size="small" color="black"/></div> : null}
        {resendVerificationResult !== '' ? <div className="resendVerificationResult">
            {resendVerificationResult === "email_send_validation" ? <p>{translate({lang, info: "email_send"})}</p> : <p>{translate({lang, info: "email_no_send"})}</p>}
        </div> : null}
    </div>
}
export default VerificationSend