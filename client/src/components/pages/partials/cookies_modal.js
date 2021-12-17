import React from 'react';

function Cookies(props) {
    var lang = props.lang;
	return (
		<div className="cookies_msg_container" id ="cookies_msg">
            <div className="cookies_msg">
                {(() => {
                    switch (lang) {
                        case "ro":
                            return (
                                <div className="cookies_text">
                                    <h4>Notificari de cookies</h4>
                                    <h6>
                                        Pentru a va oferi cele mai relevante informatii si pentru o performanta optima a sistemul,
                                        noi folosim cookies pentru a colecta informatii din activitatea dumneavoatra.
                                    </h6>
                                </div>
                            )
                        case "eng":
                        default:
                            return(
                                <div className="cookies_text">
                                    <h4>Cookies Notification</h4>
                                    <h6>
                                        In order to offer you the most relevant information and for optimal system performance,
                                        we use cookies that collect information from your game activity.
                                    </h6>
                                </div>
                            )						
                    }
                })()}								
                <div className="confirm_cookies">
                    <button type="button" id="cookies_btn_ok" onClick={()=>props.casino_cookies()}>OK</button>
                </div>
            </div>
        </div>
	);
}

export default Cookies;