import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { translate } from '../../../translations/translate'

function TermsConditionsZh(props){
    const {settings} = props
    const {lang} = settings
    let dispatch = useDispatch()

    function handleContact(){
        dispatch(changePage('Contact'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    return <Row id="terms_conditions" className="other_page_container">
        <Col lg={2} />
        <Col lg={8}>
            <p>在使用我们的赌场网站服务之前，请仔细阅读这些条款和条件。</p>
        
            <h3>接受条款</h3>
            <p>通过访问或使用服务，您同意受这些条款的约束。如果您不同意任何部分的条款，则您不得访问服务。</p>
        
            <h3>资格</h3>
            <p>您必须年满18岁或您所在司法管辖区的合法赌博年龄（以较高者为准）才能使用我们的服务。使用服务即表示您声明并保证您符合资格标准。</p>
        
            <h3>账户注册</h3>
            <p>要访问服务的某些功能，您可能需要创建一个账户。您有责任维护账户凭证的机密性，并对在您的账户下发生的所有活动负责。</p>
        
            <h3>禁止活动</h3>
            <p>您同意不从事以下任何禁止活动：</p>
            <ul>
                <li>违反任何适用的法律或法规</li>
                <li>冒充任何个人或实体，或虚假陈述或以其他方式歪曲您与个人或实体的关联</li>
                <li>干扰或破坏服务或连接到服务的服务器或网络</li>
                <li>从事任何形式的作弊或欺诈行为</li>
            </ul>
        
            <h3>知识产权</h3>
            <p>服务及其原创内容、功能和功能将始终是BunnyBet及其许可方的专有财产。服务受版权、商标和其他法律保护。</p>
        
            <h3>存款和取款</h3>
            <p>存款和取款受我们指定的支付方式、条款和处理时间的约束。您有责任提供准确和最新的支付信息。</p>
        
            <h3>负责任的赌博</h3>
            <p>我们提倡负责任的赌博，并提供工具和资源帮助玩家管理他们的赌博活动。我们鼓励您设定存款限额、休息以及在需要时寻求支持。赌博应被视为娱乐，而不是赚钱的手段。</p>
        
            <h3>责任限制</h3>
            <p>在法律允许的最大范围内，BunnyBet及其附属公司、董事、高级职员、员工、代理人和服务提供商不对因使用服务而产生的任何直接、间接、附带、特殊、后果性或惩罚性损害（包括利润损失）承担责任。</p>
        
            <h3>赔偿</h3>
            <p>您同意赔偿并使BunnyBet及其附属公司、董事、高级职员、员工、代理人和服务提供商免受因您使用服务而引起的任何索赔、要求、损害、责任和费用（包括合理的律师费）。</p>
        
            <h3>法律适用</h3>
            <p>这些条款应受您所在国家的法律管辖并依其解释。因这些条款引起或与之相关的任何争议应受您所在国家法院的专属管辖。</p>
        
            <h3>条款和条件的变更</h3>
            <p>我们保留随时修改或替换这些条款的权利。最新版本的条款将发布在我们的网站上。您在任何此类更改后继续使用服务即表示您接受新条款。</p>
        
            <h3>联系我们</h3>
            <p>如果您对这些条款和条件有任何问题或疑虑，请联系我们。</p>
        
            <br></br>
        
            <p>使用我们的服务即表示您确认您已阅读、理解并同意受这些条款和条件的约束。</p>

            <p id="about_contact" onClick={()=>handleContact()}><FontAwesomeIcon icon={faPaperPlane} />{translate({lang: lang, info: "contact"})}</p>
        </Col>        
        <Col lg={2} />
    </Row>
}
export default TermsConditionsZh