import React, { useEffect, useState } from 'react'
import { translate } from '../../../translations/translate'
import PaymentForm from './paymentForm'
import { Col, Row, Button } from 'react-bootstrap'
import Counter from '../counter'
import { useDispatch, useSelector } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import $ from "jquery"
import { decryptData } from '../../../utils/crypto'
import { isEmpty, paymentErrors, postData } from '../../../utils/utils'
import { validateCVV, validateCard, validateCardMonthYear, validateInput } from '../../../utils/validate'
import { changePopup } from '../../../reducers/popup'
import PaymentCart from './paymentCart'
import PaymentDetails from './paymentDetails'
import { updatePaymentDetails } from '../../../reducers/paymentDetails'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStore, faCartShopping} from '@fortawesome/free-solid-svg-icons'

function Payment(props){
    const {lang, user, template, home} = props
    let dispatch = useDispatch()
    let max_bet = user.money ? decryptData(user.money) : 0
    let price_per_carrot = 1

    let payment_details = useSelector(state => state.paymentDetails)

    const [qty, setQty] = useState(1)
    const [amount, setAmount] = useState(price_per_carrot)
    const [month, setMonth] = useState(payment_details.month !== -1 ? payment_details.month : -1)
    const [year, setYear] = useState(payment_details.year !== "" ? payment_details.year : "")
    const [country, setCountry] = useState(payment_details.country !== "" ? payment_details.country : "")
    const [city, setCity] = useState(payment_details.city !== "" ? payment_details.city : "")
    const [gateway, setGateway] = useState("stripe")
    const [cryptoData, setCryptoData] = useState(null)
    const [paymentDetails, setPaymentDetails] = useState(null)
    const [paymentError, setPaymentError] = useState(paymentErrors())

    let gatewayDetails = {
        stripe: ["name", "email", "phone", "country", "city", "payment_methode", "card_number", "year", "month", "cvv"],
        paypal: ["name", "email", "phone", "country", "city", "payment_methode"],
        crypto: ["payment_methode", "bitcoin_address"]
    }
    let gatewayDetailsMandatory = {
        stripe: ["name", "email", "payment_methode", "card_number", "year", "month", "cvv"],
        paypal: ["name", "email", "payment_methode"],
        crypto: ["payment_methode", "bitcoin_address"]
    }

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

    useEffect(() => {
        switch (payment_details.option) {
            case "1":
                setGateway("stripe")
                break;
            case "2":
                setGateway("paypal")
                break;
            case "3":
                setGateway("crypto")
                break;
            default:
                setGateway("stripe")
        }
    }, [payment_details.option])

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
            case "country":
                setCountry(value)
                break
            case "city":
                setCity(value)
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
        dispatch(changeGamePage('market'))
    }

    function getFormDetails(){
        let form = $('#payment_form').serializeArray()
        let payload = {
            name: getValueFromForm(form, 'name'),
            email: getValueFromForm(form, 'email'),
            phone: getValueFromForm(form, 'phone'),
            country,
            city,
        }

        let radio1 = getValueFromForm(form, 'radio1')
        let radio2 = getValueFromForm(form, 'radio2')
        let radio3 = getValueFromForm(form, 'radio3')
        if (radio1 === "on") {
            payload.option = '1'
        } else if (radio2 === "on") {
            payload.option = '2'
        } else if (radio3 === "on") {
            payload.option = '3'
        }

        let cardNumber = getValueFromForm(form, 'card_number')
        if(cardNumber){
            payload.cardNumber = cardNumber
        }
        let cvv = getValueFromForm(form, 'cvv')
        if(cvv){
            payload.cvv = cvv
        }
        if(month){
            payload.month = month
        }
        if(year){
            payload.year = year
        }
        let bitcoin_address = getValueFromForm(form, 'bitcoin_address')
        if(bitcoin_address){
            payload.bitcoin_address = bitcoin_address
        }

        return payload
    }

    function handleSubmit(){
        if($('#payment_form') && qty > 0){
            validateSubmit(getFormDetails())
        }
    }

    function getValueFromForm(form, name){
        for(let i in form){
            if(form[i].name === name){
                let value = form[i].value ? form[i].value : ""
                return value
            }
        }
    }

    function validateSubmit(data){
        let pay_card = data.option === "1" ? true : false
        let pay_paypal = data.option === "2" ? true : false
        let pay_crypto = data.option === "3" ? true : false    
        let errors = paymentErrors()

        if(pay_card){ //"name", "email", "payment_methode", "card_number", "year", "month", "cvv"
            if(isEmpty(data.name)){
                errors.name.fill = false
            }
            if(!validateInput(data.name, "name")){
                errors.name.validate = false
            }
            if(isEmpty(data.email)){
                errors.email.fill = false
            }
            if(!validateInput(data.email, "email")){
                errors.email.validate = false
            }
            if(isEmpty(data.cardNumber)){
                errors.cardNumber.fill = false
            }
            if(!validateCard(data.cardNumber)){ // test card details --> 4242424242424242
                errors.cardNumber.validate = false
            }
            if(parseInt(month) === -1){
                errors.month.fill = false
            }
            if(isEmpty(year)){
                errors.year.fill = false
            }
            if(!validateCardMonthYear(year, month)){
                errors.month.validate = false
                errors.year.validate = false
            }
            if(isEmpty(data.cvv)){
                errors.cvv.fill = false
            }
            if(!validateCVV(data.cardNumber, data.cvv)){
                errors.cvv.validate = false
            }
        }
        if(pay_paypal){ //"name", "email", "payment_methode"
            if(isEmpty(data.name)){
                errors.name.fill = false
            }
            if(!validateInput(data.name, "name")){
                errors.name.validate = false
            }
            if(isEmpty(data.email)){
                errors.email.fill = false
            }
            if(!validateInput(data.email, "email")){
                errors.email.validate = false
            }
        }
        if(pay_crypto){ //"payment_methode", "bitcoin_address"
            if(isEmpty(data.bitcoin_address)){
                errors.bitcoinAddress.fill = false
            }
            if(!validateInput(data.bitcoin_address, "bitcoin_address")){ //test bitcoin address--> 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
                errors.bitcoinAddress.validate = false
            }
        }
        setPaymentError(errors)

        // Check if there is any problem (fill or validate errors for at least one element in error array)
        let problem = Object.values(errors).some(error => !error.fill || !error.validate)
        
        if(!problem){
            sendPayload(data)
            dispatch(updatePaymentDetails(data))
        }
    }

    function sendPayload(e){
        setPaymentDetails(e)
    }

    function sendPayment(){
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
            let payload = {...paymentDetails}
            payload.amount = total_promo
            //console.log('sendPayload1--> ', gateway, payload, url)
            if(!isEmpty(url)){
                postData(url, payload).then((data) => {
                    if(data && data.result && data.result === "success"){
                        //console.log('sendPayload2--> ', data)
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
                                        
                                        if (payment_id) {
                                            checkCryptoPaymentStatus(iid, payment_id)
                                        } else {
                                            let payload = {
                                                open: true,
                                                template: "error",
                                                title: translate({lang: props.lang, info: "error"}),
                                                data: translate({lang: props.lang, info: data.payload ? data.payload : "error_charge"})
                                            }
                                            dispatch(changePopup(payload))
                                        }
                                    })
                                }
                                break 
                            default:
                                break
                        }
                    } else {
                        let payload = {
                            open: true,
                            template: "error",
                            title: translate({lang: props.lang, info: "error"}),
                            data: translate({lang: props.lang, info: data.payload ? data.payload : "error_charge"})
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
                title: translate({lang: props.lang, info: "error"}),
                data: translate({lang: props.lang, info: "error_charge"})
            }
            dispatch(changePopup(payload))
        }
    }
    
    function checkCryptoPaymentStatus(iid, payment_id){
        let counter = 0
        let maxChecks = 10
        let interval = 60000 // 1 minute

        let tt = setInterval(() => {
            if (counter >= maxChecks) {
                clearInterval(tt)
                let payload = {
                    open: true,
                    template: "error",
                    title: translate({lang: props.lang, info: "error"}),
                    data: translate({lang: props.lang, info: "error_charge"})
                }
                dispatch(changePopup(payload))
            } else {
                counter++
                postData('/api/crypto_status', { paymentId: payment_id }).then((data) => {
                    //console.log('sendPayload5--> ', iid, payment_id, data)
                    if (data && data.result === "success") {
                        const paymentStatus = data.payload.payment_status
                        const actuallyPaid = data.payload.actually_paid
                        const payAmount = data.payload.pay_amount
                        if ((paymentStatus === 'confirmed' || paymentStatus === 'finished') && actuallyPaid >= payAmount) {
                            clearInterval(tt)
                            let payload = {
                                open: true,
                                template: "success",
                                title: translate({lang: props.lang, info: "payment_success"}),
                                data: translate({lang: props.lang, info: "payment_success_text"})
                            }
                            dispatch(changePopup(payload))
                        }
                    } else {
                        console.error("Error checking payment status", data.payload)
                        let payload = {
                            open: true,
                            template: "error",
                            title: translate({lang: props.lang, info: "error"}),
                            data: translate({lang: props.lang, info: "error_charge"})
                        }
                        dispatch(changePopup(payload))
                    }
                });
            }
        }, interval)
    }

    return<Row>
        <p>{translate({lang: props.lang, info: "under_construction"})}</p>
        {paymentDetails ? <PaymentDetails 
            {...props} 
            paymentDetails={paymentDetails}
            totalPromo={total_promo}
            gatewayDetails={gatewayDetails}
            gateway={gateway}
            sendPayment={()=>sendPayment(paymentDetails)}
            handleBack={()=>handleBack()}
        /> : <>
            <Col sm={8}>
                <PaymentForm 
                    {...props} 
                    getChanges={(e)=>getChanges(e)}
                    paymentError={paymentError}
                    cryptoData={cryptoData}
                    totalPromo={total_promo}
                    gateway={gateway}
                    gatewayDetailsMandatory={gatewayDetailsMandatory}
                    paymentDetails={payment_details}
                />
            </Col>
            <Col sm={4}>
                <Row>
                    <Col sm={12}>
                        {(() => {
                            switch(template) {
                                case "buy_carrots":
                                    return <Counter num={1} max={max_bet} update={(e)=>updateQty(e)} />
                                case "checkout":
                                    return <PaymentCart {...props} />
                                default:  
                                    return                               
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
                        ><FontAwesomeIcon icon={faCartShopping} /> {translate({lang: lang, info: "continue"})}</Button>
                        <Button 
                            type="button"  
                            className="mybutton button_fullcolor shadow_convex"
                            onClick={()=>handleBack()}
                        ><FontAwesomeIcon icon={faStore} /> {translate({lang: lang, info: "market"})}</Button>
                    </Col>
                </Row>
            </Col>
        </>}
    </Row>
}
export default Payment