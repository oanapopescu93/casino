import React, {useState, useEffect} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons'

function ContactList(props){
    const {lang, list, handleChooseContactElement} = props
    let default_list = list[0][lang] ? list[0][lang] : list[0]["ENG"]
    const [titleDropdown, setTitleDropdown] = useState(default_list ? default_list.country : default_list.country)
    const [location, setLocation] = useState(default_list)

    useEffect(() => {
        let current_country = titleDropdown
        let list_found = list.find(item => Object.values(item).some(entry => entry.country === current_country))
        let default_list = list_found[lang] ? list_found[lang] : list_found["ENG"]
		setTitleDropdown(default_list ? default_list.country : default_list.country)
	}, [lang])

    function handleDropdown(i){
        let location = list[i][lang] ? list[i][lang] : list[i]["ENG"] 
        setLocation(location)
        setTitleDropdown(location ? location.country : location.country)
        handleChooseContactElement(location ? location.country : location.country, parseInt(i))
    }

    return <div className="contact_list">
        <div className="contact_dropdown shadow_convex">
            <DropdownButton title={titleDropdown} id="contact_button" onSelect={(e)=>handleDropdown(e)}>                
                {list.map((item, i)=>{
                    let country = item[lang] ? item[lang].country : item["ENG"].country
                    return <div key={i} className='contact_list_item_container'>
                        <Dropdown.Item eventKey={i}>{country}</Dropdown.Item>
                    </div>
                })}
            </DropdownButton>
        </div>        
        <ul className="contact_box contact_list_item shadow_concav">
            <li>
                <p><FontAwesomeIcon icon={faLocationDot} />:  <span>{location.city}</span></p>
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
    </div>
}
export default ContactList