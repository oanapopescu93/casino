import React from 'react'
import { translate } from '../../translations/translate'
import Currency from '../settings/currency'
import Date from '../settings/date'
import Language from '../settings/language'

function Settings(props) {
    return <div className="settings">
        <div className="settings_language">
            <h3>{translate({lang: props.lang, info: "language"})}</h3>
            <Language title={props.lang}></Language>       
        </div>
        <div className="settings_date">
            <h3>{translate({lang: props.lang, info: "date_calendar"})}</h3>
            <Date title={props.date}></Date>
        </div>
        <div className="settings_currency">
            <h3>{translate({lang: props.lang, info: "currency"})}</h3>
            <Currency title={props.currency} {...props}></Currency>
        </div>
    </div>
}

export default Settings