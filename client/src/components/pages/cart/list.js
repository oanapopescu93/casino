import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashCan} from '@fortawesome/free-solid-svg-icons'
import { translate } from '../../../translations/translate'
import vegetables_yellow from '../../../img/icons/vegetables_yellow.png'
import carrot_img from '../../../img/icons/carrot_icon.png'
import Counter from '../../partials/counter'
import { decryptData } from '../../../utils/crypto'

function List(props){
    const {list, lang, user} = props
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
            {list.map(function(item, i){
                let cart_item_total_price = (item.qty * item.price).toFixed(2)
                return <div key={i} className="cart_item">
                    <Row>
                        <Col xs={8}>
                            <Row>
                                <Col xs={6} sm={4} className="cart_image">
                                    <div className="crop_vegetables">
                                        <img alt="vegetable" className={'vegetable '+item.id} src={vegetables_yellow}></img>
                                    </div>
                                </Col>
                                <Col xs={6} sm={8} className="cart_info">
                                    {(() => {                                        
                                        switch (props.lang) {
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
                                    <p><b>{translate({lang: lang, info: "price"})}</b>: {item.price}<img alt="carrot_img" className="currency_img" src={carrot_img}/></p>
                                    <p><b>{translate({lang: lang, info: "qty"})}</b>: {item.qty}</p>                                    
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <Counter num={item.qty} max={max} update={(e)=>updateQtyProduct(e, item)}></Counter>      
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={4} className="cart_action">
                            <h4><b>{translate({lang: lang, info: "total_price"})}</b>: {cart_item_total_price}<img alt="carrot_img" className="currency_img" src={carrot_img}/></h4>
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