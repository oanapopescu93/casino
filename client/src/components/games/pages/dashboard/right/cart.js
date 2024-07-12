import React from 'react'
import { translate } from '../../../../../translations/translate'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashCan, faCartShopping} from '@fortawesome/free-solid-svg-icons'
import vegetables_yellow from '../../../../../img/icons/vegetables_yellow.png'
import Counter from '../../../../partials/counter'
import { Button } from 'react-bootstrap'
import { decryptData } from '../../../../../utils/crypto'
import { convertCurrency } from '../../../../../utils/utils'

function Cart(props){
    const {cart, home, user, settings, exchange_rates} = props
    const {lang, currency} = settings
    let market = home.market ? home.market : []
    let total = totalPriceSum().toFixed(2)
    let max = user.money ? decryptData(user.money) : 0

    function cartRemoveAllProduct(){
        if(typeof props.cartRemoveAllProduct === "function"){
            props.cartRemoveAllProduct()
        }
    }
    function cartRemoveProduct(item){
        if(typeof props.cartRemoveProduct === "function"){
            props.cartRemoveProduct(item)
        }
    }

    function updateQtyProduct(x, item){
        let payload = {...item, qty: x}
        if(typeof props.updateQtyProduct === "function"){
            props.updateQtyProduct(payload)
        }
    }

    function handleCheckout(){
        if(typeof props.handleCheckout === "function"){
            props.handleCheckout()
        }
    }

    function totalPriceSum(){
        let total = 0
        for(let i in cart){
            let product = market.filter(a => a.id === cart[i].id)
            if(product && product[0] && product[0].price){
                total = total + product[0].price * cart[i].qty
            }
        }
        return total
    }

    return <div className="cart box">								
        {cart && cart.length>0 ? <>
            <div className="cart_header">
                <h3>{translate({lang: lang, info: "cart"})}</h3>
            </div>
            <div className="cart_list">
                {cart.map((item, i)=>{
                    let product = market.filter(a => a.id === item.id)
                    let cart_item_total_price = item.qty * convertCurrency(product[0].price, currency, exchange_rates)
                    cart_item_total_price = parseFloat(cart_item_total_price.toFixed(2))                    
                    return <div key={i} className='cart_item'>
                        <div className="cart_image">
                            <div className="crop_vegetables">
                                <img alt="vegetable" className={'vegetable '+item.id} src={vegetables_yellow} />
                            </div>
                        </div>
                        <div className="cart_info">
                            <h4>{product[0]["name_" + lang.toLowerCase()] || product[0].name_eng.toLowerCase()}</h4>
                            <p><b>{translate({lang: lang, info: "price"})}</b>: {convertCurrency(product[0].price, currency, exchange_rates)} {currency}</p>
                            <p><b>{translate({lang: lang, info: "qty"})}</b>: {item.qty}</p>
                        </div>
                        <div className="cart_buttons">
                            <h4><b>{translate({lang: lang, info: "price"})}</b>: {cart_item_total_price} {currency}</h4> 
                            <Button 
                                type="button"  
                                className="mybutton round button_transparent shadow_convex remove"
                                onClick={()=>cartRemoveProduct(product[0])}
                            ><FontAwesomeIcon icon={faTrashCan}/></Button>
                        </div>
                        <div className="cart_counter">
                            <Counter min={1} num={item.qty} max={max} update={(e)=>updateQtyProduct(e, item)} />
                        </div>
                    </div>
                })}
            </div>
            <div className="cart_footer">
                <div className="cart_total_price 1">
                    <h3><b>{translate({lang: lang, info: "total_price"})}</b>: {convertCurrency(total, currency, exchange_rates)} {currency}</h3>
                </div>
                <div className="cart_button">
                    <Button 
                        type="button"  
                        className="mybutton button_transparent shadow_convex"
                        onClick={()=>cartRemoveAllProduct()}
                    ><FontAwesomeIcon icon={faTrashCan}/> <span>{translate({lang: lang, info: "remove_all"})}</span></Button>
                </div>
                <div className="cart_button">
                    <Button 
                        type="button"  
                        className="mybutton button_fullcolor shadow_convex"
                        onClick={()=>handleCheckout()}
                    ><FontAwesomeIcon icon={faCartShopping}/> <span>{translate({lang: lang, info: "checkout"})}</span></Button>
                </div>
            </div>
        </> : <p>{translate({lang: lang, info: "no_cart"})}</p>}
    </div>
}
export default Cart