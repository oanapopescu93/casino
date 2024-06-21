import React from 'react'
import { Col, Row } from 'react-bootstrap'

function RacePt(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introdução</h3></Col>
                <Col sm={12}>
                    <p>A aposta em corridas envolve apostar dinheiro no resultado da corrida.</p>
                    <p>O objetivo é prever qual animal vencerá ou ficará em uma posição específica em uma corrida.</p>
                </Col>
                <Col sm={12}><h3>Tipos de Apostas</h3></Col>
                <Col sm={12}>
                    <ul>
                        <li>Vencedor: Apostar em um animal específico para terminar em primeiro lugar.</li>
                        <li>Colocado: Apostar em um animal para terminar nas duas ou três primeiras posições, dependendo das regras específicas.</li>
                        <li>Cada/Vez: Uma combinação de apostas Vencedor e Colocado. Se a sua seleção vencer, você ganha tanto a aposta Vencedor quanto a aposta Colocado. Se a sua seleção ficar em uma posição, você ganha apenas a aposta Colocado.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Entendendo as Odds</h3></Col>
                <Col sm={12}>
                    <p>As odds representam o pagamento que você pode esperar se sua aposta for bem-sucedida.</p>
                    <p>As odds podem ser exibidas em diferentes formatos, como fracionário (por exemplo, 5/1), decimal (por exemplo, 6.0) ou linha de dinheiro (por exemplo, +500).</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}
export default RacePt