import React from 'react'
import ListCell from './listCell'

function ContactList(props){
    const {lang, list, handleChooseContactElement} = props

    function handleClick(x){
        handleChooseContactElement(x)
    }

    return <div id="contact_list" className="contact_box shadow_concav">
        <div className="contact_list">
            {list.map(function(item, i){
                return <div key={i} className='contact_list_item_container'>
                    <ListCell item={item} lang={lang} handleClick={(e)=>handleClick(e)}></ListCell>
                </div>
            })}
        </div>
    </div>
}
export default ContactList