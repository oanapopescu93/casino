import React, {useState, useEffect} from 'react'
import Header from '../../partials/header'
import { Form, Button } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { formatDate, isEmpty } from '../../../utils/utils'
import { decryptData } from '../../../utils/crypto'
import { getRoom } from '../../../utils/games'
import { useSelector } from 'react-redux'

function ChatMessages(props){
    const {lang, messages} = props
    const messagesEndRef = React.createRef()
    let date_format = useSelector(state => state.settings.date)

    function scrollToBottom(){
        if(messagesEndRef && messagesEndRef.current){
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    useEffect(() => {
		scrollToBottom()
	}, [messages]) 

    return <div className="messages">
        {messages.map((message, i)=>{
            let text = message.text
            let user = message.user ? decryptData(message.user) : "" 
            let date = formatDate(message.timestamp, date_format)
            switch (text) {
                case "join":
                    return <div key={i} className='message message_join'>
                        <p>{user} {translate({lang, info: "joined_the_chat"})}</p>
                    </div>
                case "leave":
                    return <div key={i} className='message message_leave'>
                        <p>{user} {translate({lang, info: "left_the_chat"})}</p>
                    </div>
                default:
                    return <div key={i} className="message message_box">
                        <div className="chat_header">
                            <div className="user"><p><b>{user}</b></p></div>                            
                        </div>
                        <div className="chat_body">
                            <div className="date"><h6>({date})</h6></div>
                            <div className="text"><p>{text}</p></div>
                        </div>
                    </div>
            }
        })}
        <div ref={messagesEndRef} />
    </div>
}

function ChatList(props){
    const {list} = props
    let date_format = useSelector(state => state.settings.date)
    return <div className="chat_list_container">
        <ul className="chat_list">
            {list.map((item, i)=>{
                let date = formatDate(item.timestamp, date_format)
                return <li key={i}>
                    <span className="left">{decryptData(item.user)}</span>
                    <span className="right"><h6>{date}</h6></span>
                </li>
            })}
        </ul>
    </div>
}

function Chat(props){
    const {page, user, socket, settings, chatRoomUsers} = props
    const {lang, theme} = settings
    let game = page.game
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])    

    useEffect(() => {
        socket.on('message_read', (res)=>{
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
                user: user.user
            }
            socket.emit('message_send', payload) 
            setInput('')
        }
    }

    return <>
        <Header template="panel_user" details={page} lang={lang} theme={theme}/>
        <Form className="chat_form">
            <div id="chatmessages" className="input_light">
                <ChatMessages messages={messages} lang={lang} />
            </div>
            <input className="input_light" type="text" value={input} onChange={(e)=>{handleChange(e)}}/>
            <Button type="button" onClick={(e)=>handleSubmit(e)} className="mybutton button_fullcolor shadow_convex">
                {translate({lang, info: "send"})}
            </Button>
        </Form>
        <ChatList list={chatRoomUsers} />
    </>
}
export default Chat