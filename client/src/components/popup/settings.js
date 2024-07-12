import React from 'react'
import { translate } from '../../translations/translate'
import Currency from '../settings/currency'
import Date from '../settings/date'
import Language from '../settings/language'

function Settings(props) {
    const {settings} = props
    const {lang, date, currency} = settings

    return <div className="settings">
        <div className="settings_language">
            <h4>{translate({lang: lang, info: "language"})}</h4>
            <Language title={lang} />
        </div>
        <div className="settings_date">
            <h4>{translate({lang: lang, info: "date_calendar"})}</h4>
            <Date title={date} />
        </div>
        <div className="settings_currency">
            <h4>{translate({lang: lang, info: "currency"})}</h4>
            <Currency title={currency} {...props} />
        </div>
    </div>
}

export default Settings