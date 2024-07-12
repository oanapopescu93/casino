import React, {useState, useEffect} from 'react'
import Header from '../../partials/header'
import { Form, Button } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { formatDate, isEmpty } from '../../../utils/utils'
import { decryptData } from '../../../utils/crypto'
import { getRoom } from '../../../utils/games'
import { useSelector } from 'react-redux'
import { getWindowDimensions } from '../../../utils/utils'

function ChatMessages(props){
    const {lang, messages, height} = props
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

    return <div className="messages" style={{height: height+'px'}}>
        {messages.map((message, i)=>{
            let text = message.text
            let user = message.user ? decryptData(message.user) : "" 
            let date = formatDate(message.timestamp, date_format)
            switch (text) {
                case "join":
                    return <div key={i} className='message'>
                        <p>{user} {translate({lang: lang, info: "joined_the_chat"})}</p>
                    </div>
                case "leave":
                    return <div key={i} className='message'>
                        <p>{user} {translate({lang: lang, info: "left_the_chat"})}</p>
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
    const {list} = props
    let date_format = useSelector(state => state.settings.date)
    return <ul className="chat_list">
        {list.map((item, i)=>{
            let date = formatDate(item.timestamp, date_format)
            return <li key={i}>
                <span className="left">{decryptData(item.user)}</span>
                <span className="right">{date}</span>
            </li>
        })}
    </ul>
}

function Chat(props){
    const {page, user, socket, settings, chatRoomUsers} = props
    const {lang} = settings
    let game = page.game
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [height, setHeight] = useState(getWindowDimensions().height)

    function getHeight(x){
        if(x >= 500){
          return 200
        } else {
          return 100
        }
    }

    function handleResize(){
        setHeight(getHeight(getWindowDimensions().height))
    }

    useEffect(() => {    
        if(typeof window !== "undefined"){
            window.addEventListener("resize", handleResize)
            handleResize()
            return () => window.removeEventListener("resize", handleResize)
        }
	}, [])

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
        <Header template="panel_user" details={page} lang={lang} />
        <Form className="chat_form">
            <div id="chatmessages" className="input_light">
                <ChatMessages messages={messages} lang={lang} height={height} />
            </div>
            <input className="input_light" type="text" value={input} onChange={(e)=>{handleChange(e)}}/>
            <Button type="button" onClick={(e)=>handleSubmit(e)} className="mybutton button_fullcolor shadow_convex">
                {translate({lang: lang, info: "send"})}
            </Button>
        </Form>
        <ChatList list={chatRoomUsers} />
    </>
}
export default Chat