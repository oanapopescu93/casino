import React from 'react'
import { Col, Row, Dropdown, DropdownButton } from 'react-bootstrap'
import { translate } from "../../../../translations/translate"
import { showCardNumber } from '../../../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons'

function Stripe(props) {
    const {
        paymentDetails, amount, minimum_amount, editCardNumber, paymentError, settings, monthOptions, yearOptions, months, 
        filteredCountries, filteredCountry, filteredCities, filteredCity,        
        handleCountryChange, handleFilterCountries, handleCityChange, handleFilterCities, 
        handleInputChange, handleEditCardNumber, handleSaveCardNumber, changeMonth, changeYear
    } = props
    const { lang, currency } = settings

    const cardNumber_edit = <div className="cardNumber_edit">
        <input
            value={paymentDetails.cardNumber}
            onChange={handleInputChange}
            className="input_light shadow_concav"
            type="text"
            placeholder={translate({ lang: lang, info: "cardNumber" })}
            id="cardNumber"
            name="cardNumber"
        />
        <div className="cardNumber_button" onClick={()=>handleSaveCardNumber()}>
            <FontAwesomeIcon icon={faSquareCheck} />
        </div>
    </div>

    const cardNumber_show = <div className="cardNumber_show">
        <span>{paymentDetails.cardNumber ? showCardNumber(paymentDetails.cardNumber) : '-'}</span>
        <div className="cardNumber_button" onClick={()=>handleEditCardNumber()}>
            <FontAwesomeIcon icon={faPenToSquare} />
        </div>
    </div>

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
                            <label htmlFor="name">{translate({ lang: lang, info: "name" })}</label>
                            <input
                                value={paymentDetails.name}
                                onChange={handleInputChange}
                                className="input_light shadow_concav"
                                type="text"
                                placeholder={translate({ lang: lang, info: "name" })}
                                id="name"
                                name="name"
                            />
                            {!paymentError.name.fill ? (
                                <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({ lang: lang, info: paymentError.name.fill_message })}
                                    </p>
                                </div>
                            ) : !paymentError.name.validate ? (
                                <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({ lang: lang, info: paymentError.name.validate_message })}
                                    </p>
                                </div>
                            ) : null}
                        </Col>
                        <Col sm={12} md={4}>
                            <label htmlFor="phone">{translate({ lang: lang, info: "phone" })}</label>
                            <input
                                value={paymentDetails.phone}
                                onChange={handleInputChange}
                                className="input_light shadow_concav"
                                type="text"
                                placeholder={translate({ lang: lang, info: "phone" })}
                                id="phone"
                                name="phone"
                            />
                            {!paymentError.phone.fill ? (
                                <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({ lang: lang, info: paymentError.phone.fill_message })}
                                    </p>
                                </div>
                            ) : !paymentError.phone.validate ? (
                                <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({ lang: lang, info: paymentError.phone.validate_message })}
                                    </p>
                                </div>
                            ) : null}
                        </Col>
                        <Col sm={12} md={4}>
                            <label htmlFor="email">{translate({ lang: lang, info: "email" })}</label>
                            <input
                                value={paymentDetails.email}
                                onChange={handleInputChange}
                                className="input_light shadow_concav"
                                type="text"
                                placeholder={translate({ lang: lang, info: "email" })}
                                id="email"
                                name="email"
                            />
                            {!paymentError.email.fill ? (
                                <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({ lang: lang, info: paymentError.name.fill_message })}
                                    </p>
                                </div>
                            ) : !paymentError.email.validate ? (
                                <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({ lang: lang, info: paymentError.email.validate_message })}
                                    </p>
                                </div>
                            ) : null}
                        </Col>
                    </Row>
                </Col>
                <Col sm={4} md={12}>
                    <Row>
                        <Col sm={12} md={6}>
                            <label htmlFor="country">{translate({lang: lang, info: "country"})}</label>
                            <DropdownButton title={paymentDetails.country ? paymentDetails.country : translate({lang: lang, info: "country"})} id="country_button" className="shadow_convex" onSelect={handleCountryChange}>
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
                                    {translate({ lang: lang, info: paymentError.country.fill_message })}
                                </p>
                            </div> : null}
                        </Col>
                        <Col sm={12} md={6}>
                            <label htmlFor="city">{translate({lang: lang, info: "city"})}</label>
                            <DropdownButton title={paymentDetails.city ? paymentDetails.city : translate({lang: lang, info: "city"})} id="city_button" className="shadow_convex" onSelect={handleCityChange}>
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
                                    {translate({ lang: lang, info: paymentError.city.fill_message })}
                                </p>
                            </div> : null}
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
                    <label htmlFor="card_number">{translate({lang: lang, info: "card_number"})}</label>                    
                    {!editCardNumber ? <>{cardNumber_show}</> : <>{cardNumber_edit}</>}
                    {!paymentError.cardNumber.fill ? (
                        <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({ lang: lang, info: paymentError.cardNumber.fill_message })}
                            </p>
                        </div>
                    ) : !paymentError.cardNumber.validate ? (
                        <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({ lang: lang, info: paymentError.cardNumber.validate_message })}
                            </p>
                        </div>
                    ) : null}
                </Col>
            </Row>
            <Row>
                <Col sm={4}>
                    <label>{translate({lang: lang, info: "month"})}</label>
                    <DropdownButton title={monthOptions[paymentDetails.month] ? translate({lang: lang, info: monthOptions[paymentDetails.month]}) : translate({lang: lang, info: "month"})} onSelect={(e)=>changeMonth(e)} className="shadow_concav">
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
                    <label>{translate({lang: lang, info: "year"})}</label>
                    <DropdownButton title={paymentDetails.year ? paymentDetails.year : translate({lang: lang, info: "year"})} onSelect={(e)=>changeYear(e)} className="shadow_concav">
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
                    <label htmlFor="cvv">{translate({lang: lang, info: "cvv"})}</label>
                    <input
                        value={paymentDetails.cvv}
                        onChange={handleInputChange}
                        className="input_light shadow_concav"
                        type="text"
                        placeholder={translate({ lang: lang, info: "cvv" })}
                        id="cvv"
                        name="cvv"
                    />
                    {!paymentError.cvv.fill ? (
                        <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({ lang: lang, info: paymentError.name.fill_message })}
                            </p>
                        </div>
                    ) : !paymentError.cvv.validate ? (
                        <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({ lang: lang, info: paymentError.cvv.validate_message })}
                            </p>
                        </div>
                    ) : null}
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    {minimum_amount > amount ? <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({lang: lang, info: "amount_too_small_transaction"})}
                        </p>
                    </div> : <p><span>{translate({lang: lang, info: "min_amount"})}</span>: <span>{minimum_amount} {currency}</span></p>}
                </Col>
            </Row>
        </Col>
    </Row>
}

export default Stripe