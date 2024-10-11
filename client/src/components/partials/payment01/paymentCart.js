import React, {useEffect, useState } from 'react'
import { translate } from '../../../translations/translate'
import { Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Cart from '../../pages/checkout/cart'
import { convertCurrency, getWindowDimensions } from '../../../utils/utils'

function PaymentCart(props){
    const {home, settings, exchange_rates} = props
    const {lang, currency} = settings
    let market = home.market ? home.market : []
    let cart = useSelector(state => state.cart.cart) 
    let promo = useSelector(state => state.cart.promo) 
    let total = totalPriceSum()
    let total_promo = total
    if(promo && Object.keys(promo).length>0){
        total_promo = (total_promo - (total_promo * promo.discount)/100).toFixed(2)
    }
    const [width, setWidth] = useState(getWindowDimensions().width)

    function handleResize(){
        setWidth(getWindowDimensions().width)
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize)
            handleResize()
            return () => window.removeEventListener("resize", handleResize)
        }
	}, [])

    function totalPriceSum(){
        let total = 0
        for(let i in cart){
            let product = market.filter(a => a.id === cart[i].id)
            if(product && product[0] && product[0].price){
                total = total + product[0].price * cart[i].qty
            }
        }
        return total.toFixed(2)
    }

    return <>
        {width >= 600 ? <>
            {cart && cart.length>0 ? <>
                <Row>
                    <Col sm={12}>
                        <h3 className="cart_header">{translate({lang: lang, info: "cart"})}</h3>
                    </Col>
                    <Col sm={12}>
                        <Cart {...props} cart={cart}></Cart>
                    </Col>
                </Row>
            </> : null} 
            <Row>
                <Col sm={12}>
                    <div className="cart_total_price 3">
                        {promo && Object.keys(promo).length>0 ? <>
                            <p><b>{translate({lang: lang, info: "price"})}</b>: {convertCurrency(total, currency, exchange_rates)} {currency}</p>
                            <p><b>{translate({lang: lang, info: "promo_discount"})}: </b><span>-{promo.discount}%</span></p>
                            <h3><b>{translate({lang: lang, info: "total_price"})}</b>: {convertCurrency(total_promo, currency, exchange_rates)} {currency}</h3>
                        </> : <h3><b>{translate({lang: lang, info: "total_price"})}</b>: {convertCurrency(total, currency, exchange_rates)} {currency}</h3>}
                    </div>
                </Col>
            </Row> 
        </> : null}
    </>
}
export default PaymentCart