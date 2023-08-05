import React from 'react'
import { translate } from '../../../../../translations/translate'

function Orders(props){
    const {lang, order} = props
    return <div className="order_container box">								
        {order && order.length>0 ? <div className="order">
            <p>orders!!!</p>
        </div> : <div className="order">
            <p>{translate({lang: lang, info: "no_order"})}</p>
        </div>}
    </div>
}
export default Orders