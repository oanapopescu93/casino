import React, { useState } from 'react'
import { translate } from "../../../../translations/translate"
import { Row, Col } from "react-bootstrap"

function Crypto(props) {
    const {lang, paymentDetails, gateway, gatewayDetailsMandatory, paymentError, cryptoData, amount} = props
    const [bitcoinAddress] = useState(paymentDetails.bitcoin_address !== "" ? paymentDetails.bitcoin_address : "")

    return <Row>
        <Col sm={12}>
            {(() => {
                if(cryptoData && amount > 0){
                    if(parseInt(cryptoData.fiat_equivalent) <= amount){
                        return <>
                            <label htmlFor="bitcoin_address">{translate({lang: lang, info: "bitcoin_address"})} {gatewayDetailsMandatory[gateway].includes("bitcoin_address") ? <>*</> : null}</label>
                            <input defaultValue={bitcoinAddress} className="input_light shadow_concav" type="text" placeholder={translate({lang: lang, info: "bitcoin_address"})} id="bitcoin_address" name="bitcoin_address"/>
                            {!paymentError.bitcoinAddress.fill ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: lang, info: paymentError.bitcoinAddress.fill_message})}
                                </p>
                            </div> : <>
                                {!paymentError.bitcoinAddress.validate ? <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({lang: lang, info: paymentError.bitcoinAddress.validate_message})}
                                    </p>
                                </div> : null}
                            </>}
                        </>
                    } else {
                        return <>
                            <p><span>{translate({lang: lang, info: "min_amount"})}</span>: <span>{cryptoData.min_amount} {cryptoData.currency_from}</span></p>
                            <p><span>{translate({lang: lang, info: "or"})} {translate({lang: lang, info: "fiat_equivalent"})}</span>: <span>${cryptoData.fiat_equivalent}</span></p>
                        </>
                    }
                } else {
                    return <p>{translate({lang: lang, info: "error"})}</p>
                }
            })()}
        </Col>
    </Row>
}

export default Crypto