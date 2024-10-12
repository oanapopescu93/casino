import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import PaymentDetails from './paymentDetails'
import PaymentForm from './paymentForm'
import PaymentCart from './paymentCart'

import { changePage, changeGame, changeGamePage } from '../../../reducers/page'

import countriesData from '../../../utils/constants/countries.json'
import { checkoutData, isEmpty } from '../../../utils/utils'
import { translate } from '../../../translations/translate'
import { validateCard, validateInput } from '../../../utils/validate'
import { resetPaymentDetails, updatePaymentDetails } from '../../../reducers/paymentDetails'

function Payment(props){
    const {template, home, settings} = props
    const {lang} = settings
    const minimum_amount_usd = 10
    const max_amount = 100
    const price_per_carrot = 1

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
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

    const [total, setTotal] = useState(0)
    const [totalPromo, setTotalPromo] = useState(0)
    const [qty, setQty] = useState(1)

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
        setPaymentDetails({...paymentDetails, option: value})
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
        const { name, phone, email, country, city, cardNumber, month, year, cvv } = paymentDetails        
        let errors = errors_default

        if (isEmpty(name)) {
            errors.name.fill = false
        }
        if (isEmpty(phone)) {
            errors.phone.fill = false
        }
        if (isEmpty(email)) {
            errors.email.fill = false
        }
        if (isEmpty(country)) {
            errors.country.fill = false
        }
        if (isEmpty(city)) {
            errors.city.fill = false
        }
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

        if(!validateInput(name, "name")){
            errors.name.validate = false
        }                  
        if(!validateInput(phone, "phone")){
            errors.phone.validate = false
        }
        if(!validateInput(email, "email")){
            errors.email.validate = false
        }  
        if(!validateCard(cardNumber)){ // test card details --> 4242424242424242
            errors.cardNumber.validate = false
            errors.month.validate = false
            errors.year.validate = false
        }

        return errors
    }

    function validateForm(){               
        let errors = null

        if(paymentDetails.option === "card"){
            errors = checkCardForm()
            setPaymentError(errors)
        }

        // Check if there is any problem (fill or validate errors for at least one element in error array)
        let problem = Object.values(errors).some(error => !error.fill || !error.validate)
        return problem
    }

    function handleContinue(){        
        if(!validateForm()){
            setPaymentContinue(true)
            dispatch(updatePaymentDetails({...paymentDetails}))
        }
    }

    function updateQty(e){
        setQty(e)
        setTotalPromo(e * price_per_carrot)
    }

    function sendPayment(){
        console.log('sendPayment!!! ', paymentDetails)
    }

    //dispatch(resetPaymentDetails())

    return <form id="payment_form">
        <p>{translate({lang: lang, info: "under_construction"})}</p>
        <Row>
            {paymentContinue ? <PaymentDetails 
                {...props} 
                paymentDetails={paymentDetails}
                template={template}
                handleBack={(e)=>handleBack(e)}
                sendPayment={()=>sendPayment()}
            /> : <>
                <Col sm={8}>
                    <PaymentForm 
                        {...props} 
                        paymentDetails={paymentDetails}
                        editCardNumber={editCardNumber}
                        paymentError={paymentError}
                        minimum_amount_usd={minimum_amount_usd}
                        filteredCountries={filteredCountries}
                        filteredCountry={filteredCountry}
                        filteredCities={filteredCities}
                        filteredCity={filteredCity}
                        monthOptions={monthOptions}
                        yearOptions={yearOptions}
                        months={months}
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
                    />
                </Col>
                <Col sm={4}>
                    <PaymentCart 
                        {...props}
                        cart={cart}
                        promo={promo}
                        total_promo={totalPromo}
                        total={total}
                        qty={qty}
                        max_amount={max_amount}
                        updateQty={(e)=>updateQty(e)}
                        handleContinue={()=>handleContinue()}
                        handleBack={(e)=>handleBack(e)}
                    />
                </Col>
            </>}
        </Row>
    </form>
}
export default Payment