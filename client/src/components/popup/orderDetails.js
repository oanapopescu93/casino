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

    let payment_method = method === "stripe" ? "card" : method
    
    let status = "succeded"
    let status_color = "green"

    let orderDetails_footer = convertCurrency(amount, currencySettings, exchange_rates) + " " + currencySettings

    return <>
        <div className="orderDetails_popup">
            <Row>
                <Col sm={6} className="orderDetails_order_info">
                    <h3>{translate({lang, info: 'order_info'})}</h3>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang, info: 'payment_id'})}:</span>
                        <span className="value">{payment_id}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang, info: 'method'})}:</span>
                        <span className="value">{method}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang, info: 'payment_method'})}:</span>
                        <span className="value">{payment_method ? payment_method : "-"}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang, info: 'date'})}:</span>
                        <span className="value">{date}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang, info: 'description'})}:</span>
                        <span className="value">{description ? description : "-"}</span>
                    </div> 
                    <div className="order_detail_item">
                        <span className="label">{translate({lang, info: 'status'})}:</span>
                        <span className={"order_detail_status " + status_color}>{translate({lang, info: status})}</span>
                    </div>
                </Col>
                <Col sm={6} className="orderDetails_customer_info">
                    <h3>{translate({lang, info: 'customer_info'})}</h3>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang, info: 'customer_id'})}:</span>
                        <span className="value">{customer_id ? customer_id : "-"}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang, info: 'country'})}:</span>
                        <span className="value">{country ? country : "-"}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang, info: 'city'})}:</span>
                        <span className="value">{city ? city : "-"}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang, info: 'email'})}:</span>
                        <span className="value">{email ? email : "-"}</span>
                    </div>
                    <div className="order_detail_item">
                        <span className="label">{translate({lang, info: 'phone'})}:</span>
                        <span className="value">{phone ? phone : "-"}</span>
                    </div>
                </Col>
            </Row>
            {items && items.length > 0 ? <Row>
                <Col sm={12} className="orderDetails_order_detail_items">
                    <h3>{translate({lang, info: 'items'})}:</h3>
                    <ul className="items">
                        {items.map((item, index) => {                            
                            let name = item["name_" + lang.toLowerCase()] || item.name_eng.toLowerCase()
                            let quantity = item.quantity ? item.quantity : item.qty
                            let price = convertCurrency(item.price, currencySettings, exchange_rates)
                            return <li key={index} className="item">
                                {name}: {quantity} x {price} {currencySettings}
                            </li>
                        })}
                    </ul>                   
                </Col>
            </Row> : null}                   
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