import React from 'react'
import { translate } from '../../translations/translate'
import Currency from '../settings/currency'
import Date from '../settings/date'
import Language from '../settings/language'

function Settings(props) {
    return <div className="settings">
        <div className="settings_language">
            <h4>{translate({lang: props.lang, info: "language"})}</h4>
            <Language title={props.lang}></Language>       
        </div>
        <div className="settings_date">
            <h4>{translate({lang: props.lang, info: "date_calendar"})}</h4>
            <Date title={props.date}></Date>
        </div>
        <div className="settings_currency">
            <h4>{translate({lang: props.lang, info: "currency"})}</h4>
            <Currency title={props.currency} {...props}></Currency>
        </div>
    </div>
}

export default Settings