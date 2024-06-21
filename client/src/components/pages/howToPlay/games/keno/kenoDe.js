import React from 'react'
import { Col, Row } from 'react-bootstrap'

function KenoDe(){
    return <Row>
    <Col lg={2} />
    <Col lg={8}>
        <Row>
            <Col sm={12}><h3>Einführung</h3></Col>
            <Col sm={12}>
                <p>Keno ist ein Lotteriespiel, das in vielen Casinos und Online-Plattformen gespielt wird.</p>
                <p>Das Ziel des Spiels besteht darin, Zahlen aus einer Auswahl auszuwählen und sie mit den vom Keno-Gerät gezogenen Zahlen abzugleichen.</p>
            </Col>
            <Col sm={12}><h3>Keno-Schein</h3></Col>
            <Col sm={12}>
                <p>Um Keno zu spielen, beginnen Sie damit, einen Keno-Schein zu erhalten. Der Schein enthält ein Raster mit Zahlen von 1 bis 80.</p>
                <p>Sie können in der Regel auswählen, wie viele Zahlen Sie spielen möchten (normalerweise 1 bis 20), und Ihre Auszahlung hängt davon ab, wie viele Zahlen Sie auswählen.</p>
            </Col>
            <Col sm={12}><h3>Zahlen auswählen</h3></Col>
            <Col sm={12}>
                <p>Markieren oder wählen Sie auf dem Keno-Schein die Zahlen aus, die Sie spielen möchten, indem Sie sie umkreisen oder hervorheben.</p>
                <p>Die Anzahl der Auswahlmöglichkeiten hängt von den spezifischen Regeln des Keno-Spiels ab, das Sie spielen.</p>
            </Col>
            <Col sm={12}><h3>Einsatz festlegen</h3></Col>
            <Col sm={12}>
                <p>Legen Sie den Betrag fest, den Sie auf Ihrem Keno-Schein setzen möchten.</p>
                <p>Die Auszahlung für übereinstimmende Zahlen hängt von Ihrem Einsatzbetrag ab.</p>
            </Col>
            <Col sm={12}><h3>Anzahl der Ziehungen</h3></Col>
            <Col sm={12}>
                <p>Entscheiden Sie, wie viele aufeinanderfolgende Spiele oder Ziehungen Sie mit demselben Schein spielen möchten. Sie können in der Regel ein einzelnes Spiel oder mehrere Spiele hintereinander wählen.</p>
            </Col>
            <Col sm={12}><h3>Zahlenabgleich und Auszahlungen</h3></Col>
            <Col sm={12}>
                <p>Vergleichen Sie die gezogenen Zahlen mit den auf Ihrem Keno-Schein ausgewählten Zahlen.</p>
                <p>Je mehr Zahlen übereinstimmen, desto höher ist Ihre Auszahlung, abhängig von der spezifischen Auszahlungstabelle des gespielten Spiels.</p>
            </Col>
        </Row>
    </Col>
    <Col lg={2} />
    </Row>
}

export default KenoDe