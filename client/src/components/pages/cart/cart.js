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

function Cart(props){
    let market = props.home.market
    let cart = useSelector(state => state.cart.cart) 
    const [promo, setPromo] = useState(null) 
    let dispatch = useDispatch()
    let list = getProducts(cart)

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
        <Header template="cart" title={translate({lang: props.lang, info: "cart"})}></Header>    
        <div className="page_content">
            {list && list.length>0 ? <Row>
                <Col sm={8}>
                    <List 
                        {...props} 
                        list={list} 
                        updateQtyProduct={(e)=>updateQtyProduct(e)}
                        removeProduct={(e)=>removeProduct(e)}
                    ></List>                    
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
                    ></Panel>
                    <Promo 
                        {...props} 
                        updatePromo={(e)=>updatePromo(e)}
                    ></Promo>
                </Col>
            </Row> : 
            <Row>
                <Col sm={12}>
                    <p style={{paddingBottom: "10px"}}>{translate({lang: props.lang, info: "no_cart"})}</p>
                </Col>
                <Col sm={12} className="button_action_group">
                    <Button type="button" onClick={()=>handleContinueShopping()} className="mybutton round button_transparent shadow_convex">
                        {translate({lang: props.lang, info: "market"})}
                    </Button>	
                    <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                        {translate({lang: props.lang, info: "back"})}
                    </Button>	
                </Col>
            </Row>}
        </div>
    </div>
}

export default Cart