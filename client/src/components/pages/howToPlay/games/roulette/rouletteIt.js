import React from 'react'
import { Col, Row } from 'react-bootstrap'

function RouletteIt(){
    return  <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduzione</h3></Col>
                <Col sm={12}>
                    <p>La roulette è un popolare gioco da casinò che si gioca su una ruota girevole.</p>
                    <p>L'obiettivo del gioco è prevedere dove la piccola pallina si fermerà sulla ruota, effettuando quindi scommesse su numeri diversi o gruppi di numeri.</p>
                </Col>
                <Col sm={12}><h3>La Ruota della Roulette</h3></Col>
                <Col sm={12}>
                    <p>La ruota della roulette è composta da tasche numerate da 0 a 36.</p>
                    <p>I numeri sono colorati alternativamente in rosso e nero, con la tasca 0 colorata in verde.</p>
                    <p>La versione europea della roulette ha una sola tasca 0, mentre quella americana ha una tasca aggiuntiva 00.</p>
                </Col>
                <Col sm={12}><h3>Il Tavolo della Roulette</h3></Col>
                <Col sm={12}>
                    <p>Il tavolo della roulette è dove i giocatori effettuano le loro scommesse.</p>
                    <p>Presenta una griglia che rappresenta i numeri sulla ruota e varie opzioni di scommessa aggiuntive.</p>
                    <p>Il tavolo è diviso in due sezioni principali: le scommesse interne e le scommesse esterne.</p>
                </Col>
                <Col sm={12}><h3>Scommesse Interne</h3></Col>
                <Col sm={12}><p>Scommettere su un singolo numero posizionando una fiches direttamente su quel numero.</p></Col>
                <Col sm={12}><h3>Scommesse Esterne</h3></Col>
                <Col sm={12}>
                    <p>Le scommesse esterne vengono effettuate su gruppi più ampi di numeri o caratteristiche dei numeri.</p>
                    <p>Ecco alcune scommesse esterne comuni:</p>
                    <ul>
                        <li>Rosso/Nero: Scommettere su quale colore (rosso o nero) la pallina si fermerà.</li>
                        <li>Pari/Dispari: Scommettere su un numero pari o dispari in cui la pallina si fermerà.</li>
                        <li>Basso/Alto: Scommettere su un numero basso (1-18) o alto (19-36) in cui la pallina si fermerà.</li>
                        <li>Scommessa sulle Dodici: Scommettere su un gruppo di 12 numeri posizionando una fiches sulle sezioni "1-12", "13-24" o "25-36" del tavolo.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Girare la Ruota</h3></Col>
                <Col sm={12}>
                    <p>Dopo la fase di scommessa, il croupier (l'addetto al casinò responsabile del gioco) gira la ruota della roulette in una direzione e rilascia una piccola pallina nella direzione opposta. Man mano che la ruota rallenta, la pallina alla fine si fermerà in una delle tasche numerate.</p>
                </Col>
                <Col sm={12}><h3>Vincere e Perdere</h3></Col>
                <Col sm={12}>
                    <p>Se la pallina si ferma su un numero o un gruppo di numeri su cui hai scommesso, vinci un corrispondente pagamento basato sulle probabilità di quella specifica scommessa.</p>
                </Col>
                <Col sm={12}><h3>Pagamenti</h3></Col>
                <Col sm={12}>
                    <p>I pagamenti variano a seconda del tipo di scommessa effettuata. Le scommesse singole, ad esempio, hanno pagamenti più alti poiché sono più rischiose.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default RouletteIt