import React, {useState, useEffect} from 'react'
import { translate } from '../../../../translations/translate'
import { Button, Row, Col } from 'react-bootstrap'
import Counter from '../../../partials/counter'
import { decryptData } from '../../../../utils/crypto'

function PokerBoard(props){
    const {lang, user, startGame, round} = props
    let max_bet = decryptData(user.money)
    let bet = 0
    let betRaise = 0
    let [status, setStatus]= useState(null)
    let [roundChange, setRoundChange]= useState(0)    
    let [draw, setDraw]= useState(false)    

    useEffect(() => {        
        if(round > 0 && round !== roundChange){
            setRoundChange(round)
            setDraw(true)
        } else {
            setDraw(false)
        }
	}, [round]) 

    function handleSendParent(type){   
        if(typeof props.updateBets === "function" && type !== "fold"){
            switch(type){
                case "raise":
                    props.updateBets(betRaise)
                    break
                case "start":
                    props.updateBets(bet)
                    break
                default:
            }
        }     
        if(typeof props.choice === "function"){
            props.choice(type)
        }
        setStatus(null)
    }
    function handleClick(e){   
        setStatus(e)
    }
    function updateQtyMarket(e, type){
        switch(type){
            case "raise":
                betRaise = e
            default:
                bet = e
        }
    }

    return <Row>
        {startGame ? <>
            {(() => {
                switch(status) {
                    case "call":
                        return <>
                            <Col xs={4}></Col>
                            <Col xs={4}>
                                <div className="button_box">
                                    <Button type="button" onClick={()=>handleSendParent('call')} className="mybutton button_fullcolor shadow_convex">
                                        {translate({lang: lang, info: "call"})}
                                    </Button>
                                </div>
                            </Col>
                            <Col xs={4}>
                                <div className="button_box">
                                    <Button type="button" onClick={()=>handleClick('cancel')} className="mybutton button_fullcolor shadow_convex">
                                        {translate({lang: lang, info: "cancel"})}
                                    </Button>
                                </div>
                            </Col>
                        </>
                    case "raise":
                        return <>
                            <Col xs={4}>
                                <Counter num={0} max={max_bet} update={(e)=>updateQtyMarket(e, 'raise')}></Counter>
                            </Col>
                            <Col xs={4}>
                                <div className="button_box">
                                    <Button type="button" onClick={()=>handleSendParent('raise')} className="mybutton button_fullcolor shadow_convex">
                                        {translate({lang: lang, info: "raise"})}
                                    </Button>
                                </div>
                            </Col>
                            <Col xs={4}>
                                <div className="button_box">
                                    <Button type="button" onClick={()=>handleClick('cancel')} className="mybutton button_fullcolor shadow_convex">
                                        {translate({lang: lang, info: "cancel"})}
                                    </Button>
                                </div>
                            </Col>
                        </>
                    default: 
                        return <>
                            <Col sm={3} xs={6}>
                                <div className="button_box">
                                    <Button type="button" onClick={()=>handleClick('call')} className="mybutton button_fullcolor shadow_convex">
                                        {translate({lang: lang, info: "call"})}
                                    </Button>
                                </div>
                            </Col>
                            <Col sm={3} xs={6}>
                                <div className="button_box">
                                    <Button type="button" onClick={()=>handleClick('raise')} className="mybutton button_fullcolor shadow_convex">
                                        {translate({lang: lang, info: "raise"})}
                                    </Button>
                                </div>
                            </Col>
                            <Col sm={3} xs={6}>
                                <div className="button_box">
                                    <Button type="button" onClick={()=>handleSendParent('fold')} className="mybutton button_fullcolor shadow_convex">
                                        {translate({lang: lang, info: "fold"})}
                                    </Button>
                                </div>
                            </Col>
                            {draw ? <Col sm={3} xs={6}>
                                <div className="button_box">
                                    <Button type="button" onClick={()=>handleSendParent('replace')} className="mybutton button_fullcolor shadow_convex">
                                        {translate({lang: lang, info: "replace"})}
                                    </Button>
                                </div>
                            </Col> : null}
                        </>
                }
            })()}
        </> : <>
            <Col xs={4}>
                <Counter num={0} max={max_bet} update={(e)=>updateQtyMarket(e)}></Counter>
            </Col>
            <Col xs={4}></Col>
            <Col xs={4}>
                <div className="button_box">
                    <Button type="button" onClick={()=>handleSendParent('start')} className="mybutton button_fullcolor shadow_convex">
                        {translate({lang: lang, info: "start"})}
                    </Button>
                </div>
            </Col>
        </>}
    </Row>
}

export default PokerBoard