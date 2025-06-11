import React from 'react'
import { Button } from 'react-bootstrap'
import { translate } from '../../translations/translate'

function Cookies(props) {
    const {lang, cookiesClick} = props
	return <div className="cookies_msg_container" id ="cookies_msg">
        <div className="cookies_box">
            <div className="cookies_msg">
                <h4>{translate({lang, info: "cookies_modal_title"})}</h4>
                <div className="cookies_text">                
                    <p>{translate({lang, info: "cookies_modal_text"})}</p>
                </div>							
                <div className="confirm_cookies">
                    <Button type="button" id="cookies_btn_ok" className="mybutton button_fullcolor_dark" onClick={()=>cookiesClick()}>OK</Button>
                </div>
            </div>
        </div>
    </div>
}

export default Cookies