import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from "../../../../translations/translate"

function Paypal(props) {
    const {lang, minimum_amount_usd} = props  

    return <Row>
        <Col sm={12}>
            <p><span>{translate({lang: lang, info: "min_amount"})}</span>: <span>{minimum_amount_usd} USD</span></p>
        </Col>
    </Row>
}

export default Paypal