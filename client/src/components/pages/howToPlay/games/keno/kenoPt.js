import React from 'react'
import { Col, Row } from 'react-bootstrap'

function KenoPt(){
    return <Row>
    <Col lg={2} />
    <Col lg={8}>
        <Row>
            <Col sm={12}><h3>Introdução</h3></Col>
            <Col sm={12}>
                <p>O Keno é um jogo no estilo de loteria jogado em muitos cassinos e plataformas online.</p>
                <p>O objetivo do jogo é selecionar números de um pool e combiná-los com os números sorteados pela máquina de Keno.</p>
            </Col>
            <Col sm={12}><h3>Bilhete de Keno</h3></Col>
            <Col sm={12}>
                <p>Para jogar Keno, você começa obtendo um bilhete de Keno. O bilhete contém uma grade de números de 1 a 80.</p>
                <p>Geralmente, você pode escolher quantos números deseja jogar (geralmente de 1 a 20), e seu pagamento dependerá de quantos números você selecionar.</p>
            </Col>
            <Col sm={12}><h3>Seleção de Números</h3></Col>
            <Col sm={12}>
                <p>No bilhete de Keno, marque ou selecione os números que deseja jogar circulando-os ou destacando-os.</p>
                <p>O número de seleções que você pode fazer depende das regras específicas do jogo de Keno que você está jogando.</p>
            </Col>
            <Col sm={12}><h3>Escolhendo a Aposta</h3></Col>
            <Col sm={12}>
                <p>Decida a quantia de dinheiro que deseja apostar em seu bilhete de Keno.</p>
                <p>O pagamento por acertar números dependerá do valor da sua aposta.</p>
            </Col>
            <Col sm={12}><h3>Número de Sorteios</h3></Col>
            <Col sm={12}>
                <p>Determine quantos jogos ou sorteios consecutivos você deseja jogar com o mesmo bilhete. Geralmente, você pode escolher jogar um jogo ou vários jogos seguidos.</p>
            </Col>
            <Col sm={12}><h3>Combinação de Números e Pagamentos</h3></Col>
            <Col sm={12}>
                <p>Conforme os números são sorteados, compare-os com os números que você selecionou em seu bilhete de Keno.</p>
                <p>Quanto mais números você acertar, maior será seu pagamento, dependendo da tabela de pagamento específica para o jogo que você está jogando.</p>
            </Col>
        </Row>
    </Col>
    <Col lg={2} />
</Row>
}

export default KenoPt