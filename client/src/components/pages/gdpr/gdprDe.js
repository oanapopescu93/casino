import React from 'react'
import { Row, Col } from 'react-bootstrap'

function GdprDe(props){
    const {contact, settings} = props
    const { lang } = settings
    let myContact = contact[0][lang]
    let myEmail = myContact.email

    return <Row id="gdpr" className="other_page_container">
        <Col lg={2} />
        <Col lg={8}>
            <h3>1. Einführung</h3>
            <p>Wir schätzen Ihre Privatsphäre und verpflichten uns, Ihre persönlichen Daten zu schützen. Diese Seite beschreibt, wie wir Ihre persönlichen Informationen gemäß der EU-Verordnung zum Datenschutz (GDPR) erheben, verwenden und schützen.</p>

            <h3>2. Welche Daten wir erheben</h3>
            <p>Wir erheben die folgenden Arten von persönlichen Daten:</p>
            <ul>
                <li>Kontaktinformationen (Benutzername, E-Mail, Telefonnummer, Passwort)</li>
                <li>Technische Informationen (ID, UUID)</li>
                <li>Zahlungs- und Transaktionsdaten</li>
                <li>Benutzereinstellungen und Kommunikationsdaten</li>
            </ul>

            <h3>3. Warum wir Ihre Daten erheben</h3>
            <p>Wir erheben Ihre persönlichen Daten, um:</p>
            <ul>
                <li> Ihnen personalisierte Dienstleistungen und Erfahrungen anzubieten</li>
                <li> Zahlungen zu verarbeiten</li>
                <li> Mit Ihnen bezüglich Ihres Kontos und Transaktionen zu kommunizieren</li>
                <li> Unsere Website und Dienstleistungen zu verbessern</li>
                <li> Ihnen Newsletter und Marketingmitteilungen zu senden (nur wenn Sie zugestimmt haben)</li>
            </ul>

            <h3>4. Wie wir Ihre Daten verwenden</h3>
            <p>Ihre Daten werden für folgende Zwecke verwendet:</p>
            <ul>
                <li> Um mit Ihnen über unsere Produkte, Dienstleistungen oder Aktualisierungen zu kommunizieren</li>
                <li> Um Marketing-E-Mails zu senden, wenn Sie sich für unseren Newsletter angemeldet haben</li>
                <li> Um Ihre Transaktionen sicher über unseren Zahlungsprozessor zu verarbeiten</li>
                <li> Um die Qualität und Funktionalität unserer Website und Dienstleistungen zu verbessern</li>
            </ul>

            <h3>5. Wie wir Ihre Daten schützen</h3>
            <p>Wir ergreifen geeignete Sicherheitsmaßnahmen, um Ihre persönlichen Daten vor unbefugtem Zugriff, Verlust oder Missbrauch zu schützen. Diese Maßnahmen umfassen Verschlüsselung, sichere Server und regelmäßige Überwachung unserer Systeme.</p>

            <h3>6. Ihre Rechte gemäß der GDPR</h3>
            <p>Sie haben folgende Rechte in Bezug auf Ihre persönlichen Daten:</p>
            <ul>
                <li>Recht auf Auskunft: Sie können eine Kopie der persönlichen Daten anfordern, die wir über Sie speichern.</li>
                <li>Recht auf Berichtigung: Sie können ungenaue oder unvollständige Daten aktualisieren oder korrigieren.</li>
                <li>Recht auf Löschung: Sie können verlangen, dass wir Ihre persönlichen Daten löschen, vorbehaltlich bestimmter Bedingungen.</li>
                <li>Recht auf Einschränkung: Sie können verlangen, dass die Verarbeitung Ihrer Daten vorübergehend gestoppt wird.</li>
                <li>Recht auf Datenübertragbarkeit: Sie können Ihre Daten in einem strukturierten, maschinenlesbaren Format erhalten.</li>
                <li>Recht auf Widerspruch: Sie können der Verarbeitung Ihrer Daten für Marketingzwecke widersprechen.</li>
                <li>Recht auf Widerruf der Zustimmung: Wenn Sie Ihre Zustimmung zur Datenverarbeitung gegeben haben, können Sie diese jederzeit widerrufen.</li>
            </ul>

            <h3>7. Wie Sie Ihre Rechte ausüben können</h3>
            <p>Um eines Ihrer Rechte auszuüben, kontaktieren Sie uns bitte unter:</p>
            <ul>
                <li><b>E-Mail: </b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>

            <h3>8. Cookies und Tracking-Technologien</h3>
            <p>Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern.</p>

            <h3>9. Dritte Dienstleister</h3>
            <p>Wir können Ihre persönlichen Daten mit Drittanbietern teilen, die uns bei der Verwaltung unserer Website und Dienstleistungen unterstützen, wie zum Beispiel Zahlungsabwicklungsdienste, E-Mail-Marketing-Plattformen und Cloud-Speicheranbieter. Alle unsere Drittanbieter sind vertraglich verpflichtet, die Anforderungen der GDPR zu erfüllen.</p>

            <h3>10. Aufbewahrung von Daten</h3>
            <p>Wir werden Ihre persönlichen Daten nur so lange aufbewahren, wie es für die in dieser Datenschutzerklärung angegebenen Zwecke erforderlich ist. Beispielsweise können wir Rechnungsinformationen für eine gewisse Zeit aufbewahren, wie es durch Steuer- und Buchhaltungsgesetze erforderlich ist.</p>

            <h3>11. Datenübertragung außerhalb der EU</h3>
            <p>Wir übertragen keine persönlichen Daten außerhalb der Europäischen Union (EU).</p>

            <h3>12. Änderungen dieser Richtlinie</h3>
            <p>Wir können diese GDPR-Richtlinie von Zeit zu Zeit aktualisieren. Alle Änderungen werden auf dieser Seite veröffentlicht, und wir werden Sie per E-Mail benachrichtigen, wenn es wesentliche Änderungen gibt.</p>

            <h3>13. Kontaktinformation</h3>
            <p>Wenn Sie Fragen oder Bedenken hinsichtlich unserer GDPR-Compliance haben, kontaktieren Sie uns bitte:</p>
            <ul>
                <li><b>E-Mail: </b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>
        </Col>
        <Col lg={2} />
    </Row>
}
export default GdprDe