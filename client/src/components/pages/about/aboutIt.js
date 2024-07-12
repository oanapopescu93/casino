import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { useDispatch } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons'

function AboutIt(props){
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
        <p>Benvenuti su {casino_name}, un progetto personale nato dall'amore per il gioco, realizzato da un gruppo di appassionati di casinò dedicati a condividere la propria passione con il mondo. Non siamo ancora un casinò commerciale (almeno, non ancora), ma la nostra missione è offrire un'esperienza di gioco unica e divertente ai nostri compagni appassionati di gioco.</p>
        <h3>La Nostra Storia:</h3>
        <p>{casino_name} è nato come progetto personale, scaturito dalla nostra profonda passione per tutto ciò che riguarda il casinò. Essendo noi stessi giocatori appassionati, abbiamo sempre sognato di creare uno spazio in cui le persone potessero godere dell'emozione del gioco d'azzardo senza la pressione degli interessi commerciali. Questo progetto è la testimonianza del nostro impegno nel mondo del gioco e del nostro desiderio di costruire qualcosa di veramente speciale.</p>
        <h3>Perché {casino_name}?</h3>
        <ul>
            <li><b>Giochi guidati dalla passione:</b> I nostri giochi sono accuratamente selezionati e riflettono la nostra passione per una giocabilità di qualità. Dai giochi da tavolo classici alle esperienze uniche e straordinarie, ci sforziamo di offrire qualcosa per ogni tipo di giocatore.</li>
            <li><b>Nessuna pressione commerciale:</b> Essendo mossi dalla passione e non dal profitto, possiamo concentrarci esclusivamente sulla creazione di esperienze di gioco eccezionali senza spingere i giocatori a spendere di più. Il nostro obiettivo è rendere il gioco piacevole, puro e privo di pressioni commerciali.</li>
            <li><b>Orientamento alla comunità:</b> Stiamo costruendo una comunità di giocatori che condividono la nostra passione. Connettiti con altri appassionati, condividi le tue esperienze e fai parte della nostra comunità amichevole e inclusiva.</li>
            <li><b>Nessun Rischio, Solo Divertimento:</b> Essendo un progetto non commerciale, qui non c'è denaro reale in gioco. Ciò significa che puoi goderti i giochi senza il rischio di perdere i tuoi guadagni. Si tratta semplicemente di divertirsi, in modo puro e semplice.</li>
        </ul>
        <h3>Il Nostro Impegno:</h3>
        <p>Anche se {casino_name} non è un progetto commerciale, ci impegniamo a garantire un ambiente di gioco equo e sicuro. Seguiamo le migliori pratiche per la correttezza nei giochi, e la tua privacy e sicurezza sono la nostra massima preoccupazione.</p>
        <p>Siamo sempre aperti a feedback e suggerimenti dai nostri giocatori per migliorare l'esperienza complessiva di gioco. Il tuo contributo è inestimabile mentre lavoriamo per ampliare e migliorare le nostre offerte.</p>
        <p>Unisciti a noi su {casino_name} e fai parte della nostra crescente comunità di giocatori appassionati. Anche se non siamo un casinò commerciale, siamo una piattaforma costruita sull'amore per il gioco e il desiderio di creare qualcosa di veramente speciale. Quindi, prendi le tue fiches virtuali, lancia i dadi e fai girare i rulli per un'esperienza di gioco che ruota interamente intorno alla pura gioia di giocare.</p>
        <p>Grazie per far parte del nostro percorso su {casino_name}. Non vediamo l'ora di condividere molti momenti memorabili nel mondo del gioco insieme.</p>
        <p id="about_how_to_play" onClick={()=>handleHowToPlay()}><FontAwesomeIcon icon={faCircleQuestion} />{translate({lang: lang, info: "how_to_play"})}</p>
    </Col>
    <Col lg={2} />
</Row>
}
export default AboutIt