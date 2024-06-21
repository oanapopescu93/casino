import React from 'react'
import { Col, Row } from 'react-bootstrap'

function BlackjackDe(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Einführung</h3></Col>
                <Col sm={12}>
                    <p>Blackjack ist ein beliebtes Kartenspiel, das in Casinos gespielt wird. Das Ziel des Spiels ist es, eine Hand mit einem Gesamtwert näher an 21 zu haben als die Hand des Dealers, ohne dabei die 21 zu überschreiten.</p>
                    <p>Das Spiel wird mit einem oder mehreren Standarddecks mit 52 Karten gespielt.</p>
                </Col>
                <Col sm={12}><h3>Kartenwerte</h3></Col>
                <Col sm={12}>
                    <p>Im Blackjack haben nummerierte Karten (2-10) den Wert ihrer Zahl.</p>
                    <p>Bildkarten (König, Dame und Bube) haben den Wert von 10.</p>
                    <p>Das Ass kann entweder als 1 oder als 11 gezählt werden, je nachdem, welcher Wert der Hand am meisten nützt.</p>
                </Col>
                <Col sm={12}><h3>Spielablauf</h3></Col>
                <Col sm={12}>
                    <p>Das Spiel beginnt damit, dass jeder Spieler seine Einsätze auf dem dafür vorgesehenen Bereich auf dem Blackjack-Tisch platziert.</p>
                    <p>Der Dealer teilt dann jedem Spieler zwei Karten offen aus und sich selbst eine Karte offen aus. Die zweite Karte des Dealers wird verdeckt ausgeteilt (Hole Card).</p>
                </Col>
                <Col sm={12}><h3>Spieleroptionen</h3></Col>
                <Col sm={12}>
                    <p>Zuerst ist der Spieler an der Reihe und er hat mehrere Optionen zur Auswahl, je nach seiner Hand:</p>
                    <ul>
                        <li>Kaufen: Der Spieler fordert eine zusätzliche Karte an. Der Spieler kann mehrere Karten kaufen, bis er mit seiner Hand zufrieden ist oder bis er 21 überschreitet und verliert.</li>
                        <li>Halten: Der Spieler entscheidet sich, seine aktuelle Hand zu behalten und seinen Zug zu beenden, wodurch der nächste Spieler oder der Dealer an der Reihe ist.</li>
                        <li>Double Down: Der Spieler verdoppelt seinen ursprünglichen Einsatz und erhält nur eine zusätzliche Karte. Diese Option steht normalerweise zur Verfügung, wenn der Anfangswert der Spielerhand 9, 10 oder 11 beträgt.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Zug des Dealers</h3></Col>
                <Col sm={12}>
                    <p>Nachdem alle Spieler ihren Zug beendet haben, zeigt der Dealer seine verdeckte Karte.</p>
                    <p>Wenn der Gesamtwert der Hand des Dealers 16 oder weniger beträgt, muss er kaufen und weitere Karten ziehen, bis der Wert seiner Hand 17 oder mehr beträgt.</p>
                    <p>Wenn der Gesamtwert der Hand des Dealers 21 überschreitet, gewinnen alle verbleibenden Spieler.</p>
                    <p>Wenn der Gesamtwert der Hand des Dealers 21 nicht überschreitet, wird seine Hand mit der Hand jedes Spielers verglichen, um die Gewinner zu ermitteln.</p>
                </Col>
                <Col sm={12}><h3>Blackjack</h3></Col>
                <Col sm={12}>
                    <p>Wenn einem Spieler oder dem Dealer als ersten beiden Karten ein Ass und eine Karte mit einem Wert von 10 (10, Bube, Dame oder König) ausgeteilt werden, spricht man von einem Blackjack.</p>
                    <p>Ein Blackjack ist ein automatischer Gewinn für den Spieler und zahlt 3:2 aus, es sei denn, der Dealer hat auch einen Blackjack, was zu einem Gleichstand führt.</p>
                </Col>
                <Col sm={12}><h3>Bestimmung des Ergebnisses</h3></Col>
                <Col sm={12}>
                    <p>Wenn der Gesamtwert der Hand des Spielers höher ist als der des Dealers, ohne 21 zu überschreiten, gewinnt der Spieler und erhält eine Auszahlung von 1:1.</p>
                    <p>Wenn der Gesamtwert der Hand des Spielers geringer ist als der des Dealers, verliert der Spieler seinen Einsatz.</p>
                    <p>Wenn der Gesamtwert der Hand des Spielers und des Dealers gleich ist (ein Gleichstand), wird der Einsatz an den Spieler zurückgegeben.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default BlackjackDe