import React from 'react'
import { Col, Row, Dropdown, DropdownButton } from 'react-bootstrap'
import { translate } from "../../../../translations/translate"
import { convertCurrency, showCardNumber } from '../../../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons'

import download1 from '../../../../img/payments/download1.png'
import download2 from '../../../../img/payments/download2.png'
import download3 from '../../../../img/payments/download3.png'
import download4 from '../../../../img/payments/download4.png'
import download5 from '../../../../img/payments/download5.png'
import download6 from '../../../../img/payments/download6.png'
import download7 from '../../../../img/payments/download7.png'

function Stripe(props) {
    const {
        paymentDetails, amount, minimum_amount, exchange_rates, editCardNumber, paymentError, settings, monthOptions, yearOptions, months, 
        filteredCountries, filteredCountry, filteredCities, filteredCity,        
        handleCountryChange, handleFilterCountries, handleCityChange, handleFilterCities, 
        handleInputChange, handleEditCardNumber, handleSaveCardNumber, changeMonth, changeYear
    } = props
    const { lang, currency } = settings
    let price = convertCurrency(amount, currency, exchange_rates)

    const cardNumber_edit = <div className="cardNumber_edit">
        <input
            value={paymentDetails.cardNumber}
            onChange={handleInputChange}
            className="input_light shadow_concav"
            type="text"
            placeholder={translate({ lang, info: "cardNumber" })}
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
        {minimum_amount >= price ? <Col sm={12}>
            <div className="alert alert-danger">
                <p className="text_red">
                    {translate({lang, info: "amount_too_small_transaction"})}
                </p>
                <p className="text_red">
                    <span>{translate({lang, info: "min_amount"})}</span>: <span>{minimum_amount} {currency}</span>
                </p>
            </div>
        </Col> : <Col sm={12}>
            <Row>
                <Col sm={12}>
                    <h3>{translate({lang, info: "customer_info"})}</h3>
                </Col>
            </Row>
            <Row>
                <Col sm={8} md={12}>
                    <Row>
                        <Col sm={12} md={4}>
                            <label htmlFor="name">{translate({ lang, info: "name" })}</label>
                            <input
                                value={paymentDetails.name}
                                onChange={handleInputChange}
                                className="input_light shadow_concav"
                                type="text"
                                placeholder={translate({ lang, info: "name" })}
                                id="name"
                                name="name"
                            />
                            {!paymentError.name.fill ? (
                                <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({ lang, info: paymentError.name.fill_message })}
                                    </p>
                                </div>
                            ) : !paymentError.name.validate ? (
                                <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({ lang, info: paymentError.name.validate_message })}
                                    </p>
                                </div>
                            ) : null}
                        </Col>
                        <Col sm={12} md={4}>
                            <label htmlFor="phone">{translate({ lang, info: "phone" })}</label>
                            <input
                                value={paymentDetails.phone}
                                onChange={handleInputChange}
                                className="input_light shadow_concav"
                                type="text"
                                placeholder={translate({ lang, info: "phone" })}
                                id="phone"
                                name="phone"
                            />
                            {!paymentError.phone.fill ? (
                                <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({ lang, info: paymentError.phone.fill_message })}
                                    </p>
                                </div>
                            ) : !paymentError.phone.validate ? (
                                <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({ lang, info: paymentError.phone.validate_message })}
                                    </p>
                                </div>
                            ) : null}
                        </Col>
                        <Col sm={12} md={4}>
                            <label htmlFor="email">{translate({ lang, info: "email" })}</label>
                            <input
                                value={paymentDetails.email}
                                onChange={handleInputChange}
                                className="input_light shadow_concav"
                                type="text"
                                placeholder={translate({ lang, info: "email" })}
                                id="email"
                                name="email"
                            />
                            {!paymentError.email.fill ? (
                                <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({ lang, info: paymentError.name.fill_message })}
                                    </p>
                                </div>
                            ) : !paymentError.email.validate ? (
                                <div className="alert alert-danger">
                                    <p className="text_red">
                                        {translate({ lang, info: paymentError.email.validate_message })}
                                    </p>
                                </div>
                            ) : null}
                        </Col>
                    </Row>
                </Col>
                <Col sm={4} md={12}>
                    <Row>
                        <Col sm={12} md={6}>
                            <label htmlFor="country">{translate({lang, info: "country"})}</label>
                            <DropdownButton title={paymentDetails.country ? paymentDetails.country : translate({lang, info: "country"})} id="country_button" className="shadow_convex" onSelect={handleCountryChange}>
                                <div className="dropdown_search">
                                    <input 
                                        id="searchCountry" 
                                        className="input_light shadow_concav" 
                                        type="text" 
                                        placeholder={translate({lang, info: "search"})}
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
                                    {translate({ lang, info: paymentError.country.fill_message })}
                                </p>
                            </div> : null}
                        </Col>
                        <Col sm={12} md={6}>
                            <label htmlFor="city">{translate({lang, info: "city"})}</label>
                            <DropdownButton title={paymentDetails.city ? paymentDetails.city : translate({lang, info: "city"})} id="city_button" className="shadow_convex" onSelect={handleCityChange}>
                                <div className="dropdown_search">
                                    <input 
                                        id="searchCity" 
                                        className="input_light shadow_concav" 
                                        type="text" 
                                        placeholder={translate({lang, info: "search"})}
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
                                    {translate({ lang, info: paymentError.city.fill_message })}
                                </p>
                            </div> : null}
                        </Col>
                    </Row> 
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <h3>{translate({lang, info: "payment_info"})}</h3>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <label htmlFor="card_number">{translate({lang, info: "card_number"})}*</label>                    
                    {!editCardNumber ? <>{cardNumber_show}</> : <>{cardNumber_edit}</>}
                    {!paymentError.cardNumber.fill ? (
                        <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({ lang, info: paymentError.cardNumber.fill_message })}
                            </p>
                        </div>
                    ) : !paymentError.cardNumber.validate ? (
                        <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({ lang, info: paymentError.cardNumber.validate_message })}
                            </p>
                        </div>
                    ) : null}
                </Col>
            </Row>
            <Row>
                <Col sm={4}>
                    <label>{translate({lang, info: "month"})}*</label>
                    <DropdownButton title={monthOptions[paymentDetails.month] ? translate({lang, info: monthOptions[paymentDetails.month]}) : translate({lang, info: "month"})} onSelect={(e)=>changeMonth(e)} className="shadow_concav">
                        {months.map((x, i)=>{
                            return <Dropdown.Item key={i} eventKey={x}>{translate({lang, info: monthOptions[x]})}</Dropdown.Item>
                        })}
                    </DropdownButton>
                    {!paymentError.month.fill ? <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({lang, info: paymentError.month.fill_message})}
                        </p>
                    </div> : <>
                        {!paymentError.month.validate ? <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({lang, info: paymentError.month.validate_message})}
                            </p>
                        </div> : null}
                    </>}
                </Col>
                <Col sm={4}>
                    <label>{translate({lang, info: "year"})}*</label>
                    <DropdownButton title={paymentDetails.year ? paymentDetails.year : translate({lang, info: "year"})} onSelect={(e)=>changeYear(e)} className="shadow_concav">
                        {yearOptions.map((x, i)=>{
                            return <Dropdown.Item key={i} eventKey={x}>{x}</Dropdown.Item>
                        })}
                    </DropdownButton>
                    {!paymentError.year.fill ? <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({lang, info: paymentError.year.fill_message})}
                        </p>
                    </div> : <>
                        {!paymentError.year.validate ? <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({lang, info: paymentError.year.validate_message})}
                            </p>
                        </div> : null}
                    </>}
                </Col>
                <Col sm={4}>
                    <label htmlFor="cvv">{translate({lang, info: "cvv"})}*</label>
                    <input
                        value={paymentDetails.cvv}
                        onChange={handleInputChange}
                        className="input_light shadow_concav"
                        type="text"
                        placeholder={translate({ lang, info: "cvv" })}
                        id="cvv"
                        name="cvv"
                    />
                    {!paymentError.cvv.fill ? (
                        <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({ lang, info: paymentError.name.fill_message })}
                            </p>
                        </div>
                    ) : !paymentError.cvv.validate ? (
                        <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({ lang, info: paymentError.cvv.validate_message })}
                            </p>
                        </div>
                    ) : null}
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    {minimum_amount > price ? <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({lang, info: "amount_too_small_transaction"})}
                        </p>
                        <p className="text_red">
                            <span>{translate({lang, info: "min_amount"})}</span>: <span>{minimum_amount} {currency}</span>
                        </p>
                    </div> : null}
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <div className="payment_icons_container">
                        <img src={download1} alt="JCB" title="JCB" className="payment_icon" />
                        <img src={download2} alt="Discover" title="Discover" className="payment_icon" />
                        <img src={download3} alt="Diner's Club" title="Diner's Club" className="payment_icon" />
                        <img src={download4} alt="Maestro" title="Maestro" className="payment_icon" />
                        <img src={download5} alt="MasterCard" title="MasterCard" className="payment_icon" />
                        <img src={download6} alt="Visa" title="Visa" className="payment_icon" />
                        <img src={download7} alt="American Express" title="American Express" className="payment_icon" />
                    </div>
                </Col>
            </Row>
        </Col>}
    </Row>
}

export default Stripe