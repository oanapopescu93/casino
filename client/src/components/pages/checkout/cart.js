import React from 'react'
import carrot_img from '../../../img/icons/carrot_icon.png'
import { translate } from '../../../translations/translate'
import vegetables_yellow from '../../../img/icons/vegetables_yellow.png'
import { Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'

function Cart(props){
    const {lang, home} = props
    let market = home.market ? home.market : []
    let cart = useSelector(state => state.cart.cart) 
    let promo = useSelector(state => state.cart.promo) 
    let list = getProducts(cart) 
    let total = totalPriceSum()
    let total_promo = total
    if(promo && Object.keys(promo).length>0){
        total_promo = (total_promo - (total_promo * promo.discount)/100).toFixed(2)
    }
    // total_promo = 123 //for testing

    function getProducts(cart){
        let array = []
        for(let i in cart){
            let index = market.findIndex((x) => x.id === cart[i].id)
            if(index !== -1){
                let elem = {...market[index], qty: cart[i].qty, cardId: cart[i].cartId}
                array.push(elem)
            }            
        }
        return array
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

    return <div className="cart_list">
        <div className="cart_list_items 2">
            {list.map(function(item, i){
                let cart_item_total_price = (item.qty * item.price).toFixed(2)
                return <div key={i} className='cart_item'>
                    <Row>
                        <Col xs={6} sm={4} className="cart_image">
                            <div className="crop_vegetables">
                                <img alt="vegetable" className={'vegetable '+item.id} src={vegetables_yellow}></img>
                            </div>
                        </Col>
                        <Col xs={6} sm={8} className="cart_info">
                            {(() => {
                                switch (lang) {
                                    case "DE":
                                        return <h4>{item.name_de}</h4>
                                    case "ES":
                                        return <h4>{item.name_es}</h4>
                                    case "FR":
                                        return <h4>{item.name_fr}</h4>
                                    case "IT":
                                        return <h4>{item.name_it}</h4>
                                    case "PT":
                                        return <h4>{item.name_pt}</h4>
                                    case "RO":
                                        return <h4>{item.name_ro}</h4>
                                    case "RU":
                                        return <h4>{item.name_ru}</h4>
                                    case "ENG":
                                    default:
                                        return <h4>{item.name_eng}</h4>
                                }
                            })()}
                            <h4><b>{translate({lang: lang, info: "total_price"})}</b>: {cart_item_total_price}<img alt="carrot_img" className="currency_img" src={carrot_img}/></h4>                                   
                        </Col>
                    </Row>
                </div>
            })}
        </div>
    </div>
}
export default Cart