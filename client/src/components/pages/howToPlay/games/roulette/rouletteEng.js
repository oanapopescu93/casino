import React from 'react'
import { Col, Row } from 'react-bootstrap'

function RouletteEng(){
    return  <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduction</h3></Col>
                <Col sm={12}>
                    <p>Roulette is a popular casino game that is played on a spinning wheel.</p>
                    <p>The objective of the game is to predict where a small ball will land on the wheel, thereby placing bets on different numbers or groups of numbers.</p>
                </Col>
                <Col sm={12}><h3>The Roulette Wheel</h3></Col>
                <Col sm={12}>
                    <p>The roulette wheel consists of numbered pockets, ranging from 0 to 36.</p>
                    <p>The numbers are alternately colored in red and black, with the 0 pocket colored in green.</p>
                    <p>The European version of roulette has a single 0 pocket, while the American version has an additional 00 pocket.</p>
                </Col>
                <Col sm={12}><h3>The Roulette Table</h3></Col>
                <Col sm={12}>
                    <p>The roulette table is where players place their bets.</p>
                    <p>It features a grid that represents the numbers on the wheel and various additional betting options.</p>
                    <p>The table is divided into two main sections: the inside bets and the outside bets.</p>
                </Col>
                <Col sm={12}><h3>Inside Bets</h3></Col>
                <Col sm={12}><p>Betting on a single number by placing a chip directly on that number</p></Col>
                <Col sm={12}><h3>Outside Bets</h3></Col>
                <Col sm={12}>
                    <p>Outside bets are placed on larger groups of numbers or characteristics of the numbers.</p> 
                    <p>Here are some common outside bets:</p>
                    <ul>
                        <li>Red/Black: Betting on whether the ball will land on a red or black number.</li>
                        <li>Even/Odd: Betting on whether the ball will land on an even or odd number.</li>
                        <li>Low/High: Betting on whether the ball will land on a low (1-18) or high (19-36) number.</li>
                        <li>Dozen Bet: Betting on a group of 12 numbers by placing a chip on the "1st 12," "2nd 12," or "3rd 12" sections of the table.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Spinning the Wheel</h3></Col>
                <Col sm={12}>
                    <p>After the betting phase, the croupier (the casino employee in charge of the game) will spin the roulette wheel in one direction and release a small ball in the opposite direction. As the wheel slows down, the ball will eventually come to rest in one of the numbered pockets.</p>
                </Col>
                <Col sm={12}><h3>Winning and Losing</h3></Col>
                <Col sm={12}>
                    <p>If the ball lands on a number or group of numbers you bet on, you win a corresponding payout based on the odds of that particular bet.</p>
                </Col>
                <Col sm={12}><h3>Payouts</h3></Col>
                <Col sm={12}>
                    <p>Payouts vary depending on the type of bet placed. Straight bets, for example, have higher payouts since they are riskier.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default RouletteEng