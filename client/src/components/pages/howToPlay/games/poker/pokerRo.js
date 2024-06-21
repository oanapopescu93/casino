import React from 'react'
import { Col, Row } from 'react-bootstrap'

function PokerRo(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introducere</h3></Col>
                <Col sm={12}>
                    <p>Pokerul este un joc popular de cărți jucat cu un pachet standard de 52 de cărți.</p>
                    <p>Scopul jocului este de a câștiga potul, care este suma de bani sau jetoane contribuită de jucători.</p>
                </Col>
                <Col sm={12}><h3>Ierarhia Mâinilor</h3></Col>
                <Col sm={12}>
                    <p>Familiarizează-te cu ierarhia mâinilor în poker, de la cea mai mare la cea mai mică:</p>
                    <ul>
                        <li>Culoare Regală: A, K, Q, J, 10 de aceeași culoare.</li>
                        <li>Culoare Curată: Cinci cărți consecutive de aceeași culoare.</li>
                        <li>Chintă: Patru cărți de aceeași valoare.</li>
                        <li>Full: Trei cărți de aceeași valoare plus o pereche.</li>
                        <li>Culoare: Cinci cărți de aceeași culoare.</li>
                        <li>Suită: Cinci cărți consecutive de orice culoare.</li>
                        <li>Set: Trei cărți de aceeași valoare.</li>
                        <li>Doi Pari: Două perechi de cărți de aceeași valoare.</li>
                        <li>Pereche: Două cărți de aceeași valoare.</li>
                        <li>Carte Mare: Cea mai înaltă carte din mână.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Runde de Pariază</h3></Col>
                <Col sm={12}>
                    <p>Pokerul implică în mod obișnuit mai multe runde de pariere, în care jucătorii plasează pariuri în funcție de puterea mâinii lor sau de strategia de bluff.</p>
                    <p>Tipurile cele mai comune de jocuri de poker includ Texas Hold'em, Omaha, Seven-Card Stud și Five-Card Draw.</p>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Poker Texas Hold'em</h2></Col>
                        <Col sm={12}><h3>Introducere</h3></Col>
                        <Col sm={12}>
                            <p>Fiecare jucător primește două cărți private (cărți proprii), iar cinci cărți comune sunt așezate cu fața în sus pe masă.</p>
                            <p>Jocul constă în patru runde de pariere: pre-flop, flop, turn și river.</p>
                        </Col>
                        <Col sm={12}><h3>Pre-Flop</h3></Col>
                        <Col sm={12}>
                            <p>După primirea cărților proprii, începe prima rundă de pariere.</p>
                            <p>Jucătorii pot alege să renunțe (să-și arunce cărțile), să facă call (să egaleze pariu curent) sau să facă raise (să mărească pariu).</p>
                        </Col>
                        <Col sm={12}><h3>Flop</h3></Col>
                        <Col sm={12}>
                            <p>După runda de pariere pre-flop, trei cărți comune sunt așezate cu fața în sus pe masă. Aceasta se numește flop.</p>
                            <p>O altă rundă de pariere are loc, începând cu jucătorul din stânga dealerului.</p>
                        </Col>
                        <Col sm={12}><h3>Turn</h3></Col>
                        <Col sm={12}>
                            <p>După flop, o a patra carte comună este așezată cu fața în sus pe masă. Aceasta se numește turn.</p>
                            <p>O altă rundă de pariere are loc.</p>
                        </Col>
                        <Col sm={12}><h3>River</h3></Col>
                        <Col sm={12}>
                            <p>După turn, o a cincea și ultima carte comună este așezată cu fața în sus pe masă. Aceasta se numește river.</p>
                            <p>Ultima rundă de pariere are loc.</p>
                        </Col>
                        <Col sm={12}><h3>Showdown</h3></Col>
                        <Col sm={12}>
                            <p>Dacă rămân doi sau mai mulți jucători după ultima rundă de pariere, are loc showdown-ul.</p>
                            <p>Jucătorii își arată cărțile proprii, iar jucătorul cu cea mai bună mână câștigă potul.</p>
                            <p>În caz de egalitate, potul este împărțit în mod egal între jucătorii câștigători.</p>
                        </Col>
                    </Row>
                </Col>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Poker Cinci Carti Trase</h2></Col>
                        <Col sm={12}><h3>Introducere</h3></Col>
                        <Col sm={12}>
                            <p>Pokerul Cinci Carti Trase este o formă clasică și simplă de poker.</p>
                            <p>Scopul jocului este să alcătuiți cea mai bună mână de cinci cărți utilizând o combinație de cărțile din mâna voastră și cele de pe masă.</p>
                        </Col>
                        <Col sm={12}><h3>Impartirea cărților</h3></Col>
                        <Col sm={12}>
                            <p>Fiecare jucător primește cinci cărți personale cu fața în jos.</p>
                            <p>De obicei, pariurile încep cu jucătorul din stânga dealerului.</p>
                        </Col>
                        <Col sm={12}><h3>Prima rundă de pariere</h3></Col>
                        <Col sm={12}>
                            <p>Prima rundă de pariere începe cu jucătorul din stânga dealerului.</p>
                            <p>Jucătorii pot decide să renunțe (să arunce cărțile și să iasă din mână), să egaleze (să plaseze un pariu egal cu pariul curent) sau să mărească (să crească pariul).</p>
                        </Col>
                        <Col sm={12}><h3>Faza de schimbare a cărților</h3></Col>
                        <Col sm={12}>
                            <p>După prima rundă de pariere, jucătorii au opțiunea de a schimba unele sau toate cărțile lor cu altele noi.</p>
                            <p>Pornind de la jucătorul din stânga dealerului, fiecare jucător poate renunța la orice număr de cărți și poate primi un număr egal de cărți noi din pachet.</p>
                            <p>În majoritatea jocurilor, cărțile abandonate sunt așezate cu fața în jos, iar cărțile noi sunt distribuite, de asemenea, cu fața în jos.</p>
                        </Col>
                        <Col sm={12}><h3>A doua rundă de pariere</h3></Col>
                        <Col sm={12}>
                            <p>După faza de schimbare a cărților, urmează a doua rundă de pariere.</p>
                            <p>Parierile încep cu jucătorul din stânga dealerului, iar jucătorii pot decide să renunțe, să egaleze sau să mărească pariul în funcție de puterea mâinii lor.</p>
                        </Col>
                        <Col sm={12}><h3>Showdown</h3></Col>
                        <Col sm={12}>
                            <p>Dacă rămân doi sau mai mulți jucători după a doua rundă de pariere, are loc o confruntare.</p>
                            <p>Jucătorii rămași își dezvăluie cărțile, începând cu jucătorul care a făcut ultima pariere sau mărire.</p>
                            <p>Jucătorul cu cea mai bună mână de cinci cărți câștigă potul.</p>
                            <p>Ierarhia mâinilor urmează regulile standard de poker, cu Chinta Roială fiind cea mai valoroasă mână și Cartea Mare cea mai puțin valoroasă.</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default PokerRo