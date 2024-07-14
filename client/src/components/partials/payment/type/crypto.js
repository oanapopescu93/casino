import React, {useState, useEffect} from 'react'
import { Row, Col, DropdownButton, Dropdown } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBitcoinSign, faLitecoinSign } from '@fortawesome/free-solid-svg-icons'

function Crypto(props) {
    const { cryptoChoice, cryptoData } = props

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
            <Row>
                <Col sm={12}>
                    {details && details[0] ? <p>
                        {(() => {                            
                            switch (details[0].currency_from){
                                case "btc":
                                    return <span><FontAwesomeIcon icon={faBitcoinSign} /> - </span>
                                case "ltc":
                                    return <span><FontAwesomeIcon icon={faLitecoinSign} /> - </span>
                                default:
                                    return
                            }
                        })()}                            
                        <span>{details[0].min_amount} {details[0].currency_from}</span>&nbsp;
                        <span>({details[0].fiat_equivalent} USD)</span>
                    </p> : null}                    
                </Col>
            </Row>
        </Col>
    </Row>
}

export default Crypto