import React, { useRef } from 'react'
import Header from '../../../partials/header'
import Carousel from '../../../carousel/carousel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import { translate } from '../../../../translations/translate'
import { useSelector } from 'react-redux'
import { decryptData } from '../../../../utils/crypto'

function RaceTables(props){
    const {
        settings, page, rabbitArray,
        getData, handleHandleExit
    } = props
    const {lang, theme} = settings

    const carouselRef = useRef(null)

    const race_carousel_options = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        swipeToSlide: true,
        draggable: true,
        dots: false,
        arrows: false,
        initialSlide: 0,
        swipeThreshold: 20,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 2,
                }
            }, 
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    }

    let moneyEncrypted = useSelector(state => state.auth.money)
    let money = moneyEncrypted ? decryptData(moneyEncrypted) : 0

    function handleGetData(){
        if(carouselRef && carouselRef.current){
            let raceInfo = carouselRef.current.getRabbits()
            getData(raceInfo)
        }
    }

    return <>
        <Header template={"game"} details={page} lang={lang} theme={theme}/>
        <div className="carousel_race_container">
            <Carousel 
                ref={carouselRef}
                {...props}
                id="carousel_race"
                template="race" 
                options={race_carousel_options}
                itemList={rabbitArray}
                money={money}
            />
        </div>
        <div className="button_action_group race_buttons_container">
            <div className="tooltip">
                    <Button 
                        type="button"
                        className="mybutton round button_transparent shadow_convex"
                        onClick={()=>handleGetData()}
                    ><FontAwesomeIcon icon={faPlay} /></Button>
                    <span className="tooltiptext">{translate({lang, info: "start"})}</span>
                </div>
            <div className="tooltip">
                <Button 
                    type="button" 
                    className="mybutton round button_transparent shadow_convex"
                    onClick={()=>handleHandleExit()} 
                ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
                <span className="tooltiptext">{translate({lang, info: "back"})}</span>
            </div>
        </div>       
    </>
}

export default RaceTables