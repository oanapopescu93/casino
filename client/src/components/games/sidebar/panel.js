import React, {useState, useEffect, useRef} from 'react'
import { translate } from '../../../translations/translate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faComments } from '@fortawesome/free-solid-svg-icons'
import User from './user'
import Chat from './chat'
import { checkWinterMonths } from '../../../utils/special_occasions'
import { getWindowDimensions } from '../../../utils/utils'

function Panel(props){
    const {page, settings} = props
    const {lang} = settings
    const [open, setOpen] = useState('')
    const [panel, setPanel] = useState("user_panel_box")
    const [panelUser, setPanelUser] = useState("active")
    const [panelChat, setPanelChat] = useState("")
    const [showWinter, setShowWinter] = useState(false)
    const wrapperRef = useRef(null)

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

    useEffect(() => {
		document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
	}, []) 

    function handleClickOutside(e){
        if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(e.target)){
            setOpen('')
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize)
            handleResize()
            return () => window.removeEventListener("resize", handleResize)
        }
	}, [])

    function handleResize(){
        // special occasions
        let winter = checkWinterMonths()
		if(winter && getWindowDimensions().width >= 960){ // will appear only on winter months and only if the width is more than 960
			setShowWinter(true)
		}
    }

    return <div ref={wrapperRef} className={"panel_container " + open}>
        <div className="panel_button_box"> 
            <div 
                id="panel_info_button" 
                className={showWinter ? "panel_button shadow_convex snow_small" : "panel_button shadow_convex"} 
                onClick={()=>handleToggle("user_panel_box")}
            >
                <p>
                    <FontAwesomeIcon icon={faUserCircle} />
                    <span className="panel_button_text">{translate({lang: lang, info: "info"})}</span>
                </p>
            </div>
            {page.game && !page.game_page ? <div 
                id="panel_chat_button" 
                className={showWinter ? "panel_button shadow_convex snow_small" : "panel_button shadow_convex"} 
                onClick={()=>handleToggle("chat_panel_box")}
            >
                <p>
                    <FontAwesomeIcon icon={faComments} />
                    <span className="panel_button_text">{translate({lang: lang, info: "Chat"})}</span>
                </p>
            </div> : null}
        </div>
        <div id="user_panel_box" className={"panel_box " + panelUser}> 
            <User {...props} />
        </div>
        {page.game && !page.game_page ? <div id="chat_panel_box" className={"panel_box " + panelChat }>
            <Chat {...props} />
        </div> : null}
    </div>
}

export default Panel