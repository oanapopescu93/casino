import React from 'react'
import { Col, Row } from 'react-bootstrap'

function RouletteEs(){
    return  <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introducción</h3></Col>
                <Col sm={12}>
                    <p>La ruleta es un juego popular de casino que se juega en una rueda giratoria.</p>
                    <p>El objetivo del juego es predecir dónde caerá una pequeña bola en la rueda, realizando apuestas en diferentes números o grupos de números.</p>
                </Col>
                <Col sm={12}><h3>La Rueda de la Ruleta</h3></Col>
                <Col sm={12}>
                    <p>La rueda de la ruleta consta de bolsillos numerados del 0 al 36.</p>
                    <p>Los números están alternativamente coloreados en rojo y negro, y el bolsillo 0 está coloreado en verde.</p>
                    <p>La versión europea de la ruleta tiene un solo bolsillo 0, mientras que la versión americana tiene un bolsillo adicional 00.</p>
                </Col>
                <Col sm={12}><h3>La Mesa de la Ruleta</h3></Col>
                <Col sm={12}>
                    <p>La mesa de la ruleta es donde los jugadores realizan sus apuestas.</p>
                    <p>Cuenta con una cuadrícula que representa los números de la rueda y varias opciones de apuestas adicionales.</p>
                    <p>La mesa se divide en dos secciones principales: las apuestas internas y las apuestas externas.</p>
                </Col>
                <Col sm={12}><h3>Apuestas Internas</h3></Col>
                <Col sm={12}><p>Apostar a un solo número colocando una ficha directamente en ese número</p></Col>
                <Col sm={12}><h3>Apuestas Externas</h3></Col>
                <Col sm={12}>
                    <p>Las apuestas externas se realizan en grupos más grandes de números o características de los números.</p> 
                    <p>Aquí hay algunas apuestas externas comunes:</p>
                    <ul>
                        <li>Rojo/Negro: Apostar a que la bola caerá en un número rojo o negro.</li>
                        <li>Par/Impar: Apostar a que la bola caerá en un número par o impar.</li>
                        <li>Bajo/Alto: Apostar a que la bola caerá en un número bajo (1-18) o alto (19-36).</li>
                        <li>Apuesta por Docena: Apostar a un grupo de 12 números colocando una ficha en las secciones "1ª 12", "2ª 12" o "3ª 12" de la mesa.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Girar la Rueda</h3></Col>
                <Col sm={12}>
                    <p>Después de la fase de apuestas, el crupier (el empleado del casino a cargo del juego) hará girar la rueda de la ruleta en una dirección y soltará una pequeña bola en dirección opuesta. A medida que la rueda se desacelera, la bola finalmente se detendrá en uno de los bolsillos numerados.</p>
                </Col>
                <Col sm={12}><h3>Ganar y Perder</h3></Col>
                <Col sm={12}>
                    <p>Si la bola cae en un número o grupo de números en los que has apostado, ganas un pago correspondiente basado en las probabilidades de esa apuesta en particular.</p>
                </Col>
                <Col sm={12}><h3>Pagos</h3></Col>
                <Col sm={12}>
                    <p>Los pagos varían según el tipo de apuesta realizada. Las apuestas directas, por ejemplo, tienen pagos más altos ya que son más arriesgadas.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default RouletteEs