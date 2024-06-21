import React from 'react'
import { Col, Row } from 'react-bootstrap'

function SlotsPt(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introdução</h3></Col>
                <Col sm={12}>
                    <p>Caça-níqueis, também conhecidos como máquinas caça-níqueis ou máquinas de frutas, são jogos de cassino populares.</p>
                    <p>O objetivo é girar os rolos e combinar símbolos para ganhar prêmios.</p>
                </Col>
                <Col sm={12}><h3>Tipos de Máquinas Caça-Níqueis</h3></Col>
                <Col sm={12}>
                    <p>Há vários tipos de máquinas caça-níqueis, incluindo os caça-níqueis tradicionais de três rolos, os caça-níqueis de vídeo e os caça-níqueis de jackpot progressivo.</p>
                    <p>Os caça-níqueis tradicionais têm três rolos e são mais simples em design, enquanto os caça-níqueis de vídeo têm vários rolos, linhas de pagamento e frequentemente apresentam rodadas de bônus e recursos especiais.</p>
                    <p>Os caça-níqueis de jackpot progressivo oferecem um jackpot que aumenta cada vez que o jogo é jogado até que alguém ganhe o jackpot.</p>
                </Col>
                <Col sm={12}><h3>Como Usar os Caça-Níqueis</h3></Col>
                <Col sm={12}>
                    <p>Antes de jogar, determine a quantia de dinheiro que deseja apostar por giro.</p>
                    <p>Após fazer sua aposta, pressione o botão "Girar".</p>
                    <p>Quando os rolos pararem, os símbolos nas linhas de pagamento são avaliados.</p>
                    <p>Se os símbolos formarem uma combinação vencedora de acordo com a tabela de pagamento do jogo, você ganha um prêmio.</p>
                    <p>A tabela de pagamento exibe as combinações de símbolos e seus pagamentos correspondentes.</p>
                </Col>
                <Col sm={12}><h3>Símbolos Wild e Scatter</h3></Col>
                <Col sm={12}>
                    <p>Muitas máquinas caça-níqueis incluem símbolos especiais como símbolos wild e scatter.</p>
                    <p>Os símbolos wild podem substituir outros símbolos para criar combinações vencedoras, aumentando suas chances de ganhar.</p>
                    <p>Os símbolos scatter frequentemente ativam recursos de bônus, giros grátis ou prêmios adicionais quando um certo número deles aparece nos rolos.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default SlotsPt