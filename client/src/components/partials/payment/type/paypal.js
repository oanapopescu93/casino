import React from 'react'
import { Col, Row, Button } from 'react-bootstrap'
import { translate } from "../../../../translations/translate"
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPaypal } from '@fortawesome/free-brands-svg-icons'

function Paypal(props) {
    const { 
        settings, amount, minimum_amount,
        handleSendPayment
     } = props
    const { lang } = settings

    // test
    // email: sb-qpjfz10423946@personal.example.com
    // pass: cy-9_R6I
    // name: John Doe
    // phone: 4084372454
    // country: US 
    // type: personal
    // accound ID: AX25HA8A35E64
    // balance: USD 4,527

    return <Row id="payment_form_paypal">
            {minimum_amount > amount ? <Col sm={12}>
                <div className="alert alert-danger">
                    <p className="text_red">
                        {translate({lang: lang, info: "amount_too_small_transaction"})}
                    </p>
                </div>
            </Col> : <Col sm={12} className="paypal_button_container">
                <Button 
                    type="button"  
                    className="mybutton button_fullcolor shadow_convex"
                    onClick={()=>handleSendPayment()}
                ><FontAwesomeIcon icon={faPaypal} /> {translate({lang: lang, info: "pay"})}</Button>
            </Col>}
    </Row>
}

export default Paypal