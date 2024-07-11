import React from 'react'
import { Row, Col } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBitcoinSign, faLitecoinSign } from '@fortawesome/free-solid-svg-icons'

function Crypto(props) {
    const { radioBtc, radioLtc, cryptoData } = props
    let details = null
    if(cryptoData && cryptoData.length > 0){
        details = cryptoData.filter((x)=>{
            if(radioBtc){
                return x.currency_from === 'btc'
            }
            if(radioLtc){
                return x.currency_from === 'ltc'
            }
        })
    }    

    function handleChangeCheck(choice){
        if(typeof props.handleChangeCheck === "function"){
            props.handleChangeCheck(choice)
        }
    }

    return  <Row id="payment_form_crypto">
        <Col sm={12}>
            <Row>
                <Col sm={12}>
                    <div className="checkbox_radio_container payment_details_title">
                        <label>
                            <input id="radioBtc" type="radio" name="radioBtc" checked={radioBtc} onChange={()=>{handleChangeCheck("radioBtc")}}/>
                            Bitcoin
                        </label>
                        <label>
                            <input id="radioLtc" type="radio" name="radioLtc" checked={radioLtc} onChange={()=>{handleChangeCheck("radioLtc")}}/>
                            Litcoin
                        </label>
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