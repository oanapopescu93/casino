import React from 'react'
import { translate } from '../../../translations/translate'

function ListCell(props){
    const {lang, item} = props
    let location = item[lang]

    function handleClick(){
        props.handleClick(item)
    }

    return <ul className="contact_list_item shadow_convex" onClick={()=>handleClick()}>
        <li><h3>{translate({lang: lang, info: 'country'})}:  {location.country}</h3></li>
        <li><p>{translate({lang: lang, info: 'city'})}:  {location.city}</p></li>
        <li><p>{translate({lang: lang, info: 'phone'})}:  <a href={'tel:' + location.phone}>{location.phone}</a></p></li>
        <li><p>{translate({lang: lang, info: 'email'})}: <a href={'mailto:' + location.email}>{location.email}</a></p></li>
    </ul>
}
export default ListCell