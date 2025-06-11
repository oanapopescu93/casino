import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faMoneyBillTransfer, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Row, Col, Dropdown, DropdownButton, Button } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import Counter from '../../partials/counter'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../../reducers/popup'
// import ReCAPTCHA from "react-google-recaptcha"

function WithdrawFormStripe(props) {    
    const { 
        home, settings, money, allowedCurrencies, withdrawError, formState,
        filteredCountries, filteredCountry, filteredCities, filteredCity, 
        handleInputChange, changeCurrency, updateAmount, 
        handleCountryChange, handleFilterCountries, 
        handleCityChange, handleFilterCities, 
        captchaToken,
        handleSubmit, onCaptchaChange, handleBack 
    } = props
    const { lang } = settings
    const { finances } = home
    const { min_amount_withdraw, convert_carrots_rate } = finances

    let minAmount = min_amount_withdraw/convert_carrots_rate
    let maxAmount = Math.floor(money / convert_carrots_rate) > 3 * minAmount ? 3 * minAmount : Math.floor(money / convert_carrots_rate) // the max is your carrots converted to cash, if the cash is more than 3 x min, then max is 3 x min

    let dispatch = useDispatch()

    let key = "6LcdLLgqAAAAAE9O5_nzzmh8cWra3JDRDjtzBh3w"
    let secret_key = "6LcdLLgqAAAAAJLa85f6n781yygQTcA519HqHhD4"

    function handleInstructionPopup(){
        let payload = {
            open: true,
            template: "instruction_popup",
            title: translate({lang, info: "instructions"}),
            data: translate({lang, info: "withdraw_instructions"}),
            size: "lg",
            html: true,
        }
        dispatch(changePopup(payload))
    }

    return <form id="withdraw_form">
        <Row>
            <Col sm={12}>                
                <div className="instructions_container">
                    <p onClick={()=>handleInstructionPopup()}><FontAwesomeIcon icon={faCircleInfo} /></p>
                </div>
            </Col>
        </Row>   
        <Row>
            <Col sm={6} className="withdraw_form_amount">
                <label htmlFor="amount">{translate({ lang, info: "amount" })} *</label>
                <Counter min={minAmount} num={formState.amount} max={maxAmount} update={(e)=>updateAmount(e)} />
            </Col>
            <Col sm={6} className="withdraw_form_currency">
                <label htmlFor="currency">{translate({ lang, info: "currency" })} *</label>
                <DropdownButton title={formState.currency} onSelect={changeCurrency} className="shadow_concav">
                    {allowedCurrencies.map((x, i) => (
                        <Dropdown.Item key={i} eventKey={x}>{x}</Dropdown.Item>
                    ))}
                </DropdownButton>
            </Col>
        </Row>
        <Row>
            <Col sm={4} className="withdraw_form_name">
                <label htmlFor="amount">{translate({ lang, info: "name" })} *</label>
                <input
                    value={formState.name}
                    onChange={handleInputChange}
                    className="input_light shadow_concav"
                    type="text"
                    placeholder={translate({ lang, info: "name" })}
                    id="name"
                    name="name"
                />
                {!withdrawError.name.fill ? (
                    <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({ lang, info: withdrawError.name.fill_message })}
                        </p>
                    </div>
                ) : !withdrawError.name.validate ? (
                    <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({ lang, info: withdrawError.name.validate_message })}
                        </p>
                    </div>
                ) : null}
            </Col>
            <Col sm={4} className="withdraw_form_phone">
                <label htmlFor="amount">{translate({ lang, info: "phone" })} *</label>
                <input
                    value={formState.phone}
                    onChange={handleInputChange}
                    className="input_light shadow_concav"
                    type="text"
                    placeholder={translate({ lang, info: "phone" })}
                    id="phone"
                    name="phone"
                />
                {!withdrawError.phone.fill ? (
                    <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({ lang, info: withdrawError.phone.fill_message })}
                        </p>
                    </div>
                ) : !withdrawError.phone.validate ? (
                    <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({ lang, info: withdrawError.phone.validate_message })}
                        </p>
                    </div>
                ) : null}
            </Col>
            <Col sm={4} className="withdraw_form_email">
                <label htmlFor="amount">{translate({ lang, info: "email" })} *</label>
                <input
                    value={formState.email}
                    onChange={handleInputChange}
                    className="input_light shadow_concav"
                    type="text"
                    placeholder={translate({ lang, info: "email" })}
                    id="email"
                    name="email"
                />
                {!withdrawError.email.fill ? (
                    <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({ lang, info: withdrawError.email.fill_message })}
                        </p>
                    </div>
                ) : !withdrawError.email.validate ? (
                    <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({ lang, info: withdrawError.email.validate_message })}
                        </p>
                    </div>
                ) : null}
            </Col>
        </Row>
        <Row>
            <Col sm={4} className="withdraw_form_country_city">
                <Row>
                    <Col sm={12} className="withdraw_form_country">
                        <label htmlFor="amount">{translate({ lang, info: "country" })} *</label>
                        <DropdownButton title={formState.country ? formState.country : translate({lang, info: "country"})} id="country_button" className="shadow_convex" onSelect={handleCountryChange}>
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
                        {!withdrawError.country.fill ? <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({ lang, info: withdrawError.country.fill_message })}
                            </p>
                        </div> : null}
                    </Col>
                    <Col sm={12} className="withdraw_form_country">
                        <label htmlFor="amount">{translate({ lang, info: "city" })} *</label>
                        <DropdownButton title={formState.city ? formState.city : translate({lang, info: "city"})} id="city_button" className="shadow_convex" onSelect={handleCityChange}>
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
                        {!withdrawError.city.fill ? <div className="alert alert-danger">
                            <p className="text_red">
                                {translate({ lang, info: withdrawError.city.fill_message })}
                            </p>
                        </div> : null}
                    </Col>
                </Row>
            </Col>
            <Col sm={8} className="withdraw_form_iban">
                <label htmlFor="iban">IBAN *</label>
                <input
                    value={formState.iban}
                    onChange={handleInputChange}
                    className="input_light shadow_concav"
                    type="text"
                    placeholder="IBAN"
                    id="iban"
                    name="iban"
                />
                {!withdrawError.iban.fill ? (
                    <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({ lang, info: withdrawError.iban.fill_message })}
                        </p>
                    </div>
                ) : !withdrawError.iban.validate ? (
                    <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({ lang, info: withdrawError.iban.validate_message })}
                        </p>
                    </div>
                ) : null}

                <div className="captcha_container">
                    <div className="captcha_box">
                        {/* <ReCAPTCHA
                            sitekey={key}
                            onChange={onCaptchaChange}
                        /> */}
                        {!withdrawError.captcha.fill ? (
                            <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({ lang, info: withdrawError.captcha.fill_message })}
                                </p>
                            </div>
                        ) : !withdrawError.captcha.validate ? (
                            <div className="alert alert-danger">
                                <p className="text_red">
                                    {translate({ lang, info: withdrawError.captcha.validate_message })}
                                </p>
                            </div>
                        ) : null}
                    </div>
                </div>
            </Col>
        </Row>
        <div className="button_action_group">
            <Button type="button" onClick={()=>handleSubmit()} className="mybutton round button_transparent shadow_convex">
                <FontAwesomeIcon icon={faMoneyBillTransfer} />
            </Button>
            <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                <FontAwesomeIcon icon={faArrowRotateLeft} />
            </Button>
        </div>
    </form>
}

export default WithdrawFormStripe