import React from 'react'
import { Row, Col } from 'react-bootstrap'

function GdprIt(props){
    const {contact, settings} = props
    const { lang } = settings
    let myContact = contact[0][lang]
    let myEmail = myContact.email
    
    return <Row id="gdpr" className="other_page_container">
        <Col lg={2} />
        <Col lg={8}>
            <h3>1. Introduzione</h3>
            <p>Attribuiamo grande valore alla tua privacy e ci impegniamo a proteggere i tuoi dati personali. Questa pagina spiega come raccogliamo, utilizziamo e proteggiamo le tue informazioni personali in conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR) dell'UE.</p>

            <h3>2. Quali dati raccogliamo</h3>
            <p>Raccogliamo i seguenti tipi di dati personali:</p>
            <ul>
                <li>Informazioni di contatto (nome utente, e-mail, numero di telefono, password)</li>
                <li>Informazioni tecniche (ID, UUID)</li>
                <li>Dati di pagamento e transazioni</li>
                <li>Preferenze degli utenti e dati di comunicazione</li>
            </ul>

            <h3>3. Perché raccogliamo i tuoi dati</h3>
            <p>Raccogliamo i tuoi dati personali per:</p>
            <ul>
                <li>Fornirti servizi personalizzati e un'esperienza unica</li>
                <li>Elaborare i pagamenti</li>
                <li>Comunicare con te riguardo al tuo account e alle tue transazioni</li>
                <li>Migliorare il nostro sito web e i nostri servizi</li>
                <li>Inviarti newsletter e comunicazioni di marketing (solo se hai fornito il tuo consenso)</li>
            </ul>

            <h3>4. Come utilizziamo i tuoi dati</h3>
            <p>I tuoi dati sono utilizzati per i seguenti scopi:</p>
            <ul>
                <li>Per comunicare con te riguardo ai nostri prodotti, servizi o aggiornamenti</li>
                <li>Per inviare e-mail di marketing se sei iscritto alla nostra newsletter</li>
                <li>Per elaborare le tue transazioni in modo sicuro attraverso il nostro processore di pagamento</li>
                <li>Per migliorare la qualità e le funzionalità del nostro sito web e dei nostri servizi</li>
            </ul>

            <h3>5. Come proteggiamo i tuoi dati</h3>
            <p>Adottiamo misure di sicurezza adeguate per proteggere i tuoi dati personali da accessi non autorizzati, perdita o uso improprio. Queste misure includono crittografia, server sicuri e monitoraggio regolare dei nostri sistemi.</p>

            <h3>6. I tuoi diritti ai sensi del GDPR</h3>
            <p>Hai i seguenti diritti relativi ai tuoi dati personali:</p>
            <ul>
                <li>Diritto di accesso: Puoi richiedere una copia dei dati personali che conserviamo su di te.</li>
                <li>Diritto di rettifica: Puoi aggiornare o correggere dati inesatti o incompleti.</li>
                <li>Diritto alla cancellazione: Puoi richiedere che i tuoi dati personali vengano eliminati, soggetti a determinate condizioni.</li>
                <li>Diritto di limitazione: Puoi richiedere una sospensione temporanea del trattamento dei tuoi dati.</li>
                <li>Diritto alla portabilità dei dati: Puoi ricevere i tuoi dati in un formato strutturato e leggibile da una macchina.</li>
                <li>Diritto di opposizione: Puoi opporti al trattamento dei tuoi dati per scopi di marketing.</li>
                <li>Diritto di revoca del consenso: Se hai fornito il tuo consenso per il trattamento dei dati, puoi revocarlo in qualsiasi momento.</li>
            </ul>

            <h3>7. Come esercitare i tuoi diritti</h3>
            <p>Per esercitare i tuoi diritti, contattaci a:</p>
            <ul>
                <li><b>Email: </b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>

            <h3>8. Cookie e tecnologie di tracciamento</h3>
            <p>Utilizziamo cookie per migliorare la tua esperienza sul nostro sito web.</p>

            <h3>9. Fornitori di servizi terzi</h3>
            <p>Possiamo condividere i tuoi dati personali con fornitori di servizi terzi che ci aiutano a gestire il nostro sito web e i nostri servizi, come processori di pagamento, piattaforme di email marketing e fornitori di cloud storage. Tutti i nostri partner terzi sono contrattualmente obbligati a rispettare il GDPR.</p>

            <h3>10. Conservazione dei dati</h3>
            <p>Conserveremo i tuoi dati personali per il tempo necessario a soddisfare gli scopi indicati in questa politica sulla privacy. Ad esempio, potremmo conservare le informazioni di fatturazione per un periodo di tempo richiesto dalle leggi fiscali e contabili.</p>

            <h3>11. Trasferimento dei dati fuori dall'UE</h3>
            <p>Non trasferiamo dati personali al di fuori dell'Unione Europea (UE).</p>

            <h3>12. Modifiche a questa politica</h3>
            <p>Potremmo aggiornare questa politica GDPR di tanto in tanto. Qualsiasi modifica verrà pubblicata su questa pagina e ti informeremo via email in caso di modifiche significative.</p>

            <h3>13. Informazioni di contatto</h3>
            <p>Se hai domande o dubbi sulla nostra conformità al GDPR, contattaci:</p>
            <ul>
                <li><b>Email: </b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>
        </Col>
        <Col lg={2} />
    </Row>
}
export default GdprIt