import React from 'react'
import { Row, Col } from 'react-bootstrap'

function GdprPt(props){
    const {contact, settings} = props
    const { lang } = settings
    let myContact = contact[0][lang]
    let myEmail = myContact.email
    
    return <Row id="gdpr" className="other_page_container">
        <Col lg={2} />
        <Col lg={8}>
            <h3>1. Introdução</h3>
            <p>Valorizamos a sua privacidade e estamos comprometidos em proteger os seus dados pessoais. Esta página explica como coletamos, usamos e protegemos as suas informações pessoais de acordo com o Regulamento Geral de Proteção de Dados (RGPD) da UE.</p>

            <h3>2. Que dados coletamos</h3>
            <p>Coletamos os seguintes tipos de dados pessoais:</p>
            <ul>
                <li>Informações de contato (nome de usuário, e-mail, número de telefone, senha)</li>
                <li>Informações técnicas (ID, UUID)</li>
                <li>Dados de pagamento e transações</li>
                <li>Preferências dos usuários e dados de comunicação</li>
            </ul>

            <h3>3. Por que coletamos os seus dados</h3>
            <p>Coletamos os seus dados pessoais para:</p>
            <ul>
                <li>Fornecer serviços personalizados e uma experiência única</li>
                <li>Processar pagamentos</li>
                <li>Comunicar com você sobre sua conta e transações</li>
                <li>Melhorar nosso site e serviços</li>
                <li>Enviar newsletters e comunicações de marketing (apenas se você tiver consentido)</li>
            </ul>

            <h3>4. Como usamos os seus dados</h3>
            <p>Os seus dados são usados para os seguintes propósitos:</p>
            <ul>
                <li>Para comunicar com você sobre nossos produtos, serviços ou atualizações</li>
                <li>Para enviar e-mails de marketing se você estiver inscrito na nossa newsletter</li>
                <li>Para processar as suas transações de forma segura por meio do nosso processador de pagamento</li>
                <li>Para melhorar a qualidade e a funcionalidade do nosso site e serviços</li>
            </ul>

            <h3>5. Como protegemos os seus dados</h3>
            <p>Adotamos medidas de segurança adequadas para proteger os seus dados pessoais contra acessos não autorizados, perda ou uso indevido. Essas medidas incluem criptografia, servidores seguros e monitoramento regular de nossos sistemas.</p>

            <h3>6. Os seus direitos sob o RGPD</h3>
            <p>Você tem os seguintes direitos em relação aos seus dados pessoais:</p>
            <ul>
                <li>Direito de acesso: Você pode solicitar uma cópia dos dados pessoais que possuímos sobre você.</li>
                <li>Direito de retificação: Você pode atualizar ou corrigir dados imprecisos ou incompletos.</li>
                <li>Direito ao apagamento: Você pode solicitar que os seus dados pessoais sejam apagados, sujeitos a certas condições.</li>
                <li>Direito de restrição: Você pode solicitar a suspensão temporária do processamento dos seus dados.</li>
                <li>Direito à portabilidade dos dados: Você pode receber os seus dados em um formato estruturado e legível por máquina.</li>
                <li>Direito de oposição: Você pode se opor ao processamento dos seus dados para fins de marketing.</li>
                <li>Direito de retirar o consentimento: Se você deu consentimento para o processamento dos dados, pode retirá-lo a qualquer momento.</li>
            </ul>

            <h3>7. Como exercer os seus direitos</h3>
            <p>Para exercer os seus direitos, entre em contato conosco em:</p>
            <ul>
                <li><b>Email: </b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>

            <h3>8. Cookies e tecnologias de rastreamento</h3>
            <p>Usamos cookies para melhorar a sua experiência em nosso site.</p>

            <h3>9. Fornecedores de serviços terceirizados</h3>
            <p>Podemos compartilhar os seus dados pessoais com fornecedores de serviços terceirizados que nos ajudam a operar nosso site e serviços, como processadores de pagamento, plataformas de marketing por e-mail e provedores de armazenamento em nuvem. Todos os nossos parceiros terceirizados são contratualmente obrigados a cumprir o RGPD.</p>

            <h3>10. Retenção de dados</h3>
            <p>Reteremos os seus dados pessoais pelo tempo necessário para cumprir os objetivos descritos nesta política de privacidade. Por exemplo, podemos reter informações de faturamento por um período de tempo conforme exigido por leis fiscais e contábeis.</p>

            <h3>11. Transferência de dados fora da UE</h3>
            <p>Não transferimos dados pessoais para fora da União Europeia (UE).</p>

            <h3>12. Alterações a esta política</h3>
            <p>Podemos atualizar esta política de RGPD periodicamente. Quaisquer alterações serão publicadas nesta página, e notificaremos você por e-mail em caso de alterações significativas.</p>

            <h3>13. Informações de contato</h3>
            <p>Se você tiver dúvidas ou preocupações sobre nossa conformidade com o RGPD, entre em contato conosco:</p>
            <ul>
                <li><b>Email: </b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>
        </Col>
        <Col lg={2} />
    </Row>
}
export default GdprPt