import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Carousel from './partials/carousel'
import shop from '../img/other/shop.png';

function Account_market(props) {
	let market = props.market;
	let socket = props.info.socket;	
	let lang = props.lang;
	let shader_style = {
		backgroundImage: `url(${shop})`,
	};
	return (
		<div className="account_box_container">
			<Row>
				<Col sm={12}><h2>Market</h2></Col>
			</Row>
			<Row>
				<Col sm={2}></Col>
				<Col sm={8}><div style={shader_style} className="shop_shader"></div></Col>
				<Col sm={2}></Col>
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
