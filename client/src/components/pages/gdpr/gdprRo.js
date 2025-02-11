import React from 'react'
import { Row, Col } from 'react-bootstrap'

function GdprRo(props){
    const {contact, settings} = props
    const { lang } = settings
    let myContact = contact[0][lang]
    let myEmail = myContact.email
    
    return <Row id="gdpr" className="other_page_container">
        <Col lg={2} />
        <Col lg={8}>
            <h3>1. Introducere</h3>
            <p>Prețuim confidențialitatea dvs. și ne angajăm să vă protejăm datele personale. Această pagină explică modul în care colectăm, utilizăm și protejăm informațiile dvs. personale, în conformitate cu Regulamentul General privind Protecția Datelor (GDPR) al UE.</p>

            <h3>2. Ce date colectăm</h3>
            <p>Colectăm următoarele tipuri de date personale:</p>
            <ul>
                <li>Informații de contact (nume de utilizator, e-mail, număr de telefon, parolă)</li>
                <li>Informații tehnice (ID, UUID)</li>
                <li>Date privind plățile și tranzacțiile</li>
                <li>Preferințe ale utilizatorilor și date de comunicare</li>
            </ul>

            <h3>3. De ce colectăm datele dvs.</h3>
            <p>Colectăm datele dvs. personale pentru:</p>
            <ul>
                <li>A vă oferi servicii personalizate și o experiență unică</li>
                <li>A procesa plăți</li>
                <li>A comunica cu dvs. despre contul și tranzacțiile dvs.</li>
                <li>A îmbunătăți site-ul nostru și serviciile noastre</li>
                <li>A trimite buletine informative și comunicări de marketing (doar dacă v-ați dat consimțământul)</li>
            </ul>

            <h3>4. Cum folosim datele dvs.</h3>
            <p>Datele dvs. sunt utilizate pentru următoarele scopuri:</p>
            <ul>
                <li>Pentru a comunica cu dvs. despre produsele, serviciile sau actualizările noastre</li>
                <li>Pentru a trimite e-mailuri de marketing dacă sunteți abonat la newsletter-ul nostru</li>
                <li>Pentru a procesa tranzacțiile dvs. în siguranță prin intermediul procesatorului nostru de plăți</li>
                <li>Pentru a îmbunătăți calitatea și funcționalitatea site-ului și serviciilor noastre</li>
            </ul>

            <h3>5. Cum protejăm datele dvs.</h3>
            <p>Luăm măsuri de securitate adecvate pentru a proteja datele dvs. personale împotriva accesului neautorizat, pierderii sau utilizării abuzive. Aceste măsuri includ criptarea, servere securizate și monitorizarea regulată a sistemelor noastre.</p>

            <h3>6. Drepturile dvs. conform GDPR</h3>
            <p>Aveți următoarele drepturi în legătură cu datele dvs. personale:</p>
            <ul>
                <li>Dreptul de acces: Puteți solicita o copie a datelor personale pe care le deținem despre dvs.</li>
                <li>Dreptul la rectificare: Puteți actualiza sau corecta datele inexacte sau incomplete.</li>
                <li>Dreptul la ștergere: Puteți solicita ștergerea datelor dvs. personale, sub rezerva anumitor condiții.</li>
                <li>Dreptul la restricționare: Puteți solicita oprirea temporară a procesării datelor dvs.</li>
                <li>Dreptul la portabilitatea datelor: Puteți primi datele dvs. într-un format structurat, care poate fi citit de mașină.</li>
                <li>Dreptul de a vă opune: Puteți să vă opuneți procesării datelor dvs. în scopuri de marketing.</li>
                <li>Dreptul de a retrage consimțământul: Dacă v-ați dat consimțământul pentru prelucrarea datelor, îl puteți retrage oricând.</li>
            </ul>

            <h3>7. Cum vă puteți exercita drepturile</h3>
            <p>Pentru a vă exercita drepturile, vă rugăm să ne contactați la:</p>
            <ul>
                <li><b>Email: </b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>

            <h3>8. Cookie-uri și tehnologii de urmărire</h3>
            <p>Folosim cookie-uri pentru a vă îmbunătăți experiența pe site-ul nostru.</p>

            <h3>9. Furnizori de servicii terți</h3>
            <p>Putem partaja datele dvs. personale cu furnizori de servicii terți care ne ajută să operăm site-ul și serviciile noastre, cum ar fi procesatori de plăți, platforme de marketing prin e-mail și furnizori de stocare în cloud. Toți partenerii noștri terți sunt obligați contractual să respecte GDPR.</p>

            <h3>10. Păstrarea datelor</h3>
            <p>Vom păstra datele dvs. personale atât timp cât este necesar pentru a îndeplini scopurile descrise în această politică de confidențialitate. De exemplu, putem păstra informații de facturare pentru o perioadă de timp conform legilor fiscale și contabile.</p>

            <h3>11. Transferul datelor în afara UE</h3>
            <p>Nu transferăm date personale în afara Uniunii Europene (UE).</p>

            <h3>12. Modificări la această politică</h3>
            <p>Putem actualiza această politică GDPR periodic. Orice modificări vor fi publicate pe această pagină, iar în cazul unor schimbări semnificative vă vom notifica prin e-mail.</p>

            <h3>13. Informații de contact</h3>
            <p>Dacă aveți întrebări sau preocupări legate de conformitatea noastră cu GDPR, vă rugăm să ne contactați:</p>
            <ul>
                <li><b>Email: </b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>
        </Col>
        <Col lg={2} />
    </Row>
}
export default GdprRo