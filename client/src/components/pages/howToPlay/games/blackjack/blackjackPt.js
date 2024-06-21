import React from 'react'
import { Col, Row } from 'react-bootstrap'

function BlackjackPt(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introdução</h3></Col>
                <Col sm={12}>
                    <p>O Blackjack é um jogo de cartas popular jogado em cassinos, onde o objetivo é ter uma mão com um total mais próximo de 21 do que a mão do dealer, sem exceder 21.</p>
                    <p>O jogo é jogado com um ou mais baralhos padrão de 52 cartas.</p>
                </Col>
                <Col sm={12}><h3>Valores das Cartas</h3></Col>
                <Col sm={12}>
                    <p>No blackjack, as cartas numeradas (2-10) valem o valor de sua face.</p>
                    <p>As cartas com figuras (Rei, Rainha e Valete) valem 10.</p>
                    <p>O Ás pode ser contado como 1 ou 11, dependendo de qual valor beneficia mais a mão.</p>
                </Col>
                <Col sm={12}><h3>Mecânica do Jogo</h3></Col>
                <Col sm={12}>
                    <p>O jogo começa com cada jogador fazendo suas apostas na área designada à sua frente na mesa de blackjack.</p>
                    <p>O dealer então distribui duas cartas viradas para cima para cada jogador e uma carta virada para cima para si mesmo. A segunda carta do dealer é distribuída virada para baixo (carta oculta).</p>
                </Col>
                <Col sm={12}><h3>Opções do Jogador</h3></Col>
                <Col sm={12}>
                    <p>O turno do jogador vem primeiro e eles têm várias opções para escolher, dependendo de sua mão:</p>
                    <ul>
                        <li>Hit: O jogador solicita uma carta adicional ser distribuída. O jogador pode solicitar múltiplos hits até que estejam satisfeitos com sua mão ou até ultrapassarem 21, resultando em uma busta.</li>
                        <li>Stand: O jogador decide manter sua mão atual e encerrar seu turno, passando a ação para o próximo jogador ou para o dealer.</li>
                        <li>Double Down: O jogador dobra sua aposta original e recebe apenas uma carta adicional. Essa opção geralmente está disponível quando a mão inicial do jogador totaliza 9, 10 ou 11.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Turno do Dealer</h3></Col>
                <Col sm={12}>
                    <p>Depois que todos os jogadores terminam seus turnos, o dealer revela sua carta oculta.</p>
                    <p>Se a soma da mão do dealer for 16 ou menos, ele deve pedir cartas adicionais e continuar distribuindo até que sua mão totalize 17 ou mais.</p>
                    <p>Se a soma da mão do dealer exceder 21, todos os jogadores restantes ganham.</p>
                    <p>Se a soma da mão do dealer não exceder 21, sua mão é comparada com a mão de cada jogador para determinar os vencedores.</p>
                </Col>
                <Col sm={12}><h3>Blackjack</h3></Col>
                <Col sm={12}>
                    <p>Se um jogador ou dealer receber um Ás e uma carta com valor de 10 (10, Valete, Rainha ou Rei) como suas duas primeiras cartas, é chamado de blackjack.</p>
                    <p>Um blackjack é uma vitória automática para o jogador, pagando 3:2, a menos que o dealer também tenha um blackjack, resultando em um empurrão.</p>
                </Col>
                <Col sm={12}><h3>Determinando o Resultado</h3></Col>
                <Col sm={12}>
                    <p>Se o total da mão do jogador for maior do que o do dealer, sem ultrapassar 21, o jogador vence e recebe um pagamento de 1:1.</p>
                    <p>Se o total da mão do jogador for menor do que o do dealer, o jogador perde sua aposta.</p>
                    <p>Se o total da mão do jogador e do dealer for o mesmo (empate), a aposta é devolvida ao jogador.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default BlackjackPt