import React from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../reducers/popup'
import chatbotIcon_pink from '../../img/chatbot/chatbot_pink.png'
import chatbotIcon_green from '../../img/chatbot/chatbot_green.png'
import chatbotIcon_yellow from '../../img/chatbot/chatbot_yellow.png'
import chatbotIcon_orange from '../../img/chatbot/chatbot_orange.png'
import { translate } from '../../translations/translate'

function ChatBotButton(props){
    const { lang, theme } = props
    let dispatch = useDispatch()

    function handleChatBot(){
        let payload = {
            open: true,
            template: "chatbot",
            title: translate({lang, info: "chatbot"}),
            size: "lg",
            icon: chooseIcon()
        }
        dispatch(changePopup(payload))
    }

    function chooseImage(){
        switch (theme) {
            case 'purple':
              return chatbotIcon_pink
            case 'black':
              return chatbotIcon_green
            case 'blue':
              return chatbotIcon_orange
            default:
              return chatbotIcon_yellow
        }
    }

    function chooseIcon(){
      switch (theme) {
          case 'purple':
            return "chatbotIcon_pink"
          case 'black':
            return "chatbotIcon_green"
          case 'blue':
            return "chatbotIcon_orange"
          default:
            return "chatbotIcon_yellow"
      }
  }

    return <Button id="chatbot_button" type="button" onClick={()=>handleChatBot()} className="mybutton round button_transparent shadow_convex">
        <img src={chooseImage()} alt="chatbotIcon" />
    </Button>
}

export default ChatBotButton