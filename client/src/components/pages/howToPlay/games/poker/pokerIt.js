import React from 'react'
import { Col, Row } from 'react-bootstrap'

function PokerIt(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduzione</h3></Col>
                <Col sm={12}>
                    <p>Il poker è un popolare gioco di carte giocato con un mazzo standard di 52 carte.</p>
                    <p>L'obiettivo del gioco è vincere il piatto, che è la somma di denaro o gettoni contribuita dai giocatori.</p>
                </Col>
                <Col sm={12}><h3>Classifiche delle Mani</h3></Col>
                <Col sm={12}>
                    <p>Familiarizzati con le classifiche delle mani nel poker, dall'alto al basso:</p>
                    <ul>
                        <li>Scala Reale: A, K, Q, J, 10 dello stesso seme.</li>
                        <li>Colore: Cinque carte consecutive dello stesso seme.</li>
                        <li>Poker: Quattro carte dello stesso valore.</li>
                        <li>Full: Tre carte dello stesso valore più una coppia.</li>
                        <li>Colore: Cinque carte dello stesso seme.</li>
                        <li>Scala: Cinque carte consecutive di qualunque seme.</li>
                        <li>Tris: Tre carte dello stesso valore.</li>
                        <li>Doppia Coppia: Due coppie di carte dello stesso valore.</li>
                        <li>Coppia: Due carte dello stesso valore.</li>
                        <li>Carta Alta: La carta di valore più alto nella tua mano.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Fasi di Scommessa</h3></Col>
                <Col sm={12}>
                    <p>Il poker coinvolge tipicamente più fasi di scommessa, in cui i giocatori piazzano scommesse in base alla forza della loro mano o alla loro strategia di bluff.</p>
                    <p>I tipi più comuni di giochi di poker includono Texas Hold'em, Omaha, Seven-Card Stud e Five-Card Draw.</p>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Poker Texas Hold'em</h2></Col>
                        <Col sm={12}><h3>Introduzione</h3></Col>
                        <Col sm={12}>
                            <p>Ogni giocatore riceve due carte private (carte coperte), e cinque carte comuni vengono posizionate scoperte sul tavolo.</p>
                            <p>Il gioco consiste in quattro fasi di scommesse: pre-flop, flop, turn e river.</p>
                        </Col>
                        <Col sm={12}><h3>Pre-Flop</h3></Col>
                        <Col sm={12}>
                            <p>Dopo aver ricevuto le carte coperte, inizia il primo turno di scommesse.</p>
                            <p>I giocatori possono scegliere di fare fold (scartare le proprie carte), call (eguagliare la scommessa corrente) o raise (aumentare la scommessa).</p>
                        </Col>
                        <Col sm={12}><h3>Flop</h3></Col>
                        <Col sm={12}>
                            <p>Dopo il pre-flop, vengono distribuite tre carte comuni scoperte sul tavolo. Questo è chiamato flop.</p>
                            <p>Si svolge un altro turno di scommesse, a partire dal giocatore alla sinistra del mazziere.</p>
                        </Col>
                        <Col sm={12}><h3>Turn</h3></Col>
                        <Col sm={12}>
                            <p>Dopo il flop, viene distribuita una quarta carta comune scoperta sul tavolo. Questa è chiamata turn.</p>
                            <p>Si svolge un altro turno di scommesse.</p>
                        </Col>
                        <Col sm={12}><h3>River</h3></Col>
                        <Col sm={12}>
                            <p>Dopo il turn, viene distribuita una quinta e ultima carta comune scoperta sul tavolo. Questa è chiamata river.</p>
                            <p>Si svolge l'ultimo turno di scommesse.</p>
                        </Col>
                        <Col sm={12}><h3>Showdown</h3></Col>
                        <Col sm={12}>
                            <p>Se ci sono due o più giocatori rimasti dopo l'ultimo turno di scommesse, si verifica uno showdown.</p>
                            <p>I giocatori rivelano le proprie carte coperte, e il giocatore con la mano di valore più alto vince il piatto.</p>
                            <p>In caso di parità, il piatto viene diviso equamente tra i giocatori vincenti.</p>
                        </Col>
                    </Row>
                </Col>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Poker Five Card Draw</h2></Col>
                        <Col sm={12}><h3>Introduzione</h3></Col>
                        <Col sm={12}>
                            <p>Il Poker Five Card Draw è una forma classica e semplice di poker.</p>
                            <p>L'obiettivo del gioco è creare la migliore mano di cinque carte utilizzando una combinazione delle carte in mano e quelle sul tavolo.</p>
                        </Col>
                        <Col sm={12}><h3>La Distribuzione</h3></Col>
                        <Col sm={12}>
                            <p>Ogni giocatore riceve cinque carte private coperte.</p>
                            <p>Le scommesse di solito iniziano con il giocatore alla sinistra del mazziere.</p>
                        </Col>
                        <Col sm={12}><h3>Primo Turno di Scommesse</h3></Col>
                        <Col sm={12}>
                            <p>Il primo turno di scommesse inizia con il giocatore alla sinistra del mazziere.</p>
                            <p>I giocatori possono scegliere di fare fold (scartare le proprie carte e uscire dalla mano), call (eguagliare la scommessa corrente) o raise (aumentare la scommessa).</p>
                        </Col>
                        <Col sm={12}><h3>Fase di Scambio</h3></Col>
                        <Col sm={12}>
                            <p>Dopo il primo turno di scommesse, i giocatori hanno l'opzione di scambiare alcune o tutte le loro carte con delle nuove carte.</p>
                            <p>Iniziando dal giocatore alla sinistra del mazziere, ogni giocatore può scartare un qualsiasi numero delle sue carte e ricevere un numero uguale di carte di ricambio dal mazzo.</p>
                            <p>Nella maggior parte dei giochi, le carte scartate vengono posizionate coperte, e le carte di ricambio vengono distribuite anch'esse coperte.</p>
                        </Col>
                        <Col sm={12}><h3>Secondo Turno di Scommesse</h3></Col>
                        <Col sm={12}>
                            <p>Dopo la fase di scambio, si verifica un secondo turno di scommesse.</p>
                            <p>Le scommesse iniziano con il giocatore alla sinistra del mazziere, e i giocatori possono scegliere di fare fold, call o raise in base alla forza della loro mano.</p>
                        </Col>
                        <Col sm={12}><h3>Showdown</h3></Col>
                        <Col sm={12}>
                            <p>Se ci sono due o più giocatori rimasti dopo il secondo turno di scommesse, si verifica uno showdown.</p>
                            <p>I giocatori rimanenti rivelano le loro carte, a partire dal giocatore che ha fatto l'ultima scommessa o rilancio.</p>
                            <p>Il giocatore con la migliore mano di cinque carte vince il piatto.</p>
                            <p>Le classifiche delle mani seguono le regole standard del poker, con la Scala Reale che è la mano di valore più alto e la Carta Alta quella di valore più basso.</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default PokerIt