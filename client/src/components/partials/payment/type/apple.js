/* global ApplePaySession */

import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { translate } from '../../../../translations/translate'
import ApplePayButton from 'apple-pay-button'

function Apple(props) {
    const { 
        settings, amount, minimum_amount
    } = props
    const { lang, currency } = settings

    function handleClick() {
        // Define ApplePayPaymentRequest
        const applePayRequest = {
            countryCode: 'US',
            currencyCode: 'USD',
            merchantCapabilities: [
              // "supports3DS",
              "supportsEMV",
              "supportsCredit",
              "supportsDebit",
              "supportsPrepaid",
              "supportsPaymentApps"
          ],
            supportedNetworks: ["visa", "masterCard", "amex", "discover"],
            total: {
                label: "Merchant Name",
                type: "final",
                amount: "10.00",
            },
        }

        // Check for ApplePaySession
        if (window.ApplePaySession) {
            const session = new ApplePaySession(3, applePayRequest)
            handleEventsForApplePay(session)
            session.begin()
        } else {
            console.error("Apple Pay is not supported on this browser.")
        }
    }

    function handleEventsForApplePay(session) {
        session.onvalidatemerchant = async (event) => {
          console.log('event ', event)
          // Call your own server to request a new merchant session.
          // const merchantSession = await validateMerchant(event.validationURL);
          // if (merchantSession) {
          //   session.completeMerchantValidation(merchantSession);
          // } else {
          //   console.error("Error during validating merchant");
          // }
        };
    
        session.onpaymentmethodselected = (event) => {
          console.log('event ', event)
          // Define ApplePayPaymentMethodUpdate based on the selected payment method.
          const update = {
            newTotal: {
              label: "Merchant Name",
              type: "final",
              amount: "10.00",
            },
          };
          session.completePaymentMethodSelection(update);
        };
    
        session.onshippingmethodselected = (event) => {
          console.log('event ', event)
          // Define ApplePayShippingMethodUpdate based on the selected shipping method.
          const update = {
            newTotal: {
              label: "Merchant Name",
              type: "final",
              amount: "10.00",
            },
          };
          session.completeShippingMethodSelection(update);
        };
    
        session.onshippingcontactselected = (event) => {
          console.log('event ', event)
          // Define ApplePayShippingContactUpdate based on the selected shipping contact.
          const update = {
            newTotal: {
              label: "Merchant Name",
              type: "final",
              amount: "10.00",
            },
          };
          session.completeShippingContactSelection(update);
        };
    
        session.onpaymentauthorized = async (event) => {
          // Define ApplePayPaymentAuthorizationResult
          const paymentData = event.payment;
    
          if (paymentData.token) {
            // Forward token to your gateway for processing payment and return result to apple pay session
            const result = {
              status: ApplePaySession.STATUS_SUCCESS,
            };
            session.completePayment(result);
          } else {
            const result = {
              status: ApplePaySession.STATUS_FAILURE,
            };
            session.completePayment(result);
          }
        };
    
        session.oncancel = (event) => {
          console.log('event ', event)
          console.log("Session Cancelled.");
        };
      }

    return <Row id="payment_form_apple">
        {minimum_amount >= amount ? (
            <Col sm={12}>
                <div className="alert alert-danger">
                    <p className="text_red">
                        {translate({ lang, info: "amount_too_small_transaction" })}
                    </p>
                    <p className="text_red">
                        <span>{translate({ lang, info: "min_amount" })}</span>: <span>{minimum_amount} {currency}</span>
                    </p>
                </div>
            </Col>
        ) : (
            <Col sm={12} className="apple_pay_button_container">
                <p>{translate({ lang, info: "under_construction" })}</p>
                <ApplePayButton
                    onClick={handleClick}
                    style={{
                        width: '100%',
                        borderRadius: '8px',
                    }}
                    type="plain"
                />
            </Col>
        )}
    </Row>
}

export default Apple;
