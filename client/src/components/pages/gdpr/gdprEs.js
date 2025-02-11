import React from 'react'
import { Row, Col } from 'react-bootstrap'

function GdprEs(props){
    const {contact, settings} = props
    const { lang } = settings
    let myContact = contact[0][lang]
    let myEmail = myContact.email
    
    return <Row id="gdpr" className="other_page_container">
        <Col lg={2} />
        <Col lg={8}>
            <h3>1. Introducción</h3>
            <p>Valoramos su privacidad y estamos comprometidos con la protección de sus datos personales. Esta página describe cómo recopilamos, usamos y protegemos su información personal de acuerdo con el Reglamento General de Protección de Datos (GDPR) de la UE.</p>

            <h3>2. Qué datos recopilamos</h3>
            <p>Recopilamos los siguientes tipos de datos personales:</p>
            <ul>
                <li>Información de contacto (nombre de usuario, correo electrónico, número de teléfono, contraseña)</li>
                <li>Información técnica (ID, UUID)</li>
                <li>Datos de pagos y transacciones</li>
                <li>Preferencias del usuario y datos de comunicación</li>
            </ul>

            <h3>3. Por qué recopilamos sus datos</h3>
            <p>Recopilamos sus datos personales para:</p>
            <ul>
                <li>Brindarle servicios y experiencias personalizadas</li>
                <li>Procesar pagos</li>
                <li>Comunicarnos con usted sobre su cuenta y transacciones</li>
                <li>Mejorar nuestro sitio web y servicios</li>
                <li>Enviar boletines y comunicaciones de marketing (solo si ha aceptado recibirlos)</li>
            </ul>

            <h3>4. Cómo usamos sus datos</h3>
            <p>Sus datos se utilizan para los siguientes fines:</p>
            <ul>
                <li>Para comunicarnos con usted sobre nuestros productos, servicios o actualizaciones</li>
                <li>Para enviar correos electrónicos de marketing si se ha suscrito a nuestro boletín</li>
                <li>Para procesar sus transacciones de manera segura a través de nuestro procesador de pagos</li>
                <li>Para mejorar la calidad y funcionalidad de nuestro sitio web y servicios</li>
            </ul>

            <h3>5. Cómo protegemos sus datos</h3>
            <p>Tomamos medidas de seguridad adecuadas para proteger sus datos personales contra el acceso no autorizado, la pérdida o el uso indebido. Estas medidas incluyen cifrado, servidores seguros y monitoreo regular de nuestros sistemas.</p>

            <h3>6. Sus derechos según el GDPR</h3>
            <p>Usted tiene los siguientes derechos con respecto a sus datos personales:</p>
            <ul>
                <li>Derecho de acceso: Puede solicitar una copia de los datos personales que tenemos sobre usted.</li>
                <li>Derecho de rectificación: Puede actualizar o corregir cualquier dato inexacto o incompleto.</li>
                <li>Derecho de supresión: Puede solicitar que eliminemos sus datos personales, sujeto a ciertas condiciones.</li>
                <li>Derecho de restricción: Puede solicitar una suspensión temporal del procesamiento de sus datos.</li>
                <li>Derecho a la portabilidad de los datos: Puede recibir sus datos en un formato estructurado y legible por máquina.</li>
                <li>Derecho de oposición: Puede oponerse al procesamiento de sus datos con fines de marketing.</li>
                <li>Derecho a retirar el consentimiento: Si ha dado su consentimiento para el procesamiento de datos, puede retirarlo en cualquier momento.</li>
            </ul>

            <h3>7. Cómo ejercer sus derechos</h3>
            <p>Para ejercer cualquiera de sus derechos, contáctenos en:</p>
            <ul>
                <li><b>Correo electrónico: </b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>

            <h3>8. Cookies y tecnologías de seguimiento</h3>
            <p>Utilizamos cookies para mejorar su experiencia en nuestro sitio web.</p>

            <h3>9. Proveedores de servicios de terceros</h3>
            <p>Podemos compartir sus datos personales con proveedores de servicios externos que nos ayudan a operar nuestro sitio web y servicios, como procesadores de pagos, plataformas de marketing por correo electrónico y proveedores de almacenamiento en la nube. Todos nuestros socios externos están contractualmente obligados a cumplir con el GDPR.</p>

            <h3>10. Retención de datos</h3>
            <p>Conservaremos sus datos personales durante el tiempo necesario para cumplir con los fines establecidos en esta política de privacidad. Por ejemplo, podemos conservar la información de facturación durante un período de tiempo según lo requieran las leyes fiscales y contables.</p>

            <h3>11. Transferencias de datos fuera de la UE</h3>
            <p>No transferimos datos personales fuera de la Unión Europea (UE).</p>

            <h3>12. Cambios en esta política</h3>
            <p>Podemos actualizar esta política de GDPR de vez en cuando. Cualquier cambio será publicado en esta página, y le notificaremos por correo electrónico si hay cambios significativos.</p>

            <h3>13. Información de contacto</h3>
            <p>Si tiene alguna pregunta o inquietud sobre nuestro cumplimiento con el GDPR, contáctenos:</p>
            <ul>
                <li><b>Correo electrónico: </b><a href={'mailto:' + myEmail}>{myEmail}</a></li>
            </ul>
        </Col>
        <Col lg={2} />
    </Row>
}
export default GdprEs