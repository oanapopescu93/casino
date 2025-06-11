import React, {useState} from 'react'
import { translate } from '../../../../translations/translate'
import { Button, Row, Col } from 'react-bootstrap'
import Counter from '../../../partials/counter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck, faChevronUp, faXmark, faEye } from '@fortawesome/free-solid-svg-icons'

function PokerBoard(props){
    const {settings, action, bet, template, choice, updateBets, money} = props
    const {lang} = settings

    let max_bet = money
    const [num, setNum]= useState(bet)

    function handleClick(e){   
        choice(e)
    }

    function handleUpdate(e){
        updateBets(e)
        setNum(e)
    }

    return <Row>
        {(() => {
            switch(action) {
                case "preflop_betting":
                    let payload1 = action
                    if(template === 'poker_5_card_draw_board'){
                        payload1 = 'draw'
                    }
                    return <>
                        <Col xs={4}>
                            <Counter num={num} max={max_bet} update={(e)=>handleUpdate(e)} />
                        </Col>
                        <Col xs={8}>
                            <Row>
                                <Col xs={4}>
                                    <div className="tooltip">
                                        <Button 
                                            type="button"
                                            className="mybutton button_fullcolor shadow_convex"
                                            onClick={()=>handleClick({action: 'bet', stage: payload1})}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                            <span>{translate({lang, info: "bet"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang, info: "bet_explanation"})}</span>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="tooltip">
                                        <Button 
                                            type="button"
                                            className="mybutton button_fullcolor shadow_convex"
                                            onClick={()=>handleClick({action: 'check', stage: payload1})}
                                        >
                                            <FontAwesomeIcon icon={faCheck} />
                                            <span>{translate({lang, info: "check"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang, info: "check_explanation"})}</span>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="tooltip">
                                        <Button 
                                            type="button"
                                            className="mybutton button_fullcolor shadow_convex"
                                            onClick={()=>handleClick({action: 'fold', stage: payload1})}
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                            <span>{translate({lang, info: "fold"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang, info: "fold_explanation"})}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </>
                case "draw":
                    return <>
                        <Col sm={2} />
                        <Col xs={12} sm={8}>
                            <Row>
                                <Col xs={6}>
                                    <div className="tooltip">
                                        <Button 
                                            type="button"
                                            className="mybutton button_fullcolor shadow_convex"
                                            onClick={()=>handleClick({action: action, stage: 'confirm_draw'})}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                            <span>{translate({lang, info: "draw"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang, info: "draw_explanation"})}</span>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className="tooltip">
                                        <Button 
                                            type="button"
                                            className="mybutton button_fullcolor shadow_convex"
                                            onClick={()=>handleClick({action: action, stage: 'cancel_draw'})}
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                            <span>{translate({lang, info: "cancel"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang, info: "cancel_explanation"})}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={2} />
                    </>
                case "postflop_betting":
                case "turn":                
                    let payload2 = 'turn'
                    if(action === 'turn'){
                        payload2 = 'river'
                    }
                    return <>
                        <Col xs={4}>
                            <Counter num={num} max={max_bet} update={(e)=>handleUpdate(e)} />
                        </Col>
                        <Col xs={8}>
                            <Row>
                                <Col xs={4}>
                                    <div className="tooltip">
                                        <Button 
                                            type="button"
                                            className="mybutton button_fullcolor shadow_convex"
                                            onClick={()=>handleClick({action: 'call', stage: payload2})}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                            <span>{translate({lang, info: "call"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang, info: "call_explanation"})}</span>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="tooltip">
                                        <Button 
                                            type="button"
                                            className="mybutton button_fullcolor shadow_convex"
                                            onClick={()=>handleClick({action: 'raise', stage: payload2})}
                                        >
                                            <FontAwesomeIcon icon={faChevronUp} />
                                            <span>{translate({lang, info: "raise"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang, info: "raise_explanation"})}</span>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="tooltip">
                                        <Button 
                                            type="button"
                                            className="mybutton button_fullcolor shadow_convex"
                                            onClick={()=>handleClick({action: 'fold', stage: payload2})}
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                            <span>{translate({lang, info: "fold"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang, info: "fold_explanation"})}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </>
                case "river":
                    return <>
                        <Col sm={2} />
                        <Col xs={12} sm={8}>
                            <Row>
                                <Col xs={6}>
                                    <div className="tooltip">
                                        <Button 
                                            type="button"
                                            className="mybutton button_fullcolor shadow_convex"
                                            onClick={()=>handleClick({action: 'showdown', stage: "showdown"})}
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                            <span>{translate({lang, info: "showdown"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang, info: "showdown_explanation"})}</span>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className="tooltip">
                                        <Button 
                                            type="button"
                                            className="mybutton button_fullcolor shadow_convex"
                                            onClick={()=>handleClick({action: 'fold', stage: "showdown"})}
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                            <span>{translate({lang, info: "fold"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang, info: "fold_explanation"})}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={2}/>
                    </>
                default:
                    return <p>{translate({lang, info: "error"})}</p>
            }
        })()}
    </Row>
}

export default PokerBoard