import React from 'react'
import { translate } from '../../../translations/translate'
import { Row, Col, Button } from 'react-bootstrap'
import { checkoutData, convertCurrency } from '../../../utils/utils'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStore, faUser, faCartShopping} from '@fortawesome/free-solid-svg-icons'

function PaymentDetails(props){
    const {lang, template, paymentDetails, amount, gateway, gatewayDetails, currency, exchange_rates} = props 
    const monthOptions = checkoutData().monthOptions

    let payment_options = {
        "1": "pay_card",
        "2": "pay_paypal",
        "3": "pay_crypto"
    }
    const details = {
        'name': paymentDetails.name,
        'email': paymentDetails.email,
        'phone': paymentDetails.phone,
        'country': paymentDetails.country,
        'city': paymentDetails.city,
        'card_number': paymentDetails.cardNumber,
        'month': translate({ lang: lang, info: monthOptions[parseInt(paymentDetails.month)] }),
        'year': paymentDetails.year,
        'cvv': paymentDetails.cvv,
        'bitcoin_address': paymentDetails.bitcoin_address,
        'payment_methode': payment_options[paymentDetails.option],
    }
    const filteredDetails = Object.keys(details)
        .filter(key => gatewayDetails[gateway].includes(key))
        .reduce((obj, key) => {
            obj[key] = details[key]
            return obj
        }, {})

    function sendPayment(){
        if(props.sendPayment && typeof props.sendPayment === "function"){
            props.sendPayment()
        }
    }

    function handleBack(choice){
        if(props.handleBack && typeof props.handleBack === "function"){
            props.handleBack(choice)
        }
    }

    return <>        
        {paymentDetails ? <>
            <Row id="payment_details">                
                <Col sm={8}>
                    {filteredDetails["payment_methode"] !== "pay_paypal" && filteredDetails["payment_methode"] !== "pay_crypto" ? <Row>
                        <Col sm={6} className="payment_details_box">
                            <div className="payment_details_title">
                                <h3>{translate({lang: lang, info: "customer_info"})}</h3>
                            </div>
                            <div className="payment_details_body">
                                <p><strong>{translate({ lang: lang, info: "name" })}:</strong> {filteredDetails["name"] ? filteredDetails["name"] : '-'}</p>
                                <p><strong>{translate({ lang: lang, info: "email" })}:</strong> {filteredDetails["email"] ? filteredDetails["email"] : '-'}</p>
                                <p><strong>{translate({ lang: lang, info: "phone" })}:</strong> {filteredDetails["phone"] ? filteredDetails["phone"] : '-'}</p>
                                <p><strong>{translate({ lang: lang, info: "country" })}:</strong> {filteredDetails["country"] ? filteredDetails["country"] : '-'}</p>
                                <p><strong>{translate({ lang: lang, info: "city" })}:</strong> {filteredDetails["city"] ? filteredDetails["city"] : '-'}</p>
                            </div>
                        </Col>
                        <Col sm={6} className="payment_details_box">
                            <div className="payment_details_title">
                                <h3>{translate({lang: lang, info: "payment_info"})}</h3>
                            </div>
                            <div className="payment_details_body">
                                <p><strong>{translate({ lang: lang, info: "payment_methode" })}:</strong> {filteredDetails["payment_methode"] ? translate({ lang: lang, info: filteredDetails["payment_methode"] }) : '-'}</p>
                                {filteredDetails["payment_methode"] === "pay_card" ? <>
                                    <p><strong>{translate({ lang: lang, info: "card_number" })}:</strong> {filteredDetails["card_number"] ? filteredDetails["card_number"] : '-'}</p>
                                    <p><strong>{translate({ lang: lang, info: "month" })}:</strong> {filteredDetails["month"] ? filteredDetails["month"] : '-'}</p>
                                    <p><strong>{translate({ lang: lang, info: "year" })}:</strong> {filteredDetails["year"] ? filteredDetails["year"] : '-'}</p>
                                    <p><strong>{translate({ lang: lang, info: "cvv" })}:</strong> {filteredDetails["cvv"] ? filteredDetails["cvv"] : '-'}</p>
                                </> : null}
                            </div>
                        </Col>
                    </Row> : <Row>
                        <Col sm={12} className="payment_details_box">
                            <div className="payment_details_title">
                                <h3>{translate({lang: lang, info: "payment_info"})}</h3>
                            </div>
                            <div className="payment_details_body">
                                <p><strong>{translate({ lang: lang, info: "payment_methode" })}:</strong> {filteredDetails["payment_methode"] ? translate({ lang: lang, info: filteredDetails["payment_methode"] }) : '-'}</p>
                            </div>
                        </Col>
                    </Row>}
                </Col>
                <Col sm={4}>
                    <Row>
                        <Col sm={12}>
                            <div className="payment_details_total_price 2">
                                <h3>
                                    <b>{translate({lang: lang, info: "total_price"})}</b>: {convertCurrency(amount, currency, exchange_rates)} {currency}
                                </h3>
                            </div>
                        </Col>
                    </Row>
                    <Row> 
                        <Col sm={12} className="button_action_group">
                            <Button 
                                type="button"  
                                className="mybutton button_fullcolor shadow_convex"
                                onClick={()=>sendPayment()}
                            ><FontAwesomeIcon icon={faCartShopping} /> {translate({lang: lang, info: "pay"})}</Button>
                            {(() => {
                                let choice = null
                                let icon = null
                                switch(template){
                                    case "buy_carrots":
                                        choice = "dashboard"
                                        icon = faUser
                                        break
                                    case "checkout":
                                        choice = "market"
                                        icon = faStore
                                        break                                                 
                                }
                                return <>{choice && icon ? <Button 
                                    type="button"  
                                    className="mybutton button_fullcolor shadow_convex"
                                    onClick={()=>handleBack(choice)}
                                ><FontAwesomeIcon icon={icon} /> {translate({lang: lang, info: choice})}</Button> : null}</>
                            })()}
                        </Col> 
                    </Row>
                </Col>
            </Row>
        </> : <p>{translate({lang: lang, info: "error"})}</p>} 
    </>
}
export default PaymentDetails