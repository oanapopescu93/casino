import React from 'react'
import { Row, Col } from 'react-bootstrap'

function GdprEng(props){
    const {contact, settings} = props
    const { lang } = settings
    let myContact = contact[0][lang]
    let myEmail = myContact.email

    return <Row id="gdpr" className="other_page_container">
        <Col lg={2} />
        <Col lg={8}>
            <h3>1. Introduction</h3>
            <p>We value your privacy and are committed to protecting your personal data. This page outlines how we collect, use, and protect your personal information in accordance with the EU General Data Protection Regulation (GDPR).</p>

            <h3>2. What Data We Collect</h3>
            <p>We collect the following types of personal data:</p>
            <ul>
                <li>Contact information (username, email, phone number, password)</li>
                <li>Technical information (ID, UUID)</li>
                <li>Payment and transaction data</li>
                <li>User preferences and communication data</li>
            </ul>

            <h3>3. Why We Collect Your Data</h3>
            <p>We collect your personal data to:</p>
            <ul>
                <li>Provide you with personalized services and experience</li>
                <li>Process payments</li>
                <li>Communicate with you regarding your account and transactions</li>
                <li>Improve our website and services</li>
                <li>Send you newsletters and marketing communications (only if you have opted in)</li>
            </ul>

            <h3>4. How We Use Your Data</h3>
            <p>Your data is used for the following purposes:</p>
            <ul>
                <li>To communicate with you about our products, services, or updates</li>
                <li>To send marketing emails if you have subscribed to our newsletter</li>
                <li>To process your transactions securely through our payment processor</li>
                <li>To improve the quality and functionality of our website and services</li>
            </ul>

            <h3>5. How We Protect Your Data</h3>
            <p>We take appropriate security measures to protect your personal data from unauthorized access, loss, or misuse. These measures include encryption, secure servers, and regular monitoring of our systems.</p>

            <h3>6. Your Rights Under GDPR</h3>
            <p>You have the following rights regarding your personal data:</p>
            <ul>
                <li>Right to Access: You can request a copy of the personal data we hold about you.</li>
                <li>Right to Rectification: You can update or correct any inaccurate or incomplete data.</li>
                <li>Right to Erasure: You can request that we delete your personal data, subject to certain conditions.</li>
                <li>Right to Restriction: You can request a temporary halt to the processing of your data.</li>
                <li>Right to Data Portability: You can receive your data in a structured, machine-readable format.</li>
                <li>Right to Object: You can object to the processing of your data for marketing purposes.</li>
                <li>Right to Withdraw Consent: If you’ve provided consent for data processing, you can withdraw it at any time.</li>
            </ul>

            <h3>7. How to Exercise Your Rights</h3>
            <p>To exercise any of your rights, please contact us at:</p>
            <ul>
                <li><b>Email: </b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>

            <h3>8. Cookies and Tracking Technologies</h3>
            <p>We use cookies to enhance your experience on our website. </p>

            <h3>9. Third-Party Service Providers</h3>
            <p>We may share your personal data with third-party service providers who help us operate our website and services, such as payment processors, email marketing platforms, and cloud storage providers. All our third-party partners are contractually obligated to comply with GDPR.</p>

            <h3>10. Retention of Data</h3>
            <p>We will retain your personal data for as long as necessary to fulfill the purposes outlined in this privacy policy. For example, we may retain billing information for a period of time as required by tax and accounting laws.</p>
            
            <h3>11. Data Transfers Outside the EU</h3>
            <p>We do not transfer personal data outside of the European Union (EU)</p>

            <h3>12. Changes to This Policy</h3>
            <p>We may update this GDPR policy from time to time. Any changes will be posted on this page, and we will notify you by email if there are significant changes.</p>

            <h3>13. Contact Information</h3>
            <p>If you have any questions or concerns about our GDPR compliance, please contact us:</p>
            <ul>
                <li><b>Email: </b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>
        </Col>
        <Col lg={2} />
    </Row>
}
export default GdprEng