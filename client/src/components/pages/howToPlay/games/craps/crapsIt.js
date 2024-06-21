import React from 'react'
import { Col, Row } from 'react-bootstrap'

function CrapsIt(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduzione</h3></Col>
                <Col sm={12}>
                    <p>Il craps è un gioco di dadi giocato con due dadi, di solito su un tavolo specializzato in un casinò.</p>
                    <p>L'obiettivo del gioco è prevedere il risultato dei lanci dei dadi e piazzare le scommesse di conseguenza.</p>
                </Col>
                <Col sm={12}><h3>La Scommessa Pass Line</h3></Col>
                <Col sm={12}>
                    <p>La scommessa più comune nel craps è la "Pass Line" (linea di passaggio). Viene piazzata prima del lancio iniziale dei dadi.</p>
                    <p>Per effettuare una scommessa Pass Line, posiziona le tue fiches nell'area "Pass Line" del tavolo da craps.</p>
                </Col>
                <Col sm={12}><h3>Il Lancio Iniziale</h3></Col>
                <Col sm={12}>
                    <p>Il gioco inizia con il lanciatore (la persona che lancia i dadi) che effettua il lancio iniziale.</p>
                    <p>Se il lancio iniziale è un 7 o un 11, le scommesse Pass Line vincono e chi le ha piazzate viene pagato alla pari.</p>
                    <p>Se il lancio iniziale è un 2, un 3 o un 12, le scommesse Pass Line perdono e chi le ha piazzate perde le proprie fiches.</p>
                </Col>
                <Col sm={12}><h3>Numero Punto</h3></Col>
                <Col sm={12}>
                    <p>Se il lancio iniziale è un 4, un 5, un 6, un 8, un 9 o un 10, quel numero diventa il "punto".</p>
                    <p>Il croupier posizionerà un segnaposto chiamato "marcatore del punto" sul tavolo per indicare il punto stabilito.</p>
                </Col>
                <Col sm={12}><h3>Continuazione del Gioco</h3></Col>
                <Col sm={12}>
                    <p>Dopo che il punto è stato stabilito, il lanciatore continua a lanciare i dadi fino a quando si verifica uno dei due esiti: viene rilanciato il punto (le scommesse Pass Line vincono) o viene lanciato un 7 (le scommesse Pass Line perdono).</p>
                    <p>Il lanciatore continua a lanciare i dadi fino a quando si verifica uno di questi esiti, momento in cui la persona successiva diventa il lanciatore.</p>
                </Col>
                <Col sm={12}><h3>Opzioni di Scommessa</h3></Col>
                <Col sm={12}>
                    <p>Oltre alla scommessa Pass Line, ci sono molte altre opzioni di scommessa nel craps:</p>
                    <ul>
                        <li>Scommessa Come: Simile alla scommessa Pass Line, ma piazzata dopo che il punto è stato stabilito.</li>
                        <li>Scommessa Don't Pass Line: Contraria alla scommessa Pass Line. Vince con 2 o 3, perde con 7 o 11 e pareggia con 12. Se viene stabilito un punto, la scommessa vince se viene lanciato un 7 prima del punto.</li>
                        <li>Scommessa Don't Come: Simile alla scommessa Don't Pass Line, ma piazzata dopo che il punto è stato stabilito.</li>
                        <li>Scommesse Place: Scommessa su numeri specifici (4, 5, 6, 8, 9 o 10) da lanciare prima di un 7.</li>
                        <li>Scommessa Field: Scommessa su 2, 3, 4, 9, 10, 11 o 12 da lanciare nel prossimo lancio.</li>
                        <li>Scommesse Proposition: Scommesse su esiti specifici (ad esempio, un numero o una combinazione specifica) con pagamenti elevati ma margine della casa più alto.</li>
                    </ul>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default CrapsIt