import React from 'react';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Sapou from './partials/sapou';

function Splash(props) {
	return (
		<div id="splash_screen" className="full-height">
			<div className="full-height-content">
				<Container>	
                    <Row>
				        <Col sm={4} md={4} lg={4}></Col>
				        <Col sm={4} md={4} lg={4} className="HomePage color_yellow">
                            <div className="deco">
                                <div className="HomePage_box">
                                    <Sapou page="splash_screen"></Sapou>                                    
                                    <div id="myProgress" className="shadow_convex">
                                        <div id="myBar"></div>                                
                                    </div>
                                    <div id="myBar_text_container">
                                        <div id="myBar_text">0%</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col sm={4} md={4} lg={4}></Col>
                    </Row>
                </Container>
		    </div>	
        </div>	
	);
}

export default Splash;