import React from 'react'
import { Col, Row } from 'react-bootstrap'

function BlackjackEng(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduction</h3></Col>
                <Col sm={12}>
                    <p>Blackjack is a popular card game played in casinos, where the objective is to have a hand total closer to 21 than the dealer's hand without exceeding 21.</p>
                    <p>The game is played with one or more standard decks of 52 cards.</p>
                </Col>
                <Col sm={12}><h3>Card Values</h3></Col>
                <Col sm={12}>
                    <p>In blackjack, numbered cards (2-10) are worth their face value.</p>
                    <p>Face cards (King, Queen, and Jack) are worth 10.</p>
                    <p>The Ace can be counted as either 1 or 11, depending on which value benefits the hand the most.</p>
                </Col>
                <Col sm={12}><h3>Gameplay</h3></Col>
                <Col sm={12}>
                    <p>The game begins with each player placing their bets on the designated area in front of them on the blackjack table.</p>
                    <p>The dealer then deals two cards face-up to each player and one face-up card to themselves. The dealer's second card is dealt face-down (hole card).</p>
                </Col>
                <Col sm={12}><h3>Player Options</h3></Col>
                <Col sm={12}>
                    <p>The player's turn comes first, and they have several options to choose from, depending on their hand:</p>
                    <ul>
                        <li>Hit: The player requests an additional card to be dealt. The player can request multiple hits until they are satisfied with their hand or until they exceed 21, resulting in a bust.</li>
                        <li>Stand: The player decides to keep their current hand and end their turn, passing the action to the next player or the dealer.</li>
                        <li>Double Down: The player doubles their original bet and receives only one additional card. This option is typically available when the player's initial hand totals 9, 10, or 11.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Dealer's Turn</h3></Col>
                <Col sm={12}>
                    <p>After all players have completed their turns, the dealer reveals their hole card.</p>
                    <p>If the dealer's hand totals 16 or less, they must hit and continue drawing cards until their hand totals 17 or more.</p>
                    <p>If the dealer's hand exceeds 21, all remaining players win.</p>
                    <p>If the dealer's hand does not exceed 21, their hand is compared to each player's hand to determine the winners.</p>
                </Col>
                <Col sm={12}><h3>Blackjack</h3></Col>
                <Col sm={12}>
                    <p>If a player or the dealer is dealt an Ace and a 10-value card (10, Jack, Queen, or King) as their first two cards, it is called a blackjack.</p>
                    <p>A blackjack is an automatic win for the player, paying out 3:2 unless the dealer also has a blackjack, resulting in a push.</p>
                </Col>
                <Col sm={12}><h3>Determining the Outcome</h3></Col>
                <Col sm={12}>
                    <p>If the player's hand total is higher than the dealer's without exceeding 21, the player wins and is paid out 1:1.</p>
                    <p>If the player's hand total is less than the dealer's, the player loses their bet.</p>
                    <p>If the player's hand and the dealer's hand have the same total (a push), the bet is returned to the player.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default BlackjackEng