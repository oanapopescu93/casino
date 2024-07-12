import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { translate } from '../../translations/translate'

function ChangeUsername(props) {
    const {settings} = props
    const {lang} = settings
    const [choice, setChoice] = useState("")
    const [error, setError] = useState(false)
    let user = useSelector(state => state.auth.user)

    function handleChange(e){
        setError(false)
        setChoice(e.target.value)
    }
    function handleSendChange(e){
        if(e.value === ""){
            setError(true)
        } else {
            props.changeUsername(e)
        }
    }

    return <div className="changeUsername">
        <div className="changeUsername_box">
            <input className="input_light" type="text" value={choice} onChange={(e)=>{handleChange(e)}}/>
        </div>
        {error ? <div className="alert alert-danger">
            <p className="text_red">{translate({lang: lang, info: "empty_input_change_username"})}</p>
        </div> : null}
        <div className="changeUsername_buttons">
            <Button type="button" id="changeUsername_btn_ok" className="mybutton button_fullcolor_dark" onClick={()=>handleSendChange({value: choice, uuid: user.uuid, type: "user"})}>
                {translate({lang: lang, info: "change"})}
            </Button>
        </div>
    </div>
}

export default ChangeUsername