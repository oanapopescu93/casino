import React from 'react'
import { Col, Row } from 'react-bootstrap'
import GooglePayButton from '@google-pay/button-react'
import { convertCurrency } from '../../../../utils/utils'

function Google(props) {
    const { 
        settings, amount, exchange_rates, 
        handlePaymentDataChanged, handlePaymentAuthorized, handlePaymentGoogle 
    } = props
    const { currency } = settings
    let price = convertCurrency(amount, currency, exchange_rates).toString()    

    return <Row id="payment_form_google">        
        <Col sm={12} className="google_pay_button_container">
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
                                gateway: 'example',
                                gatewayMerchantId: 'exampleGatewayMerchantId',
                              },
                            },
                          },
                    ],
                    merchantInfo: {
                        merchantId: '12345678901234567890',
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
                onLoadPaymentData={paymentData => {
                    handlePaymentGoogle(paymentData)
                }}
                onPaymentAuthorized={handlePaymentAuthorized}
                onPaymentDataChanged={handlePaymentDataChanged}
                existingPaymentMethodRequired='false'
                buttonColor='white'
                buttonType='Pay'
                className="google_pay_button"
                buttonRadius={100}
                buttonSizeMode='fill'
                buttonLocale='it'
            />
        </Col>
    </Row>
}

export default Google