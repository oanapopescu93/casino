import React from 'react'
import { Col, Row } from 'react-bootstrap'

function CrapsEs(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introducción</h3></Col>
                <Col sm={12}>
                    <p>Craps es un juego de dados que se juega con dos dados, generalmente en una mesa especializada en un casino.</p>
                    <p>El objetivo del juego es predecir el resultado de los lanzamientos de los dados y realizar apuestas en consecuencia.</p>
                </Col>
                <Col sm={12}><h3>La Apuesta Pass Line</h3></Col>
                <Col sm={12}>
                    <p>La apuesta más común en craps es la apuesta "Pass Line". Se realiza antes del lanzamiento inicial de los dados.</p>
                    <p>Para hacer una apuesta Pass Line, coloca tus fichas en el área "Pass Line" de la mesa de craps.</p>
                </Col>
                <Col sm={12}><h3>El Lanzamiento Inicial</h3></Col>
                <Col sm={12}>
                    <p>El juego comienza con el tirador (la persona que lanza los dados) realizando el lanzamiento inicial.</p>
                    <p>Si el lanzamiento inicial es un 7 o 11, las apuestas Pass Line ganan y se paga el mismo dinero a quienes las realizaron.</p>
                    <p>Si el lanzamiento inicial es un 2, 3 o 12, las apuestas Pass Line pierden y quienes las realizaron pierden sus fichas.</p>
                </Col>
                <Col sm={12}><h3>Número Punto</h3></Col>
                <Col sm={12}>
                    <p>Si el lanzamiento inicial es un 4, 5, 6, 8, 9 o 10, ese número se convierte en el "punto".</p>
                    <p>El crupier colocará un marcador llamado "marcador de punto" en la mesa para indicar el punto establecido.</p>
                </Col>
                <Col sm={12}><h3>Continuación del Juego</h3></Col>
                <Col sm={12}>
                    <p>Después de establecer el punto, el tirador continúa lanzando los dados hasta que ocurra una de dos situaciones: se vuelve a lanzar el punto (las apuestas Pass Line ganan) o se lanza un 7 (las apuestas Pass Line pierden).</p>
                    <p>El tirador sigue lanzando los dados hasta que se logre una de estas situaciones, momento en el que la siguiente persona se convierte en el tirador.</p>
                </Col>
                <Col sm={12}><h3>Opciones de Apuesta</h3></Col>
                <Col sm={12}>
                    <p>Además de la apuesta Pass Line, hay muchas otras opciones de apuesta en craps:</p>
                    <ul>
                        <li>Apuesta Come: Similar a la apuesta Pass Line, pero se realiza después de establecer el punto.</li>
                        <li>Apuesta Don't Pass Line: Contraria a la apuesta Pass Line. Gana con 2 o 3, pierde con 7 u 11, y empata con 12. Si se establece un punto, la apuesta gana si se lanza un 7 antes del punto.</li>
                        <li>Apuesta Don't Come: Similar a la apuesta Don't Pass Line, pero se realiza después de establecer el punto.</li>
                        <li>Apuestas Place: Apuesta a números específicos (4, 5, 6, 8, 9 o 10) para que se lancen antes de un 7.</li>
                        <li>Apuesta Field: Apuesta a que se lanzará un 2, 3, 4, 9, 10, 11 o 12 en el próximo lanzamiento.</li>
                        <li>Apuestas Proposition: Apuestas de un solo lanzamiento en resultados específicos (por ejemplo, un número o combinación específicos) con pagos altos pero mayor ventaja para la casa.</li>
                    </ul>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default CrapsEs