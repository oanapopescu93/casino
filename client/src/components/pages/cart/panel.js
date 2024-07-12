import React from 'react'
import { Button } from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faTrashCan, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { translate } from '../../../translations/translate'
import { convertCurrency } from '../../../utils/utils'

function Panel(props){    
    const {list, promo, settings, exchange_rates} = props
    const {lang, currency} = settings

    let total = totalPriceSum()
    let total_promo = total
    if(promo && Object.keys(promo).length>0){
        total_promo = (total_promo - (total_promo * promo.discount)/100).toFixed(2)
    }

    function totalPriceSum(){
        let total = 0
        for(let i in list){
            total = total + list[i].price * list[i].qty
        }
        return total.toFixed(2)
    }

    function removeAll(){
        if(typeof props.removeAll === "function"){
            props.removeAll()
        }
    }

    function handleCheckout(){
        if(typeof props.handleCheckout === "function"){
            props.handleCheckout()
        }
    }

    function handleContinueShopping(){
        if(typeof props.handleContinueShopping === "function"){
            props.handleContinueShopping()
        }
    }

    return <div id="cart_panel">
        <div className="cart_total_price 2">
            {promo && Object.keys(promo).length>0 ? <>
                <p><b>{translate({lang: lang, info: "price"})}</b>: {convertCurrency(total, currency, exchange_rates)} {currency}</p>
                <p><b>{translate({lang: lang, info: "promo_discount"})}: </b><span>-{promo.discount}%</span></p>
                <h3><b>{translate({lang: lang, info: "total_price"})}</b>: {convertCurrency(total_promo, currency, exchange_rates)} {currency}</h3>
            </> : <h3><b>{translate({lang: lang, info: "total_price"})}</b>: {convertCurrency(total, currency, exchange_rates)} {currency}</h3>}
        </div>
        <div className="button_action_group">
            <Button 
                type="button"  
                className="mybutton button_fullcolor shadow_convex"
                onClick={()=>handleCheckout()}
            ><FontAwesomeIcon icon={faCartShopping}/><span>{translate({lang: lang, info: "checkout"})}</span></Button>            
            <Button 
                type="button"  
                className="mybutton button_fullcolor shadow_convex"
                onClick={()=>handleContinueShopping()}
            ><FontAwesomeIcon icon={faCartShopping}/><span>{translate({lang: lang, info: "continue_shopping"})}</span></Button>
            <Button 
                type="button"  
                className="mybutton button_fullcolor shadow_convex"
                onClick={()=>removeAll()}
            ><FontAwesomeIcon icon={faTrashCan}/><span>{translate({lang: lang, info: "remove_all"})}</span></Button>
        </div>
    </div>
}
export default Panel