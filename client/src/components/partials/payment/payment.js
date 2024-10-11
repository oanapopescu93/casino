import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import PaymentDetails from './paymentDetails'
import PaymentForm from './paymentForm'
import PaymentCart from './paymentCart'

import { changePage, changeGame, changeGamePage } from '../../../reducers/page'

import countriesData from '../../../utils/constants/countries.json'
import { checkoutData } from '../../../utils/utils'
import { translate } from '../../../translations/translate'

function Payment(props){
    const {template, home, settings} = props
    const {lang} = settings
    const minimum_amount_usd = 10

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
    const [paymentChoice, setPaymentChoice] = useState({
        stripe: payment_details.option === "1" ? true : false,
        paypal: payment_details.option === "2" ? true : false,
        crypto: payment_details.option === "3" ? true : false,
    })
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

    let market = home.market ? home.market : []
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
            setPaymentDetails(null)
        }        
    }

    function handleChangeCheck(choice){
        setPaymentChoice({
            stripe: choice === "stripe",
            paypal: choice === "paypal",
            crypto: choice === "crypto"
        })
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

    function sendPayment(){
        console.log('sendPayment!!! ', paymentDetails)
    }

    function handleContinue(){
        setPaymentContinue(true)
    }

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
                        paymentChoice={paymentChoice}
                        paymentDetails={paymentDetails}
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
                        changeMonth={(e)=>changeMonth(e)}
                        changeYear={(e)=>changeYear(e)}
                    />
                </Col>
                <Col sm={4}>
                    <PaymentCart 
                        {...props}
                        cart={cart}
                        promo={promo}
                        total_promo={total_promo}
                        total={total}
                        handleContinue={()=>handleContinue()}
                        handleBack={(e)=>handleBack(e)}
                    />
                </Col>
            </>}
        </Row>
    </form>
}
export default Payment