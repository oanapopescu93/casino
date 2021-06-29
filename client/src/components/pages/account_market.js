import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Carousel from './partials/carousel'

function Account_market(props) {
	var market = props.market;
	var socket = props.info.socket;	
	var lang = props.lang;
	return (
		<div className="account_box_container">
			<Row>
				<Col sm={12}><h2>Market</h2></Col>
			</Row>
			<Row className="item_container">
				<Col sm={2}></Col>
				<Col sm={8} style={{textAlign:"center"}}>
					<Carousel template="market" lang={lang} socket={socket} item_list={market}></Carousel>					
				</Col>
				<Col sm={2}></Col>
			</Row>
		</div>
	);
}

export default Account_market;
