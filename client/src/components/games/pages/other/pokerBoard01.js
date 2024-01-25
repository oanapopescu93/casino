import React, {useState, useEffect} from 'react'
import { translate } from '../../../../translations/translate'
import { Button, Row, Col } from 'react-bootstrap'
import Counter from '../../../partials/counter'
import { decryptData } from '../../../../utils/crypto'

function PokerBoard(props){
    const {lang, user, action} = props
    let max_bet = decryptData(user.money)

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

    return <Row>
        <Col xs={12}>{action}</Col>
        {(() => {
            switch(action) {
                case "preflop_betting":
                    return <>
                        <Col xs={4}>
                            <Counter num={0} max={max_bet} update={(e)=>updateQtyMarket(e)}></Counter>
                        </Col>
                        <Col xs={8}>
                            <div className="button_box">
                                <Button type="button" onClick={()=>handleClick('preflop_betting')} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "bet"})}
                                </Button>
                                <Button type="button" onClick={()=>handleClick('check')} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "check"})}
                                </Button>
                                <Button type="button" onClick={()=>handleClick('fold')} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "fold"})}
                                </Button>
                            </div>
                        </Col>                        
                    </>
                case "postflop_betting":
                    return <>
                    <Col xs={4}>
                        <Counter num={0} max={max_bet} update={(e)=>updateQtyMarket(e)}></Counter>
                    </Col>
                    <Col xs={8}>
                        <div className="button_box">
                            <Button type="button" onClick={()=>handleClick('call')} className="mybutton button_fullcolor shadow_convex">
                                {translate({lang: lang, info: "call"})}
                            </Button>
                            <Button type="button" onClick={()=>handleClick('raise')} className="mybutton button_fullcolor shadow_convex">
                                {translate({lang: lang, info: "raise"})}
                            </Button>
                            <Button type="button" onClick={()=>handleClick('fold')} className="mybutton button_fullcolor shadow_convex">
                                {translate({lang: lang, info: "fold"})}
                            </Button>
                        </div>
                    </Col>                        
                </>
            }
        })()}
    </Row>
}

export default PokerBoard