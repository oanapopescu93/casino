import React from 'react'
import { Col, Row } from 'react-bootstrap'

function KenoEng(){
    return <Row>
    <Col lg={2} />
    <Col lg={8}>
        <Row>
            <Col sm={12}><h3>Introduction</h3></Col>
            <Col sm={12}>
                <p>Keno is a lottery-style game played in many casinos and online platforms.</p>
                <p>The objective of the game is to select numbers from a pool and match them with the numbers drawn by the Keno machine.</p>
            </Col>
            <Col sm={12}><h3>Keno Ticket</h3></Col>
            <Col sm={12}>
                <p>To play Keno, you start by obtaining a Keno ticket. The ticket contains a grid of numbers from 1 to 80.</p>
                <p>You can usually choose how many numbers you want to play (usually 1 to 20), and your payout will depend on how many numbers you select.</p>
            </Col>
            <Col sm={12}><h3>Selecting Numbers</h3></Col>
            <Col sm={12}>
                <p>On the Keno ticket, mark or select the numbers you wish to play by circling or highlighting them.</p>
                <p>The number of selections you can make depends on the specific rules of the Keno game you are playing.</p>
            </Col>
            <Col sm={12}><h3>Choosing the Wager</h3></Col>
            <Col sm={12}>
                <p>Decide on the amount of money you want to wager on your Keno ticket.</p>
                <p>The payout for matching numbers will depend on your wager amount.</p>
            </Col>
            <Col sm={12}><h3>Number of Draws</h3></Col>
            <Col sm={12}>
                <p>Determine how many consecutive games or draws you want to play with the same ticket. You can usually choose to play one game or multiple games in a row.</p>
            </Col>
            <Col sm={12}><h3>Matching Numbers and Payouts</h3></Col>
            <Col sm={12}>
                <p>As the numbers are drawn, compare them to the numbers you selected on your Keno ticket.</p>
                <p>The more numbers you match, the higher your payout will be, depending on the specific payout table for the game you are playing.</p>
            </Col>
        </Row>
    </Col>
    <Col lg={2} />
</Row>
}

export default KenoEng