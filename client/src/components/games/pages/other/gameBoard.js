import React from 'react'
import { translate } from '../../../../translations/translate'
import { Button, Row, Col } from 'react-bootstrap'
import Counter from '../../../partials/counter'
import { decryptData } from '../../../../utils/crypto'
import PokerBoard from './pokerBoard'

function GameBoard(props){
    const {template, lang, user, startGame} = props
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
                case "blackjack":
                    return <Row>
                        {startGame ? <>
                            <Col xs={3}>
                                <div  className="button_box">
                                    <Button type="button" onClick={()=>handleClick('hit')} className="mybutton button_fullcolor shadow_convex">
                                        {translate({lang: lang, info: "hit"})}
                                    </Button>
                                </div>
                            </Col>
                            <Col xs={3}>
                                <div  className="button_box">
                                    <Button type="button" onClick={()=>handleClick('stand')} className="mybutton button_fullcolor shadow_convex">
                                        {translate({lang: lang, info: "stand"})}
                                    </Button>
                                </div>
                            </Col>
                            <Col xs={3}>
                                <div  className="button_box">
                                    <Button type="button" onClick={()=>handleClick('double_down')} className="mybutton button_fullcolor shadow_convex">
                                        {translate({lang: lang, info: "double_down"})}
                                    </Button>
                                </div>
                            </Col>
                            <Col xs={3}>
                                <div  className="button_box">
                                    <Button type="button" onClick={()=>handleClick('surrender')} className="mybutton button_fullcolor shadow_convex">
                                        {translate({lang: lang, info: "surrender"})}
                                    </Button>
                                </div>                                    
                            </Col>
                        </> : <>
                            <Col xs={4}>
                                <Counter num={0} max={max_bet} update={(e)=>updateQtyMarket(e)}></Counter>
                            </Col>
                            <Col xs={4}></Col>
                            <Col xs={4}>
                                <div  className="button_box">
                                    <Button type="button" onClick={()=>handleClick('start')} className="mybutton button_fullcolor shadow_convex">
                                        {translate({lang: lang, info: "start"})}
                                    </Button>
                                </div>
                            </Col>
                        </>}                    
                    </Row>
                case "slots":
                    return <Row>
                        <Col xs={8}>
                                <Counter num={0} max={max_bet} update={(e)=>updateQtyMarket(e)}></Counter>
                        </Col>
                        <Col xs={4}>
                            <div  className="button_box">
                                <Button type="button" onClick={()=>handleClick('start')} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "start"})}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                case "texas_holdem":
                case "5_card_draw":
                    return <PokerBoard {...props} handleClick={(e)=>handleClick(e)} updateQtyMarket={(e)=>updateQtyMarket(e)}></PokerBoard>
                default: 
                    return null
            }
        })()}        
    </div>
}

export default GameBoard