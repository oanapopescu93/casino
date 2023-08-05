import React from 'react'
import { translate } from '../../translations/translate'
import Payment from '../partials/payment/payment'
import Header from '../partials/header'

function BuyCarrots(props){
    return <div className="content_wrap">
        <Header template="buy_carrots" title={translate({lang: props.lang, info: "buy_carrots"})}></Header>
        <div className="page_content">
            <Payment {...props} template="buy_carrots"></Payment>  
        </div>
    </div>
}
export default BuyCarrots