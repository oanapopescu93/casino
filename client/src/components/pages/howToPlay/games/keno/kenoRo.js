import React from 'react'
import { Col, Row } from 'react-bootstrap'

function KenoEng(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introducere</h3></Col>
                <Col sm={12}>
                    <p>Keno este un joc de tip loterie jucat în multe cazinouri și platforme online.</p>
                    <p>Scopul jocului este de a selecta numere dintr-un grup și de a le potrivi cu numerele extrase de aparatul Keno.</p>
                </Col>
                <Col sm={12}><h3>Bilet Keno</h3></Col>
                <Col sm={12}>
                    <p>Pentru a juca Keno, începeți prin obținerea unui bilet Keno. Biletul conține o grilă de numere de la 1 la 80.</p>
                    <p>De obicei, puteți alege câte numere doriți să jucați (în mod obișnuit de la 1 la 20), iar plata dumneavoastră depinde de numărul de numere selectate.</p>
                </Col>
                <Col sm={12}><h3>Selectarea numerelor</h3></Col>
                <Col sm={12}>
                    <p>Pe biletul Keno, marcați sau selectați numerele pe care doriți să le jucați prin încercuirea sau evidențierea acestora.</p>
                    <p>Numărul de selecții pe care le puteți face depinde de regulile specifice ale jocului Keno pe care îl jucați.</p>
                </Col>
                <Col sm={12}><h3>Alegerea mizei</h3></Col>
                <Col sm={12}>
                    <p>Decideți suma de bani pe care doriți să o pariați pe biletul Keno.</p>
                    <p>Plata pentru numerele potrivite depinde de suma pariată.</p>
                </Col>
                <Col sm={12}><h3>Număr de extrageri</h3></Col>
                <Col sm={12}>
                    <p>Stabiliți câte jocuri sau extrageri consecutive doriți să jucați cu același bilet. De obicei, puteți alege să jucați un singur joc sau mai multe jocuri la rând.</p>
                </Col>
                <Col sm={12}><h3>Potrivirea numerelor și plățile</h3></Col>
                <Col sm={12}>
                    <p>Pe măsură ce numerele sunt extrase, comparați-le cu numerele selectate pe biletul Keno.</p>
                    <p>Cu cât potriviți mai multe numere, cu atât va fi mai mare plata dumneavoastră, în funcție de tabela specifică de plăți pentru jocul pe care îl jucați.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default KenoEng