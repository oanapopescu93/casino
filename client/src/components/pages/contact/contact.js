import React, {useState, useEffect } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import ContactForm from './contactForm'
import ContactList from './contactList'
import ContactMap from './contactMap'
import { getWindowDimensions } from '../../../utils/utils'
import Header from '../../partials/header'

function Contact(props){
    const [contactElement, setContactElement] = useState(null)
    let dispatch = useDispatch() 
    const [mapCenter, setsetMapCenter] = useState({lat: 44.439663, lng: 26.096306})
    const [markerPosition, setMarkerPosition] = useState([44.439663, 26.096306])    
    const [country, setCountry] = useState('Romania')
    const [city, setCity] = useState('Bucharest') 
    const [zoom, setZoom] = useState(10)  
    const [width, setWidth] = useState(getWindowDimensions().width)  

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    function handleChooseContactElement(x){
        if(x){
            setContactElement(x)            
            if(x.city){
                setCity(x.city)
            }
            if(x.country){
                setCountry(x.country)
            }            
            switch(x.country) {        
                case "USA":
                    setsetMapCenter({lat: 40.730610, lng: -73.935242})
                    setMarkerPosition([40.730610, -73.935242])
                    setZoom(10)
                    break
                case "Germany":
                    setsetMapCenter({lat: 52.5200, lng: 13.4050})
                    setMarkerPosition([52.5200, 13.4050])
                    setZoom(10)
                    break
                case "Romania":
                default:    
                    setsetMapCenter({lat: 44.439663, lng: 26.096306})
                    setMarkerPosition([44.439663, 26.096306])
                    setZoom(10)
                    break                  
            } 
        }
    }

    function handleResize() {
        setWidth(getWindowDimensions().width)     
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize)
            handleResize()
            return () => window.removeEventListener("resize", handleResize)
        }
    }, []) 

    return <div className="content_wrap">
        <Header template="contact" title={translate({lang: props.lang, info: "contact"})}></Header>        
        <div className="page_content">
            <Row>
                <Col sm={4} md={4} lg={4}>
                    <ContactForm lang={props.lang} socket={props.socket}></ContactForm>
                </Col>
                <Col sm={8} md={8} lg={8}>
                    <ContactList lang={props.lang} list={props.home.contact} handleChooseContactElement={(e)=>handleChooseContactElement(e)}></ContactList>
                </Col>
            </Row>
            {width < 960 ? null : <Row>
                <Col sm={12}>
                    <ContactMap 
                        lang={props.lang} 
                        contactElement={contactElement}
                        mapCenter={mapCenter}
                        markerPosition={markerPosition}
                        country={country}
                        city={city}
                        zoom={zoom}
                    ></ContactMap>
                </Col>
            </Row>}            
        </div>
        <div className="text_center">
            <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                {translate({lang: props.lang, info: "back"})}
            </Button>
        </div>
    </div>
}
export default Contact