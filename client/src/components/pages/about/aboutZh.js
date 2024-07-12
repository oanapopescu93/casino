import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { useDispatch } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons'

function AboutZh(props){
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
            <p>欢迎来到 {casino_name}，这是由一群致力于向世界分享他们对游戏热情的赌场爱好者们创造的爱的结晶。虽然我们不是一家商业赌场（至少，目前还不是），我们的使命是为我们的游戏爱好者提供独特而愉快的游戏体验。</p>
            <h3>我们的故事：</h3>
            <p>{casino_name} 始于一个宠物项目，源于我们对所有赌场事物的深厚热爱。作为狂热的玩家，我们一直梦想着创建一个空间，让人们可以享受赌场游戏的刺激而不受商业利益的压力。这个项目是我们对游戏世界的承诺，也是我们渴望建造一些真正特别的东西的见证。</p>
            <h3>为什么选择 {casino_name}?</h3>
            <ul>
                <li><b>激情驱动的游戏：</b>我们的游戏经过精心策划，反映了我们对高质量游戏体验的热情。从经典桌面游戏到独特的、独一无二的体验，我们努力为每种类型的游戏玩家提供一些特别的东西。</li>
                <li><b>没有商业压力：</b>由于我们不以利润为驱动，我们可以专注于提供卓越的游戏体验，而不需要推动玩家花更多钱。我们的目标是使游戏愉快、纯粹，并且没有任何商业压力。</li>
                <li><b>以社区为中心：</b>我们正在建立一个志同道合的玩家社区，他们与我们一样热爱游戏。与其他爱好者联系，分享你的经验，成为我们友好、包容社区的一部分。</li>
                <li><b>零风险，纯粹乐趣：</b>作为一个非商业项目，这里没有涉及真钱。这意味着你可以享受游戏，而不必担心失去辛苦赚来的钱。这里的一切都是为了纯粹的乐趣。</li>
            </ul>
            <h3>我们的承诺：</h3>
            <p>虽然 {casino_name} 不是一个商业项目，但我们致力于确保公平和安全的游戏环境。我们遵循最佳实践，以确保游戏公平，你的隐私和安全是我们的最重要关注点。</p>
            <p>我们始终欢迎玩家的反馈和建议，以改善整体游戏体验。你的意见对我们非常宝贵，因为我们致力于扩展和增强我们的产品。</p>
            <p>加入我们在 {casino_name}，成为我们不断壮大的热情玩家社区的一员。虽然我们不是一家商业赌场，但我们是一个基于对游戏热爱的平台，致力于创造一些真正特别的东西。所以，拿上你的虚拟筹码，掷骰子，转动转盘，享受纯粹的游戏乐趣。</p>
            <p>感谢你成为我们 {casino_name} 旅程的一部分。我们期待在游戏世界中与你分享许多难忘的时刻。</p>
            <p id="about_how_to_play" onClick={()=>handleHowToPlay()}><FontAwesomeIcon icon={faCircleQuestion} />{translate({lang: lang, info: "how_to_play"})}</p>
        </Col>
        <Col lg={2} />
    </Row>
}
export default AboutZh