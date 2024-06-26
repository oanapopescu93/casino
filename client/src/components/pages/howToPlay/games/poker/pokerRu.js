import React from 'react'
import { Col, Row } from 'react-bootstrap'

function PokerRu(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Введение</h3></Col>
                <Col sm={12}>
                    <p>Покер — популярная карточная игра, которая играется стандартной колодой из 52 карт.</p>
                    <p>Цель игры состоит в том, чтобы выиграть банк, который представляет собой сумму денег или фишек, внесенных игроками.</p>
                </Col>
                <Col sm={12}><h3>Ранги Комбинаций</h3></Col>
                <Col sm={12}>
                    <p>Ознакомьтесь с рангами комбинаций в покере, от самой высокой до самой низкой:</p>
                    <ul>
                        <li>Роял Флеш: A, K, Q, J, 10 одной масти.</li>
                        <li>Стрит Флеш: Пять последовательных карт одной масти.</li>
                        <li>Каре: Четыре карты одного достоинства.</li>
                        <li>Фулл Хаус: Три карты одного достоинства плюс пара.</li>
                        <li>Флеш: Пять карт одной масти.</li>
                        <li>Стрит: Пять последовательных карт любой масти.</li>
                        <li>Тройка: Три карты одного достоинства.</li>
                        <li>Две Пары: Две пары карт одного достоинства.</li>
                        <li>Одна Пара: Две карты одного достоинства.</li>
                        <li>Старшая Карта: Самая высокая карта в вашей руке.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Раунды Ставок</h3></Col>
                <Col sm={12}>
                    <p>В покер обычно включаются несколько раундов ставок, в которых игроки делают ставки в зависимости от силы своей руки или своей стратегии блефа.</p>
                    <p>Самые распространенные виды покера включают Техасский Холдем, Омаху, Семикарточный Стад и Пятькарточный Дро.</p>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Покер Техасского Холдема</h2></Col>
                        <Col sm={12}><h3>Введение</h3></Col>
                        <Col sm={12}>
                            <p>Каждому игроку раздают две личные карты (карманные карты), а пять общих карт выкладываются лицом вверх на стол.</p>
                            <p>Игра состоит из четырех раундов ставок: пре-флоп, флоп, терн и ривер.</p>
                        </Col>
                        <Col sm={12}><h3>Пре-Флоп</h3></Col>
                        <Col sm={12}>
                            <p>После получения ваших карманных карт начинается первый раунд ставок.</p>
                            <p>Игроки могут выбрать сбросить карты (передать их), колл (сравнять текущую ставку) или рейз (увеличить ставку).</p>
                        </Col>
                        <Col sm={12}><h3>Флоп</h3></Col>
                        <Col sm={12}>
                            <p>После пре-флоп раунда ставок на стол выкладываются три общие карты лицом вверх. Это называется флопом.</p>
                            <p>Следует еще один раунд ставок, начиная с игрока слева от дилера.</p>
                        </Col>
                        <Col sm={12}><h3>Терн</h3></Col>
                        <Col sm={12}>
                            <p>После флопа на стол выкладывается четвертая общая карта лицом вверх. Это называется терном.</p>
                            <p>Следует еще один раунд ставок.</p>
                        </Col>
                        <Col sm={12}><h3>Ривер</h3></Col>
                        <Col sm={12}>
                            <p>После терна на стол выкладывается пятая и последняя общая карта лицом вверх. Это называется ривером.</p>
                            <p>Следует последний раунд ставок.</p>
                        </Col>
                        <Col sm={12}><h3>Шоудаун</h3></Col>
                        <Col sm={12}>
                            <p>Если после последнего раунда ставок остаются два или более игроков, происходит шоудаун.</p>
                            <p>Игроки открывают свои карманные карты, и игрок с самой высокой комбинацией выигрывает банк.</p>
                            <p>В случае ничьей банк делится поровну между победителями.</p>
                        </Col>
                    </Row>
                </Col>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Покер "Пять Карт" (Five Card Draw)</h2></Col>
                        <Col sm={12}><h3>Введение</h3></Col>
                        <Col sm={12}>
                            <p>Покер "Пять Карт" (Five Card Draw) - это классическая и простая форма покера.</p>
                            <p>Цель игры - составить лучшую пятикарточную комбинацию, используя карты на руках и те, которые находятся на столе.</p>
                        </Col>
                        <Col sm={12}><h3>Раздача</h3></Col>
                        <Col sm={12}>
                            <p>Каждому игроку раздают пять личных карт лицом вниз.</p>
                            <p>Ставки обычно начинаются с игрока слева от дилера.</p>
                        </Col>
                        <Col sm={12}><h3>Первый Раунд Ставок</h3></Col>
                        <Col sm={12}>
                            <p>Первый раунд ставок начинается с игрока слева от дилера.</p>
                            <p>Игроки могут выбрать сбросить карты (покинуть руку), колл (сравнять текущую ставку) или рейз (увеличить ставку).</p>
                        </Col>
                        <Col sm={12}><h3>Фаза Обмена Картами</h3></Col>
                        <Col sm={12}>
                            <p>После первого раунда ставок у игроков есть возможность обменять некоторые или все свои карты на новые.</p>
                            <p>Начиная с игрока слева от дилера, каждый игрок может сбросить любое количество своих карт и получить равное количество карт на замену из колоды.</p>
                            <p>В большинстве игр сброшенные карты кладутся лицом вниз, а новые карты также раздаются лицом вниз.</p>
                        </Col>
                        <Col sm={12}><h3>Второй Раунд Ставок</h3></Col>
                        <Col sm={12}>
                            <p>После фазы обмена картами происходит второй раунд ставок.</p>
                            <p>Ставки начинаются с игрока слева от дилера, и игроки могут выбрать сбросить, колл или рейз в зависимости от силы своей комбинации.</p>
                        </Col>
                        <Col sm={12}><h3>Шоудаун</h3></Col>
                        <Col sm={12}>
                            <p>Если после второго раунда ставок остаются два или более игроков, происходит шоудаун.</p>
                            <p>Оставшиеся игроки открывают свои руки, начиная с игрока, который сделал последнюю ставку или рейз.</p>
                            <p>Игрок с лучшей пятикарточной комбинацией выигрывает банк.</p>
                            <p>Рейтинг комбинаций соответствует стандартным правилам покера, при этом Роял Флэш является наивысшей комбинацией, а "хай кард" - наименьшей.</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default PokerRu