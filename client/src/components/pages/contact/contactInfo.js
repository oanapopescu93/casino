import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons'

function ContactInfo(props){
    const {location} = props
    return <ul className="contact_box contact_list_item shadow_concav">
        <li>
            <p><FontAwesomeIcon icon={faLocationDot} />:  <span>{location.country}, {location.city}</span></p>
        </li>
        <li>
            <p><FontAwesomeIcon icon={faPhone} />:  <a href={'tel:' + location.phone}><span>{location.phone_text}</span></a></p>
        </li>
        <li>
            <p><FontAwesomeIcon icon={faEnvelope} />: <a href={'mailto:' + location.email}><span>{location.email}</span></a></p>
        </li>
        <li>
            <a href={location.linkedin} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedinIn} /> <span>{location.linkedin}</span>                
            </a>
        </li>
        <li>
            <a href={location.github} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} /> <span>{location.github}</span>                
            </a>
        </li>
    </ul>
}
export default ContactInfo