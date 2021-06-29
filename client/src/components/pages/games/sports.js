import React from 'react';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import under_construction_icon from '../../img/icons/under_construction_icon.png'

var socket;

function Sports(props){
	socket = props.socket;
	//var lang = props.lang;
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