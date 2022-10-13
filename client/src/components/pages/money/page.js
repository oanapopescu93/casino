import React, { useEffect, useState } from 'react'
import Sapou from '../partials/sapou'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ukraine from '../../img/icons/ukraine.svg'

function Page(props){
    let lang = props.lang 
    let socket = props.socket 
    const [loading, setLoading] = useState(true)
    const [info, setInfo] = useState(null)
    let info_title = ["crypto", "paypal"]

    useEffect(() => {
        get_wallet().then(function(data){
            if(data){
                setInfo(data)
                setLoading(false)
            }
        })
	}, [])

    function get_wallet(){
        return new Promise(function(resolve, reject){
            socket.emit('donate_send', "")
            socket.on('donate_read', function(data){
                resolve(data)
            })         
        })
    }   

	return (
        <>
            <Sapou lang={lang} page="donations"></Sapou>
            <Row>
                <Col sm={3}></Col>
                <Col sm={6}>
                    {loading ? <div>Loading...</div> : 
                        <>
                            {info ? <div className="donation_container color_yellow">
                                <div className="donation_ukraine">
                                    <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/fundraisers/explore/search/charities/?query=ukraine">
                                        Donation for Ukraine <img id="ukraine_icon" alt="ukraine_icon" src={ukraine}></img>
                                    </a>
                                </div>
                                {	                    																		
                                    info_title.map(function(item01, i){                        
                                        let first = item01.slice(0, 1).toUpperCase()
                                        let rest = item01.slice(1, item01.length)
                                        let title = first + rest
                                        let style = "donation_body donation_body_crypto shadow_concav"
                                        if(item01 !== "crypto"){
                                            style = "donation_body"
                                        }
                                        return(
                                            <div key={i} className="donation_box">
                                                {/* { item01 !== "crypto" ? null : <div className="donation_header"><h4>{title}</h4></div> } */}
                                                <ul className={style}>
                                                    {
                                                        info.map(function(item02, j){
                                                            if(item01 === item02.type){
                                                                if(item01 === "crypto"){
                                                                    return (
                                                                        <li key={j} className="donation_link donation_link_crypto">
                                                                            <p key={i}><span>{item02.title}: </span><b>{item02.text}</b></p>
                                                                        </li>
                                                                    )                                                        
                                                                } else if(item01 === "paypal"){
                                                                    return (                                                                
                                                                        <li key={j} className="donation_link donation_link_paypall">
                                                                            <a className="paypal_button shadow_convex" rel="noopener noreferrer" target="_blank" href="https://paypal.me/oanapopescu93?country.x=RO&locale.x=en_US">Paypal</a>
                                                                        </li>
                                                                    )
                                                                } else {
                                                                    return null
                                                                }
                                                            } else {
                                                                return null
                                                            }                                                                                                                  
                                                        }) 
                                                    } 
                                                </ul>
                                            </div>
                                        )                                                                                                                
                                    })
                                }
                            </div> : <div className="donation_container color_yellow">
                                <p>{lang === "ro" ? <span>Nu avem informatii disponibile</span> : <span>No info</span>}</p>
                            </div>}
                        </>
                    }                    
                </Col>
                <Col sm={3}></Col>
            </Row>      
            <Button className="button_table shadow_convex" type="button" onClick={()=>props.back()}>
                {lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
            </Button>
        </>
    )
}
export default Page