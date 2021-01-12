import React from 'react';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

function Account_market(props) {
	var market = props.market;
	var socket = props.info.socket;
	
	function my_click(id){
		console.log('buy', id);
	}	
	
	return (
		<div className="account_box_container">
			<Row>
				<Col sm={12}><h2>Market</h2></Col>
			</Row>
			<Row className="item_container">
				<Col sm={12} style={{textAlign:"center"}}>
					{					
						market.map(function(item, i){							
							var id = item.id;
							console.log(i, item, id)
							return(
								<div key={i} className="table_inside shadow_concav">
									<div className="table_box">
										<h3>{item.name}</h3>
										<p>{item.description}</p>
										<p>Price: <b>{item.price}</b></p>
										<Button className="button_table" id="item01" type="button" onClick={() => my_click(id)}>Buy</Button>
									</div>
								</div>												
							)
						})
					}
				</Col>
			</Row>
		</div>
	);
}

export default Account_market;
