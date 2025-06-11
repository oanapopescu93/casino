import React from 'react'
import { translate } from '../../../../translations/translate'
import Counter from '../../../partials/counter'
import { Button, Col, Row } from 'react-bootstrap'

function BaccaratTable(props){
    const {
        settings, playerBet, bankerBet, tieBet, choice, 
        updateBets, handleChoice
    } = props
	const {lang} = settings

    return <div className="baccarat_table">
        <Row>
            <Col lg={2}/>
            <Col lg={8}>
                <Row>
                    <Col sm={4}>
                        <div className="table_box table_player">
                            <h3>
                                <span>{translate({lang, info: "player"})} </span>
                                {choice && choice.type === "player" ? <span>
                                    ({translate({lang, info: "bet"})}: {choice.bet})
                                </span> : null}
                            </h3>
                            <Counter min={0} num={playerBet} max={100} update={(e)=>updateBets('player', e)} />
                            <Button type="button" onClick={()=>handleChoice('player', playerBet)} className="mybutton button_fullcolor shadow_convex">
                                {translate({lang, info: "bet"})}
                            </Button>
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div className="table_box table_player">
                            <h3>
                                <span>{translate({lang, info: "banker"})} </span>
                                {choice && choice.type === "banker" ? <span>
                                    ({translate({lang, info: "bet"})}: {choice.bet})
                                </span> : null}
                            </h3>
                            <Counter min={0} num={bankerBet} max={100} update={(e)=>updateBets('banker', e)} />
                            <Button type="button" onClick={()=>handleChoice('banker', bankerBet)} className="mybutton button_fullcolor shadow_convex">
                                {translate({lang, info: "bet"})}
                            </Button>
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div className="table_box table_player">
                            <h3>
                                <span>{translate({lang, info: "tie"})} </span>
                                {choice && choice.type === "tie" ? <span>
                                    ({translate({lang, info: "bet"})}: {choice.bet})
                                </span> : null}
                            </h3>
                            <Counter min={0} num={tieBet} max={100} update={(e)=>updateBets('tie', e)} />
                            <Button type="button" onClick={()=>handleChoice('tie', tieBet)} className="mybutton button_fullcolor shadow_convex">
                                {translate({lang, info: "bet"})}
                            </Button>
                        </div>                
                    </Col>
                </Row>
            </Col>
            <Col lg={2}/>
        </Row>
  </div>  
}

export default BaccaratTable