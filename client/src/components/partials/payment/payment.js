import React, { useEffect, useState } from 'react'
import { translate } from '../../../translations/translate'
import PaymentForm from './paymentForm'
import { Col, Row, Button } from 'react-bootstrap'
import Counter from '../counter'
import { useDispatch, useSelector } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import $ from "jquery"
import { decryptData } from '../../../utils/crypto'
import { isEmpty, postData } from '../../../utils/utils'
import { validateCVV, validateCard, validateCardMonthYear, validateInput } from '../../../utils/validate'
import { changePopup } from '../../../reducers/popup'
import PaymentCart from './paymentCart'

function Payment(props){
    const {lang, user, template, home} = props
    let dispatch = useDispatch()
    let max_bet = user.money ? decryptData(user.money) : 0
    let price_per_carrot = 1
    const [qty, setQty] = useState(1)
    const [amount, setAmount] = useState(price_per_carrot)       
    const [month, setMonth] = useState(-1)    
    const [year, setYear] = useState("")    
    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [cardNumberError, setCardNumberError] = useState(false)
    const [cvvError, setCvvError] = useState(false)
    const [monthError, setMonthError] = useState(false)   
    const [yearError, setYearError] = useState(false)
    const [gateway, setGateway] = useState("stripe")
    const [cryptoData, setCryptoData] = useState(null)

    let market = home.market ? home.market : []
    let cart = useSelector(state => state.cart.cart) 
    let promo = useSelector(state => state.cart.promo) 
    let total = totalPriceSum()
    let total_promo = total
    if(promo && Object.keys(promo).length>0){
        total_promo = (total_promo - (total_promo * promo.discount)/100).toFixed(2)
    }    
    function totalPriceSum(){
        let total = 0
        for(let i in cart){
            let product = market.filter(a => a.id === cart[i].id)
            if(product && product[0] && product[0].price){
                total = total + product[0].price * cart[i].qty
            }
        }
        return total.toFixed(2)
    }

    useEffect(() => {
        let url = "/api/crypto_min"
        let payload = {
            amount: total_promo
        }        
        postData(url, payload).then((res) => {
            setCryptoData(res.payload)
        })
    }, [])

    function getChanges(data){
        let type = data.type
        let value = data.value
        switch(type){
            case "month":
                setMonth(value)
                break
            case "year":
                setYear(value)
                break
            case "gateway":
                setGateway(value)
                break
            default:
        }
    }

    function updateQty(x){
        setQty(x)
        setAmount(x * price_per_carrot)
    }

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    function handleSubmit(){
        if($('#payment_form') && qty > 0){
            let form = $('#payment_form').serializeArray()
            let payload = {
                name: getValueFromForm(form, 'name'),
                email: getValueFromForm(form, 'email'),
                cardNumber: getValueFromForm(form, 'card_number'),
                cvv: getValueFromForm(form, 'cvv'),
                expiry_month: month,
                expiry_year: year,
                bitcoin_address: getValueFromForm(form, 'bitcoin_wallet'),
            }
            validate(payload)
        }
    }

    function getValueFromForm(form, name){
        for(let i in form){
            if(form[i].name === name){
                return form[i].value
            }
        }
    }
    function validate(data){ 
        let problem = false
        setNameError(false)
        setEmailError(false)
        setCardNumberError(false)
        setCvvError(false)
        setMonthError(false)
        setYearError(false)

        let pay_card = $("input[name='radio1']:checked").val()
        // let pay_paypal = $("input[name='radio2']:checked").val()
        // let pay_crypto = $("input[name='radio3']:checked").val()        
        
        if(isEmpty(data.name)){
            setNameError(true)
            problem = true
        }
        if(isEmpty(data.email) || !validateInput(data.email, "email")){
            setEmailError(true)
            problem = true
        }
       
        if(pay_card){            
            if(isEmpty(data.cardNumber) || !validateCard(data.cardNumber)){
                setCardNumberError(true)
                problem = true
            }     
            if(isEmpty(data.cvv) || !validateCVV(data.cardNumber, data.cvv)){
                setCvvError(true)
                problem = true
            }
            
            if(month === -1){
                setMonthError(true)
                problem = true
            }        
            if(isEmpty(year)){
                setYearError(true)
                problem = true
            }
            if(!validateCardMonthYear(year, month)){
                setMonthError(true)
                setYearError(true)
                problem = true
            }
        }
        
        if(!problem){
            sendPayload(data)
        }
    }

    function crypto_status(payment_id){
        postData("/api/crypto_get_payment", {payment_id}).then((data) => {
            //console.log('sendPayload5--> ', data, data.payment_status)
        })
    }

    function sendPayload(payload){
        if(typeof total_promo !== "undefined" && total_promo !== "" && total_promo !== "null" && total_promo !== null && amount > 0){ // something is wrong and we can't charge client (ex: somehow the cart is empty, so, the total amount is 0)
            let url = ""
            switch(gateway){
                case "stripe":
                    url = "/api/stripe"
                    break
                case "paypal":
                    url = "/api/paypal"                    
                    break
                case "crypto":
                    url = "/api/crypto"
                    break
                default:                    
            }
            payload.amount = total_promo
            //console.log('sendPayload1--> ', gateway, payload, url)   
            if(!isEmpty(url)){
                postData(url, payload).then((data) => {
                    //console.log('sendPayload2--> ', data)
                    if(data && data.result && data.result === "success"){
                        switch(gateway){
                            case "stripe":
                            case "paypal":
                                if(data.payload.receipt_url){
                                    window.open(data.payload.receipt_url,'_blank')
                                }
                                break
                            case "crypto": 
                                let iid = data.iid
                                if(data.payload.invoice_url){
                                    window.open(data.payload.invoice_url,'_blank')
                                }
                                //console.log('sendPayload3--> ', data, iid)
                                if(typeof iid !== "undefined" && iid !== "null" && iid !== null && iid !== ""  && iid > 0){
                                    postData('/api/crypto_pay', {iid}).then((data) => {
                                        let payment_id = data.payload.payment_id
                                        //console.log('sendPayload4--> ', data, payment_id)
                                        crypto_status(payment_id)
                                        let tt=setInterval(function(){startTime()},60000) // check each minute
                                        let counter = 0
                                        function startTime(){
                                            if(counter === 10) {
                                                clearInterval(tt) // stop checking after 10 minutes
                                            } else {
                                                counter++
                                                crypto_status(payment_id)
                                            }
                                        }                                        
                                    })                                
                                }
                                break 
                            default:
                        }
                    } else {
                        let payload = {
                            open: true,
                            template: "error",
                            title: translate({lang: props.lang, info: "error"}),
                            data: translate({lang: props.lang, info: "error_charge"})
                        }
                        dispatch(changePopup(payload))
                    }
                })
            } else {
                let payload = {
                    open: true,
                    template: "error",
                    title: translate({lang: props.lang, info: "error"}),
                    data: translate(translate({lang: lang, info: "no_payment_methods"}))
                }
                dispatch(changePopup(payload))
            }
        } else {
            let payload = {
                open: true,
                template: "error",
                title: translate({lang: props.lang, info: "error3"}),
                data: translate({lang: props.lang, info: "error_charge"})
            }
            dispatch(changePopup(payload))
        }
    }

    return<Row>
        <Col sm={8}>
            <PaymentForm 
                {...props} 
                getChanges={(e)=>getChanges(e)}
                nameError={nameError} 
                emailError={emailError} 
                cardNumberError={cardNumberError} 
                cvvError={cvvError} 
                monthError={monthError}  
                yearError={yearError}
                cryptoData={cryptoData}
            ></PaymentForm> 
        </Col>
        <Col sm={4}>
            <Row>
                <Col sm={12}>
                    {(() => {
                        switch(template) {
                            case "buy_carrots":
                                return <Counter num={1} max={max_bet} update={(e)=>updateQty(e)}></Counter>
                            case "checkout":
                                return <PaymentCart {...props}></PaymentCart>
                            default:                                 
                        }
                    })()}                    
                </Col>
            </Row>
            <Row>
                <Col sm={12} className="button_action_group">
                    <Button 
                        type="button"  
                        className="mybutton button_fullcolor shadow_convex"
                        onClick={()=>handleSubmit()}
                    >{translate({lang: lang, info: "submit"})}</Button>
                    <Button 
                        type="button"  
                        className="mybutton button_fullcolor shadow_convex"
                        onClick={()=>handleBack()}
                    >{translate({lang: lang, info: "back"})}</Button>                    
                </Col>
            </Row>
        </Col>
    </Row>
}
export default Payment