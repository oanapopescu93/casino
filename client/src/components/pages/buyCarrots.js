import React from 'react'
import { translate } from '../../translations/translate'
import Payment from '../partials/payment/payment'
import Header from '../partials/header'
import { Col, Row } from 'react-bootstrap'

function BuyCarrots(props){
    return <div className="content_wrap">
        <Header template="buy_carrots" title={translate({lang: props.lang, info: "buy_carrots"})} />
        <div className="page_content">
            <Row>
                <Col lg={2} />
                <Col lg={8}>
                    <Payment {...props} template="buy_carrots" />
                </Col>
                <Col lg={2} />
            </Row>
        </div>
    </div>
}
export default BuyCarrots