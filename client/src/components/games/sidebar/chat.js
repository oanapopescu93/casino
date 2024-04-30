import React, {useState, useEffect} from 'react'
import Header from '../../partials/header'
import { Form, Button } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { formatDate, isEmpty } from '../../../utils/utils'
import { decryptData } from '../../../utils/crypto'
import { getRoom } from '../../../utils/games'
import { useSelector } from 'react-redux'

function ChatMessages(props){
    const messagesEndRef = React.createRef()
    let date_format = useSelector(state => state.settings.date)

    function scrollToBottom(){
        if(messagesEndRef && messagesEndRef.current){
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    useEffect(() => {
		scrollToBottom()
	}, [props.messages]) 

    return <div className="messages" style={{height: props.height+'px'}}>
        {props.messages.map(function(message, i){
            let text = message.text
            let user = message.user ? decryptData(message.user) : "" 
            let date = formatDate(message.timestamp, date_format)
            switch (text) {
                case "join":
                    return <div key={i} className='message'>
                        <p>{user} {translate({lang: props.lang, info: "joined_the_chat"})}</p>
                    </div>
                case "leave":
                    return <div key={i} className='message'>
                        <p>{user} {translate({lang: props.lang, info: "left_the_chat"})}</p>
                    </div>        
                default:
                    return <div key={i} className="message">
                        <div className="chat_header">
                            <span className="user"><strong>{user} </strong>
                            </span> (<span className="date">{date}</span>)
                        </div>
                        <div className="chat_body">
                            <span className="text">{text}</span>
                        </div>
                    </div>
            }
        })}
        <div ref={messagesEndRef} />
    </div>
}

function ChatList(props){
    let date_format = useSelector(state => state.settings.date)
    return <ul className="chat_list">
        {props.list.map(function(item, i){
            let date = formatDate(item.timestamp, date_format)
            return <li key={i}>
                <span className="left">{decryptData(item.user)}</span>
                <span className="right">{date}</span>
            </li>
        })}
    </ul>
}

function Chat(props){
    const {lang, socket, page} = props
    let game = page.game
    let chatRoomUsers = props.chatRoomUsers ? props.chatRoomUsers : []
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [height] = useState(100)

    useEffect(() => {
        socket.on('message_read', function(res){
            setMessages((state) => [...state, res])
        })
    }, [socket])    

    function handleChange(e){
        setInput(e.target.value)
    }

    function handleSubmit(e){
        e.preventDefault()
        if(!isEmpty(input)){
            let payload = {
                text: input,
                room: getRoom(game),
                user: props.user.user
            }
            socket.emit('message_send', payload) 
            setInput('')
        }
    }

    return <>
        <Header template="panel_user" details={page} lang={lang}></Header>
        <Form className="chat_form">            
            <div id="chatmessages" className="input_light">
                <ChatMessages messages={messages} lang={lang} height={height}></ChatMessages>
            </div>
            <input className="input_light" type="text" value={input} onChange={(e)=>{handleChange(e)}}/>
            <Button type="button" onClick={(e)=>handleSubmit(e)} className="mybutton button_fullcolor shadow_convex">
                {translate({lang: lang, info: "send"})}
            </Button>
        </Form>
        <ChatList list={chatRoomUsers}></ChatList>
    </>
}
export default Chat