import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashCan} from '@fortawesome/free-solid-svg-icons'
import { translate } from '../../../translations/translate'
import vegetables_yellow from '../../../img/icons/vegetables_yellow.png'
import Counter from '../../partials/counter'
import { decryptData } from '../../../utils/crypto'
import { convertCurrency } from '../../../utils/utils'

function List(props){
    const {list, user, settings, exchange_rates} = props
    const {lang, currency} = settings
    let max = user.money ? decryptData(user.money) : 0

    function updateQtyProduct(x, item){
        let payload = {...item, qty: x}
        if(typeof props.updateQtyProduct === "function"){
            props.updateQtyProduct(payload)
        }
    }

    function removeProduct(item){
        if(typeof props.removeProduct === "function"){
            props.removeProduct(item)
        }
    }

    return <div id="cart_list" className="cart_box shadow_concav">
        <div className="cart_list_items 1">
            {list.map((item, i)=>{                
                let cart_item_total_price = item.qty * convertCurrency(item.price, currency, exchange_rates)
                cart_item_total_price = parseFloat(cart_item_total_price.toFixed(2))                              
                return <div key={i} className="cart_item">
                    <Row>
                        <Col xs={8}>
                            <Row>
                                <Col xs={6} sm={4} className="cart_image">
                                    <div className="crop_vegetables">
                                        <img alt="vegetable" className={'vegetable '+item.id} src={vegetables_yellow} />
                                    </div>
                                </Col>
                                <Col xs={6} sm={8} className="cart_info">
                                    <h4>{item["name_" + lang.toLowerCase()] || item.name_eng.toLowerCase()}</h4>                                    
                                    <p>
                                        <b>{translate({lang: lang, info: "price"})}</b>: {convertCurrency(item.price, currency, exchange_rates)} {currency}
                                    </p>
                                    <p><b>{translate({lang: lang, info: "qty"})}</b>: {item.qty}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <Counter min={1} num={item.qty} max={max} update={(e)=>updateQtyProduct(e, item)}></Counter>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={4} className="cart_action">
                            <h4><b>{translate({lang: lang, info: "total_price"})}</b>: {cart_item_total_price} {currency}</h4>
                            <Button 
                                type="button"  
                                className="mybutton round button_transparent shadow_convex remove"
                                onClick={()=>removeProduct(item)}
                            ><FontAwesomeIcon icon={faTrashCan}/></Button>
                        </Col>
                    </Row>
                </div>
            })}
        </div>
    </div>
}
export default List