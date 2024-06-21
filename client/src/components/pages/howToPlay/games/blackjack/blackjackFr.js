import React from 'react'
import { Col, Row } from 'react-bootstrap'

function BlackjackFr(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduction</h3></Col>
                <Col sm={12}>
                    <p>Le blackjack est un jeu de cartes populaire joué dans les casinos, où l'objectif est d'avoir une main dont la valeur totale est plus proche de 21 que celle du croupier sans dépasser 21.</p>
                    <p>Le jeu se joue avec un ou plusieurs jeux de 52 cartes standard.</p>
                </Col>
                <Col sm={12}><h3>Valeurs des Cartes</h3></Col>
                <Col sm={12}>
                    <p>Au blackjack, les cartes numérotées (2 à 10) valent leur valeur nominale.</p>
                    <p>Les cartes à figures (Roi, Dame et Valet) valent 10.</p>
                    <p>L'As peut être compté comme 1 ou 11, en fonction de la valeur qui favorise le plus la main.</p>
                </Col>
                <Col sm={12}><h3>Déroulement du Jeu</h3></Col>
                <Col sm={12}>
                    <p>Le jeu commence par chaque joueur plaçant ses mises sur la zone désignée devant lui sur la table de blackjack.</p>
                    <p>Le croupier distribue ensuite deux cartes face visible à chaque joueur et une carte face visible à lui-même. La deuxième carte du croupier est distribuée face cachée (carte trouée).</p>
                </Col>
                <Col sm={12}><h3>Options du Joueur</h3></Col>
                <Col sm={12}>
                    <p>C'est d'abord au tour du joueur, qui a plusieurs options à choisir en fonction de sa main :</p>
                    <ul>
                        <li>Tirer : Le joueur demande à recevoir une carte supplémentaire. Le joueur peut demander plusieurs cartes supplémentaires jusqu'à ce qu'il soit satisfait de sa main ou jusqu'à ce qu'il dépasse 21, ce qui entraîne une perte.</li>
                        <li>Rester : Le joueur décide de conserver sa main actuelle et de mettre fin à son tour, passant l'action au joueur suivant ou au croupier.</li>
                        <li>Doubler : Le joueur double sa mise initiale et ne reçoit qu'une carte supplémentaire. Cette option est généralement disponible lorsque la main initiale du joueur totalise 9, 10 ou 11.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Tour du Croupier</h3></Col>
                <Col sm={12}>
                    <p>Après que tous les joueurs ont terminé leur tour, le croupier révèle sa carte trouée.</p>
                    <p>Si la main du croupier totalise 16 ou moins, il doit tirer des cartes supplémentaires jusqu'à ce que sa main totalise 17 ou plus.</p>
                    <p>Si la main du croupier dépasse 21, tous les joueurs restants gagnent.</p>
                    <p>Si la main du croupier ne dépasse pas 21, sa main est comparée à celle de chaque joueur pour déterminer les gagnants.</p>
                </Col>
                <Col sm={12}><h3>Blackjack</h3></Col>
                <Col sm={12}>
                    <p>Si un joueur ou le croupier reçoit un As et une carte d'une valeur de 10 (10, Valet, Dame ou Roi) comme ses deux premières cartes, on parle de blackjack.</p>
                    <p>Un blackjack est une victoire automatique pour le joueur, avec un paiement de 3:2, sauf si le croupier a également un blackjack, ce qui entraîne une égalité.</p>
                </Col>
                <Col sm={12}><h3>Détermination du Résultat</h3></Col>
                <Col sm={12}>
                    <p>Si la valeur totale de la main du joueur est supérieure à celle du croupier sans dépasser 21, le joueur gagne et est payé 1:1.</p>
                    <p>Si la valeur totale de la main du joueur est inférieure à celle du croupier, le joueur perd sa mise.</p>
                    <p>Si la valeur totale de la main du joueur et celle du croupier sont identiques (égalité), la mise est restituée au joueur.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default BlackjackFr