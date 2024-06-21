import React from 'react'
import { Col, Row } from 'react-bootstrap'

function KenoIt(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduzione</h3></Col>
                <Col sm={12}>
                    <p>Il Keno è un gioco simile alla lotteria giocato in molti casinò e piattaforme online.</p>
                    <p>L'obiettivo del gioco è selezionare numeri da un insieme e confrontarli con i numeri estratti dalla macchina del Keno.</p>
                </Col>
                <Col sm={12}><h3>Biglietto del Keno</h3></Col>
                <Col sm={12}>
                    <p>Per giocare a Keno, inizia ottenendo un biglietto del Keno. Il biglietto contiene una griglia di numeri da 1 a 80.</p>
                    <p>Di solito puoi scegliere quanti numeri vuoi giocare (di solito da 1 a 20), e il tuo pagamento dipenderà da quanti numeri selezioni.</p>
                </Col>
                <Col sm={12}><h3>Selezione dei Numeri</h3></Col>
                <Col sm={12}>
                    <p>Sul biglietto del Keno, segna o seleziona i numeri che desideri giocare cerchiandoli o evidenziandoli.</p>
                    <p>Il numero di selezioni che puoi fare dipende dalle regole specifiche del gioco di Keno a cui stai giocando.</p>
                </Col>
                <Col sm={12}><h3>Scegliere la Scommessa</h3></Col>
                <Col sm={12}>
                    <p>Decidi l'importo di denaro che desideri scommettere sul tuo biglietto del Keno.</p>
                    <p>Il pagamento per i numeri corrispondenti dipenderà dall'importo della tua scommessa.</p>
                </Col>
                <Col sm={12}><h3>Numero di Estrazioni</h3></Col>
                <Col sm={12}>
                    <p>Decidi quanti giochi o estrazioni consecutive desideri giocare con lo stesso biglietto. Di solito puoi scegliere di giocare un solo gioco o più giochi di fila.</p>
                </Col>
                <Col sm={12}><h3>Corrispondenza dei Numeri e Pagamenti</h3></Col>
                <Col sm={12}>
                    <p>Man mano che i numeri vengono estratti, confrontali con i numeri che hai selezionato sul tuo biglietto del Keno.</p>
                    <p>Più numeri corrispondi, maggiore sarà il tuo pagamento, a seconda della tabella di pagamento specifica del gioco a cui stai giocando.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default KenoIt