import React from 'react'
import { Col, Row, Button } from 'react-bootstrap'
import { translate } from "../../../../translations/translate"
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPaypal } from '@fortawesome/free-brands-svg-icons'
import { convertCurrency } from '../../../../utils/utils'

function Paypal(props) {
    const { 
        settings, amount, minimum_amount, exchange_rates,
        handleSendPayment
     } = props
    const { lang, currency } = settings
    let price = convertCurrency(amount, currency, exchange_rates)

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
            {minimum_amount > price ? <Col sm={12}>
                <div className="alert alert-danger">
                    <p className="text_red">
                        {translate({lang, info: "amount_too_small_transaction"})}
                    </p>
                </div>
            </Col> : <Col sm={12} className="paypal_button_container">
                <Button 
                    type="button"  
                    className="mybutton button_fullcolor shadow_convex"
                    onClick={()=>handleSendPayment()}
                ><FontAwesomeIcon icon={faPaypal} /> {translate({lang, info: "pay"})}</Button>
            </Col>}
    </Row>
}

export default Paypal