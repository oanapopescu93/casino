import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from "../../../../translations/translate"

function Paypal(props) {
    const {lang, paymentDetails, gateway, gatewayDetailsMandatory, paymentError} = props
    
    const [email] = useState(paymentDetails.email !== "" ? paymentDetails.email : "")    

    return <Row>
        <Col sm={12}>
            <label htmlFor="email">{translate({lang: lang, info: "email"})} {gatewayDetailsMandatory[gateway].includes("email") ? <>*</> : null}</label>
            <input defaultValue={email} className="input_light shadow_concav" type="text" placeholder="text@text.text" id="email" name="email"/>
            {!paymentError.email.fill ? <div className="alert alert-danger">
                <p className="text_red">
                    {translate({lang: lang, info: paymentError.email.fill_message})}
                </p>
            </div> : <>
                {!paymentError.email.validate ? <div className="alert alert-danger">
                    <p className="text_red">
                        {translate({lang: lang, info: paymentError.email.validate_message})}
                    </p>
                </div> : null}
            </>}
        </Col>
    </Row>
}

export default Paypal