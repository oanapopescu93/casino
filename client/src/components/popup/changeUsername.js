import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { translate } from '../../translations/translate'

function ChangeUsername(props) {
    const {lang} = props
    const [choice, setChoice] = useState(null)
    let user = useSelector(state => state.auth.user)    

    function handleChange(e){
        setChoice(e.target.value)
    }

    return <div className="changeUsername">
        <div className="changeUsername_box">
            <input className="input_light" type="text" value={choice} onChange={(e)=>{handleChange(e)}}/>
        </div>
        <div className="changeUsername_buttons">
            <Button type="button" id="changeUsername_btn_ok" className="mybutton button_fullcolor_dark" onClick={()=>props.changeUsername({value: choice, uuid: user.uuid, type: "user"})}>
                {translate({lang: lang, info: "choose"})}
            </Button>
        </div>
    </div>
}

export default ChangeUsername