import React from 'react'
import { Col, Row } from 'react-bootstrap'

function RaceFr(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduction</h3></Col>
                <Col sm={12}>
                    <p>Les paris hippiques consistent à miser de l'argent sur l'issue de la course.</p>
                    <p>L'objectif est de prédire quel animal terminera en première position ou se placera dans une course spécifique.</p>
                </Col>
                <Col sm={12}><h3>Types de Paris</h3></Col>
                <Col sm={12}>
                    <ul>
                        <li>Gagnant : Miser sur un animal spécifique pour terminer en première position.</li>
                        <li>Placé : Miser sur un animal pour terminer parmi les deux ou trois premières positions, selon les règles spécifiques.</li>
                        <li>Chaque-Way : Une combinaison de paris Gagnant et Placé. Si votre sélection gagne, vous remportez à la fois les paris Gagnant et Placé. Si votre sélection se place, vous remportez uniquement le pari Placé.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Comprendre les Cotes</h3></Col>
                <Col sm={12}>
                    <p>Les cotes représentent le paiement que vous pouvez espérer si votre pari est gagnant.</p>
                    <p>Les cotes peuvent être affichées dans différents formats, tels que fractionnaires (par exemple, 5/1), décimales (par exemple, 6.0) ou en argent (par exemple, +500).</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}
export default RaceFr