import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { useDispatch } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons'

function AboutDe(props){
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
            <p>Herzlich willkommen bei {casino_name}, einem Herzensprojekt, das von einer Gruppe von Casino-Enthusiasten ins Leben gerufen wurde, die sich der Mission verschrieben haben, ihre Leidenschaft für das Spielen mit der Welt zu teilen. Wir sind zwar noch kein kommerzielles Casino (zumindest noch nicht), aber unsere Mission besteht darin, ein einzigartiges und unterhaltsames Spielerlebnis für unsere Mit-Spieler zu bieten.</p>
            <h3>Unsere Geschichte:</h3>
            <p>{casino_name} begann als ein Herzensprojekt, geboren aus unserer tiefen Liebe für alles, was mit dem Casino zu tun hat. Als leidenschaftliche Spieler selbst haben wir immer davon geträumt, einen Raum zu schaffen, in dem Menschen den Nervenkitzel des Casino-Spiels ohne den Druck kommerzieller Interessen genießen können. Dieses Projekt ist ein Zeugnis unseres Engagements für die Welt des Spielens und unseres Wunsches, etwas wirklich Besonderes aufzubauen.</p>
            <h3>Warum {casino_name}?</h3>
            <ul>
                <li><b>Leidenschaftsgetriebene Spiele: </b>Unsere Spiele werden sorgfältig ausgewählt und spiegeln unsere Leidenschaft für hochwertiges Gameplay wider. Von klassischen Tischspielen bis hin zu einzigartigen, einmaligen Erlebnissen bemühen wir uns, für jeden Spielertyp etwas anzubieten.</li>
                <li><b>Kein kommerzieller Druck: </b>Da wir nicht von Profit getrieben sind, können wir uns ausschließlich darauf konzentrieren, außergewöhnliche Spielerlebnisse zu bieten, ohne die Spieler dazu zu drängen, mehr Geld auszugeben. Unser Ziel ist es, das Spielen angenehm, rein und frei von kommerziellem Druck zu gestalten.</li>
                <li><b>Gemeinschaftszentriert: </b>Wir bauen eine Gemeinschaft von Gleichgesinnten auf, die unsere Leidenschaft für das Spielen teilen. Vernetzen Sie sich mit anderen Enthusiasten, teilen Sie Ihre Erfahrungen und werden Sie Teil unserer freundlichen, inklusiven Gemeinschaft.</li>
                <li><b>Null Risiken, Nur Spaß: </b>Da es sich um ein nicht kommerzielles Projekt handelt, ist hier kein echtes Geld im Spiel. Das bedeutet, dass Sie Spiele genießen können, ohne das Risiko, Ihr hart verdientes Geld zu verlieren. Hier geht es ausschließlich um den Spaß, einfach und pur.</li>
            </ul>
            <h3>Unser Engagement:</h3>
            <p>Obwohl {casino_name} kein kommerzielles Unternehmen ist, sind wir entschlossen, eine faire und sichere Spielumgebung sicherzustellen. Wir folgen bewährten Praktiken in Bezug auf Fairness beim Spiel, und Ihre Privatsphäre und Sicherheit liegen uns besonders am Herzen.</p>
            <p>Wir sind immer offen für Feedback und Vorschläge unserer Spieler, um das Gesamterlebnis beim Spielen zu verbessern. Ihr Beitrag ist von unschätzbarem Wert, während wir daran arbeiten, unsere Angebote zu erweitern und zu verbessern.</p>
            <p>Treten Sie uns bei {casino_name} bei und werden Sie Teil unserer wachsenden Gemeinschaft leidenschaftlicher Spieler. Auch wenn wir kein kommerzielles Casino sind, sind wir eine Plattform, die auf Liebe zum Spielen und dem Wunsch aufbaut, etwas wirklich Besonderes zu schaffen. Also schnappen Sie sich Ihre virtuellen Chips, werfen Sie die Würfel und drehen Sie die Walzen für ein Spielerlebnis, das sich ganz um die reine Freude am Spielen dreht.</p>
            <p>Vielen Dank, dass Sie Teil unserer Reise mit {casino_name} sind. Wir freuen uns darauf, viele unvergessliche Momente in der Welt des Spielens gemeinsam zu erleben.</p>
            <p id="about_how_to_play" onClick={()=>handleHowToPlay()}><FontAwesomeIcon icon={faCircleQuestion} />{translate({lang: lang, info: "how_to_play"})}</p>
        </Col>
        <Col lg={2} />
    </Row>
}
export default AboutDe