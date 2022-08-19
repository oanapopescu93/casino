import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import under_construction_icon from '../../img/icons/under_construction_icon.png'

function Keno(props){
		return (
			<>
				<Row>
					<Col sm={2}></Col>
					<Col xs={10} sm={8} className="keno_container spacing_small">						
                        <img className="under_construction_icon" alt="under construction" src={under_construction_icon} />
					</Col>
					<Col sm={2}></Col>
				</Row>
			</>
		)
}

export default Keno;