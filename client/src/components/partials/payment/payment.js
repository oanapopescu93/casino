import React, { useEffect, useState } from 'react'
import { translate } from '../../../translations/translate'
import PaymentForm from './paymentForm'
import { Col, Row, Button } from 'react-bootstrap'
import Counter from '../counter'
import { useDispatch, useSelector } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import $ from "jquery"
import { getProducts, isEmpty, paymentErrors, postData } from '../../../utils/utils'
import { validateCVV, validateCard, validateCardMonthYear, validateInput } from '../../../utils/validate'
import { changePopup } from '../../../reducers/popup'
import PaymentCart from './paymentCart'
import PaymentDetails from './paymentDetails'
import { updatePaymentDetails } from '../../../reducers/paymentDetails'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStore, faUser, faCartShopping} from '@fortawesome/free-solid-svg-icons'
import { orderAdd } from '../../../reducers/order'

function Payment(props){
    const {lang, template, home} = props
    let dispatch = useDispatch()
    let max_amount = 100
    let price_per_carrot = 1

    let payment_details = useSelector(state => state.paymentDetails)
    let cart = useSelector(state => state.cart.cart) 
    let promo = useSelector(state => state.cart.promo) 

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

    useEffect(() => {
        let pay = 0
        switch(template){
            case "buy_carrots":
                pay = qty * price_per_carrot
                break
            case "checkout":
                pay = totalPriceSum()
                if(promo && Object.keys(promo).length>0){
                    pay = (pay - (pay * promo.discount)/100).toFixed(2)
                }
                break
        }
        setAmount(parseFloat(pay))
    }, [])

    function totalPriceSum(){
        let market = home.market ? home.market : [] 
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
            amount: amount
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

    function handleBack(choice){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(choice))
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

        if(pay_card){
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
        if(pay_paypal){
            if(isEmpty(data.email)){
                errors.email.fill = false
            }
            if(!validateInput(data.email, "email")){
                errors.email.validate = false
            }
        }
        if(pay_crypto){
            if(isEmpty(data.bitcoin_address)){
                errors.bitcoinAddress.fill = false
            }
            if(!validateInput(data.bitcoin_address, "bitcoin_address")){
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

    function showError(data={}){
        let payload = {
            open: true,
            template: "error",
            title: translate({lang: props.lang, info: "error"}),
            data: translate({lang: props.lang, info: typeof data.payload === "string" ? data.payload : "error_charge"})
        }
        dispatch(changePopup(payload))
    }

    function sendPayment(){
        if(amount > 0){
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
            payload.amount = amount
            if(template === "buy_carrots"){
                payload.products = [{name_eng: "Carrot", price: price_per_carrot, qty}]
                payload.description = "Buy carrots"
            }
            if(template === "checkout"){
                payload.products = getProducts(cart, home.market ? home.market : [])
                payload.description = "Buy vegetables"
            }
            
            if(!isEmpty(url)){
                postData(url, payload).then((data) => {
                    if(data && data.result && data.result === "success"){                        
                        switch(gateway){
                            case "stripe":
                                if(data.payload && data.result === "success"){
                                    let payload = {
                                        open: true,
                                        template: "paymentSuccess",
                                        title: translate({lang: props.lang, info: "payment_success"}),
                                        data: {
                                            id: data.payload.id,
                                            amount: (data.payload.amount / 100).toFixed(2),
                                            created: data.payload.created,
                                            gateway
                                        },
                                        size: 'lg',
                                    }
                                    dispatch(changePopup(payload))
                                } else {
                                    showError(data)
                                }
                                break
                            case "paypal":
                                //console.log('sendPayload2--> ', data)
                                if(data.payload && data.payload.receipt_url){
                                    window.open(data.payload.receipt_url,'_blank')
                                } else {
                                    showError(data)
                                }
                                break
                            case "crypto": 
                                //console.log('sendPayload2--> ', data)
                                let iid = data.iid
                                if(data.payload && data.payload.invoice_url){
                                    window.open(data.payload.invoice_url,'_blank')
                                } else {
                                    let payload = {
                                        open: true,
                                        template: "error",
                                        title: translate({lang: props.lang, info: "error"}),
                                        data: translate({lang: props.lang, info: typeof data.payload === "string" ? data.payload : "error_charge"})
                                    }
                                    dispatch(changePopup(payload))
                                }                                
                                if(typeof iid !== "undefined" && iid !== "null" && iid !== null && iid !== ""  && iid > 0){
                                    postData('/api/crypto_pay', {iid}).then((data) => {                              
                                        if (data.payload.payment_id) {
                                            checkCryptoPaymentStatus(iid, data.payload.payment_id)
                                        } else {
                                            showError(data)
                                        }
                                    })
                                }
                                break 
                            default:
                                showError()
                                break
                        }
                    } else {
                        showError()
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
            showError()
        }
    }
    
    function checkCryptoPaymentStatus(iid, payment_id){
        let counter = 0
        let maxChecks = 10
        let interval = 60000 // 1 minute

        let tt = setInterval(() => {
            if (counter >= maxChecks) {
                clearInterval(tt)
                showError()
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
                                template: "paymentSuccess",
                                title: translate({lang: props.lang, info: "payment_success"}),
                                data: {
                                    id: data.payload.id,
                                    amount: data.payload.amount,
                                    created: 'date will come here',
                                    gateway
                                },
                                size: 'lg',
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
        {paymentDetails ? <PaymentDetails 
            {...props} 
            paymentDetails={paymentDetails}
            amount={amount}
            gatewayDetails={gatewayDetails}
            gateway={gateway}
            template={template}
            sendPayment={()=>sendPayment(paymentDetails)}
            handleBack={(e)=>handleBack(e)}
        /> : <>
            <Col sm={8}>
                <PaymentForm 
                    {...props} 
                    getChanges={(e)=>getChanges(e)}
                    paymentError={paymentError}
                    cryptoData={cryptoData}
                    amount={amount}
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
                                    return <>
                                        <Counter num={1} max={max_amount} update={(e)=>updateQty(e)} />
                                        <div className="payment_details_total_price">
                                            <h3>
                                                <b>{translate({lang: lang, info: "total_price"})}</b>: ${amount}
                                            </h3>
                                        </div>
                                    </>
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
                        {(() => {
                            let choice = null
                            let icon = null
                            switch(template) {
                                case "buy_carrots":
                                    choice = "dashboard"
                                    icon = faUser
                                    break
                                case "checkout":
                                    choice = "market"
                                    icon = faStore
                                    break                                                          
                            }
                            return <>{choice && icon ? <Button 
                                type="button"  
                                className="mybutton button_fullcolor shadow_convex"
                                onClick={()=>handleBack(choice)}
                            ><FontAwesomeIcon icon={icon} /> {translate({lang: lang, info: choice})}</Button> : null}</>
                        })()}
                    </Col>
                </Row>
            </Col>
        </>}
    </Row>
}
export default Payment