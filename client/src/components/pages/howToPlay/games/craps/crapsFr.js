import React from 'react'
import { Col, Row } from 'react-bootstrap'

function CrapsFr(){
    return <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduction</h3></Col>
                <Col sm={12}>
                    <p>Le craps est un jeu de dés joué avec deux dés, généralement sur une table spécialisée dans un casino.</p>
                    <p>L'objectif du jeu est de prédire le résultat des lancers de dés et de placer des paris en conséquence.</p>
                </Col>
                <Col sm={12}><h3>La Mise Pass Line</h3></Col>
                <Col sm={12}>
                    <p>La mise la plus courante au craps est la mise "Pass Line". Elle est placée avant le premier lancer de dés.</p>
                    <p>Pour faire une mise Pass Line, placez vos jetons sur la zone "Pass Line" de la table de craps.</p>
                </Col>
                <Col sm={12}><h3>Le Premier Lancer</h3></Col>
                <Col sm={12}>
                    <p>Le jeu commence avec le tireur (la personne qui lance les dés) effectuant le premier lancer.</p>
                    <p>Si le premier lancer est un 7 ou un 11, les mises Pass Line gagnent et les joueurs qui les ont placées sont payés à égalité.</p>
                    <p>Si le premier lancer est un 2, un 3 ou un 12, les mises Pass Line perdent et les joueurs qui les ont placées perdent leurs jetons.</p>
                </Col>
                <Col sm={12}><h3>Numéro Point</h3></Col>
                <Col sm={12}>
                    <p>Si le premier lancer est un 4, un 5, un 6, un 8, un 9 ou un 10, ce nombre devient le "point".</p>
                    <p>Le croupier place un marqueur appelé "marqueur de point" sur la table pour indiquer le point établi.</p>
                </Col>
                <Col sm={12}><h3>Poursuite du Jeu</h3></Col>
                <Col sm={12}>
                    <p>Après l'établissement du point, le tireur continue de lancer les dés jusqu'à ce que l'une des deux situations suivantes se produise : le point est à nouveau lancé (les mises Pass Line gagnent) ou un 7 est lancé (les mises Pass Line perdent).</p>
                    <p>Le tireur continue de lancer les dés jusqu'à ce que l'une de ces situations soit atteinte, moment où la personne suivante devient le tireur.</p>
                </Col>
                <Col sm={12}><h3>Options de Mise</h3></Col>
                <Col sm={12}>
                    <p>En plus de la mise Pass Line, il existe de nombreuses autres options de mise au craps :</p>
                    <ul>
                        <li>Mise Come : Similaire à la mise Pass Line, mais placée après l'établissement du point.</li>
                        <li>Mise Don't Pass Line : Contraire à la mise Pass Line. Gagne avec 2 ou 3, perd avec 7 ou 11 et fait égalité avec 12. Si un point est établi, la mise gagne si un 7 est lancé avant le point.</li>
                        <li>Mise Don't Come : Similaire à la mise Don't Pass Line, mais placée après l'établissement du point.</li>
                        <li>Mises Place : Mise sur des numéros spécifiques (4, 5, 6, 8, 9 ou 10) pour qu'ils soient lancés avant un 7.</li>
                        <li>Mise Field : Mise sur le fait qu'un 2, un 3, un 4, un 9, un 10, un 11 ou un 12 sera lancé lors du prochain lancer.</li>
                        <li>Mises Proposition : Mises sur un seul lancer pour des résultats spécifiques (par exemple, un numéro ou une combinaison spécifiques) avec des gains élevés mais une marge bénéficiaire plus importante pour le casino.</li>
                    </ul>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default CrapsFr