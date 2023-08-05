import React, { useState } from 'react'
import { translate } from '../../../translations/translate'
import { Col, Row, Dropdown, DropdownButton } from 'react-bootstrap'
import { checkoutData } from '../../../utils/utils';

function PaymentForm(props){
    const {lang, nameError, emailError, cardNumberError, cvvError, monthError, yearError, cryptoData} = props 
    
    const [month, setMonth] = useState(-1)    
    const [year, setYear] = useState("")
     
    const [radioOne, setRadioOne] = useState(true) 
    const [radioTwo, setRadioTwo] = useState(false)
    const [radioThree, setRadioThree] = useState(false)
    
    const monthOptions = checkoutData().monthOptions
    const yearOptions = checkoutData().yearOptions
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]    
    
    function changeMonth(x){
        setMonth(x)
        if(typeof props.getChanges === "function"){
            props.getChanges({type: 'month', value: x})
        }
    }
    function changeYear(x){
        setYear(x)
        if(typeof props.getChanges === "function"){
            props.getChanges({type: 'year', value: x})
        }
    }
    function handleChangeCheck(x){
        switch(x){            
            case "radio3":	
                setRadioOne(false)			
                setRadioTwo(false)
                setRadioThree(true)		
                if(typeof props.getChanges === "function"){
                    props.getChanges({type: 'gateway', value: 'crypto'})
                }
                break
            case "radio2":	
                setRadioOne(false)			
                setRadioTwo(true)
                setRadioThree(false)		
                if(typeof props.getChanges === "function"){
                    props.getChanges({type: 'gateway', value: 'paypal'})
                }
                break
            case "radio1":	
            default:
                setRadioOne(true)			
                setRadioTwo(false)
                setRadioThree(false)		
                if(typeof props.getChanges === "function"){
                    props.getChanges({type: 'gateway', value: 'stripe'})
                }
                break
        }  
    }

    return <form id="payment_form">
        <Row>
            <Col sm={12}>
                <h3>{translate({lang: props.lang, info: "customer_info"})}</h3>  
            </Col>
        </Row>
        <Row>
            <Col sm={6}>
                <label htmlFor="name">{translate({lang: props.lang, info: "name"})}</label>
                <input className="input_light shadow_concav" type="text" placeholder={translate({lang: props.lang, info: "name"})} id="name" name="name"/>
                {nameError ? <div className="alert alert-danger">
                    <p className="text_red">
                        {translate({lang: props.lang, info: "fill_field"})}
                    </p>                            
                </div> : null}
            </Col>
            <Col sm={6}>
                <label htmlFor="email">{translate({lang: props.lang, info: "email"})}</label>
                <input className="input_light shadow_concav" type="text" placeholder="text@text.text" id="email" name="email"/>
                {emailError ? <div className="alert alert-danger">
                    <p className="text_red">
                        {translate({lang: props.lang, info: "fill_field"})}
                    </p>                            
                </div> : null}
            </Col>
        </Row>        
        <Row>
            <Col sm={12}>
                <h3>{translate({lang: props.lang, info: "payment_info"})}</h3>
            </Col>
        </Row>
        <Row>
            <Col lg={8}>
                <Row>
                    <Col sm={12}>
                    <div className="checkbox_radio_container">
                            <label>
                                <input id="pay_card" type="radio" name="radio1" checked={radioOne} onChange={()=>{handleChangeCheck("radio1")}}/>
                                {translate({lang: props.lang, info: "pay_card"})}
                            </label>
                            <label>
                                <input id="pay_paypal" type="radio" name="radio2" checked={radioTwo} onChange={()=>{handleChangeCheck("radio2")}}/>
                                {translate({lang: props.lang, info: "pay_paypal"})}
                            </label>
                            <label>
                                <input id="pay_crypto" type="radio" name="radio3" checked={radioThree} onChange={()=>{handleChangeCheck("radio3")}}/>
                                {translate({lang: props.lang, info: "pay_crypto"})}
                            </label>
                        </div>
                    </Col>
                </Row>
                {radioOne ? <>
                    <Row>
                        <Col sm={12}>
                            <label htmlFor="card_number">{translate({lang: props.lang, info: "card_number"})}</label>
                            <input className="input_light shadow_concav" type="text" placeholder="XXXX XXXX XXXX XXXX" id="card_number" name="card_number"/>
                            {cardNumberError ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: props.lang, info: "fill_field"})}
                                </p>                            
                            </div> : null}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            <label>{translate({lang: props.lang, info: "month"})}</label>
                            <DropdownButton title={monthOptions[month] ? monthOptions[month][lang] : translate({lang: props.lang, info: "month"})} onSelect={(e)=>changeMonth(e)} className="shadow_concav">
                                {months.map(function(x, i){
                                    return <Dropdown.Item key={i} eventKey={x}>{monthOptions[x][lang]}</Dropdown.Item>
                                })}
                            </DropdownButton>                                    
                            {monthError ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: props.lang, info: "fill_field"})}
                                </p>                            
                            </div> : null}
                        </Col>
                        <Col sm={4}>
                            <label>{translate({lang: props.lang, info: "year"})}</label>
                            <DropdownButton title={year ? year : translate({lang: props.lang, info: "year"})} onSelect={(e)=>changeYear(e)} className="shadow_concav">
                                {yearOptions.map(function(x, i){
                                    return <Dropdown.Item key={i} eventKey={x}>{x}</Dropdown.Item>
                                })}
                            </DropdownButton>
                            {yearError ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: props.lang, info: "fill_field"})}
                                </p>                            
                            </div> : null}
                        </Col>
                        <Col sm={4}>
                            <label htmlFor="cvv">{translate({lang: props.lang, info: "cvv"})}</label>
                            <input className="input_light shadow_concav" type="text" placeholder="123" id="cvv" name="cvv"/>
                            {cvvError ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: props.lang, info: "fill_field"})}
                                </p>                            
                            </div> : null}
                        </Col>
                    </Row>
                </> : null}    
                {radioThree ? <>
                    <Row>
                        <Col sm={12}>
                            {(() => {
                                if(cryptoData){
                                    return <>
                                        <p><span>{translate({lang: props.lang, info: "min_amount"})}</span>: <span>{cryptoData.min_amount} {cryptoData.currency_from}</span></p>
                                        <p><span>{translate({lang: props.lang, info: "or"})} {translate({lang: props.lang, info: "fiat_equivalent"})}</span>: <span>${cryptoData.fiat_equivalent}</span></p>
                                    </>
                                } else {
                                    return null
                                }
                            })()}
                        </Col>
                    </Row>
                </> : null}                       
            </Col>
        </Row>                              
    </form>
}
export default PaymentForm