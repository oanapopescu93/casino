import React from 'react'
import { Col, Row, Button } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { convertCurrency } from '../../../utils/utils'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faStore, faUser, faCartShopping} from '@fortawesome/free-solid-svg-icons'
import Cart from '../../pages/checkout/cart'
import BuyCarrots from '../../pages/checkout/buyCarrots'

function PaymentCart(props){
    const {
        template, settings, cart, promo, exchange_rates, totalPromo, total,
        handleContinue, handleBack
    } = props
    const {lang, currency} = settings

    return <>
        {(() => {
            switch(template){
                case "checkout":
                    return <Row>
                        <Col sm={12}>
                            <h3 className="cart_header">{translate({lang: lang, info: "cart"})}</h3>
                        </Col>
                        <Col sm={12}>
                            <Cart {...props} cart={cart} />
                        </Col>
                        <Col sm={12}>
                            {totalPromo > 0 ? <div className="cart_total_price">
                                {promo && Object.keys(promo).length>0 ? <>
                                    <p><b>{translate({lang: lang, info: "price"})}</b>: {convertCurrency(total, currency, exchange_rates)} {currency}</p>
                                    <p><b>{translate({lang: lang, info: "promo_discount"})}: </b><span>-{promo.discount}%</span></p>
                                    <h3><b>{translate({lang: lang, info: "total_price"})}</b>: {convertCurrency(totalPromo, currency, exchange_rates)} {currency}</h3>
                                </> : <h3><b>{translate({lang: lang, info: "total_price"})}</b>: {convertCurrency(total, currency, exchange_rates)} {currency}</h3>}
                            </div> : null}                            
                        </Col>
                    </Row>
                case "buy_carrots":
                    return <Row>
                        <Col sm={12}>
                            <BuyCarrots {...props} />
                        </Col>
                    </Row>
                default:
                    return
            }
        })()}
        <Row>
            <Col sm={12} className="button_action_group">
                <Button 
                    type="button"  
                    className="mybutton button_fullcolor shadow_convex"
                    onClick={()=>handleContinue()}
                ><FontAwesomeIcon icon={faCartShopping} /> {translate({lang: lang, info: "continue"})}</Button>
                {(() => {
                    let choice = null
                    let icon = null
                    switch(template) {
                        case "buy_carrots":
                            choice = "dashboard"
                            icon = faUser
                            break
                        case "checkout":
                            choice = "market"
                            icon = faStore
                            break
                        default:
                    }
                    return <>{choice && icon ? <Button 
                        type="button"  
                        className="mybutton button_fullcolor shadow_convex"
                        onClick={()=>handleBack(choice)}
                    ><FontAwesomeIcon icon={icon} /> {translate({lang: lang, info: choice})}</Button> : null}</>
                })()}
            </Col>
        </Row>
    </>
}
export default PaymentCart