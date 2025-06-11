import React from 'react'
import { Col, Row, Dropdown, DropdownButton } from 'react-bootstrap'
import { translate } from "../../../../translations/translate"
import { convertCurrency } from '../../../../utils/utils'
import Spinner from '../../spinner'

function Crypto(props) {
    const {
        cryptoChoice, cryptoArray, cryptoDataFound, fiatEquivalent, loadingCryptoData, 
        exchange_rates, settings,
        handleCryptoChange
    } = props
    const { lang, currency } = settings
    let cryptoDetails = cryptoArray.find(item => item.value === cryptoChoice)    

    return <Row id="payment_form_crypto">
        <Col sm={12}>
            <Row>
                <Col sm={12}>
                    <div className="checkbox_radio_container">
                        <DropdownButton title={cryptoDetails.text} id="crypto_button" className="shadow_convex" onSelect={handleCryptoChange}>
                            {cryptoArray.map((x, i)=>{
                                return <Dropdown.Item key={i} eventKey={x.value}><span>{x.text}</span></Dropdown.Item>
                            })}
                        </DropdownButton>
                    </div>
                </Col>
            </Row>            
            {!loadingCryptoData && cryptoDataFound && fiatEquivalent ? <Row>
                <Col sm={12}>
                    {fiatEquivalent.estimated_amount > -1 ? <>
                        <p>{translate({lang, info: "your_amount_in_fiat_equivalent"})}:&nbsp;</p>
                        <p>{fiatEquivalent.estimated_amount} {fiatEquivalent.currency_to}</p>
                        <p>
                            <span>{translate({lang, info: "min_amount"})}:&nbsp;</span>                          
                            <span>{cryptoDataFound.min_amount} {cryptoDataFound.currency_from}</span>&nbsp;
                            <span>({convertCurrency(cryptoDataFound.fiat_equivalent, currency, exchange_rates)} {currency})</span>
                        </p>
                    </> : <div className="alert alert-danger">
                        <p className="text_red">{translate({lang, info: "amount_too_small_transaction"})}</p>
                        <p>
                            <span>{translate({lang, info: "min_amount"})}:&nbsp;</span>                          
                            <span>{cryptoDataFound.min_amount} {cryptoDataFound.currency_from}</span>&nbsp;
                            <span>({convertCurrency(cryptoDataFound.fiat_equivalent, currency, exchange_rates)} {currency})</span>
                        </p>
                    </div>}
                </Col>
            </Row> : <Spinner size="small" color="gold"/>}
        </Col>
    </Row>
}

export default Crypto