import React from 'react'
import { translate } from '../../../translations/translate'
import { Row, Col } from 'react-bootstrap'
import Stripe from './type/stripe'
import Paypal from './type/paypal'
import Crypto from './type/crypto'

function PaymentForm(props){
    const {paymentChoice, settings, handleChangeCheck} = props
    const {lang} = settings

    return <>
        <Row>
            <Col sm={12}>
                <div className="checkbox_radio_container payment_details_title">
                    <label>
                        <input 
                            type="radio" 
                            name="paymentChoice" 
                            checked={paymentChoice.stripe} 
                            onChange={() => handleChangeCheck("stripe")}
                        />
                        {translate({ lang: lang, info: "pay_card" })}
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="paymentChoice" 
                            checked={paymentChoice.paypal} 
                            onChange={() => handleChangeCheck("paypal")}
                        />
                        {translate({ lang: lang, info: "pay_paypal" })}
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="paymentChoice" 
                            checked={paymentChoice.crypto} 
                            onChange={() => handleChangeCheck("crypto")}
                        />
                        {translate({ lang: lang, info: "pay_crypto" })}
                    </label>
                </div>
            </Col>
        </Row>        
        {(() => {
            if(paymentChoice.stripe){
                return <Stripe {...props} />
            }
            if(paymentChoice.paypal){
                return <Paypal {...props} />
            }
            if(paymentChoice.crypto){
                return <Crypto {...props} />
            }
            return <p>{translate({lang: lang, info: "error"})}</p>
        })()}
    </>
}
export default PaymentForm