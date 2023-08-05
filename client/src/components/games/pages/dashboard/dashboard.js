import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DashboardLeft from './left/dashboardLeft'
import DashboardRight from './right/dashboardRight'
import { useDispatch, useSelector } from 'react-redux'
import { cartRemove, cartUpdate, cartRemoveAll } from '../../../../reducers/cart'
import { changePage, changeGame, changeGamePage } from '../../../../reducers/page'

function Dashboard(props){
	let dispatch = useDispatch()
	let cart = useSelector(state => state.cart.cart)
	let order = useSelector(state => state.order.order)

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
			<Col sm={2}></Col>
			<Col sm={8}>					
				<Row>				
					<Col sm={12}><h2>Dashboard</h2></Col>
				</Row>
				<Row>
					<Col sm={4}>
						<DashboardLeft {...props}></DashboardLeft>
					</Col>
					<Col sm={8}>
						<DashboardRight 
							{...props} 
							cart={cart} 
							order={order}
							cartRemoveAllProduct={()=>cartRemoveAllProduct()}
							cartRemoveProduct={(e)=>cartRemoveProduct(e)}
							updateQtyProduct={(e)=>updateQtyProduct(e)}
							handleCheckout={()=>handleCheckout()}
						></DashboardRight>
					</Col>
				</Row>
			</Col>
			<Col sm={2}></Col>
		</Row>
    </div>
}
export default Dashboard