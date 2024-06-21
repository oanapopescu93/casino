import React from 'react'
import { Col, Row } from 'react-bootstrap'

function KenoEs(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introducción</h3></Col>
                <Col sm={12}>
                    <p>Keno es un juego de lotería que se juega en muchos casinos y plataformas en línea.</p>
                    <p>El objetivo del juego es seleccionar números de un conjunto y coincidirlos con los números extraídos por la máquina de Keno.</p>
                </Col>
                <Col sm={12}><h3>Boleto de Keno</h3></Col>
                <Col sm={12}>
                    <p>Para jugar al Keno, comienza obteniendo un boleto de Keno. El boleto contiene una cuadrícula de números del 1 al 80.</p>
                    <p>Por lo general, puedes elegir cuántos números quieres jugar (generalmente de 1 a 20), y tu pago dependerá de cuántos números selecciones.</p>
                </Col>
                <Col sm={12}><h3>Selección de Números</h3></Col>
                <Col sm={12}>
                    <p>En el boleto de Keno, marca o selecciona los números que deseas jugar circulándolos o resaltándolos.</p>
                    <p>La cantidad de selecciones que puedes hacer depende de las reglas específicas del juego de Keno que estés jugando.</p>
                </Col>
                <Col sm={12}><h3>Elección de la Apuesta</h3></Col>
                <Col sm={12}>
                    <p>Decide la cantidad de dinero que deseas apostar en tu boleto de Keno.</p>
                    <p>El pago por acertar números dependerá de la cantidad apostada.</p>
                </Col>
                <Col sm={12}><h3>Número de Extracciones</h3></Col>
                <Col sm={12}>
                    <p>Determina cuántos juegos o extracciones consecutivas deseas jugar con el mismo boleto. Por lo general, puedes elegir jugar un solo juego o varios juegos seguidos.</p>
                </Col>
                <Col sm={12}><h3>Correspondencia de Números y Pagos</h3></Col>
                <Col sm={12}>
                    <p>A medida que se extraen los números, compáralos con los números que seleccionaste en tu boleto de Keno.</p>
                    <p>Cuanto más números coincidas, mayor será tu pago, según la tabla de pagos específica del juego que estés jugando.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default KenoEs