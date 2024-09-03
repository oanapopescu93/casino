import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { translate } from '../../../translations/translate'

function PolicyPrivacyZh(props){
    const {settings} = props
    const {lang} = settings
    let dispatch = useDispatch()

    function handleContact(){
        dispatch(changePage('Contact'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    return <Row id="policy_privacy" className="other_page_container">
        <Col lg={2} />
        <Col lg={8}>
            <h3>介绍</h3>
            <p>本隐私政策文件概述了我们如何收集、使用、披露和保护从我们赌场网站用户那里获得的个人信息。我们致力于确保提供给我们的所有个人信息的隐私和安全。通过使用我们的网站，您同意本文档中描述的做法。</p>
            
            <h3>个人信息的收集</h3>
            <p>我们可能会从用户那里收集以下类型的个人信息：</p>
            <ul>
                <li><b>联系信息：</b>包括您的姓名、电子邮件地址、电话号码和邮寄地址。</li>
                <li><b>账户信息：</b>如果您在我们的网站上创建账户，我们可能会收集您的用户名、密码和其他与账户相关的详细信息。</li>
                <li><b>财务信息：</b>进行交易时，我们可能会收集支付卡详细信息、银行账户信息以及处理付款所需的其他财务详细信息。</li>
                <li><b>使用信息：</b>我们收集您如何与我们的网站互动的信息，例如访问的页面、点击的链接和其他操作。</li>
                <li><b>设备信息：</b>我们可能会收集您用来访问我们网站的设备信息，包括IP地址、浏览器类型、操作系统和唯一设备标识符。</li>
            </ul>
            
            <h3>个人信息的使用</h3>
            <p>我们可能会将个人信息用于以下目的：</p>
            <ul>
                <li><b>提供服务：</b>为您提供访问我们赌场游戏的权限、处理交易以及提供客户支持。</li>
                <li><b>个性化：</b>个性化您的网站体验，包括展示相关内容、促销和推荐。</li>
                <li><b>沟通：</b>与您就更新、促销和我们服务的其他相关信息进行沟通。</li>
                <li><b>安全：</b>监控和确保我们网站的安全，检测和防止欺诈，并保护免受未经授权的访问。</li>
                <li><b>法律合规：</b>遵守适用的法律、法规和法律义务。</li>
            </ul>
            
            <h3>个人信息的披露</h3>
            <p>我们可能会向以下实体或在以下情况下披露个人信息：</p>
            <ul>
                <li><b>服务提供商：</b>我们可能会与可信的第三方服务提供商分享个人信息，这些服务提供商帮助我们提供服务，例如支付处理、客户支持和数据分析提供商。这些服务提供商有合同义务保护个人信息的机密性和安全性。</li>
                <li><b>法律要求：</b>如果法律要求或我们认为这种披露是保护我们权利、遵守法律程序或响应政府或监管机构要求所必需的，我们可能会披露个人信息。</li>
                <li><b>业务转移：</b>在合并、收购或全部或部分资产出售的情况下，个人信息可能会转移给收购方。</li>
            </ul>
            
            <h3>数据安全</h3>
            <p>我们采用行业标准的安全措施来保护个人信息免受未经授权的访问、披露、篡改或破坏。然而，通过互联网进行的传输或电子存储方法并不完全安全，我们不能保证绝对的安全。</p>
            
            <h3>数据保留</h3>
            <p>我们将保留个人信息，只要有必要实现本隐私政策中概述的目的，除非法律要求或允许更长的保留期。</p>
            
            <h3>您的权利</h3>
            <p>作为用户，您对您的个人信息享有某些权利，包括访问、更正、删除和限制处理您信息的权利。您也可能有权反对某些处理活动并撤回同意。</p>
            
            <h3>第三方网站</h3>
            <p>我们的网站可能包含指向第三方网站的链接。我们不对这些网站的隐私实践或内容负责。我们建议您在提供任何个人信息之前查看任何第三方网站的隐私政策。</p>
            
            <h3>本政策的更新</h3>
            <p>我们保留定期更新本隐私政策的权利，以反映我们实践或适用法律的变化。我们将在我们的网站上发布更新版本，并注明修订的生效日期。</p>
            
            <h3>联系我们</h3>
            <p>如果您对本隐私政策或我们处理您的个人信息有任何疑问、担忧或请求，请联系我们。</p>
        </Col>
        <Col lg={2} />
    </Row>
}
export default PolicyPrivacyZh