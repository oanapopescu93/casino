import React from 'react'
import { Col, Row } from 'react-bootstrap'

function PokerFr(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduction</h3></Col>
                <Col sm={12}>
                    <p>Le poker est un jeu de cartes populaire joué avec un jeu standard de 52 cartes.</p>
                    <p>L'objectif du jeu est de remporter le pot, qui est la somme d'argent ou de jetons misée par les joueurs.</p>
                </Col>
                <Col sm={12}><h3>Classement des Mains</h3></Col>
                <Col sm={12}>
                    <p>Familiarisez-vous avec le classement des mains au poker, du plus élevé au plus bas :</p>
                    <ul>
                        <li>Flush Royal : As, Roi, Dame, Valet, 10 de la même couleur.</li>
                        <li>Quinte Flush : Cinq cartes consécutives de la même couleur.</li>
                        <li>Carré : Quatre cartes de même rang.</li>
                        <li>Full : Trois cartes de même rang plus une paire.</li>
                        <li>Couleur : Cinq cartes de la même couleur.</li>
                        <li>Quinte : Cinq cartes consécutives de couleur différente.</li>
                        <li>Brelan : Trois cartes de même rang.</li>
                        <li>Double Paire : Deux paires de cartes de même rang.</li>
                        <li>Paire : Deux cartes de même rang.</li>
                        <li>Carte Haute : La carte de rang le plus élevé dans votre main.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Tours de Mises</h3></Col>
                <Col sm={12}>
                    <p>Le poker implique généralement plusieurs tours de mises, où les joueurs placent des mises en fonction de la force de leur main ou de leur stratégie de bluff.</p>
                    <p>Les types de jeux de poker les plus courants comprennent le Texas Hold'em, l'Omaha, le Seven-Card Stud et le Five-Card Draw.</p>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Poker Texas Hold'em</h2></Col>
                        <Col sm={12}><h3>Introduction</h3></Col>
                        <Col sm={12}>
                            <p>Chaque joueur reçoit deux cartes privées (cartes fermées), et cinq cartes communes sont placées face visible sur la table.</p>
                            <p>Le jeu se compose de quatre tours de mises : pré-flop, flop, turn et river.</p>
                        </Col>
                        <Col sm={12}><h3>Pré-Flop</h3></Col>
                        <Col sm={12}>
                            <p>Après avoir reçu vos cartes fermées, le premier tour de mises commence.</p>
                            <p>Les joueurs peuvent choisir de se coucher (abandonner leurs cartes), de suivre (mettre la même mise que la mise actuelle) ou de relancer (augmenter la mise).</p>
                        </Col>
                        <Col sm={12}><h3>Flop</h3></Col>
                        <Col sm={12}>
                            <p>Après le tour de mises pré-flop, trois cartes communes sont distribuées face visible sur la table. C'est ce qu'on appelle le flop.</p>
                            <p>Un autre tour de mises a lieu, en commençant par le joueur à gauche du donneur.</p>
                        </Col>
                        <Col sm={12}><h3>Turn</h3></Col>
                        <Col sm={12}>
                            <p>Après le flop, une quatrième carte commune est distribuée face visible sur la table. C'est ce qu'on appelle le turn.</p>
                            <p>Un autre tour de mises a lieu.</p>
                        </Col>
                        <Col sm={12}><h3>River</h3></Col>
                        <Col sm={12}>
                            <p>Après le turn, une cinquième et dernière carte commune est distribuée face visible sur la table. C'est ce qu'on appelle la river.</p>
                            <p>Le dernier tour de mises a lieu.</p>
                        </Col>
                        <Col sm={12}><h3>Abattage</h3></Col>
                        <Col sm={12}>
                            <p>S'il reste deux joueurs ou plus après le dernier tour de mises, un abattage a lieu.</p>
                            <p>Les joueurs révèlent leurs cartes fermées, et le joueur ayant la main de rang le plus élevé remporte le pot.</p>
                            <p>En cas d'égalité, le pot est divisé également entre les joueurs gagnants.</p>
                        </Col>
                    </Row>
                </Col>
                <Col sm={6}>
                    <Row>
                        <Col sm={12}><h2>Poker Five Card Draw</h2></Col>
                        <Col sm={12}><h3>Introduction</h3></Col>
                        <Col sm={12}>
                            <p>Le Five Card Draw est une forme classique et simple de poker.</p>
                            <p>L'objectif du jeu est de constituer la meilleure main de cinq cartes en utilisant une combinaison des cartes de votre main et de celles sur la table.</p>
                        </Col>
                        <Col sm={12}><h3>La Donne</h3></Col>
                        <Col sm={12}>
                            <p>Chaque joueur reçoit cinq cartes privées face cachée.</p>
                            <p>Les mises commencent généralement par le joueur à gauche du donneur.</p>
                        </Col>
                        <Col sm={12}><h3>Premier Tour de Mises</h3></Col>
                        <Col sm={12}>
                            <p>Le premier tour de mises commence avec le joueur à gauche du donneur.</p>
                            <p>Les joueurs peuvent choisir de se coucher (abandonner leurs cartes et quitter la main), de suivre (mettre la même mise que la mise actuelle) ou de relancer (augmenter la mise).</p>
                        </Col>
                        <Col sm={12}><h3>Phase d'Échange</h3></Col>
                        <Col sm={12}>
                            <p>Après le premier tour de mises, les joueurs ont la possibilité d'échanger certaines ou toutes leurs cartes contre de nouvelles cartes.</p>
                            <p>En commençant par le joueur à gauche du donneur, chaque joueur peut se défausser d'un certain nombre de ses cartes et recevoir un nombre équivalent de cartes de remplacement du paquet.</p>
                            <p>Dans la plupart des jeux, les cartes défaussées sont placées face cachée, et les cartes de remplacement sont distribuées face cachée également.</p>
                        </Col>
                        <Col sm={12}><h3>Deuxième Tour de Mises</h3></Col>
                        <Col sm={12}>
                            <p>Après la phase d'échange, un deuxième tour de mises a lieu.</p>
                            <p>Les mises commencent par le joueur à gauche du donneur, et les joueurs peuvent choisir de se coucher, de suivre ou de relancer en fonction de la force de leur main.</p>
                        </Col>
                        <Col sm={12}><h3>Abattage</h3></Col>
                        <Col sm={12}>
                            <p>S'il reste deux joueurs ou plus après le deuxième tour de mises, un abattage a lieu.</p>
                            <p>Les joueurs restants révèlent leurs mains, en commençant par le joueur qui a fait la dernière mise ou relance.</p>
                            <p>Le joueur ayant la meilleure main de cinq cartes remporte le pot.</p>
                            <p>Le classement des mains suit les règles standard du poker, avec la Quinte Flush Royale étant la main de rang le plus élevé et la Carte Haute étant la main de rang le plus bas.</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default PokerFr