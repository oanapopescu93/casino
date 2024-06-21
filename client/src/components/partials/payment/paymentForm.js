import React, { useState, useEffect, useRef } from 'react'
import { translate } from '../../../translations/translate'
import { Col, Row, Dropdown, DropdownButton } from 'react-bootstrap'
import { checkoutData } from '../../../utils/utils'
import countriesData from '../../../utils/constants/countries.json'

function PaymentForm(props){
    const {cryptoData, totalPromo, gateway, gatewayDetailsMandatory, paymentDetails, paymentError} = props

    const [name] = useState(paymentDetails.name !== "" ? paymentDetails.name : "")
    const [email] = useState(paymentDetails.email !== "" ? paymentDetails.email : "")
    const [phone] = useState(paymentDetails.phone !== "" ? paymentDetails.phone : "")

    const [country, setCountry] = useState(paymentDetails.country !== "" ? paymentDetails.country : "")
    const [city, setCity] = useState(paymentDetails.city !== "" ? paymentDetails.city : "")

    const [radioOne, setRadioOne] = useState(paymentDetails.option === "1" ? true : false)
    const [radioTwo, setRadioTwo] = useState(paymentDetails.option === "2" ? true : false)
    const [radioThree, setRadioThree] = useState(paymentDetails.option === "3" ? true : false)

    const [cardNumber] = useState(paymentDetails.cardNumber !== "" ? paymentDetails.cardNumber : "")
    const [month, setMonth] = useState(paymentDetails.month !== -1 ? paymentDetails.month : -1)
    const [year, setYear] = useState(paymentDetails.year !== "" ? paymentDetails.year : "")
    const [cvv] = useState(paymentDetails.cvv !== "" ? paymentDetails.cvv : "")

    const [bitcoinAddress] = useState(paymentDetails.bitcoin_address !== "" ? paymentDetails.bitcoin_address : "")
    
    const [countries, setCountries] = useState([])
    const [cities, setCities] = useState([])
    const [filteredCities, setFilteredCities] = useState([])
    const [filteredCountries, setFilteredCountries] = useState([])
    const [filteredCountry, setFilteredCountry] = useState("")
    const [filteredCity, setFilteredCity] = useState("")
    const monthOptions = checkoutData().monthOptions
    const yearOptions = checkoutData().yearOptions
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

    const cityDropdownRef = useRef(null)
    
    useEffect(() => {        
        const countryNames = Object.keys(countriesData)
        setCountries(countryNames)
        setFilteredCountries(countryNames)
    }, [])
    
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

    function handleCountryChange(e) {
        const selectedCountry = e
        setCountry(selectedCountry)
        const selectedCities = countriesData[selectedCountry] || []
        setCities(selectedCities)
        setFilteredCities(selectedCities)
        setFilteredCity("")
        setCity("")
        if(props.getChanges && typeof props.getChanges === "function"){
            props.getChanges({type: 'country', value: selectedCountry})
        }

        if(cityDropdownRef && cityDropdownRef.current){
            cityDropdownRef.current.scrollIntoView({ behavior: 'smooth' })
        }       
    }

    function handleCityChange(e) {
        setCity(e)
        if(props.getChanges && typeof props.getChanges === "function"){
            props.getChanges({type: 'city', value: e})
        }
    }

    function handleFilterCountries(e){
        const filtered = countries.filter(country => country.toLowerCase().includes(e.toLowerCase()))

        setFilteredCountries(filtered)
        setFilteredCountry(e)

        setFilteredCities([])
        setFilteredCity("")
    }

    function handleFilterCities(e){
        const filtered = cities.filter(city => city.toLowerCase().includes(e.toLowerCase()))
        setFilteredCities(filtered)
        setFilteredCity(e)
    }  

    return <form id="payment_form">
        <Row>
            <Col sm={12}>
                <h3>{translate({lang: props.lang, info: "customer_info"})}</h3>
            </Col>
        </Row>
        <Row>
            <Col sm={8} md={12}>
                <Row>
                    <Col sm={12} md={4}>
                        <label htmlFor="name">{translate({lang: props.lang, info: "name"})} {gatewayDetailsMandatory[gateway].includes("name") ? <>*</> : null}</label>
                        <input defaultValue={name} className="input_light shadow_concav" type="text" placeholder={translate({lang: props.lang, info: "name"})} id="name" name="name"/>
                        {!paymentError.name.fill ? <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({lang: props.lang, info: paymentError.name.fill_message})}
                            </p>
                        </div> : <>
                            {!paymentError.name.validate ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: props.lang, info: paymentError.name.validate_message})}
                                </p>
                            </div> : null}
                        </>}                        
                    </Col>
                    <Col sm={12} md={4}>
                        <label htmlFor="email">{translate({lang: props.lang, info: "email"})} {gatewayDetailsMandatory[gateway].includes("email") ? <>*</> : null}</label>
                        <input defaultValue={email} className="input_light shadow_concav" type="text" placeholder="text@text.text" id="email" name="email"/>
                        {!paymentError.email.fill ? <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({lang: props.lang, info: paymentError.email.fill_message})}
                            </p>
                        </div> : <>
                            {!paymentError.email.validate ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: props.lang, info: paymentError.email.validate_message})}
                                </p>
                            </div> : null}
                        </>}                        
                    </Col>
                    <Col sm={12} md={4}>
                        <label htmlFor="phone">{translate({lang: props.lang, info: "phone"})} {gatewayDetailsMandatory[gateway].includes("phone") ? <>*</> : null}</label>
                        <input defaultValue={phone} className="input_light shadow_concav" type="text" placeholder={translate({lang: props.lang, info: "phone"})} id="phone" name="phone"/>
                        {!paymentError.phone.fill ? <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({lang: props.lang, info: paymentError.phone.fill_message})}
                            </p>
                        </div> : <>
                            {!paymentError.phone.validate ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: props.lang, info: paymentError.phone.validate_message})}
                                </p>
                            </div> : null}
                        </>}                        
                    </Col>
                </Row>
            </Col>
            <Col sm={4} md={12}>
                <Row>
                    <Col sm={12} md={6}>
                        <label htmlFor="country">{translate({lang: props.lang, info: "country"})} {gatewayDetailsMandatory[gateway].includes("country") ? <>*</> : null}</label>
                        <DropdownButton title={country ? country : translate({lang: props.lang, info: "country"})} id="country_button" className="shadow_convex" onSelect={handleCountryChange}>
                            <div className="dropdown_search">
                                <input 
                                    id="searchCountry" 
                                    className="input_light shadow_concav" 
                                    type="text" 
                                    placeholder={translate({lang: props.lang, info: "search"})}                                     
                                    value={filteredCountry}
                                    onChange={(e) => handleFilterCountries(e.target.value)}
                                />
                            </div>
                            {filteredCountries.map(function(country, i){
                                return <Dropdown.Item key={i} eventKey={country}><span>{country}</span></Dropdown.Item>
                            })}
                        </DropdownButton>
                        {!paymentError.country.fill ? <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({lang: props.lang, info: paymentError.country.fill_message})}
                            </p>
                        </div> : <>
                            {!paymentError.country.validate ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: props.lang, info: paymentError.country.validate_message})}
                                </p>
                            </div> : null}
                        </>}                        
                    </Col>
                    <Col sm={12} md={6}>
                        <label htmlFor="city">{translate({lang: props.lang, info: "city"})} {gatewayDetailsMandatory[gateway].includes("city") ? <>*</> : null}</label>
                        <DropdownButton ref={cityDropdownRef} title={city ? city : translate({lang: props.lang, info: "city"})} id="city_button" className="shadow_convex" onSelect={handleCityChange}>
                            <div className="dropdown_search">
                                <input 
                                    id="searchCity" 
                                    className="input_light shadow_concav" 
                                    type="text" 
                                    placeholder={translate({lang: props.lang, info: "search"})}                                     
                                    value={filteredCity}
                                    onChange={(e) => handleFilterCities(e.target.value)}
                                />
                            </div>
                            {filteredCities.map(function(city, i) {
                                return <Dropdown.Item key={i} eventKey={city}><span>{city}</span></Dropdown.Item>
                            })}
                        </DropdownButton>
                        {!paymentError.city.fill ? <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({lang: props.lang, info: paymentError.city.fill_message})}
                            </p>
                        </div> : <>
                            {!paymentError.city.validate ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: props.lang, info: paymentError.city.validate_message})}
                                </p>
                            </div> : null}
                        </>}                        
                    </Col>
                </Row> 
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
                            <label htmlFor="card_number">{translate({lang: props.lang, info: "card_number"})} {gatewayDetailsMandatory[gateway].includes("card_number") ? <>*</> : null}</label>
                            <input defaultValue={cardNumber} className="input_light shadow_concav" type="text" placeholder="XXXX XXXX XXXX XXXX" id="card_number" name="card_number"/>
                            {!paymentError.cardNumber.fill ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: props.lang, info: paymentError.cardNumber.fill_message})}
                                </p>
                            </div> : <>
                                {!paymentError.cardNumber.validate ? <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({lang: props.lang, info: paymentError.cardNumber.validate_message})}
                                    </p>
                                </div> : null}
                            </>}                            
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            <label>{translate({lang: props.lang, info: "month"})} {gatewayDetailsMandatory[gateway].includes("month") ? <>*</> : null}</label>
                            <DropdownButton title={monthOptions[month] ? translate({lang: props.lang, info: monthOptions[month]}) : translate({lang: props.lang, info: "month"})} onSelect={(e)=>changeMonth(e)} className="shadow_concav">
                                {months.map(function(x, i){
                                    return <Dropdown.Item key={i} eventKey={x}>{translate({lang: props.lang, info: monthOptions[x]})}</Dropdown.Item>
                                })}
                            </DropdownButton>
                            {!paymentError.month.fill ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: props.lang, info: paymentError.month.fill_message})}
                                </p>
                            </div> : <>
                                {!paymentError.month.validate ? <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({lang: props.lang, info: paymentError.month.validate_message})}
                                    </p>
                                </div> : null}
                            </>}                            
                        </Col>
                        <Col sm={4}>
                            <label>{translate({lang: props.lang, info: "year"})} {gatewayDetailsMandatory[gateway].includes("year") ? <>*</> : null}</label>
                            <DropdownButton title={year ? year : translate({lang: props.lang, info: "year"})} onSelect={(e)=>changeYear(e)} className="shadow_concav">
                                {yearOptions.map(function(x, i){
                                    return <Dropdown.Item key={i} eventKey={x}>{x}</Dropdown.Item>
                                })}
                            </DropdownButton>
                            {!paymentError.year.fill ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: props.lang, info: paymentError.year.fill_message})}
                                </p>
                            </div> : <>
                                {!paymentError.year.validate ? <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({lang: props.lang, info: paymentError.year.validate_message})}
                                    </p>
                                </div> : null}
                            </>}                            
                        </Col>
                        <Col sm={4}>
                            <label htmlFor="cvv">{translate({lang: props.lang, info: "cvv"})} {gatewayDetailsMandatory[gateway].includes("cvv") ? <>*</> : null}</label>
                            <input defaultValue={cvv} className="input_light shadow_concav" type="text" placeholder="123" id="cvv" name="cvv"/>
                            {!paymentError.cvv.fill ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: props.lang, info: paymentError.cvv.fill_message})}
                                </p>
                            </div> : <>
                                {!paymentError.cvv.validate ? <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({lang: props.lang, info: paymentError.cvv.validate_message})}
                                    </p>
                                </div> : null}
                            </>}                            
                        </Col>
                    </Row>
                </> : null}    
                {radioThree ? <>
                    <Row>
                        <Col sm={12}>
                            {(() => {                        
                                if(cryptoData && totalPromo > 0){
                                    if(parseInt(cryptoData.fiat_equivalent) <= parseInt(totalPromo)){
                                        return <>
                                            <label htmlFor="bitcoin_address">{translate({lang: props.lang, info: "bitcoin_address"})} {gatewayDetailsMandatory[gateway].includes("bitcoin_address") ? <>*</> : null}</label>
                                            <input defaultValue={bitcoinAddress} className="input_light shadow_concav" type="text" placeholder={translate({lang: props.lang, info: "bitcoin_address"})} id="bitcoin_address" name="bitcoin_address"/>
                                            {!paymentError.bitcoinAddress.fill ? <div className="alert alert-danger">
                                                <p className="text_red">
                                                    {translate({lang: props.lang, info: paymentError.bitcoinAddress.fill_message})}
                                                </p>
                                            </div> : <>
                                                {!paymentError.bitcoinAddress.validate ? <div className="alert alert-danger">
                                                    <p className="text_red">
                                                        {translate({lang: props.lang, info: paymentError.bitcoinAddress.validate_message})}
                                                    </p>
                                                </div> : null}
                                            </>}                                            
                                        </>
                                    } else {
                                        return <>
                                            <p><span>{translate({lang: props.lang, info: "min_amount"})}</span>: <span>{cryptoData.min_amount} {cryptoData.currency_from}</span></p>
                                            <p><span>{translate({lang: props.lang, info: "or"})} {translate({lang: props.lang, info: "fiat_equivalent"})}</span>: <span>${cryptoData.fiat_equivalent}</span></p>
                                        </>
                                    }
                                } else {
                                    return <p>{translate({lang: props.lang, info: "error"})}</p>
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