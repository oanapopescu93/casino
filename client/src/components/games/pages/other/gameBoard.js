import React, { useState } from 'react'
import PokerBoard from './pokerBoard'
import Counter from '../../../partials/counter'
import { Button, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPlus, faPause, faAnglesUp, faXmark } from '@fortawesome/free-solid-svg-icons'
import { translate } from '../../../../translations/translate'

function GameBoard(props){
    const {template, settings, startGame, bet, choice, updateBets, money} = props
    const {lang} = settings
    let max_bet = money

    let bet_array = [
        {id: "10", text: "1"},
        {id: "10", text: "10"},
        {id: "20", text: "20"},
        {id: "50", text: "50"},
        {id: "100", text: "100"},
        {id: "max", text: "max"},
    ]

    const [titleBetsDropdown, setTitleBetsDropdown] = useState(bet_array[0].text)

    function handleClick(e){
        choice(e)
    }
    function handleUpdate(e){
        updateBets(e)
    }

    function handleSelectBet(e){
        const selectedBet = bet_array.find((item) => item.id === e)
        if (selectedBet) {
            setTitleBetsDropdown(selectedBet.text)
        }
        if (e !== "max") {
            updateBets(parseInt(e))
        } else {            
            handleClick("max")
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
                                        <span>{translate({lang, info: "hit"})}</span>
                                    </Button>
                                    <span className="tooltiptext">{translate({lang, info: "hit_explanation"})}</span>
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
                                        <span>{translate({lang, info: "stand"})}</span>
                                    </Button>
                                    <span className="tooltiptext">{translate({lang, info: "stand_explanation"})}</span>
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
                                        <span>{translate({lang, info: "double_down"})}</span>
                                    </Button>
                                    <span className="tooltiptext">{translate({lang, info: "double_down_explanation"})}</span>
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
                                        <span>{translate({lang, info: "surrender"})}</span>
                                    </Button>
                                    <span className="tooltiptext">{translate({lang, info: "surrender_explanation"})}</span>
                                </div>
                            </Col>
                        </> : <>
                            <Col xs={8} sm={4}>
                                <Counter min={1} num={bet} max={max_bet} update={(e)=>handleUpdate(e)} />
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
                                        <span className="tooltiptext">{translate({lang, info: "start"})}</span>
                                    </div>
                                </div>
                            </Col>
                        </>}
                    </Row>
                case "slots_board":
                    return <Row>
                        <Col xs={8} sm={10}>
                            <Row>
                                <Col sm={6}>
                                    <Counter min={1} num={bet} max={max_bet} update={(e)=>handleUpdate(e)} />
                                </Col>
                                <Col sm={6}>
                                    <div className="slots_bets">
                                        <div className="slots_bets_label">
                                            <p>{translate({lang, info: "bet"})}:</p>
                                        </div>
                                        <div className="slots_bets_dropdown">
                                            <DropdownButton title={titleBetsDropdown} id="slots_bets_button" className="shadow_convex"onSelect={handleSelectBet}>
                                                {bet_array.map((item, i)=>{
                                                    return <Dropdown.Item key={i} eventKey={item.id}>
                                                        <span>{item.text}</span>
                                                    </Dropdown.Item>
                                                })}
                                            </DropdownButton>
                                        </div>                                        
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={4} sm={2}>
                            <div className="tooltip">
                                <Button 
                                    type="button"
                                    className="mybutton round button_fullcolor shadow_convex"
                                    onClick={()=>handleClick('start')}
                                ><FontAwesomeIcon icon={faPlay} /></Button>
                                <span className="tooltiptext">{translate({lang, info: "start"})}</span>
                            </div>
                        </Col>
                    </Row>
                case "poker_texas_holdem_board":
                case "poker_5_card_draw_board":
                    return <PokerBoard {...props} handleClick={(e)=>handleClick(e)} updateBets={(e)=>handleUpdate(e)} />
                default: 
                    return
            }
        })()}
    </div>
}

export default GameBoard