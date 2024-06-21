import React from 'react'
import { Col, Row } from 'react-bootstrap'

function RouletteRo(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introducere</h3></Col>
                <Col sm={12}>
                    <p>Roulette este un joc popular de cazinou care se joacă pe o roată care se învârte.</p>
                    <p>Scopul jocului este să previi unde va ateriza o mică bilă pe roată, plasând astfel pariuri pe diferite numere sau grupuri de numere.</p>
                </Col>
                <Col sm={12}><h3>Roata de ruletă</h3></Col>
                <Col sm={12}>
                    <p>Roata de ruletă constă în buzunare numerotate, de la 0 la 36.</p>
                    <p>Numerele sunt colorate alternativ în roșu și negru, iar buzunarul 0 este colorat în verde.</p>
                    <p>Versiunea europeană a ruletei are un singur buzunar 0, în timp ce versiunea americană are un buzunar suplimentar 00.</p>
                </Col>
                <Col sm={12}><h3>Masa de ruletă</h3></Col>
                <Col sm={12}>
                    <p>Masa de ruletă este locul în care jucătorii își plasează pariurile.</p>
                    <p>Are o grilă care reprezintă numerele de pe roată și diverse opțiuni suplimentare de pariere.</p>
                    <p>Masa este împărțită în două secțiuni principale: pariurile interioare și pariurile exterioare.</p>
                </Col>
                <Col sm={12}><h3>Pariuri interioare</h3></Col>
                <Col sm={12}><p>Parierea pe un singur număr prin plasarea unui jetoane direct pe acel număr</p></Col>
                <Col sm={12}><h3>Pariuri exterioare</h3></Col>
                <Col sm={12}>
                    <p>Pariurile exterioare sunt plasate pe grupuri mai mari de numere sau caracteristici ale numerelor.</p>
                    <p>Iată câteva pariuri exterioare comune:</p>
                    <ul>
                        <li>Roșu/Negru: Parierea că bila va ateriza pe un număr roșu sau negru.</li>
                        <li>Par/Impar: Parierea că bila va ateriza pe un număr par sau impar.</li>
                        <li>Mic/Mare: Parierea că bila va ateriza pe un număr mic (1-18) sau mare (19-36).</li>
                        <li>Pariu pe dozenă: Parierea pe un grup de 12 numere prin plasarea unui jetoane pe secțiunile "1st 12", "2nd 12" sau "3rd 12" de pe masă.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Învârtirea roții</h3></Col>
                <Col sm={12}>
                    <p>După faza de pariere, crupierul (angajatul cazinoului responsabil de joc) va învârti roata de ruletă într-o direcție și va elibera o mică bilă în direcția opusă. Pe măsură ce roata încetinește, bila va ajunge în cele din urmă într-unul dintre buzunarele numerotate.</p>
                </Col>
                <Col sm={12}><h3>Câștig și pierdere</h3></Col>
                <Col sm={12}>
                    <p>Dacă bila aterizează pe un număr sau un grup de numere pe care ai pariat, vei câștiga un câștig corespunzător în funcție de cotele respectivei pariuri.</p>
                </Col>
                <Col sm={12}><h3>Câștiguri</h3></Col>
                <Col sm={12}>
                    <p>Câștigurile variază în funcție de tipul de pariu plasat. Pariurile simple, de exemplu, au câștiguri mai mari deoarece sunt mai riscuri.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default RouletteRo