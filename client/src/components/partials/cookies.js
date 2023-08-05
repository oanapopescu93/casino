import React from 'react'
import { Button } from 'react-bootstrap'
import { translate } from '../../translations/translate'

function Cookies(props) {
	return <div className="cookies_msg_container" id ="cookies_msg">
        <div className="cookies_msg">
            <div className="cookies_text">                    
                <h4>{translate({lang: props.lang, info: "cookies_modal_title"})}</h4>
                <h6>{translate({lang: props.lang, info: "cookies_modal_text"})}</h6>
            </div>							
            <div className="confirm_cookies">
                <Button type="button" id="cookies_btn_ok" className="mybutton button_fullcolor_dark" onClick={()=>props.cookiesClick()}>OK</Button>
            </div>
        </div>
    </div>
}

export default Cookies