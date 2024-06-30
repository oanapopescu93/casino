import React, {useState} from 'react'
import { translate } from '../../../../translations/translate'
import { Button, Row, Col } from 'react-bootstrap'
import Counter from '../../../partials/counter'
import { decryptData } from '../../../../utils/crypto'

function PokerBoard(props){
    const {lang, user, action, template} = props
    let max_bet = user.money ? decryptData(user.money) : 0
    const [num, setNum]= useState(0)

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
                    if(template === 'poker_5_card_draw'){
                        payload1 = 'draw'
                    }
                    return <>
                        {/* <Col xs={12}>1. {action} / {payload1}</Col> */}
                        <Col xs={4}>
                            <Counter num={num} max={max_bet} update={(e)=>updateQtyMarket(e)} />
                        </Col>
                        <Col xs={8}>
                            <div className="button_box">
                                <Button type="button" onClick={()=>handleClick({action: 'bet', stage: payload1})} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "bet"})}
                                </Button>
                                <Button type="button" onClick={()=>handleClick({action: 'check', stage: payload1})} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "check"})}
                                </Button>
                                <Button type="button" onClick={()=>handleClick({action: 'fold', stage: payload1})} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "fold"})}
                                </Button>
                            </div>
                        </Col>
                    </>
                case "draw":
                    return <>
                        {/* <Col xs={12}>2. {action} / draw</Col> */}
                        <Col xs={4} />
                        <Col xs={8}>
                            <div className="button_box">
                                <Button type="button" onClick={() => handleClick({ action: action, stage: 'confirm_draw' })} className="mybutton button_fullcolor shadow_convex">
                                    {translate({ lang: lang, info: "draw" })}
                                </Button>
                                <Button type="button" onClick={() => handleClick({ action: action, stage: 'cancel_draw' })} className="mybutton button_fullcolor shadow_convex">
                                    {translate({ lang: lang, info: "cancel" })}
                                </Button>
                            </div>
                        </Col>
                    </>
                case "postflop_betting":
                case "turn":                
                    let payload2 = 'turn'
                    if(action === 'turn'){
                        payload2 = 'river'
                    }
                    return <>
                        {/* <Col xs={12}>3. {action} / {payload2}</Col> */}
                        <Col xs={4}>
                            <Counter num={num} max={max_bet} update={(e)=>updateQtyMarket(e)} />
                        </Col>
                        <Col xs={8}>
                            <div className="button_box">
                                <Button type="button" onClick={()=>handleClick({action: 'call', stage: payload2})} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "call"})}
                                </Button>
                                <Button type="button" onClick={()=>handleClick({action: 'raise', stage: payload2})} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "raise"})}
                                </Button>
                                <Button type="button" onClick={()=>handleClick({action: 'fold', stage: payload2})} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "fold"})}
                                </Button>
                            </div>
                        </Col>
                    </>
                case "river":
                    return <>
                        {/* <Col xs={12}>4. {action} / showdown</Col> */}
                        <Col xs={4} />
                        <Col xs={8}>
                            <div className="button_box">
                                <Button type="button" onClick={()=>handleClick({action: 'showdown', stage: "showdown"})} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "showdown"})}
                                </Button>
                                <Button type="button" onClick={()=>handleClick({action: 'fold', stage: "showdown"})} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "fold"})}
                                </Button>
                            </div>
                        </Col>
                    </>
                default:
                    return <p>{translate({lang: lang, info: "error"})}</p>
            }
        })()}
    </Row>
}

export default PokerBoard