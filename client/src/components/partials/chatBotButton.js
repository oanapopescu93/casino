import React from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../reducers/popup'
import chatbotIcon from '../../img/chatbot/chatbot.png'

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
        <img src={chatbotIcon} alt="chatbotIcon" />
    </Button>
}

export default ChatBotButton