import React from 'react'
import { useSelector } from 'react-redux'
import { convertCurrency, formatDate } from '../../utils/utils'
import { translate } from '../../translations/translate'

function PaymentSuccess(props) {
    const {settings, data} = props
    const {lang} = settings
    const {payment_id, amount, order_date, currencyExchange, exchange_rates} = data
    let date_format = useSelector(state => state.settings.date)
    let date = formatDate(order_date, date_format)
    return <div className="paymentSuccess">
        <p>{translate({lang: lang, info: 'payment_success_text'})}</p>
        <h3>{translate({lang: lang, info: 'amount'})}: {convertCurrency(amount, currencyExchange, exchange_rates)} {currencyExchange}</h3>
        <h6>
            <span>{translate({lang: lang, info: 'payment'})}:</span>
            <span>{payment_id}</span>
            <span>({date})</span>
        </h6>
    </div>
}
export default PaymentSuccess