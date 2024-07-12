import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { useDispatch } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'

function AboutPT(props){
    const {settings, casino_name} = props
    const {lang} = settings
    let dispatch = useDispatch()
    function handleHowToPlay(){
        dispatch(changePage("how_to_play"))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }
    return (
        <Row id="about" className="other_page_container">
            <Col lg={2} />
            <Col lg={8}>
                <p>Bem-vindo ao {casino_name}, um projeto feito com amor por um grupo de entusiastas de cassino dedicados a compartilhar sua paixão pelo jogo com o mundo. Embora não sejamos um cassino comercial (pelo menos, ainda não), nossa missão é fornecer uma experiência de jogo única e agradável para nossos colegas entusiastas de jogos.</p>
                <h3>Nossa História:</h3>
                <p>{casino_name} começou como um projeto pessoal, nascido de nosso amor profundo por tudo que diz respeito a cassinos. Como jogadores ávidos, sempre sonhamos em criar um espaço onde as pessoas possam desfrutar da emoção dos jogos de cassino sem a pressão de interesses comerciais. Este projeto é um testemunho de nosso compromisso com o mundo dos jogos e nossa vontade de construir algo realmente especial.</p>
                <h3>Por que {casino_name}?</h3>
                <ul>
                    <li><b>Jogos Movidos pela Paixão: </b>Nossos jogos são cuidadosamente selecionados e refletem nossa paixão por jogabilidade de qualidade. De jogos de mesa clássicos a experiências únicas e exclusivas, nos esforçamos para oferecer algo para todo tipo de jogador.</li>
                    <li><b>Sem Pressões Comerciais: </b>Como não somos impulsionados pelo lucro, podemos nos concentrar exclusivamente em oferecer experiências de jogo excepcionais sem a necessidade de incentivar os jogadores a gastarem mais. Nosso objetivo é tornar o jogo agradável, puro e livre de qualquer pressão comercial.</li>
                    <li><b>Centrado na Comunidade: </b>Estamos construindo uma comunidade de jogadores com mentalidade semelhante que compartilham nossa paixão pelo jogo. Conecte-se com outros entusiastas, compartilhe suas experiências e faça parte de nossa comunidade amigável e inclusiva.</li>
                    <li><b>Sem Riscos, Tudo Diversão: </b>Como um projeto não comercial, aqui não há dinheiro real envolvido. Isso significa que você pode aproveitar os jogos sem o risco de perder seu dinheiro suado. É tudo sobre se divertir, puro e simples.</li>
                </ul>
                <h3>Nosso Compromisso:</h3>
                <p>Embora {casino_name} não seja um empreendimento comercial, estamos comprometidos em garantir um ambiente de jogo justo e seguro. Seguimos as melhores práticas quando se trata de equidade nos jogos, e sua privacidade e segurança são nossa maior preocupação.</p>
                <p>Sempre estamos abertos a feedback e sugestões de nossos jogadores para melhorar a experiência geral de jogo. Sua opinião é inestimável enquanto trabalhamos para expandir e aprimorar nossas ofertas.</p>
                <p>Junte-se a nós no {casino_name} e faça parte de nossa crescente comunidade de jogadores apaixonados. Embora não sejamos um cassino comercial, somos uma plataforma construída com amor pelo jogo e o desejo de criar algo verdadeiramente especial. Então, pegue suas fichas virtuais, jogue os dados e gire as bobinas para uma experiência de jogo que é toda sobre a pura alegria de jogar.</p>
                <p>Obrigado por fazer parte de nossa jornada em {casino_name}. Estamos ansiosos para compartilhar muitos momentos memoráveis no mundo dos jogos juntos.</p>
                <p id="about_how_to_play" onClick={()=>handleHowToPlay()}><FontAwesomeIcon icon={faCircleQuestion} />{translate({lang: lang, info: "how_to_play"})}</p>
            </Col>
            <Col lg={2} />
        </Row>
    )
}
export default AboutPT