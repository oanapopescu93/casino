import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { translate } from '../../translations/translate'
import Spinner from '../partials/spinner'

function SignProblem(props) {
    const {settings, signProblemsResult, sending, handleSignProblem} = props
    const {lang} = settings
    const [email, setEmail] = useState("")

    function handleChange(e){
        setEmail(e.target.value)
    }

    return <div className="signProblem_container">
        <div className="signProblem_box">
            <p>{translate({lang, info: "signProblem_message"})} </p>
        </div>
        <div className="signProblem_box">
            <input 
                className="input_light" 
                type="text" 
                value={email} 
                placeholder={translate({lang, info: "email"})} 
                onChange={(e)=>{handleChange(e)}}
            />
        </div>
        <div className="signProblem_box">
            <Button type="button" id="forgotPassword_btn_ok" className="mybutton button_fullcolor_dark" onClick={()=>handleSignProblem(email)}>
                {translate({lang, info: "send"})}
            </Button> 
        </div>
        {sending ? <Spinner size="small" color="black"/> : null}
        {signProblemsResult !== "" ? <div className="signProblem_box">
            {signProblemsResult.success_mail ? <div className="alert alert-success">
                <p className="text_green">{translate({lang, info: signProblemsResult.send})}</p>
            </div> : <div className="alert alert-danger">
                <p className="text_red">{translate({lang, info: signProblemsResult.send})}</p>
            </div>}            
        </div> : null}        
    </div>
}

export default SignProblem