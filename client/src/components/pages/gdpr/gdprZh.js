import React from 'react'
import { Row, Col } from 'react-bootstrap'

function GdprZh(props){
    const {contact, settings} = props
    const { lang } = settings
    let myContact = contact[0][lang]
    let myEmail = myContact.email
    
    return <Row id="gdpr" className="other_page_container">
        <Col lg={2} />
        <Col lg={8}>
            <h3>1. 介绍</h3>
            <p><b>我们重视您的隐私，并承诺保护您的个人数据。本页面解释了我们如何根据《欧盟通用数据保护条例》（GDPR）收集、使用和保护您的个人信息。</b></p>

            <h3>2. 我们收集哪些数据</h3>
            <p>我们收集以下类型的个人数据：</p>
            <ul>
                <li>联系信息（用户名、电子邮件、电话号码、密码）</li>
                <li>技术信息（ID、UUID）</li>
                <li>支付和交易数据</li>
                <li>用户偏好和通讯数据</li>
            </ul>

            <h3>3. 我们为何收集您的数据</h3>
            <p>我们收集您的个人数据是为了：</p>
            <ul>
                <li>为您提供个性化服务和体验</li>
                <li>处理付款</li>
                <li>与您就账户和交易进行沟通</li>
                <li>改进我们的网站和服务</li>
                <li>向您发送新闻通讯和营销信息（仅在您同意的情况下）</li>
            </ul>

            <h3>4. 我们如何使用您的数据</h3>
            <p>您的数据将用于以下目的：</p>
            <ul>
                <li>与您沟通我们的产品、服务或更新</li>
                <li>如果您订阅了我们的新闻通讯，向您发送营销邮件</li>
                <li>通过我们的支付处理器安全地处理您的交易</li>
                <li>改进我们的网站和服务的质量和功能</li>
            </ul>

            <h3>5. 我们如何保护您的数据</h3>
            <p>我们采取适当的安全措施，防止您的个人数据遭到未经授权的访问、丢失或滥用。这些措施包括加密、使用安全服务器以及对我们的系统进行定期监控。</p>

            <h3>6. 您在GDPR下的权利</h3>
            <p>您对您的个人数据拥有以下权利：</p>
            <ul>
                <li>访问权：您可以请求获取我们所持有的关于您的个人数据的副本。</li>
                <li>更正权：您可以更新或更正任何不准确或不完整的数据。</li>
                <li>删除权：在某些条件下，您可以请求我们删除您的个人数据。</li>
                <li>限制权：您可以请求暂时停止处理您的数据。</li>
                <li>数据可携权：您可以以结构化、机器可读的格式获取您的数据。</li>
                <li>反对权：您可以反对为了营销目的处理您的数据。</li>
                <li>撤回同意权：如果您已经同意数据处理，您可以随时撤回您的同意。</li>
            </ul>

            <h3>7. 如何行使您的权利</h3>
            <p>如果您想行使您的权利，请通过以下方式联系我们：</p>
            <ul>
                <li><b>电子邮件：</b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>

            <h3>8. Cookies和追踪技术</h3>
            <p>我们使用Cookies来提升您在我们网站上的体验。</p>

            <h3>9. 第三方服务提供商</h3>
            <p>我们可能会与帮助我们运营网站和服务的第三方服务提供商分享您的个人数据，例如支付处理器、电子邮件营销平台和云存储服务提供商。所有我们的第三方合作伙伴均被合同要求遵守GDPR。</p>

            <h3>10. 数据保留</h3>
            <p>我们会在完成本隐私政策中概述的目的所需的时间内保留您的个人数据。例如，我们可能会根据税务和会计法律的要求保留账单信息。</p>

            <h3>11. 数据转移到欧盟以外</h3>
            <p>我们不会将个人数据转移到欧盟（EU）以外。</p>

            <h3>12. 本政策的变更</h3>
            <p>我们可能会不时更新本GDPR政策。任何更改都将发布在本页面上，如果有重大更改，我们会通过电子邮件通知您。</p>

            <h3>13. 联系信息</h3>
            <p>如果您对我们的GDPR合规性有任何疑问或疑虑，请联系我们：</p>
            <ul>
                <li><b>电子邮件：</b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>
        </Col>
        <Col lg={2} />
    </Row>
}
export default GdprZh