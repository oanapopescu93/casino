import React from 'react'
import { Button } from 'react-bootstrap'
import { translate } from '../../translations/translate'

function IsMinor(props) {
    const {settings} = props
    const {lang} = settings
    return <div className="isMinor">
        <div className="isMinor_text">
            <p>{translate({lang: lang, info: "isMinor_text"})}</p>
        </div>							
        <div className="isMinor_buttons">
            <div className="isMinor_button">
                <Button type="button" id="isMinor_btn_ok" className="mybutton button_fullcolor_dark" onClick={()=>props.isMinorClick(false)}>
                    {translate({lang: lang, info: "yes"})}
                </Button>
            </div>
            <div className="isMinor_button">
                <Button type="button" id="isMinor_btn_ok" className="mybutton button_fullcolor_dark" onClick={()=>props.isMinorClick(true)}>
                    {translate({lang: lang, info: "no"})}
                </Button>
            </div>
        </div>
    </div>
}

export default IsMinor