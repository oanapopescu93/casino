import React from 'react'
import { translate } from '../../../../../translations/translate'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashCan} from '@fortawesome/free-solid-svg-icons'
import vegetables_yellow from '../../../../../img/icons/vegetables_yellow.png'
import Counter from '../../../../partials/counter'
import carrot_img from '../../../../../img/icons/carrot_icon.png'
import { Button } from 'react-bootstrap'
import { decryptData } from '../../../../../utils/crypto'

function Cart(props){
    const {lang, cart, home, user} = props
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
                {cart.map(function(item, i){
                    let product = market.filter(a => a.id === item.id)
                    let cart_item_total_price = (item.qty * product[0].price).toFixed(2)
                    return <div key={i} className='cart_item'>
                        <div className="cart_image">
                            <div className="crop_vegetables">
                                <img alt="vegetable" className={'vegetable '+item.id} src={vegetables_yellow}></img>
                            </div>
                        </div>
                        <div className="cart_info">
                            {(() => {
                                switch (props.lang) {
                                    case "DE":
                                        return <h4>{product[0].name_de}</h4>
                                    case "ES":
                                        return <h4>{product[0].name_es}</h4>
                                    case "FR":
                                        return <h4>{product[0].name_fr}</h4>
                                    case "IT":
                                        return <h4>{product[0].name_it}</h4>
                                    case "PT":
                                        return <h4>{product[0].name_pt}</h4>
                                    case "RO":
                                        return <h4>{product[0].name_ro}</h4>
                                    case "RU":
                                        return <h4>{product[0].name_ru}</h4>
                                    case "ENG":
                                    default:
                                        return <h4>{product[0].name_eng}</h4>
                                } 
                            })()}
                            <p><b>{translate({lang: lang, info: "price"})}</b>: {product[0].price}<img alt="carrot_img" className="currency_img" src={carrot_img}/></p>
                            <p><b>{translate({lang: lang, info: "qty"})}</b>: {item.qty}</p>
                            <Counter num={item.qty} max={max} update={(e)=>updateQtyProduct(e, item)}></Counter>
                            <h4><b>{translate({lang: lang, info: "total_price"})}</b>: {cart_item_total_price}<img alt="carrot_img" className="currency_img" src={carrot_img}/></h4>
                        </div>                        
                        <div className="cart_price">  
                            <Button 
                                type="button"  
                                className="mybutton round button_transparent shadow_convex remove"
                                onClick={()=>cartRemoveProduct(product[0])}
                            ><FontAwesomeIcon icon={faTrashCan}/></Button>
                        </div>
                    </div>
                })}
            </div>
            <div className="cart_footer">
                <div className="cart_total_price">
                    <h3><b>{translate({lang: lang, info: "total_price"})}</b>: {total}<img alt="carrot_img" className="currency_img" src={carrot_img}/></h3>
                </div>
                <div className="cart_button">
                    <Button 
                        type="button"  
                        className="mybutton button_transparent shadow_convex"
                        onClick={()=>cartRemoveAllProduct()}
                    ><FontAwesomeIcon icon={faTrashCan}/></Button>
                </div>
                <div className="cart_button">
                    <Button 
                        type="button"  
                        className="mybutton button_fullcolor shadow_convex"
                        onClick={()=>handleCheckout()}
                    >{translate({lang: lang, info: "checkout"})}</Button>
                </div>
            </div>
        </> : <p>{translate({lang: lang, info: "no_cart"})}</p>}
    </div>
}
export default Cart