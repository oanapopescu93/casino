import React from 'react'
import { Col, Row } from 'react-bootstrap'

function CrapsEng(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduction</h3></Col>
                <Col sm={12}>
                    <p>Craps is a dice game played with two dice, typically on a specialized table in a casino.</p>
                    <p>The objective of the game is to predict the outcome of the dice rolls and place bets accordingly.</p>
                </Col>
                <Col sm={12}><h3>The Pass Line Bet</h3></Col>
                <Col sm={12}>
                    <p>The most common bet in craps is the "Pass Line" bet. It is placed before the come-out roll (the first roll of the dice).</p>
                    <p>To make a Pass Line bet, place your chips on the "Pass Line" area of the craps table.</p>
                </Col>
                <Col sm={12}><h3>The Come-Out Roll</h3></Col>
                <Col sm={12}>
                    <p>The game begins with the shooter (the person rolling the dice) making the come-out roll.</p>
                    <p>If the come-out roll is a 7 or 11, Pass Line bets win, and those who placed them are paid even money.</p>
                    <p>If the come-out roll is a 2, 3, or 12, Pass Line bets lose, and those who placed them lose their chips.</p>
                </Col>
                <Col sm={12}><h3>Point Number</h3></Col>
                <Col sm={12}>
                    <p>If the come-out roll is a 4, 5, 6, 8, 9, or 10, that number becomes the "point."</p>
                    <p>The dealer will place a marker called the "point marker" on the table to indicate the established point.</p>
                </Col>
                <Col sm={12}><h3>Continuing the Game</h3></Col>
                <Col sm={12}>
                    <p>After the point is established, the shooter continues to roll the dice until one of two outcomes occurs: the point is rolled again (Pass Line bets win), or a 7 is rolled (Pass Line bets lose).</p>
                    <p>The shooter keeps rolling until one of these outcomes is achieved, at which point the next person becomes the shooter.</p>
                </Col>
                <Col sm={12}><h3>Betting Options</h3></Col>
                <Col sm={12}>
                    <p>In addition to the Pass Line bet, there are many other betting options in craps</p>
                    <ul>
                        <li>Come Bet: Similar to the Pass Line bet, but placed after the point is established.</li>
                        <li>Don't Pass Line Bet: Opposite of the Pass Line bet. Wins on 2 or 3, loses on 7 or 11, and ties on 12. If a point is established, the bet wins if a 7 is rolled before the point.</li>
                        <li>Don't Come Bet: Similar to the Don't Pass Line bet, but placed after the point is established.</li>
                        <li>Place Bets: Betting on specific numbers (4, 5, 6, 8, 9, or 10) to be rolled before a 7.</li>
                        <li>Field Bet: Betting on 2, 3, 4, 9, 10, 11, or 12 to be rolled on the next roll.</li>
                        <li>Proposition Bets: One-roll bets on specific outcomes (e.g., a specific number or combination) with high payouts but higher house edge.</li>
                    </ul>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default CrapsEng