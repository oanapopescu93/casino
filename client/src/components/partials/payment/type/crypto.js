import React, { useState, useEffect, useRef } from 'react'
import { Col, Row, Dropdown, DropdownButton } from 'react-bootstrap'
import { translate } from "../../../../translations/translate"
import { checkoutData } from '../../../../utils/utils'
import countriesData from '../../../../utils/constants/countries.json'

function Crypto(props) {
    const {paymentDetails, settings} = props
    const {lang} = settings    

    return <Row id="payment_form_crypto">
        <Col sm={12}>
            Crypto
        </Col>
    </Row>
}

export default Crypto