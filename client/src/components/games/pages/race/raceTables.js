import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { translate } from '../../../../translations/translate'
import { decryptData } from '../../../../utils/crypto'
import { changePopup } from '../../../../reducers/popup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import Carousel from '../../../carousel/carousel'

function RaceTables(props){
    const {home, user, settings} = props
    const {lang} = settings
    
    let race_bets = useSelector(state => state.games.race.bets) 
    let money = user.money ? decryptData(user.money) : 0
    let dispatch = useDispatch()

    let race_array = []
	if(home.race_rabbits && home.race_rabbits.length>0){
		race_array = home.race_rabbits.filter((x)=>{
			return x.participating
		})
	}

    function getData(){
        const sum = race_bets.reduce((total, current) => total + current.bet, 0)
        if(money >= sum){ //the user has enough money to make all these bets
            props.getData(race_bets)
        } else {
            let payload = {
				open: true,
				template: "error",
				title: "error",
				data: translate({lang: lang, info: "no_money"})
			}
			dispatch(changePopup(payload))
        }
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

    return <div className="game_container race_tables_container">
        <Carousel 
            {...props}
            id="carousel_race"
            template="race" 
            options={race_carousel_options}             
            itemList={race_array}
        />
        <div className="game_start">
            <div className="tooltip">
                    <Button 
                        type="button"  
                        className="mybutton round button_transparent shadow_convex"
                        onClick={() => getData()}
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
    </div>
}

export default RaceTables