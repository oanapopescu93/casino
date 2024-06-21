import React from 'react'
import { Col, Row } from 'react-bootstrap'

function CrapsDe(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Einführung</h3></Col>
                <Col sm={12}>
                    <p>Craps ist ein Würfelspiel, das mit zwei Würfeln gespielt wird, normalerweise auf einem speziellen Tisch in einem Casino.</p>
                    <p>Das Ziel des Spiels besteht darin, das Ergebnis der Würfelwürfe vorherzusagen und entsprechende Einsätze zu platzieren.</p>
                </Col>
                <Col sm={12}><h3>Der Pass Line-Einsatz</h3></Col>
                <Col sm={12}>
                    <p>Der häufigste Einsatz beim Craps ist der "Pass Line"-Einsatz. Er wird vor dem Come-Out-Wurf (dem ersten Wurf der Würfel) platziert.</p>
                    <p>Um einen Pass Line-Einsatz zu tätigen, platzieren Sie Ihre Chips im Bereich "Pass Line" auf dem Craps-Tisch.</p>
                </Col>
                <Col sm={12}><h3>Der Come-Out-Wurf</h3></Col>
                <Col sm={12}>
                    <p>Das Spiel beginnt damit, dass der Shooter (die Person, die die Würfel wirft) den Come-Out-Wurf macht.</p>
                    <p>Wenn der Come-Out-Wurf eine 7 oder 11 ist, gewinnen Pass Line-Einsätze, und diejenigen, die sie platziert haben, erhalten eine Auszahlung im Verhältnis 1:1.</p>
                    <p>Wenn der Come-Out-Wurf eine 2, 3 oder 12 ist, verlieren Pass Line-Einsätze, und diejenigen, die sie platziert haben, verlieren ihre Chips.</p>
                </Col>
                <Col sm={12}><h3>Punktzahl</h3></Col>
                <Col sm={12}>
                    <p>Wenn der Come-Out-Wurf eine 4, 5, 6, 8, 9 oder 10 ist, wird diese Zahl zum "Punkt".</p>
                    <p>Der Dealer platziert einen Marker namens "Punktmarker" auf dem Tisch, um den festgelegten Punkt anzuzeigen.</p>
                </Col>
                <Col sm={12}><h3>Weiterführen des Spiels</h3></Col>
                <Col sm={12}>
                    <p>Nachdem der Punkt festgelegt wurde, wirft der Shooter weiterhin die Würfel, bis eines von zwei Ergebnissen eintritt: Der Punkt wird erneut geworfen (Pass Line-Einsätze gewinnen) oder eine 7 wird geworfen (Pass Line-Einsätze verlieren).</p>
                    <p>Der Shooter würfelt so lange, bis eines dieser Ergebnisse erzielt wird, woraufhin die nächste Person der Shooter wird.</p>
                </Col>
                <Col sm={12}><h3>Wettoptionen</h3></Col>
                <Col sm={12}>
                    <p>Zusätzlich zum Pass Line-Einsatz gibt es viele andere Wettoptionen beim Craps.</p>
                    <ul>
                        <li>Come-Wette: Ähnlich wie der Pass Line-Einsatz, wird jedoch nach Festlegung des Punkts platziert.</li>
                        <li>Don't Pass Line-Einsatz: Das Gegenteil des Pass Line-Einsatzes. Gewinnt bei 2 oder 3, verliert bei 7 oder 11 und unentschieden bei 12. Wenn ein Punkt festgelegt ist, gewinnt die Wette, wenn eine 7 vor dem Punkt geworfen wird.</li>
                        <li>Don't Come-Wette: Ähnlich wie der Don't Pass Line-Einsatz, wird jedoch nach Festlegung des Punkts platziert.</li>
                        <li>Place-Wetten: Wetten auf bestimmte Zahlen (4, 5, 6, 8, 9 oder 10), die vor einer 7 geworfen werden sollen.</li>
                        <li>Field-Wette: Wetten darauf, dass bei einem der nächsten Würfe eine 2, 3, 4, 9, 10, 11 oder 12 geworfen wird.</li>
                        <li>Proposition-Wetten: Einzelwetten auf bestimmte Ergebnisse (z. B. eine bestimmte Zahl oder Kombination) mit hohen Auszahlungen, aber höherem Hausvorteil.</li>
                    </ul>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default CrapsDe