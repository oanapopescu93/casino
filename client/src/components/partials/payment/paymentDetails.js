import React from 'react'
import { translate } from '../../../translations/translate'
import { Row, Col, Button } from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

function PaymentDetails(props){
    const {
        template, paymentDetails, settings, paymentSending, 
        sendPayment, handleBack
    } = props 
    const {lang, currency} = settings

    return <>        
        {paymentDetails ? <>
            <Row id="payment_details">                
                <Col sm={8}>
                    
                </Col>
                <Col sm={4}>
                    
                </Col>
            </Row>
        </> : <p>{translate({lang: lang, info: "error"})}</p>} 
        <div className="button_action_group payment_buttons_container">
			<div className="tooltip">
				<Button 
					type="button"
					className="mybutton round button_transparent shadow_convex"
					onClick={()=>handleBack()}
				><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
				<span className="tooltiptext">{translate({lang: lang, info: "back"})}</span>
			</div>
		</div>         
    </>
}
export default PaymentDetails