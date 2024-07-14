import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLeft from './left/dashboardLeft'
import DashboardRight from './right/dashboardRight'
import { cartRemove, cartUpdate, cartRemoveAll } from '../../../../reducers/cart'
import { changePage, changeGame, changeGamePage } from '../../../../reducers/page'
import { Row, Col, Button } from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

function Dashboard(props){
	let dispatch = useDispatch()
	let cart = useSelector(state => state.cart.cart)
	let order = useSelector(state => state.order.order)
	let withdraw = useSelector(state => state.withdraw.withdraw)

	function cartRemoveAllProduct(){
		dispatch(cartRemoveAll())
    }
    function cartRemoveProduct(item){
		dispatch(cartRemove(item))
    }
	function updateQtyProduct(item){
		dispatch(cartUpdate(item))
    }

	function handleCheckout(){
		dispatch(changePage('Checkout'))
		dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    return <div className="dashboard_container">
        <Row>
			<Col sm={2} />
			<Col sm={8}>
				<Row>
					<Col lg={4}>
						<DashboardLeft {...props} />
						<div className="dashboard_buttons d-none d-lg-block">
							<Button 
								type="button"
								className="mybutton round button_transparent shadow_convex"
								onClick={()=>props.handleHandleExit()}                        
							><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>	
						</div>
					</Col>
					<Col lg={8}>
						<DashboardRight 
							{...props} 
							cart={cart} 
							order={order}
							withdraw={withdraw}
							cartRemoveAllProduct={()=>cartRemoveAllProduct()}
							cartRemoveProduct={(e)=>cartRemoveProduct(e)}
							updateQtyProduct={(e)=>updateQtyProduct(e)}
							handleCheckout={()=>handleCheckout()}
						/>
						<div className="dashboard_buttons d-block d-lg-none">
							<Button 
								type="button"
								className="mybutton round button_transparent shadow_convex"
								onClick={()=>props.handleHandleExit()}                        
							><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>	
						</div>
					</Col>
				</Row>
			</Col>
			<Col sm={2} />
		</Row>
    </div>
}
export default Dashboard