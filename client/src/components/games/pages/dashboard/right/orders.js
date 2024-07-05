import React from 'react'
import { translate } from '../../../../../translations/translate'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../../../../reducers/popup'
import { convertCurrency } from '../../../../../utils/utils'

function Orders(props){
    const {lang, order, currency, exchange_rates} = props
    let dispatch = useDispatch()

    function handleClickOrder(order){
        let payload = {
            open: true,
            template: "orderDetails",
            title: translate({lang: props.lang, info: "order"}) + ' #' + order.orderId,
            data: {...order, currencySettings: currency, exchange_rates},
            size: 'lg',
        }
        dispatch(changePopup(payload))
    }

    return <div className="order box">								
        {order && order.length>0 ? <>
            <div className="order_header">
                <h3>{translate({lang: lang, info: "orders"})}</h3>
            </div>
            <div className="order_list">
                <table>
                    <thead>
                        <tr>
                            <th>{translate({lang: lang, info: "id"})}</th>
                            <th>{translate({lang: lang, info: "payment_id"})}</th>
                            <th>{translate({lang: lang, info: "order_description"})}</th>
                            <th>{translate({lang: lang, info: "price"})}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.map((item, i) => {
                            let price = convertCurrency(item.amount, currency, exchange_rates) + " " + currency                            
                            return <tr key={i} className="order_item" onClick={()=>handleClickOrder(item)}>
                                <td className="order_item_element order_item_no">#{i+1}</td>
                                <td className="order_item_element order_item_id">
                                    {item.payment_id ? <span>{item.payment_id}</span> : <span>-</span>}
                                </td>
                                <td className="order_item_element order_item_description">                                 
                                    {item.description ? <span>{item.description}</span> : <span>-</span>}
                                </td>
                                <td className="order_item_element order_item_amount"><span>{price}</span></td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </> : <p>{translate({lang: lang, info: "no_order"})}</p>}
    </div>
}
export default Orders