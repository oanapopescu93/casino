import React from 'react'
import { Col, Row } from 'react-bootstrap'

function RaceDe(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Einführung</h3></Col>
                <Col sm={12}>
                    <p>Pferdewetten beinhalten den Einsatz von Geld auf das Ergebnis eines Rennens.</p>
                    <p>Das Ziel besteht darin, vorherzusagen, welches Tier in einem bestimmten Rennen gewinnen oder platzieren wird.</p>
                </Col>
                <Col sm={12}><h3>Arten von Einsätzen</h3></Col>
                <Col sm={12}>
                    <ul>
                        <li>Sieg: Einsatz auf ein bestimmtes Tier, das als Erstes ins Ziel kommt.</li>
                        <li>Platz: Einsatz auf ein Tier, das in den ersten beiden oder drei Positionen, je nach den spezifischen Regeln, ins Ziel kommt.</li>
                        <li>Jeder-Weg: Eine Kombination aus Sieg- und Platzwetten. Wenn Ihre Auswahl gewinnt, gewinnen Sie sowohl die Sieg- als auch die Platzwetten. Wenn Ihre Auswahl einen Platz erreicht, gewinnen Sie nur die Platzwette.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Verständnis der Quoten</h3></Col>
                <Col sm={12}>
                    <p>Quoten repräsentieren die Auszahlung, die Sie erwarten können, wenn Ihre Wette erfolgreich ist.</p>
                    <p>Quoten können in verschiedenen Formaten angezeigt werden, wie z. B. Bruchquoten (z. B. 5/1), Dezimalquoten (z. B. 6,0) oder Moneyline-Quoten (z. B. +500).</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}
export default RaceDe