import React from 'react'
import { Col, Row } from 'react-bootstrap'

function CrapsEng(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introducere</h3></Col>
                <Col sm={12}>
                    <p>Craps este un joc de zaruri jucat cu două zaruri, de obicei pe o masă specializată într-un cazinou.</p>
                    <p>Scopul jocului este de a prezice rezultatul aruncării zarurilor și de a plasa pariuri în consecință.</p>
                </Col>
                <Col sm={12}><h3>Pariul pe linia de trecere (Pass Line Bet)</h3></Col>
                <Col sm={12}>
                    <p>Cel mai comun pariu în craps este "Pariul pe linia de trecere" (Pass Line Bet). Se plasează înainte de aruncarea inițială (prima aruncare a zarurilor).</p>
                    <p>Pentru a face un pariu pe linia de trecere, plasați jetoanele pe zona "Pass Line" de pe masa de craps.</p>
                </Col>
                <Col sm={12}><h3>Aruncarea inițială (Come-Out Roll)</h3></Col>
                <Col sm={12}>
                    <p>Jocul începe cu "shooterul" (persoana care aruncă zarurile) făcând aruncarea inițială.</p>
                    <p>Dacă aruncarea inițială este un 7 sau un 11, pariurile pe linia de trecere câștigă, iar cei care le-au plasat sunt plătiți la fel de mult ca pariul.</p>
                    <p>Dacă aruncarea inițială este un 2, 3 sau 12, pariurile pe linia de trecere pierd, iar cei care le-au plasat își pierd jetoanele.</p>
                </Col>
                <Col sm={12}><h3>Numărul punctului (Point Number)</h3></Col>
                <Col sm={12}>
                    <p>Dacă aruncarea inițială este un 4, 5, 6, 8, 9 sau 10, acel număr devine "punctul" (point).</p>
                    <p>Dealerul va plasa un marcator numit "marcatorul de punct" pe masă pentru a indica punctul stabilit.</p>
                </Col>
                <Col sm={12}><h3>Continuarea jocului</h3></Col>
                <Col sm={12}>
                    <p>După stabilirea punctului, shooterul continuă să arunce zarurile până când apare una dintre cele două rezultate: se aruncă din nou punctul (pariurile pe linia de trecere câștigă) sau se aruncă un 7 (pariurile pe linia de trecere pierd).</p>
                    <p>Shooterul continuă să arunce până când se obține una dintre aceste rezultate, moment în care următoarea persoană devine shooterul.</p>
                </Col>
                <Col sm={12}><h3>Opțiuni de pariere</h3></Col>
                <Col sm={12}>
                    <p>În plus față de pariu pe linia de trecere, există multe alte opțiuni de pariere în craps.</p>
                    <ul>
                        <li>Pariu Come: Similar cu pariu pe linia de trecere, dar plasat după stabilirea punctului.</li>
                        <li>Pariu Don't Pass Line: Opusul pariului pe linia de trecere. Câștigă la 2 sau 3, pierde la 7 sau 11 și face egalitate la 12. Dacă se stabilește un punct, pariul câștigă dacă se aruncă un 7 înainte de punct.</li>
                        <li>Pariu Don't Come: Similar cu pariu Don't Pass Line, dar plasat după stabilirea punctului.</li>
                        <li>Pariuri Plasă: Pariuri pe numere specifice (4, 5, 6, 8, 9 sau 10) care vor fi aruncate înainte de un 7.</li>
                        <li>Pariu Field: Pariu pe 2, 3, 4, 9, 10, 11 sau 12 care vor fi aruncate la următoarea aruncare.</li>
                        <li>Pariuri Propunere: Pariuri pe o singură aruncare pe rezultate specifice (de exemplu, un număr sau o combinație specifică) cu plăți mari, dar cu o marjă de câștig mai mare pentru cazinou.</li>
                    </ul>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default CrapsEng