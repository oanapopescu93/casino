import React from 'react'
import { translate } from '../../../../../translations/translate'

function Orders(props){
    const {lang, order} = props
    return <div className="order box">								
        {order && order.length>0 ? <>
            <div className="order_header">
                <h3>{translate({lang: lang, info: "orders"})}</h3>
            </div>
            <div className="order_list">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>{translate({lang: lang, info: "chargeId"})}</th>
                            <th>{translate({lang: lang, info: "order_description"})}</th>
                            <th>{translate({lang: lang, info: "price"})}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.map((item, i) => {
                            return <tr key={i} className="order_item">
                                <td className="order_item_element order_item_no">{i}</td>
                                <td className="order_item_element order_item_chargeId">{item.chargeId}</td>
                                <td className="order_item_element order_item_description">
                                    <p>{translate({lang: lang, info: "method"})}: {item.type}</p>                                    
                                    {item.description ? <p>{item.description}</p> : null}
                                </td>
                                <td className="order_item_element order_item_amount">${item.amount}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </> : <p>{translate({lang: lang, info: "no_order"})}</p>}
    </div>
}
export default Orders