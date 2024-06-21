import React from 'react'
import { Col, Row } from 'react-bootstrap'

function RaceEs(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introducción</h3></Col>
                <Col sm={12}>
                    <p>Las apuestas en carreras implican apostar dinero en el resultado de la carrera.</p>
                    <p>El objetivo es predecir qué animal ganará o se ubicará en una carrera específica.</p>
                </Col>
                <Col sm={12}><h3>Tipos de Apuestas</h3></Col>
                <Col sm={12}>
                    <ul>
                        <li>Ganador: Apostar a un animal específico para que termine en primer lugar.</li>
                        <li>Lugar: Apostar a un animal para que termine en las primeras dos o tres posiciones, según las reglas específicas.</li>
                        <li>Cada Vuelta: Una combinación de apuestas de Ganador y Lugar. Si tu selección gana, ganas tanto la apuesta de Ganador como la de Lugar. Si tu selección se ubica, solo ganas la apuesta de Lugar.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Entendiendo las Probabilidades</h3></Col>
                <Col sm={12}>
                    <p>Las probabilidades representan el pago que puedes esperar si tu apuesta tiene éxito.</p>
                    <p>Las probabilidades pueden mostrarse en diferentes formatos, como fraccionarias (por ejemplo, 5/1), decimales (por ejemplo, 6.0) o de dinero (por ejemplo, +500).</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}
export default RaceEs