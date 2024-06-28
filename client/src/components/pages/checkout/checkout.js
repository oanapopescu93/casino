import React from 'react'
import { translate } from '../../../translations/translate'
import Payment from '../../partials/payment/payment'
import Header from '../../partials/header'
import { Col, Row } from 'react-bootstrap'

function Checkout(props){
    return <div className="content_wrap">
        <Header template="checkout" title={translate({lang: props.lang, info: "checkout"})} />
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