import React from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../reducers/popup'

function ChatBotButton(){
    let dispatch = useDispatch()
    function handleChatBot(){
        let payload = {
            open: true,
            template: "chatbot",
            title: "chatbot",
            size: "lg",
        }
        dispatch(changePopup(payload))
    }
    return <Button id="chatbot_button" type="button" onClick={()=>handleChatBot()} className="mybutton round button_transparent shadow_convex">
        <FontAwesomeIcon icon={faMessage} />
    </Button>
}

export default ChatBotButton