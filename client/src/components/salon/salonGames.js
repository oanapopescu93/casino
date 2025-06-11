import React, {useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeGame, changeGamePage } from '../../reducers/page'
import { checkWinterMonths } from '../../utils/special_occasions'
import { translate } from '../../translations/translate'
import { Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import Carousel from '../carousel/carousel'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import ChatBotButton from '../partials/chatBotButton'
import { decryptData } from '../../utils/crypto'

function SalonGames(props){
    const {home, settings, width} = props
    const {products} = home
    const {lang, theme} = settings
    
    const [casinoGames, setCasinoGames] = useState(null)
    const [casinoGamesTitle, setCasinoGamesTitle] = useState([])
    const [index, setIndex] = useState(0)
    const [titleDropdown, setTitleDropdown] = useState("")    
    const [showWinter, setShowWinter] = useState(false)

    let dispatch = useDispatch()
    
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
                breakpoint: 960,
                settings: {
                    slidesToShow: 3,
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

    useEffect(() => {
        create_casino_games()

        // special occasions
        let winter = checkWinterMonths()
		if(winter){ // will appear only on winter months
			setShowWinter(true)
		}

        // Initialize adsbygoogle
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('Adsense error', e);
        }
	}, [])

    function create_casino_games(){
        let casino_games = {
            roulette: [], 
            blackjack: [],
            slots: [],
            craps: [],
            poker: [],
            baccarat: [],
        }
        let casino_games_title = Object.getOwnPropertyNames(casino_games)
        for(let i in products){
            switch (products[i].table_name) {
				case "roulette":
					casino_games.roulette.push(products[i])
					break
				case "blackjack":
					casino_games.blackjack.push(products[i])
					break
				case "slots":
					casino_games.slots.push(products[i])
					break
				case "craps":
					casino_games.craps.push(products[i])
					break
                case "poker":
                    casino_games.poker.push(products[i])
                    break
                case "baccarat":
                    casino_games.baccarat.push(products[i])
                    break
				default:
					break						
				}
        } 
        setCasinoGames(casino_games)
        setCasinoGamesTitle(casino_games_title)
        setTitleDropdown(translate({lang, info: casino_games_title[0]}))
    }

    function handleSelect(x){
        let xLowerCase = x.toLowerCase()
        let i = casinoGamesTitle.indexOf(xLowerCase)
        if(i !== -1){
            setIndex(i)
        }
        setTitleDropdown(x)
    }

    function gameChoice(x){
        dispatch(changeGame(x))
        dispatch(changeGamePage(null))
    }

    return <Row>
        <Col sm={2} className="d-none d-sm-block">
            <div className="adsbygoogle_container">
                <ins
                    className="adsbygoogle"
                    style={{ display: "block", height: "60px" }}
                    data-ad-client="ca-pub-8737922729231817"
                    data-ad-slot="6086373080"
                    data-ad-format="auto"
                />
            </div>
        </Col>
        <Col sm={8} className="salon_games">
            {width < 960 ? <div className="salon_games_dropdown">
                <DropdownButton title={titleDropdown} id="dropdown-menu-align-right" className={showWinter ? "shadow_convex snow" : "shadow_convex"} onSelect={handleSelect}>
                    {casinoGamesTitle.map((t, i)=>{
                        return <Dropdown.Item key={i} eventKey={translate({lang, info: t})}>{translate({lang, info: t})}</Dropdown.Item>
                    })}
                </DropdownButton>
            </div> : null}
            {casinoGamesTitle.map((t, i)=>{
                let box = ""
                if(i === index){ box = "open" }
                return <div key={i}>
                    {width >= 960 ? <div className={showWinter ? "casino_games_title_container snow" : "casino_games_title_container"}>
                        <div className="capitalize casino_games_title shadow_convex" onClick={()=>handleSelect(t)}>
                            <h4>{translate({lang, info: t})}</h4>
                            <div className="casino_games_title_arrow"><FontAwesomeIcon icon={index !== i ? faChevronDown : faChevronUp} /></div>
                        </div>
                    </div> : null}
                    <div box={t} className={"casino_games_table_container "+box}>
                        <div className="casino_games_table">
                            <Carousel 
                                {...props}
                                id={"carousel_salon_"+t}
                                template="salon" 
                                type={t}
                                options={salon_carousel_options} 
                                itemList={casinoGames[t]} 
                                money={money}
                                getItem={(e)=>gameChoice(e)}
                            />
                        </div>
                    </div>
                </div>
            })}
            <div className="chatbot_button_container_small">
                <ChatBotButton lang={lang} theme={theme} />
            </div>
        </Col>
        <Col sm={2} className="d-none d-sm-block">
            <div className="adsbygoogle_container">
                <ins
                    className="adsbygoogle"
                    style={{ display: "block", height: "60px" }}
                    data-ad-client="ca-pub-8737922729231817"
                    data-ad-slot="6086373080"
                    data-ad-format="auto"
                />
            </div>
        </Col>
    </Row>
}

export default SalonGames