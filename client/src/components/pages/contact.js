import React from 'react';

function Contact(props){
    var socket = props.socket;

    socket.emit('contact_send', 'contact');	
    socket.on('contact_read', function(data){
        console.log('contact--> ', data)
    });	

	return (
		<div className="contact_container color_yellow">
			<h1>Contact page</h1>
            <p>Page still under construction</p>
		</div>
	);
}

export default Contact;