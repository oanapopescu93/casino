import React from 'react'
import { translate } from '../../../translations/translate'
import Payment from '../../partials/payment/payment'
import Header from '../../partials/header'

function Checkout(props){
    return <div className="content_wrap">
        <Header template="checkout" title={translate({lang: props.lang, info: "checkout"})}></Header>      
        <div className="page_content">
           <Payment {...props} template="checkout"></Payment>
        </div>
    </div>
}
export default Checkout