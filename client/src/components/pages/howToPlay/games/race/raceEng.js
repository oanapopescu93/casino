import React from 'react'
import { Col, Row } from 'react-bootstrap'

function RaceEng(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduction</h3></Col>
                <Col sm={12}>
                    <p>Race betting involves wagering money on the outcome of the race.</p>
                    <p>The objective is to predict which animal will win or place in a specific race.</p>
                </Col>
                <Col sm={12}><h3>Types of Bets</h3></Col>
                <Col sm={12}>
                    <ul>
                        <li>Win: Betting on a specific animal to finish first.</li>
                        <li>Place: Betting on a animal to finish in the top two or three positions, depending on the specific rules.</li>
                        <li>Each-Way: A combination of Win and Place bets. If your selection wins, you win both the Win and Place bets. If your selection places, you win only the Place bet.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Understanding Odds</h3></Col>
                <Col sm={12}>
                    <p>Odds represent the payout you can expect if your bet is successful.</p>
                    <p>Odds can be displayed in different formats, such as fractional (e.g., 5/1), decimal (e.g., 6.0), or moneyline (e.g., +500).</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}
export default RaceEng