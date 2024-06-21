import React from 'react'
import { Col, Row } from 'react-bootstrap'

function PokerPt(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introdução</h3></Col>
                <Col sm={12}>
                    <p>O Poker é um jogo de cartas popular jogado com um baralho padrão de 52 cartas.</p>
                    <p>O objetivo do jogo é ganhar o pote, que é a soma de dinheiro ou fichas contribuídas pelos jogadores.</p>
                </Col>
                <Col sm={12}><h3>Classificação das Mãos</h3></Col>
                <Col sm={12}>
                    <p>Familiarize-se com a classificação das mãos no poker, da mais alta para a mais baixa:</p>
                    <ul>
                        <li>Sequência Real: A, K, Q, J, 10 do mesmo naipe.</li>
                        <li>Sequência de Cor: Cinco cartas consecutivas do mesmo naipe.</li>
                        <li>Quadra: Quatro cartas do mesmo valor.</li>
                        <li>Full House: Três cartas do mesmo valor mais um par.</li>
                        <li>Flush: Cinco cartas do mesmo naipe.</li>
                        <li>Sequência: Cinco cartas consecutivas de qualquer naipe.</li>
                        <li>Trinca: Três cartas do mesmo valor.</li>
                        <li>Dois Pares: Dois pares de cartas do mesmo valor.</li>
                        <li>Um Par: Duas cartas do mesmo valor.</li>
                        <li>Carta Alta: A carta de maior valor na sua mão.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Rodadas de Apostas</h3></Col>
                <Col sm={12}>
                    <p>O Poker geralmente envolve múltiplas rodadas de apostas, onde os jogadores fazem apostas com base na força de suas mãos ou em sua estratégia de blefe.</p>
                    <p>Os tipos mais comuns de jogos de poker incluem Texas Hold'em, Omaha, Seven-Card Stud e Five-Card Draw.</p>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Poker Texas Hold'em</h2></Col>
                        <Col sm={12}><h3>Introdução</h3></Col>
                        <Col sm={12}>
                            <p>Cada jogador recebe duas cartas privadas (cartas fechadas), e cinco cartas comunitárias são colocadas com a face para cima na mesa.</p>
                            <p>O jogo consiste em quatro rodadas de apostas: pré-flop, flop, turn e river.</p>
                        </Col>
                        <Col sm={12}><h3>Pré-Flop</h3></Col>
                        <Col sm={12}>
                            <p>Após receber suas cartas fechadas, a primeira rodada de apostas começa.</p>
                            <p>Os jogadores podem escolher desistir (descartar suas cartas), pagar (igualar a aposta atual) ou aumentar (aumentar a aposta).</p>
                        </Col>
                        <Col sm={12}><h3>Flop</h3></Col>
                        <Col sm={12}>
                            <p>Após a rodada de apostas pré-flop, três cartas comunitárias são distribuídas com a face para cima na mesa. Isso é chamado de flop.</p>
                            <p>Outra rodada de apostas ocorre, começando pelo jogador à esquerda do dealer.</p>
                        </Col>
                        <Col sm={12}><h3>Turn</h3></Col>
                        <Col sm={12}>
                            <p>Após o flop, uma quarta carta comunitária é distribuída com a face para cima na mesa. Isso é chamado de turn.</p>
                            <p>Outra rodada de apostas ocorre.</p>
                        </Col>
                        <Col sm={12}><h3>River</h3></Col>
                        <Col sm={12}>
                            <p>Após o turn, uma quinta e última carta comunitária é distribuída com a face para cima na mesa. Isso é chamado de river.</p>
                            <p>A última rodada de apostas ocorre.</p>
                        </Col>
                        <Col sm={12}><h3>Showdown</h3></Col>
                        <Col sm={12}>
                            <p>Se houver dois ou mais jogadores restantes após a última rodada de apostas, ocorre um showdown.</p>
                            <p>Os jogadores revelam suas cartas fechadas, e o jogador com a mão de maior classificação ganha o pote.</p>
                            <p>Em caso de empate, o pote é dividido igualmente entre os jogadores vencedores.</p>
                        </Col>
                    </Row>
                </Col>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Poker Five Card Draw</h2></Col>
                        <Col sm={12}><h3>Introdução</h3></Col>
                        <Col sm={12}>
                            <p>O Five Card Draw é uma forma clássica e direta de poker.</p>
                            <p>O objetivo do jogo é formar a melhor mão de cinco cartas usando uma combinação das cartas na sua mão e aquelas na mesa.</p>
                        </Col>
                        <Col sm={12}><h3>A Distribuição</h3></Col>
                        <Col sm={12}>
                            <p>Cada jogador recebe cinco cartas privadas com a face para baixo.</p>
                            <p>As apostas geralmente começam com o jogador à esquerda do dealer.</p>
                        </Col>
                        <Col sm={12}><h3>Primeira Rodada de Apostas</h3></Col>
                        <Col sm={12}>
                            <p>A primeira rodada de apostas começa com o jogador à esquerda do dealer.</p>
                            <p>Os jogadores podem optar por desistir (descartar suas cartas e sair da mão), pagar (igualar a aposta atual) ou aumentar (aumentar a aposta).</p>
                        </Col>
                        <Col sm={12}><h3>Fase de Descarte</h3></Col>
                        <Col sm={12}>
                            <p>Após a primeira rodada de apostas, os jogadores têm a opção de trocar algumas ou todas as suas cartas por novas.</p>
                            <p>Começando pelo jogador à esquerda do dealer, cada jogador pode descartar qualquer número de suas cartas e receber um número igual de cartas de substituição do baralho.</p>
                            <p>Na maioria dos jogos, as cartas descartadas são colocadas com a face para baixo, e as cartas de substituição são distribuídas também com a face para baixo.</p>
                        </Col>
                        <Col sm={12}><h3>Segunda Rodada de Apostas</h3></Col>
                        <Col sm={12}>
                            <p>Após a fase de descarte, ocorre uma segunda rodada de apostas.</p>
                            <p>As apostas começam com o jogador à esquerda do dealer, e os jogadores podem optar por desistir, pagar ou aumentar com base na força de suas mãos.</p>
                        </Col>
                        <Col sm={12}><h3>Showdown</h3></Col>
                        <Col sm={12}>
                            <p>Se houver dois ou mais jogadores restantes após a segunda rodada de apostas, ocorre um showdown.</p>
                            <p>Os jogadores restantes revelam suas mãos, começando pelo jogador que fez a última aposta ou aumento.</p>
                            <p>O jogador com a melhor mão de cinco cartas ganha o pote.</p>
                            <p>As classificações de mãos seguem as regras padrão do poker, com a Sequência Real sendo a mão de classificação mais alta e o Carta Alta sendo a mão de classificação mais baixa.</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default PokerPt