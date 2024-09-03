import React from 'react'
import { translate } from '../../../translations/translate'

function ContactInfo(props){
    const {lang, location} = props
    return <ul className="contact_box contact_list_item shadow_concav">
        <li><p>{translate({lang: lang, info: 'city'})}:  {location.city}</p></li>
        <li><p>{translate({lang: lang, info: 'phone'})}:  <a href={'tel:' + location.phone}>{location.phone_text}</a></p></li>
        <li><p>{translate({lang: lang, info: 'email'})}: <a href={'mailto:' + location.email}>{location.email}</a></p></li>
    </ul>
}
export default ContactInfo