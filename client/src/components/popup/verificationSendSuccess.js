import React from 'react'
import { translate } from '../../translations/translate'
import { Button } from 'react-bootstrap'
import Spinner from '../partials/spinner'

function VerificationSendSuccess(props) {
    const { settings, data, resendVerificationResult, sending, handleResendVerification } = props
    const { lang } = settings
    
    return <div className="perificationSendSuccess">
        <p>{translate({lang: lang, info: "email_send_validation_text"})}</p>

        <Button type="button" onClick={()=>handleResendVerification(data.email)} className="mybutton button_fullcolor shadow_convex">
            <span>{translate({lang: lang, info: "email_send_validation_button"})}</span>           
        </Button>
        
        {sending ? <div className="resendVerificationResult"><Spinner size="small" color="black"/></div> : null}
        {resendVerificationResult !== '' ? <div className="resendVerificationResult">
            {resendVerificationResult === "email_send_validation" ? <p>{translate({lang: lang, info: "email_send"})}</p> : <p>{translate({lang: lang, info: "email_no_send"})}</p>}
        </div> : null}
    </div>
}
export default VerificationSendSuccess