import React, {useState,useEffect} from 'react'
import { translate } from '../../../../translations/translate'
import { Button, Row, Col } from 'react-bootstrap'
import Counter from '../../../partials/counter'
import { decryptData } from '../../../../utils/crypto'

function PokerBoard(props){
    const {lang, user, action} = props
    let max_bet = decryptData(user.money)
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

    useEffect(() => {
		console.log('xxx01 ', num)
		return () => {
			console.log('xxx02 ', num)
		}  
	}, [action]) 

    return <Row>
        {/* <Col xs={12}>{action}</Col> */}
        {(() => {
            switch(action) {
                case "preflop_betting":
                    return <>
                        <Col xs={4}>
                            <Counter num={num} max={max_bet} update={(e)=>updateQtyMarket(e)}></Counter>
                        </Col>
                        <Col xs={8}>
                            <div className="button_box">
                                <Button type="button" onClick={()=>handleClick({action: 'bet', stage: action})} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "bet"})}
                                </Button>
                                <Button type="button" onClick={()=>handleClick({action: 'check', stage: action})} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "check"})}
                                </Button>
                                <Button type="button" onClick={()=>handleClick({action: 'fold', stage: action})} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "fold"})}
                                </Button>
                            </div>
                        </Col>                        
                    </>
                case "postflop_betting":
                case "turn":                
                    let payload = 'turn'
                    if(action === "turn"){
                        payload = 'river'
                    }
                    return <>
                        <Col xs={4}>
                            <Counter num={num} max={max_bet} update={(e)=>updateQtyMarket(e)}></Counter>
                        </Col>
                        <Col xs={8}>
                            <div className="button_box">
                                <Button type="button" onClick={()=>handleClick({action: 'call', stage: payload})} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "call"})}
                                </Button>
                                <Button type="button" onClick={()=>handleClick({action: 'raise', stage: payload})} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "raise"})}
                                </Button>
                                <Button type="button" onClick={()=>handleClick({action: 'fold', stage: payload})} className="mybutton button_fullcolor shadow_convex">
                                    {translate({lang: lang, info: "fold"})}
                                </Button>
                            </div>
                        </Col>                        
                    </>
                case "river":
                    return <>
                        <Col xs={4}></Col>
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
            }
        })()}
    </Row>
}

export default PokerBoard