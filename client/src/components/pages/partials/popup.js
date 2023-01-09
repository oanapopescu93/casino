import React, { useState } from 'react'
import { isEmpty } from '../../utils'
import '../../css/firework.css'

function Popup(props){
    const [open, setOpen] = useState("open")
    let data = props.data
    let title = ""
    let text = ""
    let width = 300
    let fireworks = false
    if(data && !isEmpty(data.title)){
        title = data.title
    }
    if(data && !isEmpty(data.text)){
        text = data.text
    }
    if(data && !isEmpty(data.width)){
        width = data.width
    }
    if(data && data.fireworks){
        fireworks = true
    }

    function handleClose(){
        setOpen("")
    }

	return (
		<div className={"popup_container " + open}>
            <div className="popup_box" width={width}>
                <i className="fa fa-times popup_box_close" onClick={handleClose}></i>
                <h1 className="header"><span>{title}</span></h1>
                <div className="message">{text}</div>
            </div>
            {fireworks ? <div className="firework"></div> : null}
        </div>
	)
}
export default Popup