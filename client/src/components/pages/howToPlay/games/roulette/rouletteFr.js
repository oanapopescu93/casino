import React from 'react'
import { Col, Row } from 'react-bootstrap'

function RouletteFr(){
    return  <Row>
        <Col lg={2} />
        <Col lg={8}>
            <Row>
                <Col sm={12}><h3>Introduction</h3></Col>
                <Col sm={12}>
                    <p>La roulette est un jeu de casino populaire qui se joue sur une roue tournante.</p>
                    <p>L'objectif du jeu est de prédire où la petite bille atterrira sur la roue et de placer des paris sur différents numéros ou groupes de numéros.</p>
                </Col>
                <Col sm={12}><h3>La Roue de Roulette</h3></Col>
                <Col sm={12}>
                    <p>La roue de roulette est composée de cases numérotées de 0 à 36.</p>
                    <p>Les numéros sont alternativement colorés en rouge et en noir, avec la case 0 colorée en vert.</p>
                    <p>La version européenne de la roulette possède une seule case 0, tandis que la version américaine a une case supplémentaire 00.</p>
                </Col>
                <Col sm={12}><h3>La Table de Roulette</h3></Col>
                <Col sm={12}>
                    <p>La table de roulette est l'endroit où les joueurs placent leurs paris.</p>
                    <p>Elle présente une grille qui représente les numéros sur la roue ainsi que diverses options de paris supplémentaires.</p>
                    <p>La table est divisée en deux sections principales : les mises intérieures et les mises extérieures.</p>
                </Col>
                <Col sm={12}><h3>Mises Intérieures</h3></Col>
                <Col sm={12}><p>Miser sur un seul numéro en plaçant une puce directement sur ce numéro.</p></Col>
                <Col sm={12}><h3>Mises Extérieures</h3></Col>
                <Col sm={12}>
                    <p>Les mises extérieures sont placées sur des groupes plus importants de numéros ou sur des caractéristiques des numéros.</p>
                    <p>Voici quelques mises extérieures courantes :</p>
                    <ul>
                        <li>Rouge/Noir : Miser sur le fait que la bille atterrira sur un numéro rouge ou noir.</li>
                        <li>Pair/Impair : Miser sur le fait que la bille atterrira sur un numéro pair ou impair.</li>
                        <li>Manque/Passe : Miser sur le fait que la bille atterrira sur un numéro bas (1-18) ou haut (19-36).</li>
                        <li>Mise Douzaine : Miser sur un groupe de 12 numéros en plaçant une puce sur les sections "1ère douzaine", "2ème douzaine" ou "3ème douzaine" de la table.</li>
                    </ul>
                </Col>
                <Col sm={12}><h3>Tourner la Roue</h3></Col>
                <Col sm={12}>
                    <p>Après la phase de mise, le croupier (l'employé du casino en charge du jeu) fera tourner la roue de roulette dans une direction et lancera une petite bille dans la direction opposée. À mesure que la roue ralentit, la bille finira par s'arrêter dans l'une des cases numérotées.</p>
                </Col>
                <Col sm={12}><h3>Gagner et Perdre</h3></Col>
                <Col sm={12}>
                    <p>Si la bille atterrit sur un numéro ou un groupe de numéros sur lesquels vous avez misé, vous remportez un paiement correspondant aux chances de ce pari particulier.</p>
                </Col>
                <Col sm={12}><h3>Paiements</h3></Col>
                <Col sm={12}>
                    <p>Les paiements varient en fonction du type de pari placé. Les paris simples, par exemple, ont des paiements plus élevés car ils comportent plus de risques.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default RouletteFr