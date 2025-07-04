import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons'

function AboutRu(props){
    const {settings, casino_name, handleHowToPlay} = props
    const {lang} = settings
    return <Row id="about" className="other_page_container">
        <Col lg={2} />
        <Col lg={8}>
            <p>Добро пожаловать в {casino_name}, проект, созданный с любовью группой энтузиастов казино, которые посвятили себя делению своей страсти к азартным играм со всем миром. Хотя мы не являемся коммерческим казино (по крайней мере, пока что), наша миссия - предоставить уникальный и приятный игровой опыт для наших коллег-энтузиастов игр.</p>
            <h3>Наша История:</h3>
            <p>{casino_name} начался как личный проект, родившийся из нашей глубокой любви ко всему, что связано с казино. Как страстные игроки, мы всегда мечтали создать пространство, где люди могут наслаждаться азартом казино без давления коммерческих интересов. Этот проект - свидетель нашего приверженности миру игр и нашего желания создать что-то по-настоящему особенное.</p>
            <h3>Почему {casino_name}?</h3>
            <ul>
                <li><b>Игры на Основе Страсти: </b>Наши игры тщательно подобраны и отражают нашу страсть к качественной игровой механике. От классических настольных игр до уникальных, одинаковых опытов, мы стремимся предложить что-то для каждого типа игрока.</li>
                <li><b>Без Коммерческого Давления: </b>Поскольку нас не движет прибыль, мы можем сосредоточиться исключительно на предоставлении исключительных игровых опытов без необходимости толкать игроков тратить больше. Наша цель - сделать игры приятными, чистыми и свободными от какого-либо коммерческого давления.</li>
                <li><b>Ориентированный на Сообщество: </b>Мы строим сообщество единомышленников, которые разделяют нашу страсть к играм. Общайтесь с другими энтузиастами, делитесь своими опытами и будьте частью нашего дружелюбного и инклюзивного сообщества.</li>
                <li><b>Нулевые Риски, Вся Развлекуха: </b>Поскольку это не коммерческий проект, здесь нет реальных денег. Это означает, что вы можете наслаждаться играми без риска потерять заработанные деньги. Здесь все о веселье, чистом и простом.</li>
            </ul>
            <h3>Наше Обязательство:</h3>
            <p>Хотя {casino_name} и не является коммерческим предприятием, мы обязуемся обеспечить справедливую и безопасную игровую среду. Мы следуем лучшим практикам в области честности игры, и ваша конфиденциальность и безопасность - наш главный приоритет.</p>
            <p>Мы всегда открыты для обратной связи и предложений от наших игроков по улучшению общего игрового опыта. Ваш вклад неоценим, поскольку мы работаем над расширением и улучшением наших предложений.</p>
            <p>Присоединяйтесь к нам в {casino_name} и станьте частью нашего растущего сообщества страстных игроков. Хотя мы не являемся коммерческим казино, мы - платформа, созданная с любовью к игре и желанием создать что-то по-настоящему особенное. Так что берите свои виртуальные фишки, бросайте кости и крутите барабаны для игрового опыта, который целиком и полностью о чистой радости игры.</p>
            <p>Спасибо, что стали частью нашего пути в {casino_name}. Мы с нетерпением ждем возможности поделиться множеством незабываемых моментов в мире игр вместе.</p>
            <p id="about_how_to_play" onClick={()=>handleHowToPlay()}><FontAwesomeIcon icon={faCircleQuestion} />{translate({lang, info: "how_to_play"})}</p>
        </Col>
        <Col lg={2} />
    </Row>
}
export default AboutRu