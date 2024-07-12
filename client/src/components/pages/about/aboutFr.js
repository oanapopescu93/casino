import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { useDispatch } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons'

function AboutFr(props){
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
        <p>Bienvenue à {casino_name}, un projet personnel né de l'amour du jeu, concrétisé par un groupe d'enthousiastes de casino dédiés à partager leur passion avec le monde. Nous ne sommes pas encore un casino commercial (du moins, pas encore), mais notre mission est de fournir une expérience de jeu unique et divertissante à nos compagnons passionnés de jeu.</p>
        <h3>Notre Histoire :</h3>
        <p>{casino_name} a débuté comme un projet personnel, issu de notre profonde passion pour tout ce qui touche au casino. En tant que joueurs passionnés, nous avons toujours rêvé de créer un espace où les gens pourraient profiter de l'excitation du jeu de casino sans la pression des intérêts commerciaux. Ce projet est le témoignage de notre engagement envers le monde du jeu et notre désir de construire quelque chose de vraiment spécial.</p>
        <h3>Pourquoi {casino_name} ?</h3>
        <ul>
            <li><b>Jeux animés par la passion :</b> Nos jeux sont soigneusement sélectionnés et reflètent notre passion pour une jouabilité de qualité. Des jeux de table classiques aux expériences uniques et exceptionnelles, nous nous efforçons d'offrir quelque chose pour tous les types de joueurs.</li>
            <li><b>Aucune pression commerciale :</b> Étant donné que nous ne sommes pas motivés par le profit, nous pouvons nous concentrer exclusivement sur la fourniture d'expériences de jeu exceptionnelles sans avoir besoin de pousser les joueurs à dépenser davantage. Notre objectif est de rendre le jeu agréable, pur et exempt de pressions commerciales.</li>
            <li><b>Orienté vers la communauté :</b> Nous construisons une communauté de joueurs partageant la même passion. Connectez-vous avec d'autres passionnés, partagez vos expériences et faites partie de notre communauté conviviale et inclusive.</li>
            <li><b>Zéro risque, que du plaisir :</b> En tant que projet non commercial, il n'y a pas d'argent réel en jeu ici. Cela signifie que vous pouvez profiter des jeux sans risquer de perdre votre argent durement gagné. Il s'agit simplement de s'amuser, de manière pure et simple.</li>
        </ul>
        <h3>Notre Engagement :</h3>
        <p>Même si {casino_name} n'est pas un projet commercial, nous nous engageons à garantir un environnement de jeu équitable et sûr. Nous suivons les meilleures pratiques en matière d'équité dans le jeu, et votre vie privée et sécurité sont notre principale préoccupation.</p>
        <p>Nous sommes toujours ouverts aux commentaires et aux suggestions de nos joueurs pour améliorer l'expérience globale de jeu. Votre contribution est inestimable alors que nous travaillons à élargir et améliorer nos offres.</p>
        <p>Rejoignez-nous chez {casino_name} et faites partie de notre communauté grandissante de joueurs passionnés. Bien que nous ne soyons pas un casino commercial, nous sommes une plateforme construite sur l'amour du jeu et le désir de créer quelque chose de vraiment spécial. Alors, prenez vos jetons virtuels, lancez les dés et faites tourner les rouleaux pour une expérience de jeu axée sur la pure joie de jouer.</p>
        <p>Merci d'être une partie de notre aventure chez {casino_name}. Nous sommes impatients de partager de nombreux moments mémorables dans le monde du jeu ensemble.</p>
        <p id="about_how_to_play" onClick={()=>handleHowToPlay()}><FontAwesomeIcon icon={faCircleQuestion} />{translate({lang: lang, info: "how_to_play"})}</p>
    </Col>
    <Col lg={2} />
</Row>
}
export default AboutFr