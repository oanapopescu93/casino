import React from 'react';
import $ from 'jquery'; 
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import under_construction_icon from '../../img/icons/under_construction_icon.png'

function Sports(props){
	var socket = props.socket;
	socket.emit('sports_send', "sports_send");	
	socket.on('sports_read', function(data){
		//$("body").append(data.body)
		//console.log('sports_read', data.body)
	});
	return (
		<Row>
            <Col sm={2}></Col>
            <Col sm={8}>
				<div className="sports_container">            
					<div className="sports">
						<img className="under_construction_icon" alt="under construction" src={under_construction_icon} />
					</div>
				</div>
			</Col>
			<Col sm={2}></Col>
		</Row>
	);
}

export default Sports;