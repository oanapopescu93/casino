import React from 'react'

function ContactInfo(props){
	let contact = props.contact
    let size = props.size
    let info, location, email, phone, website, linkedin, github
    if (contact.length>0) {
        for(let i in contact){
            if(contact[i] && contact[i].title){
                switch(contact[i].title){
                    case "info":
                        info = contact[i]
                        break
                    case "location":
                        location = contact[i]
                        break
                    case "email":
                        email = contact[i]
                        break
                    case "phone":
                        phone = contact[i]
                        break
                    case "website":
                        website = contact[i]
                        break
                    case "linkedin":
                        linkedin = contact[i]
                        break
                    case "github":
                        github = contact[i]
                        break
                } 
            }
        }
    }
       
    return (
        <div id="contact_info" className={size.width < 960 ? "" : "shadow_convex"}>
            <div className={size.width < 960 ? "" : "deco"}>
                <div className="contact_info_box">
                    {size.width < 960 ? null : <p id="contact_items_info">{info.text}</p>}                    
                    <ul id="contact_list_info">
                        {email ? <li><a href={email.link}><i className={email.icon}></i> <span>{email.text}</span></a></li> : null}
                        {phone ? <li><a href={phone.link}><i className={phone.icon}></i> <span>{phone.text}</span></a></li> : null}
                        {website ? <li><a href={website.link}><i className={website.icon}></i> <span>{website.link}</span></a></li> : null}
                        {location ? <li><i className={location.icon}></i> <span>{location.text}</span></li> : null}
                    </ul>
                    <ul id="contact_list_social" className="text-center">
                        {github ? <li><a href={github.link}><i className={github.icon}></i></a></li> : null}
                        {linkedin ? <li><a href={linkedin.link}><i className={linkedin.icon}></i></a></li> : null}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ContactInfo