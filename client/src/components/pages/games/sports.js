import React from 'react';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

var socket;

function Sports(props){
	socket = props.socket;
	socket.emit('sports_send', "sports_send");	
	socket.on('sports_read', function(data){
		//$("body").append(data.body)
		console.log('sports_read', data.body)

	});
	return (
		<Row>
            <Col sm={2}></Col>
            <Col sm={8}>
				<div className="sports_container">            
					<div className="sports">
						<p>Sorry, </p>
						<p>no sport games available yet</p>
					</div>
				</div>
			</Col>
			<Col sm={2}></Col>
		</Row>
	);
}

export default Sports;