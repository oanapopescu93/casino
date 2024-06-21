import React from 'react'
import { Col, Row } from 'react-bootstrap'

function PokerDe(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Einführung</h3></Col>
                <Col sm={12}>
                    <p>Poker ist ein beliebtes Kartenspiel, das mit einem Standarddeck von 52 Karten gespielt wird.</p>
                    <p>Das Ziel des Spiels besteht darin, den Pot zu gewinnen, der die Summe des von den Spielern eingebrachten Geldes oder der Chips ist.</p>
                </Col>
                <Col sm={12}><h3>Kartenkombinationen</h3></Col>
                <Col sm={12}>
                    <p>Machen Sie sich mit den Kartenkombinationen beim Poker vertraut, angeordnet von der höchsten zur niedrigsten:</p>
                    <ul>
                        <li>Royal Flush: A, K, D, B, 10 der gleichen Farbe.</li>
                        <li>Straight Flush: Fünf aufeinanderfolgende Karten derselben Farbe.</li>
                        <li>Vierling: Vier Karten desselben Ranges.</li>
                        <li>Full House: Drei Karten desselben Ranges plus ein Paar.</li>
                        <li>Flush: Fünf Karten derselben Farbe.</li>
                        <li>Straight: Fünf aufeinanderfolgende Karten beliebiger Farbe.</li>
                        <li>Dreier: Drei Karten desselben Ranges.</li>
                        <li>Zwei Paare: Zwei Paare von Karten desselben Ranges.</li>
                        <li>Ein Paar: Zwei Karten desselben Ranges.</li>
                        <li>Höchste Karte: Die höchstrangige Karte in Ihrer Hand.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Einsatzrunden</h3></Col>
                <Col sm={12}>
                    <p>Poker beinhaltet in der Regel mehrere Einsatzrunden, bei denen die Spieler basierend auf der Stärke ihrer Hand oder ihrer Bluffstrategie Einsätze platzieren.</p>
                    <p>Die gängigsten Arten von Pokerspielen sind Texas Hold'em, Omaha, Seven-Card Stud und Five-Card Draw.</p>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Texas Hold'em Poker</h2></Col>
                        <Col sm={12}><h3>Einführung</h3></Col>
                        <Col sm={12}>
                            <p>Jeder Spieler erhält zwei verdeckte Karten (Hole Cards), und fünf Gemeinschaftskarten werden offen auf den Tisch gelegt.</p>
                            <p>Das Spiel besteht aus vier Einsatzrunden: Pre-Flop, Flop, Turn und River.</p>
                        </Col>
                        <Col sm={12}><h3>Pre-Flop</h3></Col>
                        <Col sm={12}>
                            <p>Nachdem Sie Ihre Hole Cards erhalten haben, beginnt die erste Einsatzrunde.</p>
                            <p>Die Spieler können sich entscheiden, auszusteigen (ihre Karten abzulegen), mitzugehen (den aktuellen Einsatz mitgehen) oder zu erhöhen (den Einsatz erhöhen).</p>
                        </Col>
                        <Col sm={12}><h3>Flop</h3></Col>
                        <Col sm={12}>
                            <p>Nach der Pre-Flop-Einsatzrunde werden drei Gemeinschaftskarten offen auf den Tisch gelegt. Dies wird als Flop bezeichnet.</p>
                            <p>Es findet eine weitere Einsatzrunde statt, die mit dem Spieler links vom Geber beginnt.</p>
                        </Col>
                        <Col sm={12}><h3>Turn</h3></Col>
                        <Col sm={12}>
                            <p>Nach dem Flop wird eine vierte Gemeinschaftskarte offen auf den Tisch gelegt. Dies wird als Turn bezeichnet.</p>
                            <p>Es findet eine weitere Einsatzrunde statt.</p>
                        </Col>
                        <Col sm={12}><h3>River</h3></Col>
                        <Col sm={12}>
                            <p>Nach dem Turn wird eine fünfte und letzte Gemeinschaftskarte offen auf den Tisch gelegt. Dies wird als River bezeichnet.</p>
                            <p>Die letzte Einsatzrunde findet statt.</p>
                        </Col>
                        <Col sm={12}><h3>Showdown</h3></Col>
                        <Col sm={12}>
                            <p>Wenn nach der letzten Einsatzrunde noch zwei oder mehr Spieler übrig sind, kommt es zum Showdown.</p>
                            <p>Die Spieler decken ihre Hole Cards auf, und der Spieler mit der höchstrangigen Hand gewinnt den Pot.</p>
                            <p>Bei Gleichstand wird der Pot gleichmäßig unter den Gewinnern aufgeteilt.</p>
                        </Col>
                    </Row>
                </Col>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Five Card Draw Poker</h2></Col>
                        <Col sm={12}><h3>Einführung</h3></Col>
                        <Col sm={12}>
                            <p>Five Card Draw ist eine klassische und unkomplizierte Form des Pokers.</p>
                            <p>Das Ziel des Spiels besteht darin, die beste Fünf-Karten-Hand unter Verwendung einer Kombination aus den Karten in Ihrer Hand und denen auf dem Tisch zu bilden.</p>
                        </Col>
                        <Col sm={12}><h3>Die Verteilung</h3></Col>
                        <Col sm={12}>
                            <p>Jeder Spieler erhält fünf verdeckte Karten.</p>
                            <p>Die Wettrunde beginnt normalerweise mit dem Spieler links vom Geber.</p>
                        </Col>
                        <Col sm={12}><h3>Erste Einsatzrunde</h3></Col>
                        <Col sm={12}>
                            <p>Die erste Einsatzrunde beginnt mit dem Spieler links vom Geber.</p>
                            <p>Die Spieler können sich entscheiden, auszusteigen (ihre Karten abzulegen und aus der Hand auszuscheiden), mitzugehen (den aktuellen Einsatz mitgehen) oder zu erhöhen (den Einsatz erhöhen).</p>
                        </Col>
                        <Col sm={12}><h3>Ziehphase</h3></Col>
                        <Col sm={12}>
                            <p>Nach der ersten Einsatzrunde haben die Spieler die Möglichkeit, einige oder alle ihre Karten gegen neue auszutauschen.</p>
                            <p>Beginnend mit dem Spieler links vom Geber kann jeder Spieler eine beliebige Anzahl seiner Karten ablegen und eine gleiche Anzahl von Ersatzkarten vom Stapel erhalten.</p>
                            <p>In den meisten Spielen werden die abgelegten Karten verdeckt abgelegt und die Ersatzkarten ebenfalls verdeckt ausgeteilt.</p>
                        </Col>
                        <Col sm={12}><h3>Zweite Einsatzrunde</h3></Col>
                        <Col sm={12}>
                            <p>Nach der Ziehphase folgt eine zweite Einsatzrunde.</p>
                            <p>Die Wettrunde beginnt mit dem Spieler links vom Geber, und die Spieler können basierend auf der Stärke ihrer Hand aussteigen, mitgehen oder erhöhen.</p>
                        </Col>
                        <Col sm={12}><h3>Showdown</h3></Col>
                        <Col sm={12}>
                            <p>Wenn nach der zweiten Einsatzrunde noch zwei oder mehr Spieler übrig sind, kommt es zum Showdown.</p>
                            <p>Die verbleibenden Spieler decken ihre Karten auf, beginnend mit dem Spieler, der den letzten Einsatz oder die letzte Erhöhung gemacht hat.</p>
                            <p>Der Spieler mit der besten Fünf-Karten-Hand gewinnt den Pot.</p>
                            <p>Die Handwertungen folgen den Standard-Pokerregeln, wobei der Royal Flush die höchstrangige Hand und die Höchste Karte die niedrigstrangige Hand ist.</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default PokerDe