import React, {useState} from 'react'
import { Row, Col } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import Header from '../../partials/header'
import WithdrawFormStripe from './withdrawFormStripe'
import { decryptData } from '../../../utils/crypto'

function Withdraw(props){
    const {lang, user} = props
    let money = user.money ? decryptData(user.money) : 0
    let dispatch = useDispatch()
    const [radioOne, setRadioOne] = useState(true)
    const [radioTwo, setRadioTwo] = useState(false)
    const [radioThree, setRadioThree] = useState(false)
    const [gateway, setGateway] = useState('stripe')

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }    

    function handleChangeCheck(x){
        switch(x){
            case "radio3":
                setRadioOne(false)	
                setRadioTwo(false)
                setRadioThree(true)
                setGateway('crypto')
                break
            case "radio2":
                setRadioOne(false)	
                setRadioTwo(true)
                setRadioThree(false)
                setGateway('paypal')
                break
            case "radio1":
            default:
                setRadioOne(true)
                setRadioTwo(false)
                setRadioThree(false)
                setGateway('stripe')
                break
        }
    }

    function handleSubmit(payload){
        console.log(payload)
    }

    return <div className="content_wrap">
        <Header template="terms_cond" title={translate({lang: lang, info: "withdraw"})} />
        <div className="page_content">            
            <Row>
                <Col lg={2} />
                <Col lg={8}>
                    <Row>
                        <Col sm={12}>
                            <div className="checkbox_radio_container withdraw_details_title">
                                <label>
                                    <input id="pay_card" type="radio" name="radio1" checked={radioOne} onChange={()=>{handleChangeCheck("radio1")}}/>
                                    {translate({lang: lang, info: "pay_card"})}
                                </label>
                                <label>
                                    <input id="pay_paypal" type="radio" name="radio2" checked={radioTwo} onChange={()=>{handleChangeCheck("radio2")}}/>
                                    {translate({lang: lang, info: "pay_paypal"})}
                                </label>
                                <label>
                                    <input id="pay_crypto" type="radio" name="radio3" checked={radioThree} onChange={()=>{handleChangeCheck("radio3")}}/>
                                    {translate({lang: lang, info: "pay_crypto"})}
                                </label>
                            </div>
                        </Col>
                    </Row> 
                    {(() => {
                        switch(gateway){
                            case "paypal":
                                return <p>{translate({lang: lang, info: "under_construction"})}</p>
                            case "crypto":
                                return <p>{translate({lang: lang, info: "under_construction"})}</p>
                            case "stripe":
                                return <WithdrawFormStripe
                                    {...props} 
                                    money={money}
                                    handleSubmit={()=>handleSubmit()}
                                    handleBack={()=>handleBack()}
                                />
                        }
                    })()}                    
                </Col>
                <Col lg={2} />
            </Row>
        </div>        
    </div>
}
export default Withdraw