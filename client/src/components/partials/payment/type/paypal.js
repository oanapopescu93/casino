import React, { useState, useEffect, useRef } from 'react'
import { Col, Row, Dropdown, DropdownButton } from 'react-bootstrap'
import { translate } from "../../../../translations/translate"
import { checkoutData } from '../../../../utils/utils'
import countriesData from '../../../../utils/constants/countries.json'

function Paypal(props) {
    const {paymentDetails, settings} = props
    const {lang} = settings    

    return <Row id="payment_form_paypal">
        <Col sm={12}>
            Paypal
        </Col>
    </Row>
}

export default Paypal