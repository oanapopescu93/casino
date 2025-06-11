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
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'
import ContactAddress from './contactAddress'

function Contact(props){
    const {socket, home, settings} = props
    const {lang, theme} = settings
    let locations = home.contact
    let default_location = locations[0][lang] ? locations[0][lang] : locations[0]["ENG"]
    
    let dispatch = useDispatch()

    const [contactElement, setContactElement] = useState(null)
    const [mapCenter, setMapCenter] = useState(default_location.map)
    const [markerPosition, setMarkerPosition] = useState(default_location.marker)
    const [country, setCountry] = useState(default_location.country)
    const [city, setCity] = useState(default_location.city) 
    const [zoom, setZoom] = useState(10)
    const [width, setWidth] = useState(getWindowDimensions().width)
    const [index, setIndex] = useState(0)

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    function handleChooseContactElement(x, i){
        setIndex(i)
        let location = locations[i][lang]
        setContactElement(x)
        setCountry(location.country)
        setCity(location.city)
        setMapCenter(location.map)
        setMarkerPosition(location.marker)
        setZoom(10) 
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

    useEffect(() => {
        let location = locations[index][lang]
        setCountry(location.country)
        setCity(location.city)
        setMapCenter(location.map)
        setMarkerPosition(location.marker)
    }, [lang])

    return <div className="content_wrap">
        <Header template="contact" title={translate({lang, info: "contact"})} lang={lang} theme={theme}/>
        <div className="page_content">
            <Row>
                <Col lg={2} />
                <Col lg={8}>
                    {width >= 768 ? <Row>
                        <Col md={4}>
                            <ContactForm lang={lang} socket={socket} />
                        </Col>
                        <Col md={8}>
                            {locations.length > 1 ? <ContactList 
                                lang={lang} 
                                list={locations} 
                                handleChooseContactElement={(e, i)=>handleChooseContactElement(e, i)}
                            /> : <ContactAddress 
                                lang={lang} 
                                location={locations[0]} 
                            />}
                            <ContactMap 
                                lang={lang} 
                                contactElement={contactElement}
                                mapCenter={mapCenter}
                                markerPosition={markerPosition}
                                country={country}
                                city={city}
                                zoom={zoom}
                            />
                        </Col>
                    </Row> : <Row>                
                        <Col md={8}>
                            {locations.length > 1 ? <ContactList 
                                lang={lang} 
                                list={locations} 
                                handleChooseContactElement={(e, i)=>handleChooseContactElement(e, i)}
                            /> : <ContactAddress 
                                lang={lang} 
                                location={locations[0]} 
                            />}
                        </Col>
                        <Col md={4}>
                            <ContactForm lang={lang} socket={socket} />
                        </Col>
                    </Row>}
                </Col>
                <Col lg={2} />    
            </Row> 
        </div>
        <div className="tooltip">
            <Button 
                type="button"
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>handleBack()}
            ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
            <span className="tooltiptext">{translate({lang, info: "back"})}</span>
        </div>
    </div>
}
export default Contact