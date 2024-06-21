import React from 'react'
import { Col, Row } from 'react-bootstrap'

function RouletteDe(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Einführung</h3></Col>
                <Col sm={12}>
                    <p>Roulette ist ein beliebtes Casinospiel, das auf einem drehenden Rad gespielt wird.</p>
                    <p>Das Ziel des Spiels besteht darin, vorherzusagen, auf welcher Zahl im Rad eine kleine Kugel landen wird, und entsprechend Einsätze auf verschiedene Zahlen oder Zahlengruppen zu platzieren.</p>
                </Col>
                <Col sm={12}><h3>Das Roulette-Rad</h3></Col>
                <Col sm={12}>
                    <p>Das Roulette-Rad besteht aus nummerierten Fächern von 0 bis 36.</p>
                    <p>Die Zahlen sind abwechselnd in Rot und Schwarz eingefärbt, wobei das Fach 0 grün ist.</p>
                    <p>Die europäische Version von Roulette hat ein einzelnes Fach 0, während die amerikanische Version ein zusätzliches Fach 00 hat.</p>
                </Col>
                <Col sm={12}><h3>Der Roulette-Tisch</h3></Col>
                <Col sm={12}>
                    <p>Der Roulette-Tisch ist der Ort, an dem Spieler ihre Einsätze platzieren.</p>
                    <p>Er verfügt über ein Raster, das die Zahlen auf dem Rad darstellt, sowie verschiedene zusätzliche Wettmöglichkeiten.</p>
                    <p>Der Tisch ist in zwei Hauptbereiche unterteilt: die Innenwetten und die Außenwetten.</p>
                </Col>
                <Col sm={12}><h3>Innenwetten</h3></Col>
                <Col sm={12}><p>Einsatz auf eine einzelne Zahl, indem man einen Chip direkt auf diese Zahl legt</p></Col>
                <Col sm={12}><h3>Außenwetten</h3></Col>
                <Col sm={12}>
                    <p>Außenwetten werden auf größere Zahlengruppen oder Merkmale der Zahlen platziert.</p> 
                    <p>Hier sind einige gängige Außenwetten:</p>
                    <ul>
                        <li>Rot/Schwarz: Einsatz darauf, ob die Kugel auf einer roten oder schwarzen Zahl landen wird.</li>
                        <li>Gerade/Ungerade: Einsatz darauf, ob die Kugel auf einer geraden oder ungeraden Zahl landen wird.</li>
                        <li>Niedrig/Hoch: Einsatz darauf, ob die Kugel auf einer niedrigen (1-18) oder hohen (19-36) Zahl landen wird.</li>
                        <li>Dutzend-Wette: Einsatz auf eine Gruppe von 12 Zahlen, indem man einen Chip auf die Abschnitte "1st 12", "2nd 12" oder "3rd 12" des Tisches legt.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Das Rad drehen</h3></Col>
                <Col sm={12}>
                    <p>Nach der Einsatzphase wird der Croupier (der für das Spiel zuständige Casino-Mitarbeiter) das Roulette-Rad in eine Richtung drehen und eine kleine Kugel in die entgegengesetzte Richtung freisetzen. Wenn sich das Rad verlangsamt, wird die Kugel schließlich in einem der nummerierten Fächer zur Ruhe kommen.</p>
                </Col>
                <Col sm={12}><h3>Gewinnen und Verlieren</h3></Col>
                <Col sm={12}>
                    <p>Wenn die Kugel auf einer Zahl oder einer Zahlengruppe landet, auf die Sie gesetzt haben, gewinnen Sie eine entsprechende Auszahlung basierend auf den Quoten dieses bestimmten Einsatzes.</p>
                </Col>
                <Col sm={12}><h3>Auszahlungen</h3></Col>
                <Col sm={12}>
                    <p>Die Auszahlungen variieren je nach Art des getätigten Einsatzes. Direkte Einsätze haben beispielsweise höhere Auszahlungen, da sie riskanter sind.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default RouletteDe