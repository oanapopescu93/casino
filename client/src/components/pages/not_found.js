import React from 'react';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import rabbit_stand_right from '../img/icons/rabbit_stand_right.png';
import rabbit_stand_left from '../img/icons/rabbit_stand_left.png';

function handleBack(){
    window.location.href = "/";
}

function Not_found(props) {
    var lang = props.lang;
	return (
        <div id="not_found" className="full-height">
			<div className="full-height-content">
				<Container className="not_found color_yellow">	
                    <Row>
                        <Col className="hidden-sm hidden-md hidden-lg" sm={12} style={{marginBottom: "10px"}}>
                            <img id="rabbit_stand_right" className="rabbit_not_found" alt="rabbit_stand_right" src={rabbit_stand_right} />
                            <div className="rabbit_not_found" style={{minWidth: "130px"}}>
                                <h1>404</h1>
                                {lang === "ro" ? <h2>Pagina nu exista</h2> : <h2>Page not found</h2>}                                
                            </div>
                            <img id="rabbit_stand_left" className="rabbit_not_found" alt="rabbit_stand_left" src={rabbit_stand_left} />                        
                        </Col>
				        <Col className="hidden-xs" sm={4} md={4} lg={4} >
                            <img id="rabbit_stand_right" className="rabbit_not_found" alt="rabbit_stand_right" src={rabbit_stand_right} />
                        </Col>
				        <Col sm={4} md={4} lg={4}>
                            <h1 className="hidden-xs">404</h1>
                            {lang === "ro" ? 
                                <h2 className="hidden-xs" style={{marginBottom: "10px"}}>Pagina nu exista</h2> : 
                                <h2 className="hidden-xs" style={{marginBottom: "10px"}}>Page not found</h2>
                            }  
                            {lang === "ro" ? 
                                <p>Nu am putut gasi pagina pe servarele noastre. Intoarce-te sau <a href="https://en.wikipedia.org/wiki/HTTP_404" target="_black" className="link_hover_underline" >citeste aici</a> despre aces tip de eroare.</p> : 
                                <p>We could not find the above page on our servers. Go back or <a href="https://en.wikipedia.org/wiki/HTTP_404" target="_black" className="link_hover_underline" >read more</a> about this type of error.</p>
                            }  
                            
                            <Button className="button_table shadow_convex" type="button" onClick={handleBack}>{lang === "ro" ? <span>Inapoi</span> : <span>Back</span>} </Button>
                        </Col>
                        <Col className="hidden-xs" sm={4} md={4} lg={4}>
                            <img id="rabbit_stand_left" className="rabbit_not_found" alt="rabbit_stand_left" src={rabbit_stand_left} />
                        </Col>
                    </Row>
                </Container>
		    </div>	
        </div>	
	);
}

export default Not_found;