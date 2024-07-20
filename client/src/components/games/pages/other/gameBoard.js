import React from 'react'
import { translate } from '../../../../translations/translate'
import Counter from '../../../partials/counter'
import { decryptData } from '../../../../utils/crypto'
import { Button, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPlus, faPause, faAnglesUp, faXmark } from '@fortawesome/free-solid-svg-icons'
import PokerBoard from './pokerBoard'

function GameBoard(props){
    const {template, user, settings, startGame, bet} = props
    const {lang} = settings
    let max_bet = user.money ? decryptData(user.money) : 0

    function handleClick(e){
        if(typeof props.choice === "function"){
            props.choice(e)
        }
    }
    function updateQtyMarket(e){
        if(typeof props.updateBets === "function"){
            props.updateBets(e)
        }
    }

    return <div id={template} className="gameboard shadow_convex">
        {(() => {
            switch(template) {
                case "blackjack_board":
                    return <Row>
                        {startGame ? <>
                            <Col xs={3}>
                                <div className="tooltip">
                                    <Button 
                                        type="button"
                                        className="mybutton button_fullcolor shadow_convex"
                                        onClick={()=>handleClick('hit')}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                        <span>{translate({lang: lang, info: "hit"})}</span>
                                    </Button>
                                    <span className="tooltiptext">{translate({lang: lang, info: "hit_explanation"})}</span>
                                </div>
                            </Col>
                            <Col xs={3}>
                                <div className="tooltip">
                                    <Button 
                                        type="button"
                                        className="mybutton button_fullcolor shadow_convex"
                                        onClick={()=>handleClick('stand')}
                                    >
                                        <FontAwesomeIcon icon={faPause} />
                                        <span>{translate({lang: lang, info: "stand"})}</span>
                                    </Button>
                                    <span className="tooltiptext">{translate({lang: lang, info: "stand_explanation"})}</span>
                                </div>
                            </Col>
                            <Col xs={3}>
                                <div className="tooltip">
                                    <Button 
                                        type="button"
                                        className="mybutton button_fullcolor shadow_convex"
                                        onClick={()=>handleClick('double_down')}
                                    >
                                        <FontAwesomeIcon icon={faAnglesUp} />
                                        <span>{translate({lang: lang, info: "double_down"})}</span>
                                    </Button>
                                    <span className="tooltiptext">{translate({lang: lang, info: "double_down_explanation"})}</span>
                                </div>
                            </Col>
                            <Col xs={3}>
                                <div className="tooltip">
                                    <Button 
                                        type="button"
                                        className="mybutton button_fullcolor shadow_convex"
                                        onClick={()=>handleClick('surrender')}
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                        <span>{translate({lang: lang, info: "surrender"})}</span>
                                    </Button>
                                    <span className="tooltiptext">{translate({lang: lang, info: "surrender_explanation"})}</span>
                                </div>
                            </Col>
                        </> : <>
                            <Col xs={8} sm={4}>
                                <Counter num={bet} max={max_bet} update={(e)=>updateQtyMarket(e)} />
                            </Col>
                            <Col xs={4} sm={4} className="d-none d-sm-block"/>
                            <Col xs={4} sm={4}>
                                <div className="button_box button_box_start">
                                    <div className="tooltip">
                                        <Button 
                                            type="button"
                                            className="mybutton button_fullcolor shadow_convex"
                                            onClick={()=>handleClick('start')}
                                        ><FontAwesomeIcon icon={faPlay} /></Button>
                                        <span className="tooltiptext">{translate({lang: lang, info: "start"})}</span>
                                    </div>
                                </div>
                            </Col>
                        </>}
                    </Row>
                case "slots_board":
                    return <Row>
                        <Col xs={8}>
                            <Counter num={bet} max={max_bet} update={(e)=>updateQtyMarket(e)} />
                        </Col>
                        <Col xs={4}>
                            <div className="button_box button_box_start">
                                <div className="tooltip">
                                    <Button 
                                        type="button"
                                        className="mybutton button_fullcolor shadow_convex"
                                        onClick={()=>handleClick('start')}
                                    ><FontAwesomeIcon icon={faPlay} /></Button>
                                    <span className="tooltiptext">{translate({lang: lang, info: "start"})}</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                case "poker_texas_holdem_board":
                case "poker_5_card_draw_board":
                    return <PokerBoard {...props} handleClick={(e)=>handleClick(e)} updateQtyMarket={(e)=>updateQtyMarket(e)} />
                default: 
                    return null
            }
        })()}
    </div>
}

export default GameBoard