import React from 'react'
import { Col, Row } from 'react-bootstrap'
import GooglePayButton from '@google-pay/button-react'
import { convertCurrency } from '../../../../utils/utils'
import { translate } from '../../../../translations/translate'

function Google(props) {
    const { 
        settings, amount, exchange_rates, minimum_amount, 
        handlePaymentAuthorized 
    } = props
    const { lang, currency } = settings
    let price = convertCurrency(amount, currency, exchange_rates).toString()

    return <Row id="payment_form_google">  
        {minimum_amount >= price ? <Col sm={12}>
            <div className="alert alert-danger">
                <p className="text_red">
                    {translate({lang, info: "amount_too_small_transaction"})}
                </p>
                <p className="text_red">
                    <span>{translate({lang, info: "min_amount"})}</span>: <span>{minimum_amount} {currency}</span>
                </p>
            </div>
        </Col> : <Col sm={12} className="google_pay_button_container">
            <GooglePayButton
                environment="TEST" 
                paymentRequest={{
                    apiVersion: 2,
                    apiVersionMinor: 0,
                    allowedPaymentMethods: [
                        {
                            type: 'CARD',
                            parameters: {
                            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                            allowedCardNetworks: ['MASTERCARD', 'VISA'],
                            },
                            tokenizationSpecification: {
                            type: 'PAYMENT_GATEWAY',
                            parameters: {
                                // gateway: 'example',
                                // gatewayMerchantId: 'exampleGatewayMerchantId',
                                "gateway": "stripe",
                                "stripe:version": "2018-10-31",
                                "stripe:publishableKey": "pk_test_51Mdvu1CWq9uV6YuMZd3hU7WHAH8ixNCxcNspoauTQSlvE6EYZomi0f59zTdgfhyLXGbJc0EDFAJsQ71Prd2gZxSQ00wYw12O6K",
                            },
                            },
                        },
                    ],
                    merchantInfo: {
                        merchantId: 'BCR2DN4T2O37VQRY',
                        merchantName: 'BunnyBet',
                    },
                    transactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPriceLabel: 'Total',
                        totalPrice: price,
                        currencyCode: currency,
                        countryCode: 'RO',
                    },
                    shippingAddressRequired: false,
                    callbackIntents: ['PAYMENT_AUTHORIZATION'],
                }}
                onPaymentAuthorized={handlePaymentAuthorized}
                existingPaymentMethodRequired='false'
                buttonColor='white'
                buttonType='Pay'
                className="google_pay_button"
                buttonRadius={100}
                buttonSizeMode='fill'
                buttonLocale='it'
            />
        </Col>}
    </Row>
}

export default Google