import React from 'react'
function Popup(props){
    let lang = props.lang
	return (
		<div className="popup_container">
            <div className="popup_box">
                <i className="fa fa-times popup_box_close" ></i>
                <h1 className="header">{lang === "ro" ? <span>Alerta</span> : <span>Alert</span>}</h1>
                <div className="message"></div>
            </div>
            <div className="firework"></div>
        </div>
	)
}
export default Popup