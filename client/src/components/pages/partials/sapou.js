import React, {useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import logo_icon from '../../img/logo.png'
import { checkEaster } from '../../utils'
import EasterEgg from '../../special_occasions/easter/egg'

function Sapou(props){
    const [egg, setEgg] = useState(false)
    useEffect(() => {
		let easter = checkEaster()
        if(easter){
            setEgg(true)
        }
	}, [])
    
	return (
        <>
            {(() => {
                switch (props.page) {
                    case "home":
                        return (
                            <Row>
                                <Col sm={12}>
                                    <img id="logo_icon" alt="logo_icon" src={logo_icon} />
                                    <h1>BunnyBet</h1>
                                    {props.lang === "ro" ? <h4>Indrazneste sa prinzi iepurele</h4> : <h4>Dare catch the rabbit</h4>} 
                                </Col>
                            </Row>
                        ) 
                    case "donations":
                        return (
                            <Row>
                                <Col sm={12} className="color_yellow">
                                    <img id="logo_icon" alt="logo_icon" src={logo_icon} />
                                    <h1>BunnyBet</h1>
                                    {props.lang === "ro" ? <h4>Donatii</h4> : <h4>Donations</h4>} 
                                </Col>
                            </Row>
                        ) 
                    case "recovery":
                        return(
                            <Row>
                                <Col sm={12}>
                                    <img id="logo_icon" alt="logo_icon" src={logo_icon} />
                                    <h1>BunnyBet</h1>
                                    {props.lang === "ro" ? <h4>Recuperare</h4> : <h4>Recovery</h4>}                                    
                                </Col>
                            </Row>
                        )
                    case "salon":
                        return(
                            <Row>
                                <Col sm={12} id="sapou">
                                    <a href="/">
                                        <img id="logo_icon" alt="logo_icon" src={logo_icon} />
                                        <h1>BunnyBet</h1>
                                        {props.lang === "ro" ? <h3>Salon</h3> : <h3>Welcome to the salon</h3>}                                        
                                    </a>								
                                </Col>
                                {egg ? 
                                    <div className="easter_eggs">
                                        <EasterEgg></EasterEgg>
                                        <EasterEgg></EasterEgg>
                                    </div> : null
                                }
                            </Row>      
                        )
                    case "contact":
                        return(
                            <Row>
                                <Col sm={12} id="sapou">
                                    <a href="/">
                                        <img id="logo_icon" alt="logo_icon" src={logo_icon} />
                                        <h1>BunnyBet</h1>
                                        {/* {props.lang === "ro" ? <h3>Contact</h3> : <h3>Contact</h3>}    */}
                                        {props.lang === "ro" ? 
                                            <p>
                                                Aveti nevoie de mai multe informatii? 
                                                Contactati-ne pentru a decoperi mai multe despre produsele si serviciile noastre.
                                            </p> : 
                                            <p>Do you need more information? Please contact us to find more about our products and services.</p>
                                        }                                        
                                    </a>								
                                </Col>
                            </Row>      
                        )
                    case "splash_screen":
                        return(
                            <>
                                <img id="logo_splash" alt="logo_splash" src={logo_icon} />
                                <h1>BunnyBet</h1>
                            </>
                        )   
                    case "about":
                    case "terms":
                    case "privacy":
                    case "questions":
                    case "career":
                        return(
                            <>
                                <img id="logo_splash" alt="logo_splash" src={logo_icon} />
                                <h1>BunnyBet</h1>
                                {egg ? 
                                    <div className="easter_eggs">
                                        <EasterEgg></EasterEgg>
                                        <EasterEgg></EasterEgg>
                                    </div> : null
                                }
                            </>
                        )                
                    default:
                        return(
                            <h1 className="color_yellow">BunnyBet</h1>
                        )						
                }
            })()}
        </>
	)
}

export default Sapou