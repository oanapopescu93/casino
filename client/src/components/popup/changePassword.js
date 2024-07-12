import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { translate } from '../../translations/translate'
import { validateInput } from '../../utils/validate'

function ChangePassword(props) {
    const {settings} = props
    const {lang} = settings
    const [choice, setChoice] = useState("")
    const [error, setError] = useState(false)
    const [errorPassword, setErrorPassword] = useState(false)
    let user = useSelector(state => state.auth.user) 

    function handleChange(e){
        setError(false)
        setErrorPassword(false)
        setChoice(e.target.value)
    }
    function handleSendChange(e){
        if(e.value === ""){
            setError(true)
        } else if(validateInput(e.value, "pass")){
            props.changePassword(e)
        } else {
            setErrorPassword(true)
        }
    }

    return <div className="changePassword">
        <div className="changePassword_box">
            <input className="input_light" type="text" value={choice} onChange={(e)=>{handleChange(e)}}/>
        </div>
        {error ? <div className="alert alert-danger">
            <p className="text_red">{translate({lang: lang, info: "empty_input_change_username"})}</p>
        </div> : null}
        {errorPassword ? <div className="alert alert-danger">
            <p className="text_red">{translate({lang: lang, info: "password_rule01"})}</p> 
            <p className="text_red">{translate({lang: lang, info: "password_rule02"})}</p> 
            <p className="text_red">{translate({lang: lang, info: "password_rule03"})}</p> 
            <p className="text_red">{translate({lang: lang, info: "password_rule04"})}</p> 
            <p className="text_red">{translate({lang: lang, info: "password_rule05"})}</p>
        </div> : null}
        <div className="changePassword_buttons">
            <Button type="button" id="changePassword_btn_ok" className="mybutton button_fullcolor_dark" onClick={()=>handleSendChange({value: choice, uuid: user.uuid, type: "pass"})}>
                {translate({lang: lang, info: "change"})}
            </Button>
        </div>
    </div>
}

export default ChangePassword