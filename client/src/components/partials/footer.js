import React, { useEffect, useState, useRef } from 'react'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../reducers/page'
import { translate } from '../../translations/translate'
import { checkWinterMonths } from '../../utils/special_occasions'
import { getWindowDimensions, isEmpty } from '../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { Button, Col, Row } from 'react-bootstrap'
import { validateInput } from '../../utils/validate'

function Footer(props){
    const { socket, settings } = props
    const { lang } = settings

    let dispatch = useDispatch()
    const wrapperRef = useRef(null)

    const [date, setDate] = useState('')
    const [up, setUp] = useState('')
    const [showWinter, setShowWinter] = useState(false)
    const [email, setEmail] = useState('')

    const errors_default = {        
        email: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_message_email" },
    }
    const [newsletterError, setNewsletterError] = useState(errors_default)
    const [sendResults, setSendResults] = useState(null)

    useEffect(() => {
        handleDate()
        let winter = checkWinterMonths()
		if(winter && getWindowDimensions().width >= 960){ // will appear only on winter months and only if the width is more than 960
			setShowWinter(true)
		}
    }, [])

    function handleDate(){
        let my_date = new Date()
		my_date = my_date.getFullYear()
        setDate(my_date)
    }

    function handleClick(choice){
        if(choice === "dashboard" || choice === "market"){
            dispatch(changePage("Salon"))
            dispatch(changeGame(null))
            dispatch(changeGamePage(choice))
            return
        }
        dispatch(changePage(choice))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    function handleFooterUp(){
        if(up === ''){
            setUp('up')
        } else {
            setUp('')
        }
        setEmail('')
        setNewsletterError(errors_default)
    }

    useEffect(() => {
		document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
	}, []) 

    function handleClickOutside(e){
        if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(e.target)){
            setUp('')
        }
    }

    function handleChangeInput(e){
        setEmail(e.target.value)
    }

    function validateForm(){
        let errors = errors_default
        
        if (isEmpty(email)) {
            errors.email.fill = false
        }        
        if(!validateInput(email, "email")){
            errors.email.validate = false
        } 

        setNewsletterError(errors)
        let problem = Object.values(errors).some(error => !error.fill || !error.validate)

        return problem
    }

    function handleSubmitNewsletter() { 
        if(!validateForm()){
            socket.emit('newsletter_send', email)
        }
    }

    useEffect(() => {
		socket.on('newsletter_read', (data)=>{
			if(data && data.send){
                setSendResults(data.send)
            } else {
                setSendResults("email_no_send")
            }

            let time = 3000
            setTimeout(() => {
                setSendResults(null)
            }, time)
		})
	}, [socket])

    return <div ref={wrapperRef} className={"footer_container " + up}>
        <div className="footer_button_container">
            <div className={showWinter ? "footer_button snow_small" : "footer_button"} onClick={()=>handleFooterUp()}>
                <span><FontAwesomeIcon icon={up === "up" ? faChevronDown : faChevronUp} /></span>
            </div>
        </div>
        <div className="footer_body">
            <Row>
                <Col sm="2"/>
                <Col sm="8">
                    <Row>
                        <Col md="8">
                            <Row>
                                <Col sm="4">
                                    <div className="footer_list">
                                        <h4>{translate({lang: lang, info: "company"})}</h4>
                                        <ul>
                                            <li onClick={()=>{handleClick('About')}}>{translate({lang: lang, info: "about"})}</li>
                                            <li onClick={()=>{handleClick('Career')}}>{translate({lang: lang, info: "career"})}</li>
                                            <li onClick={()=>{handleClick('Contact')}}>{translate({lang: lang, info: "contact"})}</li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col sm="4">
                                    <div className="footer_list">
                                        <h4>{translate({lang: lang, info: "resources"})}</h4>
                                        <ul>
                                            <li onClick={()=>{handleClick('terms_cond')}}>{translate({lang: lang, info: "terms_cond"})}</li>
                                            <li onClick={()=>{handleClick('policy_privacy')}}>{translate({lang: lang, info: "policy_privacy"})}</li>                                            
                                            <li onClick={()=>{handleClick('gdpr')}}>{translate({lang: lang, info: "GDPR"})}</li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col sm="4">
                                    <div className="footer_list">
                                        <h4>{translate({lang: lang, info: "links"})}</h4>
                                        <ul>                                            
                                            <li onClick={()=>{handleClick('dashboard')}}>{translate({lang: lang, info: "dashboard"})}</li>
                                            <li onClick={()=>{handleClick('market')}}>{translate({lang: lang, info: "market"})}</li>
                                            <li onClick={()=>{handleClick('how_to_play')}}>{translate({lang: lang, info: "how_to_play"})}</li>
                                            <li onClick={()=>{handleClick('Questions')}}>{translate({lang: lang, info: "questions"})}</li>
                                        </ul>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col md="4">                            
                            <div className="newsletter_container">
                                <h4>{translate({lang: lang, info: "newsletter"})}</h4>
                                <div className="newsletter_box">
                                    <input className="input_light" type="text" value={email} onChange={(e)=>{handleChangeInput(e)}}/>
                                    <Button type="button" onClick={(e)=>handleSubmitNewsletter(e)} className="mybutton button_fullcolor">
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                    </Button>

                                    {!newsletterError.email.fill ? (
                                        <div className="alert alert-danger">
                                            <p className="text_red">
                                                {translate({ lang: lang, info: newsletterError.email.fill_message })}
                                            </p>
                                        </div>
                                    ) : !newsletterError.email.validate ? (
                                        <div className="alert alert-danger">
                                            <p className="text_red">
                                                {translate({ lang: lang, info: newsletterError.email.validate_message })}
                                            </p>
                                        </div>
                                    ) : null}

                                    {sendResults === "email_send" ? <div className="alert alert-success">
                                        <p className="text_green">
                                            {translate({lang: lang, info: sendResults})}
                                        </p>
                                    </div> : null}
                                    {sendResults === "email_no_send" ? <div className="alert alert-danger">
                                        <p className="text_red">{translate({lang: lang, info: sendResults})}</p>
                                    </div> : null}
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <footer>
                                <h6>Copyright © <span id="copyright_year">{date}</span> Oana Popescu. {translate({lang: lang, info: "all_rights_reserved"})}.</h6>
                            </footer>
                        </Col>
                    </Row>
                </Col>
                <Col sm="2"/>
            </Row>
            
        </div>
    </div>
}
export default Footer