import React from 'react'
import { Col, Row } from 'react-bootstrap'

function RoulettePt(){
    return  <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introdução</h3></Col>
                <Col sm={12}>
                    <p>A roleta é um jogo popular de cassino que é jogado em uma roda giratória.</p>
                    <p>O objetivo do jogo é prever onde uma pequena bola irá pousar na roda, colocando assim apostas em diferentes números ou grupos de números.</p>
                </Col>
                <Col sm={12}><h3>A Roda da Roleta</h3></Col>
                <Col sm={12}>
                    <p>A roda da roleta consiste em bolsos numerados, variando de 0 a 36.</p>
                    <p>Os números são alternadamente coloridos em vermelho e preto, com o bolso 0 colorido em verde.</p>
                    <p>A versão europeia da roleta tem um único bolso 0, enquanto a versão americana tem um bolso adicional 00.</p>
                </Col>
                <Col sm={12}><h3>A Mesa de Roleta</h3></Col>
                <Col sm={12}>
                    <p>A mesa de roleta é onde os jogadores fazem suas apostas.</p>
                    <p>Ela apresenta uma grade que representa os números na roda e várias opções de apostas adicionais.</p>
                    <p>A mesa é dividida em duas seções principais: as apostas internas e as apostas externas.</p>
                </Col>
                <Col sm={12}><h3>Apostas Internas</h3></Col>
                <Col sm={12}><p>Apostar em um único número colocando uma ficha diretamente naquele número</p></Col>
                <Col sm={12}><h3>Apostas Externas</h3></Col>
                <Col sm={12}>
                    <p>As apostas externas são feitas em grupos maiores de números ou características dos números.</p> 
                    <p>Aqui estão algumas apostas externas comuns:</p>
                    <ul>
                        <li>Vermelho/Preto: Apostar se a bola vai cair em um número vermelho ou preto.</li>
                        <li>Par/Ímpar: Apostar se a bola vai cair em um número par ou ímpar.</li>
                        <li>Baixo/Alto: Apostar se a bola vai cair em um número baixo (1-18) ou alto (19-36).</li>
                        <li>Aposta por dúzia: Apostar em um grupo de 12 números colocando uma ficha nas seções "1ª 12", "2ª 12" ou "3ª 12" da mesa.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Girando a Roda</h3></Col>
                <Col sm={12}>
                    <p>Após a fase de apostas, o croupier (o funcionário do cassino responsável pelo jogo) girará a roda da roleta em uma direção e soltará uma pequena bola na direção oposta. À medida que a roda diminui a velocidade, a bola eventualmente se estabilizará em um dos bolsos numerados.</p>
                </Col>
                <Col sm={12}><h3>Vencendo e Perdendo</h3></Col>
                <Col sm={12}>
                    <p>Se a bola cair em um número ou grupo de números em que você apostou, você ganha um pagamento correspondente com base nas probabilidades dessa aposta específica.</p>
                </Col>
                <Col sm={12}><h3>Pagamentos</h3></Col>
                <Col sm={12}>
                    <p>Os pagamentos variam dependendo do tipo de aposta feita. Apostas diretas, por exemplo, têm pagamentos mais altos, pois são mais arriscadas.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default RoulettePt