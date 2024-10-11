import React from 'react'
import { translate } from '../../../translations/translate'
import { Row, Col, Button } from 'react-bootstrap'
import { checkoutData, convertCurrency, showCardNumber } from '../../../utils/utils'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStore, faUser, faCartShopping, faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'
import Spinner from '../spinner'

function PaymentDetails(props){
    const {template, paymentDetails, amount, settings, exchange_rates, paymentSending, handleBack} = props 
    const {lang, currency} = settings
    const monthOptions = checkoutData().monthOptions

    let paymentOptions = {
        "1": "pay_card",
        "2": "pay_paypal",
        "3": "pay_crypto"
    }
    let cryptoArray = {
        btc: "Bitcoin",
        ltc: "Litcoin"
    }

    function sendPayment(){
        if(!paymentSending){
            props.sendPayment()
        }
    }

    return <>        
        {paymentDetails ? <>
            <Row id="payment_details">                
                <Col sm={8}>
                    {(() => {
                        switch (paymentDetails.option) {
                            case "2": //paypal
                                return <Row>
                                    <Col sm={12} className="payment_details_box">
                                        <div className="payment_details_title">
                                            <h3>{translate({lang: lang, info: "payment_info"})}</h3>
                                        </div>
                                        <div className="payment_details_body">
                                            <p><strong>{translate({ lang: lang, info: "payment_methode" })}:</strong> {translate({ lang: lang, info: paymentOptions[paymentDetails.option] })}</p>
                                            <p></p>
                                        </div>
                                    </Col>
                                </Row>
                            case "3": //crypto
                                return <Row>
                                    <Col sm={12} className="payment_details_box">
                                        <div className="payment_details_title">
                                            <h3>{translate({lang: lang, info: "payment_info"})}</h3>
                                        </div>
                                        <div className="payment_details_body">
                                            <p><strong>{translate({ lang: lang, info: "payment_methode" })}:</strong> {translate({ lang: lang, info: paymentOptions[paymentDetails.option] })}</p>
                                            <p><strong>{translate({ lang: lang, info: "crypto" })}:</strong> {paymentDetails.crypto && cryptoArray[paymentDetails.crypto] ? cryptoArray[paymentDetails.crypto] : '-'}</p>
                                        </div>
                                    </Col>
                                </Row>
                            case "1": //card
                            default:
                                return <Row>
                                    <Col sm={6} className="payment_details_box">
                                        <div className="payment_details_title">
                                            <h3>{translate({lang: lang, info: "customer_info"})}</h3>
                                        </div>
                                        <div className="payment_details_body">
                                            <p><strong>{translate({ lang: lang, info: "name" })}:</strong> {paymentDetails.name ? paymentDetails.name : '-'}</p>
                                            <p><strong>{translate({ lang: lang, info: "email" })}:</strong> {paymentDetails.email ? paymentDetails.email : '-'}</p>
                                            <p><strong>{translate({ lang: lang, info: "phone" })}:</strong> {paymentDetails.phone ? paymentDetails.phone : '-'}</p>
                                            <p><strong>{translate({ lang: lang, info: "country" })}:</strong> {paymentDetails.country && paymentDetails.country !== "" ? paymentDetails.country : '-'}</p>
                                            <p><strong>{translate({ lang: lang, info: "city" })}:</strong> {paymentDetails.city && paymentDetails.city !== "" ? paymentDetails.city : '-'}</p>
                                        </div>
                                    </Col>
                                    <Col sm={6} className="payment_details_box">
                                        <div className="payment_details_title">
                                            <h3>{translate({lang: lang, info: "payment_info"})}</h3>
                                        </div>
                                        <div className="payment_details_body">
                                            <p><strong>{translate({ lang: lang, info: "payment_methode" })}:</strong> {translate({ lang: lang, info: paymentOptions[paymentDetails.option] })}</p>
                                            <p><strong>{translate({ lang: lang, info: "card_number" })}:</strong> {paymentDetails.cardNumber ? showCardNumber(paymentDetails.cardNumber) : '-'}</p>
                                            <p><strong>{translate({ lang: lang, info: "month" })}:</strong> {translate({ lang: lang, info: monthOptions[parseInt(paymentDetails.month)] })}</p>
                                            <p><strong>{translate({ lang: lang, info: "year" })}:</strong> {paymentDetails.year ? paymentDetails.year : '-'}</p>
                                            <p><strong>{translate({ lang: lang, info: "cvv" })}:</strong> {paymentDetails.cvv ? paymentDetails.cvv : '-'}</p>
                                        </div>
                                    </Col>
                                </Row>
                        }
                    })()}
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
                            >{paymentSending ? <>
                                <Spinner size="small" color="black"/>
                            </> : <>
                                <FontAwesomeIcon icon={faCartShopping} /> {translate({lang: lang, info: "pay"})}
                            </>}</Button>
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
        <div className="button_action_group payment_buttons_container">
			<div className="tooltip">
				<Button 
					type="button"
					className="mybutton round button_transparent shadow_convex"
					onClick={()=>handleBack()}
				><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
				<span className="tooltiptext">{translate({lang: lang, info: "back"})}</span>
			</div>
		</div>         
    </>
}
export default PaymentDetails