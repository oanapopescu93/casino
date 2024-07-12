import React from 'react'
import { translate } from '../../../translations/translate'
import { Row, Col } from 'react-bootstrap'
import Paypal from './type/paypal'
import Stripe from './type/stripe'
import Crypto from './type/crypto'

function PaymentForm(props){
    const {radioOne, radioTwo, radioThree, settings} = props
    const {lang} = settings
    const minimum_amount_usd = 10

    function handleChangeCheck(x){
        if(typeof props.handleChangeCheck === "function"){
            props.handleChangeCheck(x)
        }
    }    

    return <form id="payment_form">
        <Row>
            <Col sm={12}>
                <div className="checkbox_radio_container payment_details_title">
                    <label>
                        <input id="pay_card" type="radio" name="radio1" checked={radioOne} onChange={()=>{handleChangeCheck("radio1")}}/>
                        {translate({lang: lang, info: "pay_card"})}
                    </label>
                    <label>
                        <input id="pay_paypal" type="radio" name="radio2" checked={radioTwo} onChange={()=>{handleChangeCheck("radio2")}}/>
                        {translate({lang: lang, info: "pay_paypal"})}
                    </label>
                    <label>
                        <input id="pay_crypto" type="radio" name="radio3" checked={radioThree} onChange={()=>{handleChangeCheck("radio3")}}/>
                        {translate({lang: lang, info: "pay_crypto"})}
                    </label>
                </div>
            </Col>
        </Row>        
        {(() => {
            if(radioOne){
                return <Stripe {...props} minimum_amount_usd={minimum_amount_usd}/>
            }
            if(radioTwo){
                return <Paypal {...props} minimum_amount_usd={minimum_amount_usd}/>
            }
            if(radioThree){
                return <Crypto {...props}/>
            }
        })()}
    </form>
}
export default PaymentForm