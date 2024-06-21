import React from 'react'
import { Col, Row } from 'react-bootstrap'

function CrapsPt(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introdução</h3></Col>
                <Col sm={12}>
                    <p>O Craps é um jogo de dados jogado com dois dados, geralmente em uma mesa especializada em um cassino.</p>
                    <p>O objetivo do jogo é prever o resultado dos lançamentos dos dados e fazer apostas de acordo.</p>
                </Col>
                <Col sm={12}><h3>A Aposta da Linha Pass</h3></Col>
                <Col sm={12}>
                    <p>A aposta mais comum no craps é a aposta da "Linha Pass". É feita antes do lançamento inicial dos dados (o primeiro lançamento dos dados).</p>
                    <p>Para fazer uma aposta da Linha Pass, coloque suas fichas na área da "Linha Pass" na mesa de craps.</p>
                </Col>
                <Col sm={12}><h3>O Lançamento Inicial</h3></Col>
                <Col sm={12}>
                    <p>O jogo começa com o atirador (a pessoa que lança os dados) fazendo o lançamento inicial.</p>
                    <p>Se o lançamento inicial for um 7 ou 11, as apostas da Linha Pass ganham, e aqueles que as fizeram recebem dinheiro igual.</p>
                    <p>Se o lançamento inicial for um 2, 3 ou 12, as apostas da Linha Pass perdem, e aqueles que as fizeram perdem suas fichas.</p>
                </Col>
                <Col sm={12}><h3>Número Ponto</h3></Col>
                <Col sm={12}>
                    <p>Se o lançamento inicial for um 4, 5, 6, 8, 9 ou 10, esse número se torna o "ponto".</p>
                    <p>O crupiê colocará um marcador chamado "marcador de ponto" na mesa para indicar o ponto estabelecido.</p>
                </Col>
                <Col sm={12}><h3>Continuando o Jogo</h3></Col>
                <Col sm={12}>
                    <p>Depois que o ponto é estabelecido, o atirador continua a lançar os dados até que um dos dois resultados ocorra: o ponto é lançado novamente (as apostas da Linha Pass ganham) ou um 7 é lançado (as apostas da Linha Pass perdem).</p>
                    <p>O atirador continua lançando até que um desses resultados seja alcançado, momento em que a próxima pessoa se torna o atirador.</p>
                </Col>
                <Col sm={12}><h3>Opções de Apostas</h3></Col>
                <Col sm={12}>
                    <p>Além da aposta da Linha Pass, existem muitas outras opções de apostas no craps.</p>
                    <ul>
                        <li>Aposta Come: Semelhante à aposta da Linha Pass, mas feita após o ponto ser estabelecido.</li>
                        <li>Aposta na Linha Don't Pass: O oposto da aposta da Linha Pass. Ganha com 2 ou 3, perde com 7 ou 11 e empata com 12. Se um ponto for estabelecido, a aposta ganha se um 7 for lançado antes do ponto.</li>
                        <li>Aposta Don't Come: Semelhante à aposta na Linha Don't Pass, mas feita após o ponto ser estabelecido.</li>
                        <li>Apostas Place: Apostar em números específicos (4, 5, 6, 8, 9 ou 10) a serem lançados antes de um 7.</li>
                        <li>Aposta Field: Apostar em 2, 3, 4, 9, 10, 11 ou 12 a serem lançados no próximo lançamento.</li>
                        <li>Apostas de Proposição: Apostas de uma única rodada em resultados específicos (por exemplo, um número ou combinação específicos) com pagamentos altos, mas maior vantagem da casa.</li>
                    </ul>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default CrapsPt