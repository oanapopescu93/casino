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
import ContactDetails from './contactDetails'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

function Contact(props){
    let locations = props.home.contact    
    const [contactElement, setContactElement] = useState(null)
    let dispatch = useDispatch() 
    const [mapCenter, setMapCenter] = useState(locations[0][props.lang].map)
    const [markerPosition, setMarkerPosition] = useState(locations[0][props.lang].marker)
    const [country, setCountry] = useState(locations[0][props.lang].country)
    const [city, setCity] = useState(locations[0][props.lang].city) 
    const [zoom, setZoom] = useState(10)
    const [width, setWidth] = useState(getWindowDimensions().width)
    const [index, setIndex] = useState(0)

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    function handleChooseContactElement(x, i){        
        if(x){
            setIndex(i)
            let location = locations[i][props.lang]
            setContactElement(x)
            setCountry(location.country)
            setCity(location.city)
            setMapCenter(location.map)
            setMarkerPosition(location.marker)
            setZoom(10) 
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

    useEffect(() => {
        let location = locations[index][props.lang]
        setCountry(location.country)
        setCity(location.city)
        setMapCenter(location.map)
        setMarkerPosition(location.marker)
    }, [props.lang])

    return <div className="content_wrap">
        <Header template="contact" title={translate({lang: props.lang, info: "contact"})} />
        <div className="page_content">
            <Row>
                <Col sm={4} md={4} lg={4}>
                    <ContactForm lang={props.lang} socket={props.socket} />
                </Col>
                <Col sm={8} md={8} lg={8}>
                    {locations && locations.length>1 ? <ContactList 
                        lang={props.lang} 
                        list={locations} 
                        handleChooseContactElement={(e, i)=>handleChooseContactElement(e, i)}
                    /> : <ContactDetails 
                        lang={props.lang} 
                        item={locations[0]} 
                    />}
                    {locations && locations.length === 1 && width >= 960 ?<>
                        {width >= 960 ? <ContactMap 
                            lang={props.lang} 
                            contactElement={contactElement}
                            mapCenter={mapCenter}
                            markerPosition={markerPosition}
                            country={country}
                            city={city}
                            zoom={zoom}
                        /> : null} 
                    </> : null}
                </Col>
            </Row>
            {locations && locations.length>1 && width >= 960 ? <Row>
                <Col sm={12}>
                    <ContactMap 
                        lang={props.lang} 
                        contactElement={contactElement}
                        mapCenter={mapCenter}
                        markerPosition={markerPosition}
                        country={country}
                        city={city}
                        zoom={zoom}
                    />
                </Col>
            </Row> : null}
        </div>
        <div className="text_center">
            <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                <FontAwesomeIcon icon={faArrowRotateLeft} />
            </Button>
        </div>
    </div>
}
export default Contact