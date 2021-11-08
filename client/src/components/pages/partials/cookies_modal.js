import React from 'react';

function Cookies() {
	return (
		<div className="cookies_msg_container" id ="cookies_msg">
            <div className="cookies_msg">
                <div className="cookies_text">
                    <h4>Cookies Notification</h4>
                    <h6>
                        In order to offer you the most relevant information and for optimal system performance,
                        we use cookies that collect statistical information from your fleet's activity.
                    </h6>
                </div>
                <div className="confirm_cookies">
                    <button type="button" id="cookies_btn_ok" onClick={()=>this.casino_cookies()}>OK</button>
                </div>
            </div>
        </div>
	);
}

export default Cookies;