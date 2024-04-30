import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, Button } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { formatDate, roundNumber } from '../../../utils/utils'
import Order from './order'

function Orders(props){
    const {lang} = props
    let orders = useSelector(state => state.order.order) 
    const [selectedOrder, setSelectedOrder] = useState(null)
    let date_format = useSelector(state => state.settings.date)

    function handleViewOrder(x){
        setSelectedOrder(x)
    }

    function handleBackToList(){
        setSelectedOrder(null)
    }

    return <>
        {selectedOrder ? <Order order={selectedOrder} lang={lang} handleBackToList={()=>handleBackToList()}></Order> : <>            
            {orders.map(function(item, i){
                let timestamp = 1000 * item.created
                let date = formatDate(timestamp)
                let order_amount = roundNumber(item.amount)
                return <Row key={i} className='order_item'>                    
                    <Col sm={8}>
                        <p>{date}</p>
                        <h4>{item.description}</h4>
                    </Col>
                    <Col sm={4}>
                        <p>{order_amount} {item.currency}</p>
                        <Button type="button" onClick={()=>handleViewOrder(item)} className="mybutton button_transparent shadow_convex">
                            {translate({lang: lang, info: "click"})}
                        </Button>
                    </Col>
                </Row>
            })}
        </>}
    </>
}
export default Orders