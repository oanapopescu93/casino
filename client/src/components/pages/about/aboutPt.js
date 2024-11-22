import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons'

function AboutPt(props){
    const {settings, casino_name, handleHowToPlay} = props
    const {lang} = settings
    return <Row id="about" className="other_page_container">
        <Col lg={2} />
        <Col lg={8}>
            AboutPortuguese
        </Col>
        <Col lg={2} />        
    </Row>
}

export default AboutPt