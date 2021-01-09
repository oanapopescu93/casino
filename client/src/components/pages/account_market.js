import React from 'react';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

function Account_market(props) {
	function my_click(a){
		console.log('buy', a);
	}
	
	return (
		<div className="account_box_container">
			<Row>
				<Col sm={12}><h2>Market</h2></Col>
			</Row>
			<Row className="item_container">
				<Col sm={12} style={{textAlign:"center"}}>
					<div className="table_inside">
						<div className="table_box">
							<h3>Item name</h3>
							<p>Item description</p>
							<Button className="button_table" id="item01" type="button" onClick={() => my_click("item01")}>Buy</Button>
						</div>
					</div>
					<div className="table_inside">
						<div className="table_box">
							<h3>Item name</h3>
							<p>Item description</p>
							<Button className="button_table" id="item01" type="button" onClick={() => my_click("item01")}>Buy</Button>
						</div>
					</div>
					<div className="table_inside">
						<div className="table_box">
							<h3>Item name</h3>
							<p>Item description</p>
							<Button className="button_table" id="item01" type="button" onClick={() => my_click("item01")}>Buy</Button>
						</div>
					</div>
					<div className="table_inside">
						<div className="table_box">
							<h3>Item name</h3>
							<p>Item description</p>
							<Button className="button_table" id="item01" type="button" onClick={() => my_click("item01")}>Buy</Button>
						</div>
					</div>
					<div className="table_inside">
						<div className="table_box">
							<h3>Item name</h3>
							<p>Item description</p>
							<Button className="button_table" id="item01" type="button" onClick={() => my_click("item01")}>Buy</Button>
						</div>
					</div>
					<div className="table_inside">
						<div className="table_box">
							<h3>Item name</h3>
							<p>Item description</p>
							<Button className="button_table" id="item01" type="button" onClick={() => my_click("item01")}>Buy</Button>
						</div>
					</div>
					<div className="table_inside">
						<div className="table_box">
							<h3>Item name</h3>
							<p>Item description</p>
							<Button className="button_table" id="item01" type="button" onClick={() => my_click("item01")}>Buy</Button>
						</div>
					</div>
					<div className="table_inside">
						<div className="table_box">
							<h3>Item name</h3>
							<p>Item description</p>
							<Button className="button_table" id="item01" type="button" onClick={() => my_click("item01")}>Buy</Button>
						</div>
					</div>
					<div className="table_inside">
						<div className="table_box">
							<h3>Item name</h3>
							<p>Item description</p>
							<Button className="button_table" id="item01" type="button" onClick={() => my_click("item01")}>Buy</Button>
						</div>
					</div>
					<div className="table_inside">
						<div className="table_box">
							<h3>Item name</h3>
							<p>Item description</p>
							<Button className="button_table" id="item01" type="button" onClick={() => my_click("item01")}>Buy</Button>
						</div>
					</div>
					<div className="table_inside">
						<div className="table_box">
							<h3>Item name</h3>
							<p>Item description</p>
							<Button className="button_table" id="item01" type="button" onClick={() => my_click("item01")}>Buy</Button>
						</div>
					</div>
				</Col>
			</Row>
		</div>
	);
}

export default Account_market;
