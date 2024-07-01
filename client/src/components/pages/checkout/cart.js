import React from 'react'
import carrot_img from '../../../img/icons/carrot_icon.png'
import { translate } from '../../../translations/translate'
import vegetables_yellow from '../../../img/icons/vegetables_yellow.png'
import { Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { getProducts } from '../../../utils/utils'

function Cart(props){
    const {lang, home} = props
    let market = home.market ? home.market : []
    let cart = useSelector(state => state.cart.cart)
    let list = getProducts(cart, market) 

    return <div className="cart_list">
        <div className="cart_list_items 2">
            {list.map((item, i)=>{
                let cart_item_total_price = (item.qty * item.price).toFixed(2)
                return <div key={i} className='cart_item'>
                    <Row>
                        <Col xs={6} sm={12} md={4} className="cart_image">
                            <div className="crop_vegetables">
                                <img alt="vegetable" className={'vegetable '+item.id} src={vegetables_yellow} />
                            </div>
                        </Col>
                        <Col xs={6} sm={12} md={8} className="cart_info">
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
                            <p><b>{translate({lang: lang, info: "total_price"})}</b>: {cart_item_total_price}<img alt="carrot_img" className="currency_img" src={carrot_img}/></p>
                        </Col>
                    </Row>
                </div>
            })}
        </div>
    </div>
}
export default Cart