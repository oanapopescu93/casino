import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { useDispatch } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons'

function AboutRo(props){
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
        <p>Bine ați venit la {casino_name}, un proiect personal creat din dragoste pentru jocuri de noroc, pus în aplicare de un grup de entuziaști ai cazinourilor dedicați să-și împărtășească pasiunea pentru jocuri cu lumea. Încă nu suntem un cazino comercial (cel puțin, nu încă), dar misiunea noastră este de a oferi o experiență unică și distractivă jucătorilor noștri pasionați de jocuri.</p>
        <h3>Istoria Noastră:</h3>
        <p>{casino_name} a început ca un proiect personal, născut din dragostea noastră profundă pentru tot ce înseamnă cazino. Ca jucători înfocați, am visat întotdeauna să creăm un spațiu în care oamenii să se poată bucura de emoția jocurilor de cazino fără presiunea intereselor comerciale. Acest proiect este o mărturie a angajamentului nostru față de lumea jocurilor și dorința noastră de a construi ceva cu adevărat special.</p>
        <h3>De ce {casino_name}?</h3>
        <ul>
            <li><b>Jocuri conduse de pasiune:</b> Jocurile noastre sunt selecționate cu grijă și reflectă pasiunea noastră pentru o experiență de joc de calitate. De la jocuri de masă clasice până la experiențe unice și remarcabile, ne străduim să oferim ceva pentru fiecare tip de jucător.</li>
            <li><b>Fără Presiuni Comerciale:</b> Deoarece nu suntem motivați de profit, ne putem concentra exclusiv pe oferirea unor experiențe de joc excepționale fără a presa jucătorii să cheltuiască mai mult. Scopul nostru este de a face jocul plăcut, pur și liber de presiunile comerciale.</li>
            <li><b>Orientat către Comunitate:</b> Construim o comunitate de jucători cu aceeași pasiune. Conectează-te cu alți entuziaști, împărtășește-ți experiențele și fă parte din comunitatea noastră prietenoasă și incluzivă.</li>
            <li><b>Fără Riscuri, Doar Distracție:</b> Fiind un proiect non-comercial, aici nu este implicat niciun bani real. Acest lucru înseamnă că te poți bucura de jocuri fără a-ți pune în pericol câștigurile. Este totul despre distracție, pur și simplu.</li>
        </ul>
        <h3>Angajamentul Nostru:</h3>
        <p>Chiar dacă {casino_name} nu este un proiect comercial, ne angajăm să asigurăm un mediu de joc echitabil și sigur. Urăm cele mai bune practici când vine vorba de corectitudinea jocurilor, iar confidențialitatea și securitatea ta sunt o preocupare de primă importanță pentru noi.</p>
        <p>Suntem mereu deschiși la feedback și sugestii din partea jucătorilor noștri pentru a îmbunătăți experiența generală de joc. Contribuția ta este neprețuită pe măsură ce lucrăm la extinderea și îmbunătățirea ofertelor noastre.</p>
        <p>Alătură-te nouă la {casino_name} și fii parte din comunitatea noastră în creștere de jucători pasionați. Cu toate că nu suntem un cazino comercial, suntem o platformă construită pe dragostea pentru jocuri și dorința de a crea ceva cu adevărat special. Așa că ia-ți jetoanele virtuale, aruncă zarurile și învârte rolele pentru o experiență de joc care se bazează doar pe bucuria pură a jocului.</p>
        <p>Mulțumim că faci parte din călătoria noastră la {casino_name}. Așteptăm cu nerăbdare să împărtășim împreună multe momente memorabile în lumea jocurilor.</p>
        <p id="about_how_to_play" onClick={()=>handleHowToPlay()}><FontAwesomeIcon icon={faCircleQuestion} />{translate({lang: lang, info: "how_to_play"})}</p>
    </Col>
    <Col lg={2} />
</Row>
}
export default AboutRo