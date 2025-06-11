import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import PaymentDetails from './paymentDetails'
import PaymentForm from './paymentForm'
import PaymentCart from './paymentCart'

import { changePage, changeGame, changeGamePage } from '../../../reducers/page'

import countriesData from '../../../utils/constants/countries.json'
import { checkoutData, convertCurrency, getCarrotsFromProducts, getProducts, isEmpty, postData } from '../../../utils/utils'
import { validateCard } from '../../../utils/validate'
import { updatePaymentDetails } from '../../../reducers/paymentDetails'
import { changePopup } from '../../../reducers/popup'
import { translate } from '../../../translations/translate'

function Payment(props){
    const { template, home, user, settings, exchange_rates, socket } = props
    const { lang, currency } = settings
    const { uuid } = user
    const minimum_amount_usd = 10
    const maxAmount = 100
    const price_per_carrot = 1
    const minimum_amount = convertCurrency(minimum_amount_usd, currency, exchange_rates)

    let dispatch = useDispatch()

    let payment_details = useSelector(state => state.paymentDetails)
    let cart = useSelector(state => state.cart.cart) 
    let promo = useSelector(state => state.cart.promo)

    const errors_default = {
        name: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_name" },
        email: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_email" },
        phone: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_phone" },
        country: { fill: true, validate: true, fill_message: "fill_field" },
        city: { fill: true, validate: true, fill_message: "fill_field" },
        cardNumber: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_cardNumber" },
        month: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_month" },
        year: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_year" },
        cvv: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_cvv" },
        bitcoinAddress: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_bitcoinAddress" }
    }
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    let cryptoArray = [
        {value: 'btc', text: "Bitcoin"},
        {value: 'ltc', text: "Litcoin"}
    ]
    
    const [paymentDetails, setPaymentDetails] = useState(payment_details)
    const [editCardNumber, setEditCardNumber] = useState(false)
    const [paymentContinue, setPaymentContinue] = useState(null)
    const [paymentError, setPaymentError] = useState(errors_default)
    const [countries, setCountries] = useState([])
    const [cities, setCities] = useState([])
    const [filteredCountries, setFilteredCountries] = useState([])
    const [filteredCountry, setFilteredCountry] = useState("")
    const [filteredCities, setFilteredCities] = useState([])
    const [filteredCity, setFilteredCity] = useState("")
    const monthOptions = checkoutData().monthOptions
    const yearOptions = checkoutData().yearOptions    
    const [cryptoData, setCryptoData] = useState(null)
    const [cryptoDataFound, setCryptoDataFound] = useState(null)
    const [fiatEquivalent, setFiatEquivalent] = useState(null)
    const [cryptoChoice, setCryptoChoice] = useState(payment_details.crypto ? payment_details.crypto : cryptoArray[0].value)
    const [loadingCryptoData, setLoadingCryptoData] = useState(false)

    const [total, setTotal] = useState(0)
    const [totalPromo, setTotalPromo] = useState(0)
    const [qty, setQty] = useState(1)
    const [paymentSending, setPaymentSending] = useState(false)

    let market = home.market ? home.market : []

    useEffect(() => {
        let pay = 0
        switch(template){
            case "buy_carrots":
                pay = qty * price_per_carrot
                break
            case "checkout":
                pay = totalPriceSum()
                setTotal(parseFloat(pay))
                if(promo && Object.keys(promo).length>0){
                    pay = (pay - (pay * promo.discount)/100).toFixed(2)
                }
                break
            default:
                break
        }
        setTotalPromo(parseFloat(pay))
    }, [])

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
        const countryNames = Object.keys(countriesData)
        setCountries(countryNames)
        setFilteredCountries(countryNames)
    }, [])

    function handleBack(choice=null){
        if(choice){
            dispatch(changePage('Salon'))
            dispatch(changeGame(null))
            dispatch(changeGamePage(choice))
        } else {
            setPaymentContinue(false)
        }        
    }

    function handleChangeCheck(value){
        let payload = {...paymentDetails, option: value}
        setPaymentDetails(payload)
        dispatch(updatePaymentDetails(payload))
    }

    function handleInputChange(e){
        const { name, value } = e.target
        setPaymentDetails({...paymentDetails, [name]: value})
    }

    function handleCountryChange(value){
        const selectedCountry = value
        setPaymentDetails({...paymentDetails, country: selectedCountry, city: ""})
        const selectedCities = countriesData[selectedCountry] || []
        setCities(selectedCities)
        setFilteredCities(selectedCities)
        setFilteredCity("")
    }

    function handleFilterCountries(e){
        const filtered = countries.filter(country => country.toLowerCase().includes(e.toLowerCase()))

        setFilteredCountries(filtered)
        setFilteredCountry(e)

        setFilteredCities([])
        setFilteredCity("")
    }

    function handleCityChange(value){
        setPaymentDetails({...paymentDetails, city: value})
    }

    function handleFilterCities(e){        
        const filtered = cities.filter(city => city.toLowerCase().includes(e.toLowerCase()))
        setFilteredCities(filtered)
        setFilteredCity(e)
    }

    function changeMonth(value){
        setPaymentDetails({...paymentDetails, month: value})
    }
    function changeYear(value){
        setPaymentDetails({...paymentDetails, year: value})
    }

    function handleEditCardNumber(){
        setEditCardNumber(true)
    }

    function handleSaveCardNumber(){
        setEditCardNumber(false)
    }

    function checkCardForm(){
        const { cardNumber, month, year, cvv } = paymentDetails        
        let errors = errors_default
        
        if (isEmpty(cardNumber)) {
            errors.cardNumber.fill = false
        }
        if(parseInt(month) === -1){
            errors.month.fill = false
        }
        if(isEmpty(year)){
            errors.year.fill = false
        }
        if (isEmpty(cvv)) {
            errors.cvv.fill = false
        }

        if(!validateCard(cardNumber)){ // test card details --> 4242424242424242
            errors.cardNumber.validate = false
            errors.month.validate = false
            errors.year.validate = false
            errors.cvv.validate = false
        }

        return errors
    }

    function validateForm(){               
        let errors = null
        let problem = false

        if(paymentDetails.option === "stripe"){
            errors = checkCardForm()
            setPaymentError(errors)
            problem = Object.values(errors).some(error => !error.fill || !error.validate) // Check if there is any problem (fill or validate errors for at least one element in error array)
        }
        
        return problem
    }

    function checkMinimunAmountToPass(){
        let problem = false        

        switch(paymentDetails.option){
            case "stripe":                
            case "paypal":
                if(minimum_amount > totalPromo){
                    problem = true
                }
                break
        }
        
        return problem
    }

    function handleContinue(){        
        if(!validateForm()){            
            dispatch(updatePaymentDetails({...paymentDetails}))
            if(!checkMinimunAmountToPass()){
                setPaymentContinue(true)
            }
        }
    }

    function updateQty(value){
        setQty(value)
        setTotalPromo(value * price_per_carrot)
    }

    useEffect(() => {  
        setLoadingCryptoData(true)
        if(totalPromo > 0){
            let url = "/api/crypto_min"
            let payload = {
                amount: totalPromo
            }            
            postData(url, payload).then((res1) => {
                if(res1 && res1.payload){
                    setCryptoData(res1.payload)
                    const found = res1.payload.find(item => item.currency_from === cryptoChoice)
                    let fiat_equivalent = found.fiat_equivalent
                    setCryptoDataFound(found)                    
                    if(fiat_equivalent && fiat_equivalent < totalPromo){
                        let url = "/api/crypto_estimated_price"
                        let currency_from = currency.toLowerCase()
                        let currency_to = cryptoChoice        
                        let payload = {
                            amount: totalPromo,
                            currency_from, 
                            currency_to,
                        }                        
                        postData(url, payload).then((res2) => {                            
                            if(res1 && res1.payload){
                                setFiatEquivalent(res2.payload)
                                setLoadingCryptoData(false)
                            }
                        })
                    } else {
                        setFiatEquivalent({estimated_amount: -1}) //if it is -1 it means we must show a message
                        setLoadingCryptoData(false)
                    }
                }                
            })
        }        
    }, [totalPromo, cryptoChoice])

    function handleCryptoChange(value){
        const selectedCrypto = cryptoArray.find(crypto => crypto.value === value)
        setCryptoChoice(selectedCrypto.value)
        setPaymentDetails({...paymentDetails, crypto: selectedCrypto.value})
        
    }

    function handleSendPayment(){
        let payload = {...paymentDetails}
        payload.amount = totalPromo
        let url = ""

        switch(paymentDetails.option){
            case "stripe":
                url = "/api/stripe"
                break
            case "paypal":
                url = "/api/paypal"
                break
            case "crypto":
                url = "/api/crypto"
                payload.crypto_currency = cryptoChoice.toUpperCase()
                break
            default:
                break
        }
        
        if(template === "buy_carrots"){
            payload.products = [{name_eng: "Carrot", price: price_per_carrot, qty}]
            payload.description = "Buy carrots"
        }
        if(template === "checkout"){
            payload.products = getProducts(cart, home.market ? home.market : [])
            payload.description = "Buy vegetables"
        }
        
        if(!isEmpty(url)){
            setPaymentSending(true)
            postData(url, payload).then((data) => {
                setPaymentSending(false)     
                if(data && data.result && data.result === "success"){
                    switch(paymentDetails.option){
                        case "stripe":
                            handlePaymentStripe(data)
                            break
                        case "paypal":
                            handlePaymentPaypal(data)
                            break
                        default:
                            showError()
                            break
                    }
                } else {
                    showError(data)
                }
            })
        } else {
            showError({payload: "no_payment_methods"})
        }
    }

    function handlePaymentStripe(data){
        const { payload } = data
        const { id, customer, created, amount, payment_details, status, description } = payload
        const { country, city, email, phone, products } = payment_details

        let details = {
            method: paymentDetails.option,
            uuid,
            payment_id: id,
            customer_id: customer,
            order_date: created * 1000,
            amount: parseFloat((amount / 100).toFixed(2)),
            payment_method: payment_details.payment_type,
            status,
            country,
            city,
            email,
            phone,
            description,
            currency: payload.currency.toUpperCase(),
            currencyExchange: currency,
            items: products,
            exchange_rates,
            carrots_update: getCarrotsFromProducts(products)
        }
        socket.emit('order_send', details)
    }

    function handlePaymentPaypal(data){
        if(data.payload && data.payload.receipt_url){
            window.open(data.payload.receipt_url,'_blank')
        } else {
            showError(data)
        }
    }
    
    function handleSendPaymentGoogle(e){
        let paymentMethodData = e.paymentMethodData
        let url = "/api/google"
        let payload = {
            paymentMethodData, 
            option: paymentDetails.option,
            amount: totalPromo
        }
        if(template === "buy_carrots"){
            payload.products = [{name_eng: "Carrot", price: price_per_carrot, qty}]
            payload.description = "Buy carrots"
        }
        if(template === "checkout"){
            payload.products = getProducts(cart, home.market ? home.market : [])
            payload.description = "Buy vegetables"
        }

        postData(url, payload).then((data) => {
            if(data && data.result && data.result === "success"){
                handlePaymentGoogle(data)
            } else {
                showError(data)
            }
        })
    }

    const handlePaymentAuthorized = async (paymentData) => {
        try {
            // Pass payment data to your backend for processing
            await handleSendPaymentGoogle(paymentData)
            return { transactionState: 'SUCCESS' }
        } catch (error) {
            console.error('handlePaymentAuthorized:', error)            
        }
    }

    function handlePaymentGoogle(data){
        const { payload } = data
        const { id, amount, created, description, payment_details } = payload
        const { products } = payment_details

        let details = {
            method: paymentDetails.option,
            uuid,
            payment_id: id,            
            order_date: created * 1000,
            amount: parseFloat((amount / 100).toFixed(2)),
            payment_method: payment_details.type,
            status: "successful",            
            description,
            currency: payload.currency.toUpperCase(),
            currencyExchange: currency,
            items: products,
            exchange_rates,
            carrots_update: getCarrotsFromProducts(products)
        }
        socket.emit('order_send', details)
    }

    function showError(data={}){
        console.error(data)
        let payload = {
            open: true,
            template: "error",
            title: translate({lang, info: "error"}),
            data: translate({lang, info: data.payload && typeof data.payload === "string" ? data.payload : "error_charge"}),
            size: 'sm',
        }
        dispatch(changePopup(payload))
    }

    return <form id="payment_form">        
        <Row>
            {paymentContinue ? <PaymentDetails 
                {...props} 
                paymentDetails={paymentDetails}
                template={template}
                amount={totalPromo}
                cryptoArray={cryptoArray}
                fiatEquivalent={fiatEquivalent}
                paymentSending={paymentSending}
                handleBack={(e)=>handleBack(e)}
                handleSendPayment={()=>handleSendPayment()}
            /> : <>
                <Col sm={4} className="payment_cart_container">
                    <PaymentCart 
                        {...props}
                        cart={cart}
                        promo={promo}
                        totalPromo={totalPromo}
                        total={total}
                        qty={qty}
                        maxAmount={maxAmount}
                        updateQty={(e)=>updateQty(e)}                        
                    />
                </Col>
                <Col sm={8} className="payment_form_container">
                    <PaymentForm 
                        {...props} 
                        paymentDetails={paymentDetails}
                        amount={totalPromo}
                        minimum_amount_usd={minimum_amount_usd}
                        minimum_amount={minimum_amount}
                        editCardNumber={editCardNumber}
                        paymentError={paymentError}                        
                        filteredCountries={filteredCountries}
                        filteredCountry={filteredCountry}
                        filteredCities={filteredCities}
                        filteredCity={filteredCity}
                        monthOptions={monthOptions}
                        yearOptions={yearOptions}
                        months={months}
                        cryptoChoice={cryptoChoice}
                        cryptoArray={cryptoArray}
                        cryptoData={cryptoData}
                        cryptoDataFound={cryptoDataFound}
                        fiatEquivalent={fiatEquivalent}
                        loadingCryptoData={loadingCryptoData}
                        template={template}
                        handleCountryChange={(e)=>handleCountryChange(e)}
                        handleFilterCountries={(e)=>handleFilterCountries(e)}
                        handleCityChange={(e)=>handleCityChange(e)}
                        handleFilterCities={(e)=>handleFilterCities(e)}
                        handleChangeCheck={(e)=>handleChangeCheck(e)}
                        handleInputChange={(e)=>handleInputChange(e)}
                        handleEditCardNumber={()=>handleEditCardNumber()}
                        handleSaveCardNumber={()=>handleSaveCardNumber()}
                        changeMonth={(e)=>changeMonth(e)}
                        changeYear={(e)=>changeYear(e)}
                        handleCryptoChange={(e)=>handleCryptoChange(e)}
                        handleSendPaymentGoogle={(e)=>handleSendPaymentGoogle(e)}
                        handlePaymentAuthorized={(e)=>handlePaymentAuthorized(e)}
                        handleContinue={()=>handleContinue()}
                        handleBack={(e)=>handleBack(e)}
                        handleSendPayment={()=>handleSendPayment()}
                    />
                </Col>
            </>}
        </Row>
    </form>
}
export default Payment