import React, {useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { getWindowDimensions } from '../../utils/utils'
import Carousel from '../carousel/carousel'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { changeGame, changeGamePage } from '../../reducers/page'

function SalonGames(props){
    const {lang, items} = props
    const [width, setWidth] = useState(getWindowDimensions().width)
    const [casinoGames, setCasinoGames] = useState(null)
    const [casinoGamesTitle, setCasinoGamesTitle] = useState([])
    const [index, setIndex] = useState(0)
    const [titleDropdown, setTitleDropdown] = useState("")
    let dispatch = useDispatch()

    let salon_carousel_options = {
        items: 4,
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
            768:{
                items:3
            },
            1200:{
                items:4
            },
        }
    }

    function handleResize(event){
        setWidth(getWindowDimensions().width)
    }

    useEffect(() => {
        create_casino_games()
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
                {width < 960 ? <DropdownButton title={titleDropdown} id="dropdown-menu-align-right" onSelect={handleSelect}>
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
                    if(i === index){
                        box = "open"
                    }
                    return <div key={i}>
                        {(() => {
                            if (width > 960) {
                                return (
                                    <div className="casino_games_title_container">
                                        <div className="capitalize casino_games_title shadow_convex" onClick={()=>handleSelect(t)}>
                                            <h4>{t}</h4>
                                        </div>
                                    </div>
                                )
                            }
                        })()} 
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