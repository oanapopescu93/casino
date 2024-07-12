import React, { useState, useEffect, useRef } from 'react'
import { Col, Row, Dropdown, DropdownButton } from 'react-bootstrap'
import { translate } from "../../../../translations/translate"
import { checkoutData } from '../../../../utils/utils'
import countriesData from '../../../../utils/constants/countries.json'

function Stripe(props) {
    const {paymentDetails, gateway, gatewayDetailsMandatory, paymentError, settings, minimum_amount_usd} = props
    const {lang} = settings

    const [name] = useState(paymentDetails.name !== "" ? paymentDetails.name : "")
    const [email] = useState(paymentDetails.email !== "" ? paymentDetails.email : "")
    const [phone] = useState(paymentDetails.phone !== "" ? paymentDetails.phone : "")
    const [cardNumber] = useState(paymentDetails.cardNumber !== "" ? paymentDetails.cardNumber : "")
    const [cvv] = useState(paymentDetails.cvv !== "" ? paymentDetails.cvv : "")

    const [country, setCountry] = useState(paymentDetails.country !== "" ? paymentDetails.country : "")
    const [city, setCity] = useState(paymentDetails.city !== "" ? paymentDetails.city : "")
    
    const [month, setMonth] = useState(paymentDetails.month !== -1 ? paymentDetails.month : -1)
    const [year, setYear] = useState(paymentDetails.year !== "" ? paymentDetails.year : "")  

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

    return <Row id="payment_form_stripe">
        <Col sm={12}>
            <Row>
                <Col sm={12}>
                    <h3>{translate({lang: lang, info: "customer_info"})}</h3>
                </Col>
            </Row>
            <Row>
                <Col sm={8} md={12}>
                    <Row>
                        <Col sm={12} md={4}>
                            <label htmlFor="name">{translate({lang: lang, info: "name"})} {gatewayDetailsMandatory[gateway].includes("name") ? <>*</> : null}</label>
                            <input defaultValue={name} className="input_light shadow_concav" type="text" placeholder={translate({lang: lang, info: "name"})} id="name" name="name"/>
                            {!paymentError.name.fill ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: lang, info: paymentError.name.fill_message})}
                                </p>
                            </div> : <>
                                {!paymentError.name.validate ? <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({lang: lang, info: paymentError.name.validate_message})}
                                    </p>
                                </div> : null}
                            </>}
                        </Col>
                        <Col sm={12} md={4}>
                            <label htmlFor="email">{translate({lang: lang, info: "email"})} {gatewayDetailsMandatory[gateway].includes("email") ? <>*</> : null}</label>
                            <input defaultValue={email} className="input_light shadow_concav" type="text" placeholder="text@text.text" id="email" name="email"/>
                            {!paymentError.email.fill ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: lang, info: paymentError.email.fill_message})}
                                </p>
                            </div> : <>
                                {!paymentError.email.validate ? <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({lang: lang, info: paymentError.email.validate_message})}
                                    </p>
                                </div> : null}
                            </>}
                        </Col>
                        <Col sm={12} md={4}>
                            <label htmlFor="phone">{translate({lang: lang, info: "phone"})} {gatewayDetailsMandatory[gateway].includes("phone") ? <>*</> : null}</label>
                            <input defaultValue={phone} className="input_light shadow_concav" type="text" placeholder={translate({lang: lang, info: "phone"})} id="phone" name="phone"/>
                            {!paymentError.phone.fill ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: lang, info: paymentError.phone.fill_message})}
                                </p>
                            </div> : <>
                                {!paymentError.phone.validate ? <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({lang: lang, info: paymentError.phone.validate_message})}
                                    </p>
                                </div> : null}
                            </>}
                        </Col>
                    </Row>
                </Col>
                <Col sm={4} md={12}>
                    <Row>
                        <Col sm={12} md={6}>
                            <label htmlFor="country">{translate({lang: lang, info: "country"})} {gatewayDetailsMandatory[gateway].includes("country") ? <>*</> : null}</label>
                            <DropdownButton title={country ? country : translate({lang: lang, info: "country"})} id="country_button" className="shadow_convex" onSelect={handleCountryChange}>
                                <div className="dropdown_search">
                                    <input 
                                        id="searchCountry" 
                                        className="input_light shadow_concav" 
                                        type="text" 
                                        placeholder={translate({lang: lang, info: "search"})}
                                        value={filteredCountry}
                                        onChange={(e) => handleFilterCountries(e.target.value)}
                                    />
                                </div>
                                {filteredCountries.map((country, i)=>{
                                    return <Dropdown.Item key={i} eventKey={country}><span>{country}</span></Dropdown.Item>
                                })}
                            </DropdownButton>
                            {!paymentError.country.fill ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: lang, info: paymentError.country.fill_message})}
                                </p>
                            </div> : <>
                                {!paymentError.country.validate ? <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({lang: lang, info: paymentError.country.validate_message})}
                                    </p>
                                </div> : null}
                            </>}
                        </Col>
                        <Col sm={12} md={6}>
                            <label htmlFor="city">{translate({lang: lang, info: "city"})} {gatewayDetailsMandatory[gateway].includes("city") ? <>*</> : null}</label>
                            <DropdownButton ref={cityDropdownRef} title={city ? city : translate({lang: lang, info: "city"})} id="city_button" className="shadow_convex" onSelect={handleCityChange}>
                                <div className="dropdown_search">
                                    <input 
                                        id="searchCity" 
                                        className="input_light shadow_concav" 
                                        type="text" 
                                        placeholder={translate({lang: lang, info: "search"})}
                                        value={filteredCity}
                                        onChange={(e) => handleFilterCities(e.target.value)}
                                    />
                                </div>
                                {filteredCities.map((city, i)=>{
                                    return <Dropdown.Item key={i} eventKey={city}><span>{city}</span></Dropdown.Item>
                                })}
                            </DropdownButton>
                            {!paymentError.city.fill ? <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({lang: lang, info: paymentError.city.fill_message})}
                                </p>
                            </div> : <>
                                {!paymentError.city.validate ? <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({lang: lang, info: paymentError.city.validate_message})}
                                    </p>
                                </div> : null}
                            </>}
                        </Col>
                    </Row> 
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <h3>{translate({lang: lang, info: "payment_info"})}</h3>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <label htmlFor="card_number">{translate({lang: lang, info: "card_number"})} {gatewayDetailsMandatory[gateway].includes("card_number") ? <>*</> : null}</label>
                    <input defaultValue={cardNumber} className="input_light shadow_concav" type="text" placeholder="XXXX XXXX XXXX XXXX" id="card_number" name="card_number"/>
                    {!paymentError.cardNumber.fill ? <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({lang: lang, info: paymentError.cardNumber.fill_message})}
                        </p>
                    </div> : <>
                        {!paymentError.cardNumber.validate ? <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({lang: lang, info: paymentError.cardNumber.validate_message})}
                            </p>
                        </div> : null}
                    </>}
                </Col>
            </Row>
            <Row>
                <Col sm={4}>
                    <label>{translate({lang: lang, info: "month"})} {gatewayDetailsMandatory[gateway].includes("month") ? <>*</> : null}</label>
                    <DropdownButton title={monthOptions[month] ? translate({lang: lang, info: monthOptions[month]}) : translate({lang: lang, info: "month"})} onSelect={(e)=>changeMonth(e)} className="shadow_concav">
                        {months.map((x, i)=>{
                            return <Dropdown.Item key={i} eventKey={x}>{translate({lang: lang, info: monthOptions[x]})}</Dropdown.Item>
                        })}
                    </DropdownButton>
                    {!paymentError.month.fill ? <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({lang: lang, info: paymentError.month.fill_message})}
                        </p>
                    </div> : <>
                        {!paymentError.month.validate ? <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({lang: lang, info: paymentError.month.validate_message})}
                            </p>
                        </div> : null}
                    </>}
                </Col>
                <Col sm={4}>
                    <label>{translate({lang: lang, info: "year"})} {gatewayDetailsMandatory[gateway].includes("year") ? <>*</> : null}</label>
                    <DropdownButton title={year ? year : translate({lang: lang, info: "year"})} onSelect={(e)=>changeYear(e)} className="shadow_concav">
                        {yearOptions.map((x, i)=>{
                            return <Dropdown.Item key={i} eventKey={x}>{x}</Dropdown.Item>
                        })}
                    </DropdownButton>
                    {!paymentError.year.fill ? <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({lang: lang, info: paymentError.year.fill_message})}
                        </p>
                    </div> : <>
                        {!paymentError.year.validate ? <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({lang: lang, info: paymentError.year.validate_message})}
                            </p>
                        </div> : null}
                    </>}
                </Col>
                <Col sm={4}>
                    <label htmlFor="cvv">{translate({lang: lang, info: "cvv"})} {gatewayDetailsMandatory[gateway].includes("cvv") ? <>*</> : null}</label>
                    <input defaultValue={cvv} className="input_light shadow_concav" type="text" placeholder="123" id="cvv" name="cvv"/>
                    {!paymentError.cvv.fill ? <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({lang: lang, info: paymentError.cvv.fill_message})}
                        </p>
                    </div> : <>
                        {!paymentError.cvv.validate ? <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({lang: lang, info: paymentError.cvv.validate_message})}
                            </p>
                        </div> : null}
                    </>}
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <p><span>{translate({lang: lang, info: "min_amount"})}</span>: <span>{minimum_amount_usd} USD</span></p>
                </Col>
            </Row>
        </Col>
    </Row>
}

export default Stripe