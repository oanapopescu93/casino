import React, {useState} from 'react'
import { translate } from '../../../../translations/translate'
import { Button, Row, Col } from 'react-bootstrap'
import Counter from '../../../partials/counter'
import { decryptData } from '../../../../utils/crypto'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck, faChevronUp, faXmark, faEye } from '@fortawesome/free-solid-svg-icons'

function PokerBoard(props){
    const {lang, user, action, bet, template} = props
    let max_bet = user.money ? decryptData(user.money) : 0
    const [num, setNum]= useState(bet)

    function handleClick(e){   
        if(typeof props.choice === "function"){
            props.choice(e)
        }
    }

    function updateQtyMarket(e){
        if(typeof props.updateBets === "function"){
            props.updateBets(e)
            setNum(e)
        }
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
                            <Counter num={num} max={max_bet} update={(e)=>updateQtyMarket(e)} />
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
                                            <span>{translate({lang: lang, info: "bet"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang: lang, info: "bet_explanation"})}</span>
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
                                            <span>{translate({lang: lang, info: "check"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang: lang, info: "check_explanation"})}</span>
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
                                            <span>{translate({lang: lang, info: "fold"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang: lang, info: "fold_explanation"})}</span>
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
                                            <span>{translate({lang: lang, info: "draw"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang: lang, info: "draw_explanation"})}</span>
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
                                            <span>{translate({lang: lang, info: "cancel"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang: lang, info: "cancel_explanation"})}</span>
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
                            <Counter num={num} max={max_bet} update={(e)=>updateQtyMarket(e)} />
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
                                            <span>{translate({lang: lang, info: "call"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang: lang, info: "call_explanation"})}</span>
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
                                            <span>{translate({lang: lang, info: "raise"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang: lang, info: "raise_explanation"})}</span>
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
                                            <span>{translate({lang: lang, info: "fold"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang: lang, info: "fold_explanation"})}</span>
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
                                            <span>{translate({lang: lang, info: "showdown"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang: lang, info: "showdown_explanation"})}</span>
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
                                            <span>{translate({lang: lang, info: "fold"})}</span>
                                        </Button>
                                        <span className="tooltiptext">{translate({lang: lang, info: "fold_explanation"})}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={2}/>
                    </>
                default:
                    return <p>{translate({lang: lang, info: "error"})}</p>
            }
        })()}
    </Row>
}

export default PokerBoard