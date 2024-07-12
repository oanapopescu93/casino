import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button } from 'react-bootstrap'
import { cartUpdate, cartRemove, cartRemoveAll, getPromo } from '../../../reducers/cart'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import List from './list'
import Promo from './promo'
import Panel from './panel'
import { translate } from '../../../translations/translate'
import Header from '../../partials/header'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStore, faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'
import { getProducts } from '../../../utils/utils'

function Cart(props){
    const {home, settings} = props
    const {lang} = settings

    let market = home.market
    let cart = useSelector(state => state.cart.cart) 
    const [promo, setPromo] = useState(null) 
    let dispatch = useDispatch()
    let list = getProducts(cart, market)

    function updatePromo(x){
      setPromo(x)
      dispatch(getPromo(x))
    }

    function updateQtyProduct(item){
        dispatch(cartUpdate(item))
    }

    function removeProduct(item){
        dispatch(cartRemove(item))
    }

    function removeAll(){
        dispatch(cartRemoveAll())
    }

    function handleBack(){
        dispatch(changePage('Salon'))
		dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    function handleContinueShopping(){
        dispatch(changePage('Salon'))
		dispatch(changeGame(null))
        dispatch(changeGamePage('market'))
    }

    function handleCheckout(){
		dispatch(changePage('Checkout'))
		dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    return <div className="content_wrap">
        <Header template="cart" title={translate({lang: lang, info: "cart"})} /> 
        <div className="page_content">
            {list && list.length>0 ? <Row>
                <Col sm={8}>
                    <List 
                        {...props} 
                        list={list} 
                        updateQtyProduct={(e)=>updateQtyProduct(e)}
                        removeProduct={(e)=>removeProduct(e)}
                    />
                </Col>
                <Col sm={4}>
                    <Panel 
                        {...props} 
                        list={list}
                        promo={promo}
                        removeAll={()=>removeAll()}
                        handleBack={()=>handleBack()}
                        handleCheckout={()=>handleCheckout()}
                        handleContinueShopping={()=>handleContinueShopping()}
                    />
                    <Promo 
                        {...props} 
                        updatePromo={(e)=>updatePromo(e)}
                    />
                </Col>
            </Row> : 
            <Row>
                <Col sm={12}>
                    <p style={{paddingBottom: "10px"}}>{translate({lang: lang, info: "no_cart"})}</p>
                </Col>
                <Col sm={12} className="button_action_group">
                    <Button type="button" onClick={()=>handleContinueShopping()} className="mybutton round button_transparent shadow_convex">
                        <FontAwesomeIcon icon={faStore} />
                    </Button>	
                    <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                        <FontAwesomeIcon icon={faArrowRotateLeft} />
                    </Button>	
                </Col>
            </Row>}
        </div>
    </div>
}

export default Cart