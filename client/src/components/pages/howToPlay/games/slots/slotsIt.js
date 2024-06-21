import React from 'react'
import { Col, Row } from 'react-bootstrap'

function SlotsIt(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduzione</h3></Col>
                <Col sm={12}>
                    <p>Le slot machine, conosciute anche come macchinette o fruit machine, sono giochi popolari nei casinò.</p>
                    <p>L'obiettivo è far girare i rulli e ottenere combinazioni di simboli per vincere premi.</p>
                </Col>
                <Col sm={12}><h3>Tipi di Slot Machine</h3></Col>
                <Col sm={12}>
                    <p>Esistono vari tipi di slot machine, tra cui le tradizionali slot a tre rulli, le slot video e le slot con jackpot progressivo.</p>
                    <p>Le slot tradizionali hanno tre rulli e sono più semplici nel design, mentre le slot video hanno più rulli, linee di pagamento e spesso presentano giochi bonus e funzioni speciali.</p>
                    <p>Le slot con jackpot progressivo offrono un jackpot che aumenta ad ogni partita fino a quando qualcuno vince il jackpot.</p>
                </Col>
                <Col sm={12}><h3>Utilizzare le Slot</h3></Col>
                <Col sm={12}>
                    <p>Prima di giocare, stabilisci l'importo di denaro che desideri scommettere per ogni giro.</p>
                    <p>Dopo aver effettuato la tua scommessa, premi il pulsante "Gira".</p>
                    <p>Quando i rulli si fermano, i simboli sulle linee di pagamento vengono valutati.</p>
                    <p>Se i simboli formano una combinazione vincente in base alla tabella dei pagamenti del gioco, vinci un premio.</p>
                    <p>La tabella dei pagamenti mostra le combinazioni di simboli e le relative vincite.</p>
                </Col>
                <Col sm={12}><h3>Simboli Wild e Scatter</h3></Col>
                <Col sm={12}>
                    <p>Molte slot machine includono simboli speciali come i simboli Wild.</p>
                    <p>I simboli Wild possono sostituire altri simboli per creare combinazioni vincenti, aumentando le tue possibilità di vincita.</p>
                    <p>I simboli Scatter spesso attivano funzioni bonus, giri gratuiti o premi aggiuntivi quando un certo numero di essi appare sui rulli.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default SlotsIt