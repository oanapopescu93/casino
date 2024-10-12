import React from 'react'
import { translate } from '../../../translations/translate'
import { Row, Col } from 'react-bootstrap'
import Stripe from './type/stripe'
import Paypal from './type/paypal'
import Crypto from './type/crypto'

function PaymentForm(props){
    const {paymentDetails, settings, handleChangeCheck} = props
    const {lang} = settings

    return <>
        <Row>
            <Col sm={12}>
                <div className="checkbox_radio_container payment_details_title">
                    <label>
                        <input 
                            type="radio" 
                            name="paymentChoice" 
                            checked={paymentDetails.option === "card"} 
                            onChange={() => handleChangeCheck("card")}
                        />
                        {translate({ lang: lang, info: "pay_card" })}
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="paymentChoice" 
                            checked={paymentDetails.option === "paypal"} 
                            onChange={() => handleChangeCheck("paypal")}
                        />
                        {translate({ lang: lang, info: "pay_paypal" })}
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="paymentChoice" 
                            checked={paymentDetails.option === "crypto"} 
                            onChange={() => handleChangeCheck("crypto")}
                        />
                        {translate({ lang: lang, info: "pay_crypto" })}
                    </label>
                </div>
            </Col>
        </Row>        
        {(() => {
            switch(paymentDetails.option){
                case "card":
                    return <Stripe {...props} />
                case "paypal":
                    return <Paypal {...props} />
                case "crypto":
                    return <Crypto {...props} />
                default:
                    <p>{translate({lang: lang, info: "error"})}</p>
            }
        })()}
    </>
}
export default PaymentForm