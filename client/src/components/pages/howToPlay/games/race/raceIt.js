import React from 'react'
import { Col, Row } from 'react-bootstrap'

function RaceIt(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduzione</h3></Col>
                <Col sm={12}>
                    <p>Le scommesse sulle corse implicano scommettere denaro sull'esito della corsa.</p>
                    <p>L'obiettivo è prevedere quale animale vincerà o si piazzerà in una corsa specifica.</p>
                </Col>
                <Col sm={12}><h3>Tipi di Scommesse</h3></Col>
                <Col sm={12}>
                    <ul>
                        <li>Vincente: Scommettere su un animale specifico per finire primo.</li>
                        <li>Piazzato: Scommettere su un animale per finire tra le prime due o tre posizioni, a seconda delle regole specifiche.</li>
                        <li>Ognuno: Una combinazione di scommesse Vincente e Piazzato. Se la tua selezione vince, vinci sia la scommessa Vincente che quella Piazzata. Se la tua selezione si piazza, vinci solo la scommessa Piazzata.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Comprensione delle Quote</h3></Col>
                <Col sm={12}>
                    <p>Le quote rappresentano il pagamento che puoi aspettarti se la tua scommessa è vincente.</p>
                    <p>Le quote possono essere visualizzate in diversi formati, come frazionarie (ad esempio, 5/1), decimali (ad esempio, 6.0) o in denaro (ad esempio, +500).</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}
export default RaceIt