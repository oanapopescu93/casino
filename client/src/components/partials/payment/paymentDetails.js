import React from 'react'
import { translate } from '../../../translations/translate'
import { Row, Col, Button } from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'
import { checkoutData, showCardNumber } from '../../../utils/utils'

function PaymentDetails(props){
    const {
        paymentDetails, settings, paymentSending, 
        sendPayment, handleBack
    } = props 
    const {lang, currency} = settings
    const monthOptions = checkoutData().monthOptions

    return <>        
        {paymentDetails ? <>
            <Row id="payment_details">                
                <Col sm={8}>
                {(() => {
                        switch (paymentDetails.option) {
                            case "paypal":
                                return <Row>
                                    <Col sm={12} className="payment_details_box">
                                        <div className="payment_details_title">
                                            <h3>{translate({lang: lang, info: "payment_info"})}</h3>
                                        </div>
                                        <div className="payment_details_body">
                                            <p><strong>{translate({ lang: lang, info: "payment_methode" })}:</strong> {translate({ lang: lang, info: paymentDetails.option })}</p>
                                            <p></p>
                                        </div>
                                    </Col>
                                </Row>
                            case "crypto":
                                return <Row>
                                    <Col sm={12} className="payment_details_box">
                                        <div className="payment_details_title">
                                            <h3>{translate({lang: lang, info: "payment_info"})}</h3>
                                        </div>
                                        <div className="payment_details_body">
                                            <p><strong>{translate({ lang: lang, info: "payment_methode" })}:</strong> {translate({ lang: lang, info: paymentDetails.option })}</p>
                                            <p><strong>{translate({ lang: lang, info: "crypto" })}:</strong> {paymentDetails.crypto && cryptoArray[paymentDetails.crypto] ? cryptoArray[paymentDetails.crypto] : '-'}</p>
                                        </div>
                                    </Col>
                                </Row>
                            case "card":
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
                                            <p><strong>{translate({ lang: lang, info: "payment_methode" })}:</strong> {translate({ lang: lang, info: paymentDetails.option })}</p>
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
                    bbb
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