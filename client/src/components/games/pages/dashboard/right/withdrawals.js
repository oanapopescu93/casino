import React from 'react'
import { translate } from '../../../../../translations/translate'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../../../../reducers/popup'
import { convertCurrency } from '../../../../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

function Withdrawals(props){
    const {withdrawList, settings,exchange_rates} = props
    const {lang, currency} = settings
    let dispatch = useDispatch()
    
    function handleClickWithdraw(withdraw){
        let payload = {
            open: true,
            template: "withdrawDetails",
            title: translate({lang, info: "withdraw"}) + ' #' + withdraw.id,
            data: {...withdraw, currencySettings: currency, exchange_rates},
            size: 'lg',
        }
        dispatch(changePopup(payload))
    }

    return <div className="withdrawals box">
        {withdrawList ? <>
            {withdrawList.length > 0 ? <>
                <div className="withdraw_header">
                    <h3>{translate({lang, info: "withdrawals"})}</h3>
                </div>
                <div className="withdraw_list">
                    <table>
                        <thead>
                            <tr>
                                <th className="order_item_row order_item_no">{translate({lang, info: "id"})}</th>
                                <th className="order_item_row order_item_method">{translate({lang, info: "method"})}</th>
                                <th className="order_item_row order_item_description">{translate({lang, info: "order_description"})}</th>
                                <th className="order_item_row order_item_amount">{translate({lang, info: "price"})}</th>
                                <th className="order_item_row order_item_buttons"><FontAwesomeIcon icon={faCircleInfo} /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawList.map((item, i) => {
                                const {amount, id, method, description} = item                              
                                let price = convertCurrency(amount, currency, exchange_rates) + " " + currency
                                return <tr key={i} className="order_item">
                                    <td className="order_item_element order_item_no">#{id}</td>
                                    <td className="order_item_element order_item_method">{method}</td>
                                    <td className="order_item_element order_item_description">                                 
                                        {description ? <span>{description}</span> : <span>-</span>}
                                    </td>
                                    <td className="order_item_element order_item_amount"><span>{price}</span></td>
                                    <td className="order_item_element order_item_buttons" onClick={()=>handleClickWithdraw(item)}>
                                        <FontAwesomeIcon icon={faEllipsisVertical} />
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </> : <p>{translate({lang, info: "no_withdrawal"})}</p>}
        </> : <p>{translate({lang, info: "loading"})}</p>}
    </div>
}
export default Withdrawals