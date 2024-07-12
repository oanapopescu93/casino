import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { useDispatch } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons'

function AboutEng(props){
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
            <p>Welcome to {casino_name}, a labor of love brought to life by a group of casino enthusiasts who are dedicated to sharing their passion for gaming with the world. While we're not a commercial casino (at least, not yet), our mission is to provide a unique and enjoyable gaming experience for our fellow gaming enthusiasts.</p>
            <h3>Our Story:</h3>
            <p>{casino_name} began as a pet project, born from our deep-seated love for all things casino. As avid players ourselves, we've always dreamed of creating a space where people can enjoy the thrill of casino gaming without the pressure of commercial interests. This project is a testament to our commitment to the world of gaming and our desire to build something truly special.</p>
            <h3>Why {casino_name}?</h3>
            <ul>
                <li><b>Passion-Driven Games: </b>Our games are carefully curated and reflect our passion for quality gameplay. From classic table games to unique, one-of-a-kind experiences, we strive to offer something for every type of gamer.</li>
                <li><b>No Commercial Pressures: </b>Since we're not driven by profit, we can focus solely on delivering exceptional gaming experiences without the need to push players to spend more. Our goal is to make gaming enjoyable, pure, and free from any commercial pressures.</li>
                <li><b>Community-Centric: </b>We're building a community of like-minded players who share our passion for gaming. Connect with other enthusiasts, share your experiences, and be part of our friendly, inclusive community.</li>
                <li><b>Zero Risks, All Fun: </b>As a non-commercial project, there's no real money involved here. That means you can enjoy games without the risk of losing your hard-earned cash. It's all about having fun, pure and simple.</li>
            </ul>
            <h3>Our Commitment:</h3>
            <p>While {casino_name} isn't a commercial endeavor, we are committed to ensuring a fair and safe gaming environment. We follow best practices when it comes to game fairness, and your privacy and security are our utmost concern.</p>
            <p>We're always open to feedback and suggestions from our players to improve the overall gaming experience. Your input is invaluable as we work towards expanding and enhancing our offerings.</p>
            <p>Join us at {casino_name} and be a part of our growing community of passionate players. While we're not a commercial casino, we are a platform built on love for gaming and the desire to create something truly special. So, grab your virtual chips, roll the dice, and spin the reels for a gaming experience that's all about the pure joy of playing.</p>
            <p>Thank you for being a part of our {casino_name} journey. We look forward to sharing many memorable moments in the world of gaming together.</p>
            <p id="about_how_to_play" onClick={()=>handleHowToPlay()}><FontAwesomeIcon icon={faCircleQuestion} />{translate({lang: lang, info: "how_to_play"})}</p>
        </Col>
        <Col lg={2} />
    </Row>
}
export default AboutEng