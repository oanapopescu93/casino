import React from 'react'
import { translate } from '../../../translations/translate'
import { convertCurrency } from '../../../utils/utils'
import Counter from '../../partials/counter'

function BuyCarrots(props){
    const {settings, total_promo, max_amount, exchange_rates, updateQty} = props
    const {lang, currency} = settings

    return <>
        <Counter max={max_amount} update={(e)=>updateQty(e)} />
        <div className="payment_details_total_price">
            <h3>
                <b>{translate({lang: lang, info: "total_price"})}</b>: {convertCurrency(total_promo, currency, exchange_rates)} {currency}
            </h3>
        </div>
    </>
}
export default BuyCarrots