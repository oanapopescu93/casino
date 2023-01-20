import React, {useEffect, useState } from 'react'
import $ from 'jquery'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Carousel from '../partials/carousel'
import { checkWinterMonths, setCookie } from '../../utils'
import { useDispatch } from 'react-redux'
import { game_page } from '../../actions/actions'

function SalonGames(props){
    const [width, setWidth] = useState(window.innerWidth)
    const [snow, setSnow] = useState('')
    const [casinoGames, setCasinoGames] = useState(null)
    const [casinoGamesTitle, setCasinoGamesTitle] = useState([])
    let dispatch = useDispatch()

    useEffect(() => {
		//dispatch(game_page('salon'))
        create_casino_games(props.data)
        $(window).resize(function(){            
			setWidth(window.innerWidth)
		})
        let winter = checkWinterMonths()
        if(winter){
            setSnow('snow')
        }
	}, [])

    function create_casino_games(res){
        let casino_games = {
            roulette_tables: [], 
            blackjack_tables: [],
            slots_tables: [],
            craps_tables: []
        }
        let casino_games_title = Object.getOwnPropertyNames(casino_games)

		for(let i in res.server_tables){
			switch (res.server_tables[i].table_name) {
				case "roulette":
					casino_games.roulette_tables.push(res.server_tables[i])
					break
				case "blackjack":
					casino_games.blackjack_tables.push(res.server_tables[i])
					break
				case "slots":
					casino_games.slots_tables.push(res.server_tables[i])
					break
				case "craps":
					casino_games.craps_tables.push(res.server_tables[i])
					break
				default:
					break						
				}
		}
		setCasinoGames(casino_games)
        setCasinoGamesTitle(casino_games_title)
	}

    function handleExit(){
        setCookie("casino_uuid", '')
		setCookie("casino_user", '')
		setCookie("casino_email", '')
		window.location.href = "/"
	}

    function handleDropdown(t) {
		$('.casino_games_table_container').removeClass('open')
		$('.casino_games_table_container').each(function() {
			if($(this).attr('box') === t){
				$(this).addClass('open')
                let title = t.split('_').join(' ')
                $('.casino_games_title span').text(title)
                $('.casino_games_title_box_container').removeClass('open')
			}
		})
	}

    function handleDropdown_small() {
		$('.casino_games_title_box_container').toggleClass('open')
        if($('.casino_games_title_box_container').hasClass('open')){
            $('.casino_games_title i').removeClass('fa-angle-down')
            $('.casino_games_title i').addClass('fa-angle-up')
        } else {
            $('.casino_games_title i').addClass('fa-angle-down')
            $('.casino_games_title i').removeClass('fa-angle-up')
        }
	}

    function gameChoice(x){
        dispatch(game_page(x.table_name))
        props.gameChoice(x)
    }
	
	return (
        <>
            <Row>
                <Col sm={2}></Col>
                <Col sm={8}>
                {(() => {
                    if (width < 960) {
                        $('.casino_games_table_container').removeClass('open')
                        $('.casino_games_table_container').eq(0).addClass('open')
                        return (
                            <div id="casino_games_title_dropdown_container">
                                <div onClick={()=>handleDropdown_small()} className="casino_games_title_container">                                    
                                    <div className={"capitalize casino_games_title shadow_convex "+snow}>
                                        <span className="capitalize">roulette tables</span>
                                        <i className="fa fa-angle-down"></i>
                                    </div>
                                </div>                                
                                <div className="casino_games_title_box_container">
                                    <div className="casino_games_title_box">
                                        {
                                            casinoGamesTitle.map(function(t, i){
                                                let title = t.split('_').join(' ')
                                                return(
                                                    <div key={i} className="capitalize" onClick={()=>handleDropdown(t)}>{title}</div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    } 
                })()}
                </Col>
                <Col sm={2}></Col>
            </Row>
            <Row>
                <Col sm={2}></Col>
                <Col sm={8}>
                    {
                        casinoGamesTitle.map(function(t, i){
                            let title = t.split('_')[0]
                            let box = "casino_games_table_container"
                            if(i === 0){
                                box = box + " open"
                            }

                            return(
                                <div key={i}>
                                {(() => {
                                        if (width > 960) {
                                            return (
                                                <div className="casino_games_title_container">
                                                    <div className={"capitalize casino_games_title shadow_convex "+snow} onClick={()=>handleDropdown(t)}>{title}</div>
                                                </div>
                                            )
                                        }
                                    })()} 
                                    <div box={t} className={box}>
                                        <div className="casino_games_table">
                                            {(() => {
                                                if (casinoGames[t].length === 0) {
                                                    return (
                                                        <div><p>Loading</p></div>
                                                    )
                                                } else {
                                                    return (
                                                        <Carousel gameChoice={gameChoice} template="salon" lang={props.lang} socket={props.socket} item_list={casinoGames[t]} dispatch={dispatch}></Carousel>
                                                    )
                                                }
                                            })()}
                                        </div>
                                    </div>  
                                </div>													
                            )
                        })
                    }
                </Col>
                <Col sm={2}></Col>
            </Row>
            <Row>
                <Col sm={12}>
                    {props.lang === "ro" ? 
                        <p id="exit_salon" className="shadow_convex" onClick={() => handleExit()}>Iesi din salon</p> : 
                        <p id="exit_salon" className="shadow_convex" onClick={() => handleExit()}>Exit salon</p>	
                    }																			
                </Col>
            </Row>
        </>
	)
}

export default SalonGames