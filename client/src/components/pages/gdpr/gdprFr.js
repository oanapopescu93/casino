import React from 'react'
import { Row, Col } from 'react-bootstrap'

function GdprFr(props){
    const {contact, settings} = props
    const { lang } = settings
    let myContact = contact[0][lang]
    let myEmail = myContact.email
    
    return <Row id="gdpr" className="other_page_container">
        <Col lg={2} />
        <Col lg={8}>
            <h3>1. Introduction</h3>
            <p>Nous attachons une grande importance à votre vie privée et nous nous engageons à protéger vos données personnelles. Cette page explique comment nous collectons, utilisons et protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD) de l'UE.</p>

            <h3>2. Quelles données nous collectons</h3>
            <p>Nous collectons les types de données personnelles suivants :</p>
            <ul>
                <li>Informations de contact (nom d'utilisateur, e-mail, numéro de téléphone, mot de passe)</li>
                <li>Informations techniques (ID, UUID)</li>
                <li>Données de paiement et de transaction</li>
                <li>Préférences des utilisateurs et données de communication</li>
            </ul>

            <h3>3. Pourquoi nous collectons vos données</h3>
            <p>Nous collectons vos données personnelles pour :</p>
            <ul>
                <li>Vous fournir des services et une expérience personnalisés</li>
                <li>Traiter les paiements</li>
                <li>Communiquer avec vous au sujet de votre compte et de vos transactions</li>
                <li>Améliorer notre site web et nos services</li>
                <li>Vous envoyer des newsletters et des communications marketing (uniquement si vous avez donné votre consentement)</li>
            </ul>

            <h3>4. Comment nous utilisons vos données</h3>
            <p>Vos données sont utilisées pour les raisons suivantes :</p>
            <ul>
                <li>Pour communiquer avec vous au sujet de nos produits, services ou mises à jour</li>
                <li>Pour envoyer des e-mails marketing si vous êtes abonné à notre newsletter</li>
                <li>Pour traiter vos transactions de manière sécurisée via notre processeur de paiement</li>
                <li>Pour améliorer la qualité et les fonctionnalités de notre site web et de nos services</li>
            </ul>

            <h3>5. Comment nous protégeons vos données</h3>
            <p>Nous prenons des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès non autorisé, toute perte ou utilisation abusive. Ces mesures incluent le chiffrement, des serveurs sécurisés et la surveillance régulière de nos systèmes.</p>

            <h3>6. Vos droits selon le RGPD</h3>
            <p>Vous avez les droits suivants concernant vos données personnelles :</p>
            <ul>
                <li>Droit d'accès : Vous pouvez demander une copie des données personnelles que nous détenons à votre sujet.</li>
                <li>Droit de rectification : Vous pouvez mettre à jour ou corriger toute donnée inexacte ou incomplète.</li>
                <li>Droit à l'effacement : Vous pouvez demander la suppression de vos données personnelles, sous certaines conditions.</li>
                <li>Droit de restriction : Vous pouvez demander la suspension temporaire du traitement de vos données.</li>
                <li>Droit à la portabilité des données : Vous pouvez recevoir vos données dans un format structuré et lisible par machine.</li>
                <li>Droit d'opposition : Vous pouvez vous opposer au traitement de vos données à des fins de marketing.</li>
                <li>Droit de retirer le consentement : Si vous avez donné votre consentement pour le traitement des données, vous pouvez le retirer à tout moment.</li>
            </ul>

            <h3>7. Comment exercer vos droits</h3>
            <p>Pour exercer vos droits, veuillez nous contacter à :</p>
            <ul>
                <li><b>Email : </b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>

            <h3>8. Cookies et technologies de suivi</h3>
            <p>Nous utilisons des cookies pour améliorer votre expérience sur notre site web.</p>

            <h3>9. Fournisseurs de services tiers</h3>
            <p>Nous pouvons partager vos données personnelles avec des fournisseurs de services tiers qui nous aident à exploiter notre site web et nos services, tels que des processeurs de paiements, des plateformes de marketing par e-mail et des fournisseurs de stockage dans le cloud. Tous nos partenaires tiers sont contractuellement tenus de respecter le RGPD.</p>

            <h3>10. Conservation des données</h3>
            <p>Nous conserverons vos données personnelles pendant le temps nécessaire pour remplir les objectifs définis dans cette politique de confidentialité. Par exemple, nous pourrions conserver les informations de facturation pendant un certain temps, comme l'exigent les lois fiscales et comptables.</p>

            <h3>11. Transferts de données en dehors de l'UE</h3>
            <p>Nous ne transférons pas de données personnelles en dehors de l'Union Européenne (UE).</p>

            <h3>12. Modifications de cette politique</h3>
            <p>Nous pouvons mettre à jour cette politique de confidentialité RGPD de temps en temps. Toute modification sera publiée sur cette page et nous vous en informerons par e-mail en cas de changement important.</p>

            <h3>13. Informations de contact</h3>
            <p>Si vous avez des questions ou des préoccupations concernant notre conformité au RGPD, veuillez nous contacter :</p>
            <ul>
                <li><b>Email : </b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>
        </Col>
        <Col lg={2} />
    </Row>
}
export default GdprFr