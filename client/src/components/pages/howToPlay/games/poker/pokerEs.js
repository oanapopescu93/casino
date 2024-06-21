import React from 'react'
import { Col, Row } from 'react-bootstrap'

function PokerEs(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introducción</h3></Col>
                <Col sm={12}>
                    <p>El póker es un juego de cartas popular que se juega con una baraja estándar de 52 cartas.</p>
                    <p>El objetivo del juego es ganar el bote, que es la suma de dinero o fichas aportadas por los jugadores.</p>
                </Col>
                <Col sm={12}><h3>Clasificación de las Manos</h3></Col>
                <Col sm={12}>
                    <p>Familiarízate con la clasificación de las manos en el póker, de mayor a menor:</p>
                    <ul>
                        <li>Escalera Real: A, K, Q, J, 10 del mismo palo.</li>
                        <li>Escalera de Color: Cinco cartas consecutivas del mismo palo.</li>
                        <li>Póker: Cuatro cartas del mismo valor.</li>
                        <li>Full: Tres cartas del mismo valor más una pareja.</li>
                        <li>Color: Cinco cartas del mismo palo.</li>
                        <li>Escalera: Cinco cartas consecutivas de cualquier palo.</li>
                        <li>Trio: Tres cartas del mismo valor.</li>
                        <li>Doble Pareja: Dos parejas de cartas del mismo valor.</li>
                        <li>Pareja: Dos cartas del mismo valor.</li>
                        <li>Carta Alta: La carta de mayor valor en tu mano.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Rondas de Apuestas</h3></Col>
                <Col sm={12}>
                    <p>El póker generalmente involucra múltiples rondas de apuestas, donde los jugadores realizan apuestas basadas en la fuerza de su mano o su estrategia de farol.</p>
                    <p>Los tipos más comunes de juegos de póker incluyen Texas Hold'em, Omaha, Seven-Card Stud y Five-Card Draw.</p>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Póker Texas Hold'em</h2></Col>
                        <Col sm={12}><h3>Introducción</h3></Col>
                        <Col sm={12}>
                            <p>A cada jugador se le reparten dos cartas privadas (cartas ocultas) y se colocan cinco cartas comunitarias boca arriba en la mesa.</p>
                            <p>El juego consta de cuatro rondas de apuestas: pre-flop, flop, turn y river.</p>
                        </Col>
                        <Col sm={12}><h3>Pre-Flop</h3></Col>
                        <Col sm={12}>
                            <p>Después de recibir tus cartas ocultas, comienza la primera ronda de apuestas.</p>
                            <p>Los jugadores pueden optar por retirarse (descartar sus cartas), igualar (igualar la apuesta actual) o subir (aumentar la apuesta).</p>
                        </Col>
                        <Col sm={12}><h3>Flop</h3></Col>
                        <Col sm={12}>
                            <p>Después de la ronda de apuestas pre-flop, se reparten tres cartas comunitarias boca arriba en la mesa. Esto se llama flop.</p>
                            <p>Se lleva a cabo otra ronda de apuestas, comenzando por el jugador a la izquierda del repartidor.</p>
                        </Col>
                        <Col sm={12}><h3>Turn</h3></Col>
                        <Col sm={12}>
                            <p>Después del flop, se reparte una cuarta carta comunitaria boca arriba en la mesa. Esto se llama turn.</p>
                            <p>Se lleva a cabo otra ronda de apuestas.</p>
                        </Col>
                        <Col sm={12}><h3>River</h3></Col>
                        <Col sm={12}>
                            <p>Después del turn, se reparte una quinta y última carta comunitaria boca arriba en la mesa. Esto se llama river.</p>
                            <p>Se lleva a cabo la última ronda de apuestas.</p>
                        </Col>
                        <Col sm={12}><h3>Showdown</h3></Col>
                        <Col sm={12}>
                            <p>Si hay dos o más jugadores restantes después de la última ronda de apuestas, se produce un enfrentamiento.</p>
                            <p>Los jugadores revelan sus cartas ocultas, y el jugador con la mano de mayor clasificación gana el bote.</p>
                            <p>En caso de un empate, el bote se divide por igual entre los jugadores ganadores.</p>
                        </Col>
                    </Row>
                </Col>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Póker Five Card Draw</h2></Col>
                        <Col sm={12}><h3>Introducción</h3></Col>
                        <Col sm={12}>
                            <p>Five Card Draw es una forma clásica y sencilla de póker.</p>
                            <p>El objetivo del juego es formar la mejor mano de cinco cartas utilizando una combinación de las cartas en tu mano y las de la mesa.</p>
                        </Col>
                        <Col sm={12}><h3>La Distribución</h3></Col>
                        <Col sm={12}>
                            <p>A cada jugador se le reparten cinco cartas privadas boca abajo.</p>
                            <p>Por lo general, las apuestas comienzan con el jugador a la izquierda del repartidor.</p>
                        </Col>
                        <Col sm={12}><h3>Primera Ronda de Apuestas</h3></Col>
                        <Col sm={12}>
                            <p>La primera ronda de apuestas comienza con el jugador a la izquierda del repartidor.</p>
                            <p>Los jugadores pueden optar por retirarse (descartar sus cartas y abandonar la mano), igualar (igualar la apuesta actual) o subir (aumentar la apuesta).</p>
                        </Col>
                        <Col sm={12}><h3>Fase de Cambio</h3></Col>
                        <Col sm={12}>
                            <p>Después de la primera ronda de apuestas, los jugadores tienen la opción de intercambiar algunas o todas sus cartas por otras nuevas.</p>
                            <p>Comenzando por el jugador a la izquierda del repartidor, cada jugador puede descartar cualquier número de sus cartas y recibir un número igual de cartas de reemplazo del mazo.</p>
                            <p>En la mayoría de los juegos, las cartas descartadas se colocan boca abajo, y las cartas de reemplazo se reparten boca abajo también.</p>
                        </Col>
                        <Col sm={12}><h3>Segunda Ronda de Apuestas</h3></Col>
                        <Col sm={12}>
                            <p>Después de la fase de cambio, se lleva a cabo una segunda ronda de apuestas.</p>
                            <p>Las apuestas comienzan con el jugador a la izquierda del repartidor, y los jugadores pueden optar por retirarse, igualar o subir según la fuerza de su mano.</p>
                        </Col>
                        <Col sm={12}><h3>Showdown</h3></Col>
                        <Col sm={12}>
                            <p>Si hay dos o más jugadores restantes después de la segunda ronda de apuestas, se produce un enfrentamiento.</p>
                            <p>Los jugadores restantes revelan sus manos, comenzando por el jugador que realizó la última apuesta o subida.</p>
                            <p>El jugador con la mejor mano de cinco cartas gana el bote.</p>
                            <p>La clasificación de las manos sigue las reglas estándar del póker, siendo la Escalera Real la mano de mayor clasificación y la Carta Alta la de menor clasificación.</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default PokerEs