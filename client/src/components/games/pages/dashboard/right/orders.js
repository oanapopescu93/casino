import React from 'react'
import { translate } from '../../../../../translations/translate'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../../../../reducers/popup'
import { convertCurrency } from '../../../../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

function Orders(props){
    const {order, settings, exchange_rates} = props
    const {lang, currency} = settings
    let dispatch = useDispatch()

    function handleClickOrder(order){
        let payload = {
            open: true,
            template: "orderDetails",
            title: translate({lang: lang, info: "order"}) + ' #' + order.orderId,
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
                            <th className="order_item_row order_item_no">{translate({lang: lang, info: "id"})}</th>
                            <th className="order_item_row order_item_description">{translate({lang: lang, info: "order_description"})}</th>
                            <th className="order_item_row order_item_amount">{translate({lang: lang, info: "price"})}</th>
                            <th className="order_item_row order_item_buttons"><FontAwesomeIcon icon={faCircleInfo} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.map((item, i) => {
                            let price = convertCurrency(item.amount, currency, exchange_rates) + " " + currency                            
                            return <tr key={i} className="order_item">
                                <td className="order_item_element order_item_no">#{i+1}</td>                                
                                <td className="order_item_element order_item_description">                                 
                                    {item.description ? <span>{item.description}</span> : <span>-</span>}
                                </td>
                                <td className="order_item_element order_item_amount"><span>{price}</span></td>
                                <td className="order_item_element order_item_buttons" onClick={()=>handleClickOrder(item)}>
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </> : <p>{translate({lang: lang, info: "no_order"})}</p>}
    </div>
}
export default Orders