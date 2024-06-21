import React from 'react'
import { Col, Row } from 'react-bootstrap'

function KenoFr(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduction</h3></Col>
                <Col sm={12}>
                    <p>Le Keno est un jeu de style loterie joué dans de nombreux casinos et plateformes en ligne.</p>
                    <p>L'objectif du jeu est de sélectionner des numéros parmi une série et de les faire correspondre aux numéros tirés par la machine de Keno.</p>
                </Col>
                <Col sm={12}><h3>Ticket de Keno</h3></Col>
                <Col sm={12}>
                    <p>Pour jouer au Keno, commencez par obtenir un ticket de Keno. Le ticket contient une grille de numéros de 1 à 80.</p>
                    <p>Vous pouvez généralement choisir combien de numéros vous souhaitez jouer (généralement de 1 à 20), et votre gain dépendra du nombre de numéros que vous sélectionnez.</p>
                </Col>
                <Col sm={12}><h3>Sélection des Numéros</h3></Col>
                <Col sm={12}>
                    <p>Sur le ticket de Keno, marquez ou sélectionnez les numéros que vous souhaitez jouer en les entourant ou en les surlignant.</p>
                    <p>Le nombre de sélections que vous pouvez faire dépend des règles spécifiques du jeu de Keno auquel vous jouez.</p>
                </Col>
                <Col sm={12}><h3>Choix de la Mise</h3></Col>
                <Col sm={12}>
                    <p>Décidez du montant d'argent que vous souhaitez miser sur votre ticket de Keno.</p>
                    <p>Le paiement pour les numéros correspondants dépendra du montant de votre mise.</p>
                </Col>
                <Col sm={12}><h3>Nombre de Tirages</h3></Col>
                <Col sm={12}>
                    <p>Déterminez combien de jeux consécutifs ou de tirages vous souhaitez jouer avec le même ticket. Vous pouvez généralement choisir de jouer un seul jeu ou plusieurs jeux à la suite.</p>
                </Col>
                <Col sm={12}><h3>Correspondance des Numéros et Paiements</h3></Col>
                <Col sm={12}>
                    <p>Au fur et à mesure que les numéros sont tirés, comparez-les aux numéros que vous avez sélectionnés sur votre ticket de Keno.</p>
                    <p>Plus vous faites correspondre de numéros, plus votre gain sera élevé, en fonction de la table de paiement spécifique au jeu auquel vous jouez.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default KenoFr