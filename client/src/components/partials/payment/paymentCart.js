import React from 'react'
import carrot_img from '../../../img/icons/carrot_icon.png'
import { translate } from '../../../translations/translate'
import { Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Cart from '../../pages/checkout/cart'

function PaymentCart(props){
    const {lang, home} = props
    let market = home.market ? home.market : []
    let cart = useSelector(state => state.cart.cart) 
    let promo = useSelector(state => state.cart.promo) 
    let total = totalPriceSum()
    let total_promo = total
    if(promo && Object.keys(promo).length>0){
        total_promo = (total_promo - (total_promo * promo.discount)/100).toFixed(2)
    }
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
    {cart && cart.length>0 ? <>
        <Row>
            <Col sm={12}>
                <h3 className="cart_header">{translate({lang: props.lang, info: "cart"})}</h3>  
            </Col>
            <Col sm={12}>                        
                <Cart {...props} cart={cart}></Cart>
            </Col>                    
        </Row>   
    </> : null} 
    <Row>
        <Col sm={12}>
            <div className="cart_total_price">
                {promo && Object.keys(promo).length>0 ? <>
                    <p><b>{translate({lang: lang, info: "price"})}</b>: {total}<img alt="carrot_img" className="currency_img" src={carrot_img}/></p>            
                    <p><b>{translate({lang: lang, info: "promo_discount"})}: </b><span>-{promo.discount}%</span></p>
                    <h3><b>{translate({lang: lang, info: "total_price"})}</b>: {total_promo}<img alt="carrot_img" className="currency_img" src={carrot_img}/></h3>
                </> : <h3><b>{translate({lang: lang, info: "total_price"})}</b>: {total}<img alt="carrot_img" className="currency_img" src={carrot_img}/></h3>}
            </div>
        </Col>
    </Row>   
</>
}
export default PaymentCart