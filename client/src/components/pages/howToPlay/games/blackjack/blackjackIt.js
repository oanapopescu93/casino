import React from 'react'
import { Col, Row } from 'react-bootstrap'

function BlackjackIt(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduzione</h3></Col>
                <Col sm={12}>
                    <p>Il blackjack è un popolare gioco di carte giocato nei casinò, dove l'obiettivo è avere una mano il cui totale sia più vicino a 21 rispetto alla mano del banco senza superare 21.</p>
                    <p>Il gioco si gioca con uno o più mazzi standard di 52 carte.</p>
                </Col>
                <Col sm={12}><h3>Valori delle Carte</h3></Col>
                <Col sm={12}>
                    <p>Nel blackjack, le carte numerate (2-10) valgono il loro valore nominale.</p>
                    <p>Le carte faccia (Re, Regina e Jack) valgono 10.</p>
                    <p>L'Asso può essere conteggiato come 1 o 11, a seconda del valore che beneficia di più la mano.</p>
                </Col>
                <Col sm={12}><h3>Svolgimento del Gioco</h3></Col>
                <Col sm={12}>
                    <p>Il gioco inizia con ogni giocatore che piazza le proprie scommesse nell'area designata di fronte a loro sul tavolo da blackjack.</p>
                    <p>Il banco distribuisce poi due carte scoperte a ciascun giocatore e una carta scoperta a se stesso. La seconda carta del banco viene distribuita coperta (carta buca).</p>
                </Col>
                <Col sm={12}><h3>Opzioni del Giocatore</h3></Col>
                <Col sm={12}>
                    <p>È il turno del giocatore, che ha diverse opzioni tra cui scegliere in base alla sua mano:</p>
                    <ul>
                        <li>Chiedere Carta: Il giocatore richiede una carta aggiuntiva da distribuire. Il giocatore può richiedere più carte fino a quando è soddisfatto della propria mano o fino a quando supera 21, perdendo la mano.</li>
                        <li>Stare: Il giocatore decide di mantenere la mano attuale e terminare il proprio turno, passando l'azione al giocatore successivo o al banco.</li>
                        <li>Raddoppiare: Il giocatore raddoppia la scommessa originale e riceve solo una carta aggiuntiva. Questa opzione è di solito disponibile quando la mano iniziale del giocatore totalizza 9, 10 o 11.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Turno del Banco</h3></Col>
                <Col sm={12}>
                    <p>Dopo che tutti i giocatori hanno completato i loro turni, il banco rivela la carta buca.</p>
                    <p>Se il totale della mano del banco è 16 o inferiore, deve chiedere ulteriori carte fino a quando il totale della sua mano raggiunge almeno 17.</p>
                    <p>Se il totale della mano del banco supera 21, tutti i giocatori rimanenti vincono.</p>
                    <p>Se il totale della mano del banco non supera 21, la sua mano viene confrontata con quella di ogni giocatore per determinare i vincitori.</p>
                </Col>
                <Col sm={12}><h3>Blackjack</h3></Col>
                <Col sm={12}>
                    <p>Se a un giocatore o al banco vengono distribuiti un Asso e una carta con valore 10 (10, Jack, Regina o Re) come prime due carte, si chiama blackjack.</p>
                    <p>Il blackjack è una vittoria automatica per il giocatore, con un pagamento di 3:2, a meno che il banco abbia anche un blackjack, risultando in un pareggio.</p>
                </Col>
                <Col sm={12}><h3>Determinazione dell'Esito</h3></Col>
                <Col sm={12}>
                    <p>Se il totale della mano del giocatore è superiore a quello del banco senza superare 21, il giocatore vince e viene pagato 1:1.</p>
                    <p>Se il totale della mano del giocatore è inferiore a quello del banco, il giocatore perde la scommessa.</p>
                    <p>Se il totale della mano del giocatore e del banco è lo stesso (pareggio), la scommessa viene restituita al giocatore.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default BlackjackIt