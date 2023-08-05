import React, {useRef, useState, useEffect} from 'react'
import { Button } from 'react-bootstrap'
import { translate } from '../../../../translations/translate'
import Carousel from '../../../carousel/carousel'
import { useSelector } from 'react-redux'

function RaceTables(props){
    const {lang, home} = props
    let myCarousel = useRef()
    let race_bets = useSelector(state => state.games.race.bets)
    const [index, setIndex] = useState(0)

    useEffect(() => {
        myCarousel.current.to(index, 0)
	}, [race_bets, index]) 

    let race_carousel_options = {
        items: 1,
        nav: false,
        rewind: true,
        autoplay: false,
        slideBy: 1,
        dots: false,
        loop:true,
        responsive:{
            0:{
                items:1
            },
            960:{
                items:2
            },
            1400:{
                items:3
            },
            1800:{
                items:4
            },
        },
    }    
    let race_array = []
	if(home.race_rabbits && home.race_rabbits.length>0){
		race_array = home.race_rabbits.filter(function(x){
			return x.participating
		})
	}
    
    function getIndex(e){
        setIndex(e)
    }

    function getData(){
		props.getData(race_bets)
	}

    return <div className="game_container race_tables_container">
        <Carousel 
            id="carousel_race"
            template="race" 
            options={race_carousel_options} 
            lang={lang} 
            itemList={race_array}
            innerRef={myCarousel}    
            getIndex={(e)=>getIndex(e)}        
        ></Carousel>
        <div className="game_start">
            <Button 
                type="button"  
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>getData()}
            >{translate({lang: lang, info: "Start"})}</Button>
        </div>
    </div>
}

export default RaceTables