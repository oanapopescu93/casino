import React from 'react'
import { translate } from '../../../../../translations/translate'

function Withdrawals(props){
    const {withdrawal, settings} = props
    const {lang} = settings

    return <div className="withdrawals box">								
        {withdrawal && withdrawal.length>0 ? <>
            <div className="withdraw_header">
                <h3>{translate({lang: lang, info: "withdrawals"})}</h3>
            </div>
            <div className="withdraw_list">
            withdrawals will come here
            </div>
        </> : <p>{translate({lang: lang, info: "no_withdrawal"})}</p>}
    </div>
}
export default Withdrawals