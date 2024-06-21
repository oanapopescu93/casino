import React from 'react'
import { Col, Row } from 'react-bootstrap'

function BlackjackEs(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introducción</h3></Col>
                <Col sm={12}>
                    <p>El blackjack es un juego de cartas popular jugado en casinos, donde el objetivo es tener una mano con un valor total más cercano a 21 que la mano del crupier sin pasarse de 21.</p>
                    <p>El juego se juega con una o más barajas estándar de 52 cartas.</p>
                </Col>
                <Col sm={12}><h3>Valores de las Cartas</h3></Col>
                <Col sm={12}>
                    <p>En el blackjack, las cartas numeradas (2-10) valen su valor nominal.</p>
                    <p>Las cartas con figuras (Rey, Reina y Jota) valen 10.</p>
                    <p>El As puede contarse como 1 o 11, dependiendo de qué valor beneficie más a la mano.</p>
                </Col>
                <Col sm={12}><h3>Jugabilidad</h3></Col>
                <Col sm={12}>
                    <p>El juego comienza con cada jugador apostando en el área designada frente a ellos en la mesa de blackjack.</p>
                    <p>Luego, el crupier reparte dos cartas boca arriba a cada jugador y una carta boca arriba para ellos mismos. La segunda carta del crupier se reparte boca abajo (carta tapada).</p>
                </Col>
                <Col sm={12}><h3>Opciones del Jugador</h3></Col>
                <Col sm={12}>
                    <p>El turno del jugador llega primero y tiene varias opciones para elegir, según su mano:</p>
                    <ul>
                        <li>Pedir Carta (Hit): El jugador solicita que se reparta una carta adicional. El jugador puede pedir varias cartas adicionales hasta que esté satisfecho con su mano o hasta que se pase de 21, lo que resulta en una pérdida.</li>
                        <li>Mantenerse (Stand): El jugador decide quedarse con su mano actual y finalizar su turno, pasando la acción al siguiente jugador o al crupier.</li>
                        <li>Doblar la Apuesta (Double Down): El jugador duplica su apuesta original y recibe solo una carta adicional. Esta opción suele estar disponible cuando la mano inicial del jugador suma 9, 10 u 11.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Turno del Crupier</h3></Col>
                <Col sm={12}>
                    <p>Después de que todos los jugadores hayan completado sus turnos, el crupier revela su carta tapada.</p>
                    <p>Si la mano del crupier suma 16 o menos, debe pedir carta y seguir repartiendo cartas hasta que su mano sume 17 o más.</p>
                    <p>Si la mano del crupier supera 21, todos los jugadores restantes ganan.</p>
                    <p>Si la mano del crupier no supera 21, se compara con la mano de cada jugador para determinar los ganadores.</p>
                </Col>
                <Col sm={12}><h3>Blackjack</h3></Col>
                <Col sm={12}>
                    <p>Si a un jugador o al crupier se le reparte un As y una carta con valor de 10 (10, Jota, Reina o Rey) como sus dos primeras cartas, se le llama blackjack.</p>
                    <p>Un blackjack es una victoria automática para el jugador, que paga 3:2 a menos que el crupier también tenga un blackjack, lo que resulta en un empate.</p>
                </Col>
                <Col sm={12}><h3>Determinar el Resultado</h3></Col>
                <Col sm={12}>
                    <p>Si el valor total de la mano del jugador es mayor que el del crupier sin pasarse de 21, el jugador gana y se le paga 1:1.</p>
                    <p>Si el valor total de la mano del jugador es menor que el del crupier, el jugador pierde su apuesta.</p>
                    <p>Si el valor total de la mano del jugador y del crupier es igual (empate), la apuesta se devuelve al jugador.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default BlackjackEs