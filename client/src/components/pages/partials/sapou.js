import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import logo_icon from '../../img/logo.png';

function Sapou(props){
    var page = props.page; 
    var lang = props.lang;		
	if(lang === ''){
		lang = "eng";
	} 

	return (
        <>
            {(() => {
                switch (page) {
                    case "home":
                        return (
                            <Row>
                                <Col sm={12}>
                                    <img id="logo_icon" alt="logo_icon" src={logo_icon} />
                                    <h1>BunnyBet</h1>
                                    {lang === "ro" ? <h2>Indrazneste sa prinzi iepurele</h2> : <h2>Dare catch the rabbit</h2>} 
                                </Col>
                            </Row>
                        ) 
                    case "recovery":
                        return(
                            <Row>
                                <Col sm={12}>
                                    <img id="logo_icon" alt="logo_icon" src={logo_icon} />
                                    <h1>BunnyBet</h1>
                                    {lang === "ro" ? <h2>Recuperare</h2> : <h2>Recovery</h2>}                                    
                                </Col>
                            </Row>
                        ); 
                    case "salon":
                        return(
                            <Row>
                                <Col sm={12} id="sapou">
                                    <a href="/">
                                        <img id="logo_icon" alt="logo_icon" src={logo_icon} />
                                        <h1>BunnyBet</h1>
                                        {lang === "ro" ? <h6>Salon</h6> : <h6>Welcome to the salon</h6>}                                        
                                    </a>								
                                </Col>
                            </Row>      
                        ); 
                    case "splash_screen":
                        return(
                            <>
                                <img id="logo_splash" alt="logo_splash" src={logo_icon} />
                                <h1>BunnyBet</h1>
                            </>
                        )                
                    default:
                        return(
                            <h1>BunnyBet</h1>
                        )						
                }
            })()}
        </>
	);
}

export default Sapou;