import React from 'react'
import { Col, Row } from 'react-bootstrap'

function SlotsFr(){
    return <Row>
        <Col lg={2} />
        <Col sm={8}>
            <Row>
                <Col sm={12}><h3>Introduction</h3></Col>
                <Col sm={12}>
                    <p>Les machines à sous, également connues sous le nom de bandits manchots ou de machines à fruits, sont des jeux de casino populaires.</p>
                    <p>L'objectif est de faire tourner les rouleaux et d'aligner les symboles pour remporter des prix.</p>
                </Col>
                <Col sm={12}><h3>Types de Machines à Sous</h3></Col>
                <Col sm={12}>
                    <p>Il existe différents types de machines à sous, notamment les machines à trois rouleaux traditionnelles, les machines à sous vidéo et les machines à sous à jackpot progressif.</p>
                    <p>Les machines à sous traditionnelles ont trois rouleaux et sont plus simples dans leur conception, tandis que les machines à sous vidéo ont plusieurs rouleaux, lignes de paiement et proposent souvent des tours bonus et des fonctionnalités spéciales.</p>
                    <p>Les machines à sous à jackpot progressif offrent un jackpot qui augmente à chaque partie jusqu'à ce que quelqu'un remporte le jackpot.</p>
                </Col>
                <Col sm={12}><h3>Utilisation des Machines à Sous</h3></Col>
                <Col sm={12}>
                    <p>Avant de jouer, déterminez le montant d'argent que vous souhaitez miser par tour.</p>
                    <p>Après avoir placé votre mise, appuyez sur le bouton "Tourner".</p>
                    <p>Lorsque les rouleaux s'arrêtent, les symboles sur les lignes de paiement sont évalués.</p>
                    <p>Si les symboles forment une combinaison gagnante selon la table des gains du jeu, vous remportez un prix.</p>
                    <p>La table des gains affiche les combinaisons de symboles et leurs gains correspondants.</p>
                </Col>
                <Col sm={12}><h3>Symboles Wild et Scatter</h3></Col>
                <Col sm={12}>
                    <p>De nombreuses machines à sous incluent des symboles spéciaux tels que des symboles Wild.</p>
                    <p>Les symboles Wild peuvent se substituer à d'autres symboles pour former des combinaisons gagnantes, augmentant ainsi vos chances de gagner.</p>
                    <p>Les symboles Scatter déclenchent souvent des fonctionnalités bonus, des tours gratuits ou des prix supplémentaires lorsqu'un certain nombre d'entre eux apparaissent sur les rouleaux.</p>
                </Col>
            </Row>
        </Col>
        <Col lg={2} />
    </Row>
}

export default SlotsFr