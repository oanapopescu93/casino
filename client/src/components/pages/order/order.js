import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { formatDate, isEmpty, roundNumber } from '../../../utils/utils'
import { useSelector } from 'react-redux'

function Order(props){
    const {lang, order} = props
    let timestamp = 1000 * order.created
    let date_format = useSelector(state => state.settings.date)
    let date = formatDate(timestamp, date_format)
    let order_amount = roundNumber(order.amount)

    function handleBack(){
        if(typeof props.handleBackToList === "function"){
            props.handleBackToList()
        }
    }

    return <>
        <Row>
            <Col sm={8}>
                <div className="order_box shadow_concav">
                    <h3>{translate({lang: lang, info: "order_details"})}</h3>
                    <div className="order_details">
                        <p className="order_details_link">
                            <a href={order.receipt_url} target="_blank">{translate({lang: lang, info: "order_link"})}</a>
                        </p>
                        <p><b>{translate({lang: lang, info: "order_description"})}</b>: <span>{order.description}</span></p>
                        <p><b>{translate({lang: lang, info: "order_date"})}</b>: <span>{date}</span></p>
                        <h3><b>{translate({lang: lang, info: "sum"})}</b>: <span>{order_amount} {order.currency}</span></h3>
                    </div>
                </div>
            </Col>
            <Col sm={4}>
                <div className="order_box shadow_concav">
                    <h3>{translate({lang: lang, info: "customer"})}</h3>
                    <div className="customer">
                        <p><b>{translate({lang: lang, info: "name"})}</b>: <span>
                            {isEmpty(order.billing_details.name) ? order.billing_details.name : "-"}
                        </span></p>
                        <p><b>{translate({lang: lang, info: "email"})}</b>: <span>
                            {isEmpty(order.billing_details.email) ? order.billing_details.email : "-"}
                        </span></p>
                    </div>
                </div>
                <div className="order_box shadow_concav">
                    <h3>{translate({lang: lang, info: "payment_method"})}</h3>
                    <div className="payment_method">
                        <h3>{order.payment_method_details.type}</h3>
                        <p>***{order.payment_method_details.card.last4}</p>
                    </div>
                </div>
            </Col>
        </Row>
        <Row>
            <Col sm={12}>
                <div className="order_box">
                    <div className="status">
                        <p><b>{translate({lang: lang, info: "status"})}</b>: <span className={'status_box ' + order.status}>{order.status}</span></p>
                    </div>
                </div>
            </Col>
        </Row>
        <Row>
            <Col sm={12}>
                <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                    {translate({lang: props.lang, info: "back"})}
                </Button>
            </Col>
        </Row>
    </>
}
export default Order