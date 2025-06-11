import React from 'react'
import { translate } from '../../../../../translations/translate'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashCan, faCartShopping} from '@fortawesome/free-solid-svg-icons'
import vegetables_yellow from '../../../../../img/icons/vegetables/vegetables_yellow.png'
import vegetables_pink from '../../../../../img/icons/vegetables/vegetables_pink.png'
import vegetables_green from '../../../../../img/icons/vegetables/vegetables_green.png'
import vegetables_orange from '../../../../../img/icons/vegetables/vegetables_orange.png'
import Counter from '../../../../partials/counter'
import { Button } from 'react-bootstrap'
import { convertCurrency } from '../../../../../utils/utils'

function Cart(props){
    const {
        cart, home, settings, exchange_rates, money,
        cartRemoveAllProduct, cartRemoveProduct, updateQtyProduct, handleCheckout
    } = props
    const {lang, currency, theme} = settings
    
    let market = home.market ? home.market : []
    let total = totalPriceSum().toFixed(2)
    let max = money 

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

    function chooseImage(){
        switch (theme) {
            case 'purple':
                return vegetables_pink
            case 'black':
                return vegetables_green
            case 'blue':
                return vegetables_orange
            default:
              return vegetables_yellow
        }
    }

    return <div className="cart box">								
        {cart && cart.length>0 ? <>
            <div className="cart_header">
                <h3>{translate({lang, info: "cart"})}</h3>
            </div>
            <div className="cart_list">
                {cart.map((item, i)=>{
                    let product = market.filter(a => a.id === item.id)
                    let cart_item_total_price = item.qty * convertCurrency(product[0].price, currency, exchange_rates)
                    cart_item_total_price = parseFloat(cart_item_total_price.toFixed(2))                    
                    return <div key={i} className='cart_item'>
                        <div className="cart_image">
                            <div className="crop_vegetables">
                                <img alt="vegetable" className={'vegetable '+item.id} src={chooseImage()} />
                            </div>
                        </div>
                        <div className="cart_info">
                            <h4>{product[0]["name_" + lang.toLowerCase()] || product[0].name_eng.toLowerCase()}</h4>
                            <p><b>{translate({lang, info: "price"})}</b>: {convertCurrency(product[0].price, currency, exchange_rates)} {currency}</p>
                            <p><b>{translate({lang, info: "qty"})}</b>: {item.qty}</p>
                        </div>
                        <div className="cart_buttons">
                            <h4><b>{translate({lang, info: "price"})}</b>: {cart_item_total_price} {currency}</h4> 
                            <Button 
                                type="button"  
                                className="mybutton round button_transparent shadow_convex remove"
                                onClick={()=>cartRemoveProduct(product[0])}
                            ><FontAwesomeIcon icon={faTrashCan}/></Button>
                        </div>
                        <div className="cart_counter">
                            <Counter  num={item.qty} max={max} update={(e)=>updateQtyProduct({...item, qty: e})} />
                        </div>
                    </div>
                })}
            </div>
            <div className="cart_footer">
                <div className="cart_total_price 1">
                    <h3><b>{translate({lang, info: "total_price"})}</b>: {convertCurrency(total, currency, exchange_rates)} {currency}</h3>
                </div>
                <div className="cart_button">
                    <Button 
                        type="button"  
                        className="mybutton button_transparent shadow_convex"
                        onClick={()=>cartRemoveAllProduct()}
                    ><FontAwesomeIcon icon={faTrashCan}/>&nbsp;<span>{translate({lang, info: "remove_all"})}</span></Button>
                </div>
                <div className="cart_button">
                    <Button 
                        type="button"  
                        className="mybutton button_fullcolor shadow_convex"
                        onClick={()=>handleCheckout()}
                    ><FontAwesomeIcon icon={faCartShopping}/>&nbsp;<span>{translate({lang, info: "checkout"})}</span></Button>
                </div>
            </div>
        </> : <p>{translate({lang, info: "no_cart"})}</p>}
    </div>
}
export default Cart