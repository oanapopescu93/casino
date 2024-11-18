import React from 'react'
import { translate } from '../../../translations/translate'
import vegetables_yellow from '../../../img/icons/vegetables/vegetables_yellow.png'
import vegetables_pink from '../../../img/icons/vegetables/vegetables_pink.png'
import vegetables_green from '../../../img/icons/vegetables/vegetables_green.png'
import vegetables_orange from '../../../img/icons/vegetables/vegetables_orange.png'
import { Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { convertCurrency, getProducts } from '../../../utils/utils'

function Cart(props){
    const {home, settings, exchange_rates} = props
    const {lang, currency, theme} = settings
    let market = home.market ? home.market : []
    let cart = useSelector(state => state.cart.cart)
    let list = getProducts(cart, market) 

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

    return <div className="cart_list">
        <div className="cart_list_items 2">
            {list.map((item, i)=>{
                let cart_item_total_price = convertCurrency(item.qty * item.price, currency, exchange_rates)
                return <div key={i} className='cart_item'>
                    <Row>
                        <Col xs={6} sm={12} md={4} className="cart_image">
                            <div className="crop_vegetables">
                                <img alt="vegetable" className={'vegetable '+item.id} src={chooseImage()} />
                            </div>
                        </Col>
                        <Col xs={6} sm={12} md={8} className="cart_info">
                            <h4>{item["name_" + lang.toLowerCase()] || item.name_eng.toLowerCase()}</h4>                            
                            <p><b>{translate({lang: lang, info: "total_price"})}</b>: {cart_item_total_price} {currency}</p>
                        </Col>
                    </Row>
                </div>
            })}
        </div>
    </div>
}
export default Cart