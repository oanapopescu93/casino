import React, {useState} from 'react'
import { translate } from '../../../translations/translate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faComments } from '@fortawesome/free-solid-svg-icons'
import User from './user'
import Chat from './chat'

function Panel(props){
    const {lang, page} = props
    const [open, setOpen] = useState('')
    const [panel, setPanel] = useState("user_panel_box")
    const [panelUser, setPanelUser] = useState("active")
    const [panelChat, setPanelChat] = useState("")

    function handleToggle(type){
        if(panel === type){
            if(open === ''){
                setOpen('open')
            } else {
                setOpen('')
            }
        } else {
            setOpen('open')
            setPanel(type)
        }

        switch (type) {
			case "user_panel_box":
                setPanelUser("active")
                setPanelChat("")
			  	break
			case "chat_panel_box":
                setPanelUser("")
                setPanelChat("active")
				break
            default:
                break
		}
    }

    return <div className={"panel_container " + open}>
        <div className="panel_button_box">
            <div id="panel_info_button" className="panel_button shadow_convex" onClick={()=>handleToggle("user_panel_box")}>
                <p>
                    <FontAwesomeIcon icon={faUserCircle} />
                    <span className="panel_button_text">{translate({lang: lang, info: "Info"})}</span>
                </p>
            </div>
            {page.game && !page.game_page ? <div id="panel_chat_button" className="panel_button shadow_convex" onClick={()=>handleToggle("chat_panel_box")}>
                <p>
                    <FontAwesomeIcon icon={faComments} />
                    <span className="panel_button_text">{translate({lang: lang, info: "Chat"})}</span>
                </p>                
            </div> : null}            
        </div>
        <div id="user_panel_box" className={"panel_box " + panelUser}> 
            <User {...props}></User>
        </div>
        {page.game && !page.game_page ? <div id="chat_panel_box" className={"panel_box " + panelChat }>
            <Chat {...props}></Chat>
        </div> : null}
    </div>
}

export default Panel