import React from 'react'
import { translate } from '../../../translations/translate'
import { Row, Col, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { checkoutData, convertCurrency, showCardNumber } from '../../../utils/utils'
import {faStore, faUser, faCartShopping, faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'
import Spinner from '../spinner'

function PaymentDetails(props){
    const {
        paymentDetails, template, settings, paymentSending, amount, fiatEquivalent, cryptoArray, exchange_rates, 
        handleSendPayment, handleBack
    } = props 
    const {lang, currency} = settings
    const monthOptions = checkoutData().monthOptions

    return <>
        <p>{translate({lang, info: "under_construction"})}</p>    
        {paymentDetails ? <>
            <Row id="payment_details">                
                <Col sm={8}>
                {(() => {
                        switch (paymentDetails.option) {
                            case "paypal":
                                return <Row>
                                    <Col sm={12} className="payment_details_box">
                                        <div className="payment_details_title">
                                            <h3>{translate({lang, info: "payment_info"})}</h3>
                                        </div>
                                        <div className="payment_details_body">
                                            <p><strong>{translate({ lang, info: "payment_methode" })}:</strong> {translate({ lang, info: paymentDetails.option })}</p>
                                        </div>
                                    </Col>
                                </Row>
                            case "crypto": 
                                let cryptoDetails = cryptoArray.find(item => item.value === fiatEquivalent.currency_to)
                                return <Row>
                                    <Col sm={12} className="payment_details_box">
                                        <div className="payment_details_title">
                                            <h3>{translate({lang, info: "payment_info"})}</h3>
                                        </div>
                                        <div className="payment_details_body">
                                            <p><strong>{translate({ lang, info: "payment_methode" })}:</strong> {translate({ lang, info: paymentDetails.option })}</p>
                                            <p><strong>{translate({ lang, info: "crypto" })}:</strong> {cryptoDetails ? cryptoDetails.text : "-"}</p>
                                            <p><strong>{translate({ lang, info: "your_amount_in_fiat_equivalent"})}:</strong> {fiatEquivalent.estimated_amount} {fiatEquivalent.currency_to}</p>
                                        </div>
                                    </Col>
                                </Row>
                            case "stripe":
                            default:
                                return <Row>
                                    <Col sm={6} className="payment_details_box">
                                        <div className="payment_details_title">
                                            <h3>{translate({lang, info: "customer_info"})}</h3>
                                        </div>
                                        <div className="payment_details_body">
                                            <p><strong>{translate({ lang, info: "name" })}:</strong> {paymentDetails.name ? paymentDetails.name : '-'}</p>
                                            <p><strong>{translate({ lang, info: "email" })}:</strong> {paymentDetails.email ? paymentDetails.email : '-'}</p>
                                            <p><strong>{translate({ lang, info: "phone" })}:</strong> {paymentDetails.phone ? paymentDetails.phone : '-'}</p>
                                            <p><strong>{translate({ lang, info: "country" })}:</strong> {paymentDetails.country && paymentDetails.country !== "" ? paymentDetails.country : '-'}</p>
                                            <p><strong>{translate({ lang, info: "city" })}:</strong> {paymentDetails.city && paymentDetails.city !== "" ? paymentDetails.city : '-'}</p>
                                        </div>
                                    </Col>
                                    <Col sm={6} className="payment_details_box">
                                        <div className="payment_details_title">
                                            <h3>{translate({lang, info: "payment_info"})}</h3>
                                        </div>
                                        <div className="payment_details_body">
                                            <p><strong>{translate({ lang, info: "payment_methode" })}:</strong> {translate({ lang, info: paymentDetails.option })}</p>
                                            <p><strong>{translate({ lang, info: "card_number" })}:</strong> {paymentDetails.cardNumber ? showCardNumber(paymentDetails.cardNumber) : '-'}</p>
                                            <p><strong>{translate({ lang, info: "month" })}:</strong> {translate({ lang, info: monthOptions[parseInt(paymentDetails.month)] })}</p>
                                            <p><strong>{translate({ lang, info: "year" })}:</strong> {paymentDetails.year ? paymentDetails.year : '-'}</p>
                                            <p><strong>{translate({ lang, info: "cvv" })}:</strong> {paymentDetails.cvv ? paymentDetails.cvv : '-'}</p>
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
                                    <b>{translate({lang, info: "total_price"})}</b>: {convertCurrency(amount, currency, exchange_rates)} {currency}
                                </h3>
                            </div>
                        </Col>
                    </Row>
                    <Row> 
                        <Col sm={12} className="button_action_group">
                            <Button 
                                type="button"  
                                className="mybutton button_fullcolor shadow_convex"
                                onClick={()=>handleSendPayment()}
                            >{paymentSending ? <>
                                <Spinner size="small" color="black"/>
                            </> : <>
                                <FontAwesomeIcon icon={faCartShopping} /> {translate({ lang, info: "pay" })}
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
                                ><FontAwesomeIcon icon={icon} /> {translate({ lang, info: choice })}</Button> : null}</>
                            })()}
                        </Col> 
                    </Row>
                </Col>
            </Row>
        </> : <p>{translate({lang, info: "error"})}</p>} 
        <div className="button_action_group payment_buttons_container">
			<div className="tooltip">
				<Button 
					type="button"
					className="mybutton round button_transparent shadow_convex"
					onClick={()=>handleBack()}
				><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
				<span className="tooltiptext">{translate({ lang, info: "back" })}</span>
			</div>
		</div>         
    </>
}
export default PaymentDetails