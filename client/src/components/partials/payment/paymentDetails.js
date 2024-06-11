import React from 'react'
import carrot_img from '../../../img/icons/carrot_icon.png'
import { translate } from '../../../translations/translate'
import { Row, Col, Button } from 'react-bootstrap'

function PaymentDetails(props){
    const {lang, paymentDetails, totalPromo, gateway, gatewayDetails} = props

    const details = {
        'name': paymentDetails.name,
        'email': paymentDetails.email,
        'phone': paymentDetails.phone,
        'country': paymentDetails.country,
        'city': paymentDetails.city,
        'card_number': paymentDetails.cardNumber,
        'month': paymentDetails.expiry_month,
        'year': paymentDetails.expiry_year,
        'cvv': paymentDetails.cvv,
        'bitcoin_address': paymentDetails.bitcoin_address,
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

    function handleBack(){
        if(props.handleBack && typeof props.handleBack === "function"){
            props.handleBack()
        }
    }

    return <>
        {paymentDetails ? <Row id="payment_details">
            <Col sm={12}>
                <Row>
                    <Col sm={12}>
                        <h3>{translate({lang: lang, info: "payment_details"})}</h3>  
                    </Col>
                </Row>
                <Row>
                    {Object.keys(filteredDetails).map((key) => (
                        <Col sm={12} md={6} lg={4} key={key} className="payment_details_box">
                            <p><strong>{translate({ lang: lang, info: key })}:</strong> {filteredDetails[key] ? filteredDetails[key] : '-'}</p>
                        </Col>
                    ))}
                </Row>
                <Row>
                    <Col sm={12}>
                        <h3><b>{translate({lang: lang, info: "total_price"})}</b>: {totalPromo}<img alt="carrot_img" className="currency_img" src={carrot_img}/></h3>
                    </Col>
                </Row>
                <Row> 
                    <Col sm={12} className="button_action_group">
                        <Button 
                            type="button"  
                            className="mybutton button_fullcolor shadow_convex"
                            onClick={()=>sendPayment()}
                        >{translate({lang: lang, info: "submit"})}</Button>
                        <Button 
                            type="button"  
                            className="mybutton button_fullcolor shadow_convex"
                            onClick={()=>handleBack()}
                        >{translate({lang: lang, info: "back"})}</Button>                    
                    </Col>             
                </Row>
            </Col>
        </Row> : <p>{translate({lang: lang, info: "error"})}</p>} 
    </>
}
export default PaymentDetails