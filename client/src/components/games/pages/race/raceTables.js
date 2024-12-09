import React from 'react'
import { useSelector } from 'react-redux'
import { translate } from '../../../../translations/translate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import Carousel from '../../../carousel/carousel'
import Header from '../../../partials/header'

function RaceTables(props){
    const {home, page, settings, getData} = props
    const {lang, theme} = settings
    
    let race_bets = useSelector(state => state.games.race.bets) 

    let race_array = []
	if(home.race_rabbits && home.race_rabbits.length>0){
		race_array = home.race_rabbits.filter((x)=>{
			return x.participating
		})
	}

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
                breakpoint: 1800,
                settings: {
                    slidesToShow: 4,
                }
            },
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
                breakpoint: 780,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    }

    return <>
        <Header template={"game"} details={page} lang={lang} theme={theme}/>
        <div className="carousel_race_container">
            <Carousel 
                {...props}
                id="carousel_race"
                template="race" 
                options={race_carousel_options}
                itemList={race_array}
            />
        </div>
        <div className="button_action_group race_buttons_container">
            <div className="tooltip">
                    <Button 
                        type="button"
                        className="mybutton round button_transparent shadow_convex"
                        onClick={() => getData(race_bets)}
                    ><FontAwesomeIcon icon={faPlay} /></Button>
                    <span className="tooltiptext">{translate({lang: lang, info: "start"})}</span>
                </div>
            <div className="tooltip">
                <Button 
                    type="button" 
                    className="mybutton round button_transparent shadow_convex"
                    onClick={()=>props.handleHandleExit()} 
                ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
                <span className="tooltiptext">{translate({lang: lang, info: "back"})}</span>
            </div>
        </div>
    </>
}

export default RaceTables