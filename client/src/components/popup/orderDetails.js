import React from 'react'
import { useSelector } from 'react-redux'
import { convertCurrency, formatDate } from '../../utils/utils'
import { translate } from '../../translations/translate'
import { Row, Col } from 'react-bootstrap'

function OrderDetails(props) {
    const { settings, data } = props
    const { lang } = settings
    const {
        method,
        payment_id, 
        customer_id, 
        order_date, 
        amount,
        payment_method,
        status,
        country, 
        city,
        email,
        phone,
        description,
        items,
        currencySettings,
        exchange_rates
    } = data
    let date_format = useSelector(state => state.settings.date)
    let date = formatDate(order_date, date_format)
    let status_color = "default"
    switch(status) {
        case 'succeeded':
        case 'approved':
        case 'completed':
            status_color = "green"
            break
        case 'requires_action':
        case 'pending':
            status_color = "orange"
            break
        case 'requires_payment_method':
        case 'requires_confirmation':
        case 'requires_capture':
        case 'failed':
        case 'denied':
            status_color = "red"
            break
        case 'processing':
        case 'canceled':
        case 'expired':
        default:
            status_color = "default"
            break
    }

    let orderDetails_footer = convertCurrency(amount, currencySettings,exchange_rates) + " " + currencySettings

    return <>
        <div className="orderDetails_popup">
            <Row>
                <Col sm={6} className="orderDetails_order_info">
                    <h3>{translate({lang: lang, info: 'order_info'})}</h3>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang: lang, info: 'payment_id'})}:</span>
                        <span className="value">{payment_id}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang: lang, info: 'method'})}:</span>
                        <span className="value">{method}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang: lang, info: 'payment_method'})}:</span>
                        <span className="value">{payment_method ? payment_method : "-"}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang: lang, info: 'date'})}:</span>
                        <span className="value">{date}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang: lang, info: 'description'})}:</span>
                        <span className="value">{description ? description : "-"}</span>
                    </div> 
                    <div className="order_detail_item">
                        <span className="label">{translate({lang: lang, info: 'status'})}:</span>
                        <span className={"order_detail_status " + status_color}>{translate({lang: lang, info: status})}</span>
                    </div>
                </Col>
                <Col sm={6} className="orderDetails_customer_info">
                    <h3>{translate({lang: lang, info: 'customer_info'})}</h3>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang: lang, info: 'customer_id'})}:</span>
                        <span className="value">{customer_id ? customer_id : "-"}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang: lang, info: 'country'})}:</span>
                        <span className="value">{country ? country : "-"}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang: lang, info: 'city'})}:</span>
                        <span className="value">{city ? city : "-"}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang: lang, info: 'email'})}:</span>
                        <span className="value">{email ? email : "-"}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang: lang, info: 'phone'})}:</span>
                        <span className="value">{phone ? phone : "-"}</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col sm={12} className="orderDetails_order_detail_items">
                    <h3>{translate({lang: lang, info: 'items'})}:</h3>
                    {(() => {
                        switch(method){
                            case "stripe":
                                return <ul className="items">
                                    {Object.keys(items).map(key => (
                                        <li key={key} className="item">{items[key]}</li>
                                    ))}
                                </ul>
                            case "paypal":
                                return <ul className="items">
                                    {items.map((item, index) => (
                                        <li key={index} className="item">
                                            {item.name}: {item.quantity} x {item.price} {item.currency}
                                        </li>
                                    ))}
                                </ul>
                        }
                    })()}                     
                </Col>
            </Row>        
        </div>
        <Row>
            <Col sm={12}>
                <div className="orderDetails_footer">
                    <h3>{orderDetails_footer}</h3>
                </div>                
            </Col>
        </Row>
    </>
}

export default OrderDetails