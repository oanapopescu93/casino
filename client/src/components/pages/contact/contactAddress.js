import React from 'react'
import { translate } from '../../../translations/translate'

function ContactAddress(props){
    const {lang, location} = props
    let address = location[lang] ? location[lang] : location["ENG"]
    const {country, city, phone, phone_text, email} = address

    return <ul className="contact_address">
        <li><p>{translate({lang, info: 'country'})}: {country}</p></li>
        <li><p>{translate({lang, info: 'city'})}: {city}</p></li>
        <li><p>{translate({lang, info: 'phone'})}: <a href={'tel:' + phone}>{phone_text}</a></p></li>
        <li><p>{translate({lang, info: 'email'})}: <a href={'mailto:' + email}>{email}</a></p></li>
    </ul>
}
export default ContactAddress