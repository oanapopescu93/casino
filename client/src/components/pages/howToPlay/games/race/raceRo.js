import React from 'react'
import { Col, Row } from 'react-bootstrap'

function RaceRo(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introducere</h3></Col>
                <Col sm={12}>
                    <p>Parierea pe curse implică parierea de bani pe rezultatul cursei.</p>
                    <p>Scopul este de a prezice ce animal va câștiga sau va obține un loc într-o cursă specifică.</p>
                </Col>
                <Col sm={12}><h3>Tipuri de Pariuri</h3></Col>
                <Col sm={12}>
                    <ul>
                        <li>Câștig: Pariați pe un anumit animal să termine primul.</li>
                        <li>Plasament: Pariați pe un animal să termine în primele două sau trei poziții, în funcție de regulile specifice.</li>
                        <li>Fiecare-Combinație: O combinație de pariuri Câștig și Plasament. Dacă selecția dvs. câștigă, veți câștiga atât pariul de Câștig, cât și cel de Plasament. Dacă selecția dvs. obține un loc, veți câștiga doar pariul de Plasament.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Înțelegerea Cotelor</h3></Col>
                <Col sm={12}>
                    <p>Cotele reprezintă plata pe care o puteți obține în cazul în care pariu dvs. este câștigător.</p>
                    <p>Cotele pot fi afișate în diferite formate, cum ar fi fracționare (de exemplu, 5/1), zecimale (de exemplu, 6,0) sau în format moneyline (de exemplu, +500).</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}
export default RaceRo