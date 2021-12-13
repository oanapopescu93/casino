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
                                    {lang === "ro" ? <h4>Indrazneste sa prinzi iepurele</h4> : <h4>Dare catch the rabbit</h4>} 
                                </Col>
                            </Row>
                        ) 
                    case "donations":
                        return (
                            <Row>
                                <Col sm={12} className="color_yellow">
                                    <img id="logo_icon" alt="logo_icon" src={logo_icon} />
                                    <h1>BunnyBet</h1>
                                    {lang === "ro" ? <h4>Donatii</h4> : <h4>Donations</h4>} 
                                </Col>
                            </Row>
                        ) 
                    case "recovery":
                        return(
                            <Row>
                                <Col sm={12}>
                                    <img id="logo_icon" alt="logo_icon" src={logo_icon} />
                                    <h1>BunnyBet</h1>
                                    {lang === "ro" ? <h4>Recuperare</h4> : <h4>Recovery</h4>}                                    
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
                                        {lang === "ro" ? <h3>Salon</h3> : <h3>Welcome to the salon</h3>}                                        
                                    </a>								
                                </Col>
                            </Row>      
                        ); 
                    case "splash_screen":
                    case "about":
                    case "support":
                    case "terms":
                    case "privacy":
                    case "questions":
                    case "career":
                        return(
                            <>
                                <img id="logo_splash" alt="logo_splash" src={logo_icon} />
                                <h1>BunnyBet</h1>
                            </>
                        )                
                    default:
                        return(
                            <h1 className="color_yellow">BunnyBet</h1>
                        )						
                }
            })()}
        </>
	);
}

export default Sapou;