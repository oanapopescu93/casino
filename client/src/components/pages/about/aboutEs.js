import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { useDispatch } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons'

function AboutEs(props){
    const {settings, casino_name} = props
    const {lang} = settings
    let dispatch = useDispatch()
    function handleHowToPlay(){
        dispatch(changePage("how_to_play"))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }
    return <Row id="about" className="other_page_container">
    <Col lg={2} />
    <Col lg={8}>
        <p>Bienvenidos a {casino_name}, un proyecto personal hecho realidad por un grupo de entusiastas de los casinos que están dedicados a compartir su pasión por el juego con el mundo. Aunque todavía no somos un casino comercial (al menos, no todavía), nuestra misión es proporcionar una experiencia de juego única y entretenida para nuestros compañeros entusiastas del juego.</p>
        <h3>Nuestra Historia:</h3>
        <p>{casino_name} comenzó como un proyecto personal, nacido de nuestro profundo amor por todo lo relacionado con los casinos. Como jugadores ávidos nosotros mismos, siempre hemos soñado con crear un espacio donde las personas puedan disfrutar de la emoción de los juegos de casino sin la presión de intereses comerciales. Este proyecto es un testimonio de nuestro compromiso con el mundo del juego y nuestro deseo de construir algo verdaderamente especial.</p>
        <h3>¿Por qué {casino_name}?</h3>
        <ul>
            <li><b>Juegos impulsados por la pasión:</b> Nuestros juegos son cuidadosamente seleccionados y reflejan nuestra pasión por una jugabilidad de calidad. Desde juegos de mesa clásicos hasta experiencias únicas y excepcionales, nos esforzamos por ofrecer algo para todo tipo de jugadores.</li>
            <li><b>Sin presiones comerciales:</b> Dado que no estamos impulsados por el lucro, podemos centrarnos exclusivamente en brindar experiencias de juego excepcionales sin la necesidad de presionar a los jugadores para que gasten más. Nuestro objetivo es que el juego sea divertido, puro y libre de presiones comerciales.</li>
            <li><b>Orientado a la comunidad:</b> Estamos construyendo una comunidad de jugadores afines que comparten nuestra pasión por el juego. Conéctate con otros entusiastas, comparte tus experiencias y sé parte de nuestra comunidad amigable e inclusiva.</li>
            <li><b>Cero riesgos, todo diversión:</b> Como proyecto no comercial, aquí no hay dinero real en juego. Esto significa que puedes disfrutar de los juegos sin el riesgo de perder tu dinero duramente ganado. Aquí se trata de divertirse, puro y simple.</li>
        </ul>
        <h3>Nuestro Compromiso:</h3>
        <p>Aunque {casino_name} no es un proyecto comercial, estamos comprometidos a garantizar un entorno de juego justo y seguro. Seguimos las mejores prácticas en cuanto a la equidad en el juego, y tu privacidad y seguridad son nuestra máxima preocupación.</p>
        <p>Siempre estamos abiertos a comentarios y sugerencias de nuestros jugadores para mejorar la experiencia general de juego. Tu aportación es invaluable mientras trabajamos para expandir y mejorar nuestras ofertas.</p>
        <p>Únete a nosotros en {casino_name} y sé parte de nuestra creciente comunidad de jugadores apasionados. Aunque no somos un casino comercial, somos una plataforma construida sobre el amor por el juego y el deseo de crear algo realmente especial. Así que, toma tus fichas virtuales, lanza los dados y gira los carretes para experimentar un juego que se trata de la pura alegría de jugar.</p>
        <p>Gracias por formar parte de nuestra travesía en {casino_name}. Esperamos compartir muchos momentos memorables en el mundo del juego juntos.</p>
        <p id="about_how_to_play" onClick={()=>handleHowToPlay()}><FontAwesomeIcon icon={faCircleQuestion} />{translate({lang: lang, info: "how_to_play"})}</p>
    </Col>
    <Col lg={2} />
</Row>
}
export default AboutEs