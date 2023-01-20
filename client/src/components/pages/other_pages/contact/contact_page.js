import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'
import {game_page} from '../../../actions/actions'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ContactInfo from './contact_info'
import ContactForm from './contact_form'
import { getWindowDimensions } from '../../../utils'

function ContactPage(props){
    console.log(props)
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

    let dispatch = useDispatch()
	useEffect(() => {
		dispatch(game_page('contact'))	
        function handleResize() {
            setWindowDimensions(getWindowDimensions())
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
	}, [])
       
    return (
            <Row>
                {windowDimensions.width < 960 ? 
                    <>
                        <Col sm={12} className="contact_container color_yellow">
                            <ContactInfo lang={props.lang} contact={props.info.contact} size={windowDimensions}></ContactInfo>  
                            <ContactForm info={props.info}></ContactForm>
                        </Col>
                    </> : 
                    <>
                        <Col sm={2}></Col>
                        <Col sm={8} className="contact_container color_yellow shadow_concav">
                            <div className="deco">
                                <Col lg={8} md={6} sm={6} className="contact_info_container">
                                    <ContactForm info={props.info}></ContactForm>
                                </Col> 
                                <Col lg={4} md={6} sm={6} className="contact_form_container">
                                    <ContactInfo lang={props.lang} contact={props.info.contact} size={windowDimensions}></ContactInfo>  
                                </Col>                 
                            </div>                                          
                        </Col>
                        <Col sm={2}></Col>
                    </>
                }
            </Row>
    )
}

export default ContactPage