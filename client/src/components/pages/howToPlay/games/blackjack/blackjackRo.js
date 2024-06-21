import React from 'react'
import { Col, Row } from 'react-bootstrap'

function BlackjackRo(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introducere</h3></Col>
                <Col sm={12}>
                    <p>Blackjack este un joc popular de cărți jucat în cazinouri, în care obiectivul este de a avea o sumă a mâinii mai apropiată de 21 decât mâna dealerului, fără a depăși 21.</p>
                    <p>Jocul se joacă cu unul sau mai multe pachete standard de 52 de cărți.</p>
                </Col>
                <Col sm={12}><h3>Valoarea cărților</h3></Col>
                <Col sm={12}>
                    <p>În blackjack, cărțile numerotate (2-10) valorează valoarea feței lor.</p>
                    <p>Cărțile cu figuri (Rege, Damă și Valet) valorează 10.</p>
                    <p>Asul poate fi numărat fie ca 1, fie ca 11, în funcție de care valoare avantajează mâna cel mai mult.</p>
                </Col>
                <Col sm={12}><h3>Mecanica jocului</h3></Col>
                <Col sm={12}>
                    <p>Jocul începe cu fiecare jucător plasând pariurile lor pe zona desemnată în fața lor de pe masa de blackjack.</p>
                    <p>Dealerul apoi împarte două cărți, cu fața în sus, fiecărui jucător și o carte cu fața în sus pentru ei înșiși. A doua carte a dealerului este împărțită cu fața în jos (carte ascunsă).</p>
                </Col>
                <Col sm={12}><h3>Opțiunile jucătorului</h3></Col>
                <Col sm={12}>
                    <p>Rândul jucătorului vine primul și acesta are mai multe opțiuni din care poate alege, în funcție de mâna lor:</p>
                    <ul>
                        <li>Hit: Jucătorul solicită împărțirea unei cărți suplimentare. Jucătorul poate solicita mai multe cărți până când sunt mulțumiți de mâna lor sau până când depășesc 21, rezultând o pierdere.</li>
                        <li>Stand: Jucătorul decide să păstreze mâna lor actuală și să încheie rândul lor, trecând acțiunea la următorul jucător sau la dealer.</li>
                        <li>Double Down: Jucătorul dublează miza lor originală și primește doar o carte suplimentară. Această opțiune este disponibilă în mod obișnuit atunci când mâna inițială a jucătorului totalizează 9, 10 sau 11.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Rândul dealerului</h3></Col>
                <Col sm={12}>
                    <p>După ce toți jucătorii și-au terminat rândul, dealerul dezvăluie cartea lor ascunsă.</p>
                    <p>Dacă suma mâinii dealerului este de 16 sau mai mică, dealerul trebuie să ceară cărți suplimentare până când suma mâinii lor ajunge la 17 sau mai mult.</p>
                    <p>Dacă suma mâinii dealerului depășește 21, toți jucătorii rămași câștigă.</p>
                    <p>Dacă suma mâinii dealerului nu depășește 21, mâna lor este comparată cu mâna fiecărui jucător pentru a determina câștigătorii.</p>
                </Col>
                <Col sm={12}><h3>Blackjack</h3></Col>
                <Col sm={12}>
                    <p>Dacă un jucător sau dealerul primește un As și o carte cu valoare de 10 (10, Damă, Valet sau Rege) ca primele două cărți, se numește blackjack.</p>
                    <p>Un blackjack înseamnă o victorie automată pentru jucător, plătind 3:2, cu excepția cazului în care dealerul are, de asemenea, un blackjack, rezultând o egalitate.</p>
                </Col>
                <Col sm={12}><h3>Determinarea rezultatului</h3></Col>
                <Col sm={12}>
                    <p>Dacă suma mâinii jucătorului este mai mare decât cea a dealerului, fără a depăși 21, jucătorul câștigă și primește plata 1:1.</p>
                    <p>Dacă suma mâinii jucătorului este mai mică decât cea a dealerului, jucătorul pierde pariul.</p>
                    <p>Dacă suma mâinii jucătorului și cea a dealerului sunt egale (egalitate), pariul este returnat jucătorului.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default BlackjackRo