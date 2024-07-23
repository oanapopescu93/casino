import React, {useState, useEffect} from 'react'
import { Row, Col, DropdownButton, Dropdown } from "react-bootstrap"
import { translate } from '../../../../translations/translate'

function Crypto(props) {
    const { cryptoChoice, cryptoData, fiatEquivalent, settings } = props
    const { lang } = settings

    let cryptoArray = [
        {value: 'btc', text: "Bitcoin"},
        {value: 'ltc', text: "Litcoin"}
    ]
    let cryptoChoiceText = cryptoArray.find(crypto => crypto.value === cryptoChoice)?.text
    const [title, setTitle] = useState(cryptoChoiceText)
    const [details, setDetails] = useState(null)

    function handleCryptoChange(choice){
        if(typeof props.handleCryptoChange === "function"){
            props.handleCryptoChange(choice)
        }
    }

    useEffect(() => {
        let info = null
        if(cryptoData && cryptoData.length > 0){
            info = cryptoData.filter((x)=>{
                return x.currency_from === cryptoChoice
            })
        }
        setDetails(info)
	}, [cryptoChoice, cryptoData])

    useEffect(() => {
        let cryptoChoiceText = cryptoArray.find(crypto => crypto.value === cryptoChoice)?.text
		setTitle(cryptoChoiceText)
	}, [cryptoChoice])

    return  <Row id="payment_form_crypto">
        <Col sm={12}>
            <Row>
                <Col sm={12}>
                    <div className="checkbox_radio_container">
                        <DropdownButton title={title} id="crypto_button" className="shadow_convex" onSelect={handleCryptoChange}>
                            {cryptoArray.map((x, i)=>{
                                return <Dropdown.Item key={i} eventKey={x.value}><span>{x.text}</span></Dropdown.Item>
                            })}
                        </DropdownButton>
                    </div>
                </Col>
            </Row>            
            {details && details[0] && fiatEquivalent ? <>
                <Row>
                    <Col sm={12}>
                        {details && details[0] ? <p>
                            <span>{translate({lang: lang, info: "min_amount"})}:&nbsp;</span>                          
                            <span>{details[0].min_amount} {details[0].currency_from}</span>&nbsp;
                            <span>({details[0].fiat_equivalent} USD)</span>
                        </p> : null}                    
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>                        
                        {fiatEquivalent.estimated_amount > -1 ? <>
                            <p>{translate({lang: lang, info: "your_amount_in_fiat_equivalent"})}:&nbsp;</p>
                            <p>{fiatEquivalent.estimated_amount} {fiatEquivalent.currency_to}</p>
                        </> : <p>{translate({lang: lang, info: "amount_too_small_transaction"})}</p>}
                    </Col>
                </Row>
            </> : null}
        </Col>
    </Row>
}

export default Crypto