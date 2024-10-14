import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from "../../../../translations/translate"

function Paypal(props) {
    const { settings, amount, minimum_amount } = props
    const { lang, currency } = settings

    return <Row id="payment_form_paypal">
        <Col sm={12}>
            {minimum_amount > amount ? <div className="alert alert-danger">
                <p className="text_red">
                    {translate({lang: lang, info: "amount_too_small_transaction"})}
                </p>
            </div> : <p><span>{translate({lang: lang, info: "min_amount"})}</span>: <span>{minimum_amount} {currency}</span></p>}
        </Col>
    </Row>
}

export default Paypal