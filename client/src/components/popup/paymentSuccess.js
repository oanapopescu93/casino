import React from 'react'
import { useSelector } from 'react-redux'
import { formatDate } from '../../utils/utils'
import { translate } from '../../translations/translate'

function PaymentSuccess(props) {
    const { lang, data } = props
    const {id, amount, created} = data
    let date_format = useSelector(state => state.settings.date)
    let date = formatDate(created * 1000, date_format)
    return <div className="paymentSuccess">
        <p>{translate({lang: lang, info: 'payment_success_text'})}</p>
        <p>{translate({lang: lang, info: 'amount'})}: ${amount}</p>
        <h6>{translate({lang: lang, info: 'payment_id'})}: {id}, {date}</h6>
    </div>
}
export default PaymentSuccess