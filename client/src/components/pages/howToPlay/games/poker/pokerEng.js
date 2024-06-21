import React from 'react'
import { Col, Row } from 'react-bootstrap'

function PokerEng(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduction</h3></Col>
                <Col sm={12}>
                    <p>Poker is a popular card game played with a standard deck of 52 cards.</p>
                    <p>The objective of the game is to win the pot, which is the sum of money or chips contributed by the players.</p>
                </Col>
                <Col sm={12}><h3>Hand Rankings</h3></Col>
                <Col sm={12}>
                    <p>Familiarize yourself with the hand rankings in poker, from the highest to lowest:</p>
                    <ul>
                        <li>Royal Flush: A, K, Q, J, 10 of the same suit.</li>
                        <li>Straight Flush: Five consecutive cards of the same suit.</li>
                        <li>Four of a Kind: Four cards of the same rank.</li>
                        <li>Full House: Three cards of the same rank plus a pair.</li>
                        <li>Flush: Five cards of the same suit.</li>
                        <li>Straight: Five consecutive cards of any suit.</li>
                        <li>Three of a Kind: Three cards of the same rank.</li>
                        <li>Two Pair: Two pairs of cards of the same rank.</li>
                        <li>One Pair: Two cards of the same rank.</li>
                        <li>High Card: The highest-ranking card in your hand.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Betting Rounds</h3></Col>
                <Col sm={12}>
                    <p>Poker typically involves multiple betting rounds, where players place bets based on the strength of their hand or their bluffing strategy.</p>
                    <p>The most common types of poker games include Texas Hold'em, Omaha, Seven-Card Stud and Five-Card Draw.</p>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Texas Hold'em Poker</h2></Col>
                        <Col sm={12}><h3>Introduction</h3></Col>
                        <Col sm={12}>
                            <p>Each player is dealt two private cards (hole cards), and five community cards are placed face-up on the table.</p>
                            <p>The game consists of four betting rounds: pre-flop, flop, turn, and river.</p>
                        </Col>
                        <Col sm={12}><h3>Pre-Flop</h3></Col>
                        <Col sm={12}>
                            <p>After receiving your hole cards, the first betting round begins.</p>
                            <p>Players can choose to fold (discard their cards), call (match the current bet), or raise (increase the bet).</p>
                        </Col>
                        <Col sm={12}><h3>Flop</h3></Col>
                        <Col sm={12}>
                            <p>After the pre-flop betting round, three community cards are dealt face-up on the table. This is called the flop.</p>
                            <p>Another round of betting takes place, starting with the player to the left of the dealer.</p>
                        </Col>
                        <Col sm={12}><h3>Turn</h3></Col>
                        <Col sm={12}>
                            <p>After the flop, a fourth community card is dealt face-up on the table. This is called the turn.</p>
                            <p>Another round of betting takes place.</p>
                        </Col>
                        <Col sm={12}><h3>River</h3></Col>
                        <Col sm={12}>
                            <p>After the turn, a fifth and final community card is dealt face-up on the table. This is called the river.</p>
                            <p>The final round of betting takes place.</p>
                        </Col>
                        <Col sm={12}><h3>Showdown</h3></Col>
                        <Col sm={12}>
                            <p>If there are two or more players remaining after the final betting round, a showdown occurs.</p>
                            <p>Players reveal their hole cards, and the player with the highest-ranking hand wins the pot.</p>
                            <p>In case of a tie, the pot is divided equally among the winning players.</p>
                        </Col>
                    </Row>
                </Col>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Five Card Draw Poker</h2></Col>
                        <Col sm={12}><h3>Introduction</h3></Col>
                        <Col sm={12}>
                            <p>Five Card Draw is a classic and straightforward form of poker.</p>
                            <p>The objective of the game is to make the best five-card hand using a combination of the cards in your hand and those on the table.</p>
                        </Col>
                        <Col sm={12}><h3>The Deal</h3></Col>
                        <Col sm={12}>
                            <p>Each player is dealt five private cards face-down.</p>
                            <p>Betting usually begins with the player to the left of the dealer.</p>
                        </Col>
                        <Col sm={12}><h3>First Betting Round</h3></Col>
                        <Col sm={12}>
                            <p>The first round of betting begins with the player to the left of the dealer.</p>
                            <p>Players can choose to fold (discard their cards and exit the hand), call (match the current bet), or raise (increase the bet).</p>
                        </Col>
                        <Col sm={12}><h3>Drawing Phase</h3></Col>
                        <Col sm={12}>
                            <p>After the first round of betting, players have the option to exchange some or all of their cards for new ones.</p>
                            <p>Starting with the player to the left of the dealer, each player can discard any number of their cards and receive an equal number of replacement cards from the deck.</p>
                            <p>In most games, the discarded cards are placed face-down, and the replacement cards are dealt face-down as well.</p>
                        </Col>
                        <Col sm={12}><h3>Second Betting Round</h3></Col>
                        <Col sm={12}>
                            <p>After the drawing phase, a second round of betting occurs.</p>
                            <p>The betting begins with the player to the left of the dealer, and players can choose to fold, call, or raise based on the strength of their hand.</p>
                        </Col>
                        <Col sm={12}><h3>Showdown</h3></Col>
                        <Col sm={12}>
                            <p>If there are two or more players remaining after the second betting round, a showdown occurs.</p>
                            <p>The remaining players reveal their hands, starting with the player who made the last bet or raise.</p>
                            <p>The player with the best five-card hand wins the pot.</p>
                            <p>The hand rankings follow standard poker rules, with the Royal Flush being the highest-ranking hand and High Card being the lowest-ranking hand.</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default PokerEng