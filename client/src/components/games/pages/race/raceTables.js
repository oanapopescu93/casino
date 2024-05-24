import React from 'react'
import { Button } from 'react-bootstrap'
import { translate } from '../../../../translations/translate'
import Carousel from '../../../carousel/carousel'
import { useSelector,useDispatch } from 'react-redux'
import { decryptData } from '../../../../utils/crypto'
import { changePopup } from '../../../../reducers/popup'

function RaceTables(props){
    const {lang, home} = props
    let race_bets = useSelector(state => state.games.race.bets) 
    let money = props.user.money ? decryptData(props.user.money) : 0
    let dispatch = useDispatch()   

    let race_array = []
	if(home.race_rabbits && home.race_rabbits.length>0){
		race_array = home.race_rabbits.filter(function(x){
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
				data: translate({lang: props.lang, info: "no_money"})
			}
			dispatch(changePopup(payload))
        }
	}

    const race_carousel_options = {
        dots: false,
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
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }            
        ]
    }

    return <div className="game_container race_tables_container">
        <Carousel 
            id="carousel_race"
            template="race" 
            options={race_carousel_options} 
            lang={lang} 
            itemList={race_array}    
        ></Carousel>
        <div className="game_start">
            <Button 
                type="button"  
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>getData()}
            >{translate({lang: lang, info: "start"})}</Button>
        </div>
    </div>
}

export default RaceTables