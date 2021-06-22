import React from 'react';
import $ from 'jquery'; 

import under_construction_icon from '../img/icons/under_construction_icon.png'

function Support(props){
    var socket = props.socket;
    $('.full-height').attr('id', 'support')

    socket.emit('contact_send', 'contact');	
    socket.on('contact_read', function(data){
        console.log('contact--> ', data)
    });	

	return (
		<div className="contact_container color_yellow">
			<h1>Support</h1>
            <img className="under_construction_icon" alt="under construction" src={under_construction_icon} />
		</div>
	);
}

export default Support;