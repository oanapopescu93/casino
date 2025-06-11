import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { translate } from '../../translations/translate'
import { knowledgeBankTranslations } from '../../knowledgeBankTranslations/knowledgeBankTranslations'
import { decryptData } from '../../utils/crypto'
import $ from "jquery"

function ChatBot(props) {
    const {user, settings} = props
    const {lang} = settings
    let name = user.user ? decryptData(user.user) : translate({lang, info: "anonymous"})
    let error_chatbot = "error_chatbot"
    let knowledgeBank = knowledgeBankTranslations()

    const [inputText, setInputText] = useState('')
    const [messages, setMessages] = useState([])
    const [isSending, setIsSending] = useState(false)

    let chatbot_textarea = useRef(null)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            addInitialMessages()
        }, 500)
        return () => {
            setInputText('')
            setMessages([])
            clearTimeout(timeoutId)
        }      
    }, [])

    function addInitialMessages(){
        post("...", "Bot", "bot", true)
        setTimeout(() => {
            post(translate({lang, info: "greetings01"}) + " " + name, "Bot", "bot", false)
            setTimeout(() => {
                post("...", "Bot", "bot", true)
                setTimeout(() => {
                    post(translate({lang, info: "greetings02"}), "Bot", "bot", false)
                }, 500)
            }, 500)
        }, 500)
    }

    function handleInputChange(e){
        setInputText(e.target.value)
    }

    function handleSend(){
        if (inputText.trim()){
            setIsSending(true)
            post(inputText, name, "human", true)        
            setInputText('')            
            setTimeout(() => {
                handleBotResponse(inputText)
            }, 500)
        }
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                handleSend()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [inputText, messages])

    function handleBotResponse(input){
        post("...", "Bot", "bot", true)
        setTimeout(() => {
            search(input)
        }, 500)
    }

    function search(input){
        var results = []
        for(let i in knowledgeBank){
           let queries = knowledgeBank[i].queries
           for(let j in queries){
                let title = queries[j]
                let relevance = string_similarity(input, title)
                if(relevance > 0.5){
                    results.push({title: title, relevance: relevance, index: i})
                }
            }
        }

        if(results.length > 0){
            //we have some revevant responses
            results = results.sort((a, b) => b.relevance - a.relevance)

            let index_best_responses = results[0].index
            let best_responses = knowledgeBank[index_best_responses].responses
            let best_responses_details = knowledgeBank[index_best_responses].details

            const randomIndex = Math.floor(Math.random() * best_responses.length)
            let best_response = best_responses[randomIndex]

            post(best_response, "Bot", "bot", false)
        } else {            
            post(translate({info: error_chatbot, lang}), "Bot", "bot", false) //no relevant response has been found --> we give a standard response
        }

        setIsSending(false)
    }

    function get_bigrams(string) {
        var s = string.toLowerCase()
        var bigrams = []    
        for (var i = 0; i < s.length - 1; i++) {        
            bigrams.push(s[i] + s[i + 1])
        }    
        return bigrams
    }

    function string_similarity(str1, str2){
		var union = 0
		var count = 0
		var pairs1 = []
		var pairs2 = []
		
		if (str1.length > 0 && str2.length > 0){
			pairs1 = get_bigrams(str1)
			pairs2 = get_bigrams(str2)
			
			union = pairs1.length + pairs2.length
			
			for(var i in pairs1){
				for(var j in pairs2){
					if(pairs1[i] == pairs2[j]){
						count++
					}
				}
			}
			
			if (count > 0){
				return ((2 * count) / union)
			}
            
		}
		return 0
	}

    function post(text, user, type, typing = false){
        if(typing){
            setMessages(prevMessages => [
                ...prevMessages,
                { user: user, type: type, message: text }
            ]) 
        } else {
            setMessages(prevMessages => [
                ...prevMessages.slice(0, -1),
                { user: user, type: type, message: text }
            ])
        }
        scrollToBottom()
    }

    function scrollToBottom(){		
		if(chatbot_textarea && chatbot_textarea.current){
			let board = chatbot_textarea.current
			let height = $(board)[0].scrollHeight
			$(board).animate({scrollTop: height},"fast")
		}
	}

    return <div className="chatbot_container">        
        <Row>
            <Col sm={12}>
                <div className="chatbot_textarea_container shadow_concav">
                    <div className="chatbot_textarea" ref={chatbot_textarea}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.user === name ? 'user_message' : 'bot_message'}`}>
                                <div key={index} className="message_box">
                                    <p><strong>{msg.user}:</strong></p>
                                    {/* <p>{msg.message}</p> */}
                                    <p dangerouslySetInnerHTML={{ __html: msg.message }}></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Col>
        </Row>
        <Row>
            <Col xs={8} sm={8} md={8} lg={10}>
                <input 
                    id="chatbot_input" 
                    className="chatbot_input" 
                    name="chatbot_input" 
                    placeholder="Type your message..."
                    value={inputText}
                    onChange={(e)=>handleInputChange(e)} 
                />
            </Col>
            <Col xs={4} sm={4} md={4} lg={2}>
                <Button disabled={isSending} type="button" className="mybutton button_fullcolor_dark shadow_convex" onClick={()=>handleSend()}>
                    {translate({lang, info: "send"})}
                </Button>
            </Col>
        </Row>
    </div>
}

export default ChatBot