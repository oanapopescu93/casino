import React from 'react'
import { translate } from '../../translations/translate'
import Currency from '../settings/currency'
import Date from '../settings/date'
import Language from '../settings/language'
import Theme from '../settings/theme'

function Settings(props) {
    const {settings} = props
    const {lang, date, currency, theme} = settings

    return <div className="settings">
        <div className="settings_language">
            <h4>{translate({lang, info: "language"})}</h4>
            <Language title={lang} />
        </div>
        <div className="settings_date">
            <h4>{translate({lang, info: "date_calendar"})}</h4>
            <Date title={date} />
        </div>
        <div className="settings_currency">
            <h4>{translate({lang, info: "currency"})}</h4>
            <Currency title={currency} {...props} />
        </div>
        <div className="settings_theme">
            <h4>{translate({lang, info: "theme"})}</h4>
            <Theme title={theme} {...props} />
        </div>
    </div>
}

export default Settings