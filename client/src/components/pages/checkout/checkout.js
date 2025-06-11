import React from 'react'
import { translate } from '../../../translations/translate'
import Payment from '../../partials/payment/payment'
import Header from '../../partials/header'
import { Col, Row } from 'react-bootstrap'

function Checkout(props){
    const {settings} = props
    const {lang, theme} = settings

    return <div className="content_wrap">
        <Header template="checkout" title={translate({lang, info: "checkout"})} lang={lang} theme={theme}/>
        <div className="page_content">
            <Row>
                <Col lg={2} />
                <Col lg={8}>
                    <Payment {...props} template="checkout" />
                </Col>
                <Col lg={2} />
            </Row>
        </div>
    </div>
}
export default Checkout