import React, {useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { getWindowDimensions } from '../../utils/utils'
import Carousel from '../carousel/carousel'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { changeGame, changeGamePage } from '../../reducers/page'
import { checkWinterMonths } from '../../utils/special_occasions'

function SalonGames(props){
    const {lang, items} = props
    const [width, setWidth] = useState(getWindowDimensions().width)
    const [casinoGames, setCasinoGames] = useState(null)
    const [casinoGamesTitle, setCasinoGamesTitle] = useState([])
    const [index, setIndex] = useState(0)
    const [titleDropdown, setTitleDropdown] = useState("")
    let dispatch = useDispatch()    
    const [showWinter, setShowWinter] = useState(false)
    const salon_carousel_options = {
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
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
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

    function handleResize(){
        setWidth(getWindowDimensions().width)
    }

    useEffect(() => {
        create_casino_games()

        // special occasions
        let winter = checkWinterMonths()
		if(winter){ // will appear only on winter months
			setShowWinter(true)
		}

        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize)
            handleResize()
            return () => window.removeEventListener("resize", handleResize)
        }
	}, [])

    function create_casino_games(){
        let casino_games = {
            roulette: [], 
            blackjack: [],
            slots: [],
            craps: [],
            poker: [],
        }
        let casino_games_title = Object.getOwnPropertyNames(casino_games)
        for(let i in items){
            switch (items[i].table_name) {
				case "roulette":
					casino_games.roulette.push(items[i])
					break
				case "blackjack":
					casino_games.blackjack.push(items[i])
					break
				case "slots":
					casino_games.slots.push(items[i])
					break
				case "craps":
					casino_games.craps.push(items[i])
					break
                case "poker":
                    casino_games.poker.push(items[i])
                    break
				default:
					break						
				}
        } 
        setCasinoGames(casino_games)
        setCasinoGamesTitle(casino_games_title)  
        setTitleDropdown(casino_games_title[0])
    }    

    function handleSelect(x){
        let i = casinoGamesTitle.indexOf(x)
        if(i !== -1){
            setIndex(i)
        }
        setTitleDropdown(x)
    }

    function gameChoice(x){
        dispatch(changeGame(x))
        dispatch(changeGamePage(null))
    }

    return <div className="salon_games">
        <Row>
            <Col sm={2}></Col>
            <Col sm={8}>
                {width < 960 ? <DropdownButton title={titleDropdown} id="dropdown-menu-align-right" className={showWinter ? "snow" : ""} onSelect={handleSelect}>
                    {casinoGamesTitle.map(function(t, i){
                        return <Dropdown.Item key={i} eventKey={t}>{t}</Dropdown.Item>
                    })}
                </DropdownButton> : null}
            </Col>
            <Col sm={2}></Col>
        </Row>
        <Row>
            <Col sm={2}></Col>
            <Col sm={8}>
                {casinoGamesTitle.map(function(t, i){
                    let box = ""
                    if(i === index){ box = "open" }
                    return <div key={i}>
                        {width >= 960 ? <div className={showWinter ? "casino_games_title_container snow" : "casino_games_title_container"}>
                            <div className="capitalize casino_games_title shadow_convex" onClick={()=>handleSelect(t)}>
                                <h4>{t}</h4>
                            </div>
                        </div> : null}
                        <div box={t} className={"casino_games_table_container "+box}>
                            <div className="casino_games_table">
                                <Carousel 
                                    id={"carousel_salon_"+t}
                                    template="salon" 
                                    type={t}
                                    options={salon_carousel_options} 
                                    lang={lang} 
                                    itemList={casinoGames[t]} 
                                    getItem={(e)=>gameChoice(e)}   
                                ></Carousel>
                            </div>
                        </div>
                    </div>
                })}
            </Col>            
            <Col sm={2}></Col>
        </Row>
    </div>
}

export default SalonGames