import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import Header from '../../partials/header'
import WithdrawFormStripe from './withdrawFormStripe'
import { decryptData } from '../../../utils/crypto'
import { isEmpty } from '../../../utils/utils'
import { validateInput } from '../../../utils/validate'
import countriesData from '../../../utils/constants/countries.json'
import { sendWithdrawRequest } from '../../../reducers/payments'
import Loader from '../../partials/loader'
import { changePopup } from '../../../reducers/popup'

function Withdraw(props){
    const {lang, user, home} = props
    let money = user.money ? decryptData(user.money) : 0
    let dispatch = useDispatch()

    let processWithdraw = useSelector(state => state.payments.processWithdraw)
    let messageWithdraw = useSelector(state => state.payments.messageWithdraw)
    if(messageWithdraw){        
        let payload = {
            open: true,
            template: "success",
            title: translate({lang: lang, info: "withdraw"}),
            data: translate({lang: lang, info: messageWithdraw.send}),
            size: "sm",
        }
        if(messageWithdraw.send === "withdraw_failed" || messageWithdraw.send === "email_no_send"){
            payload.template = "error"
            payload.title = translate({lang: lang, info: "error"})
        }
        dispatch(changePopup(payload))
    }

    const allowedCurrencies = ['USD', 'EUR', 'GBP', 'CHF', 'RON']
    const { finances } = home
    const { min_amount_withdraw, convert_carrots_rate } = finances
    let min_amount = min_amount_withdraw/convert_carrots_rate
    const errors_default = {
        name: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_message_name" },
        phone: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_message_phone" },
        email: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_message_email" },
        country: { fill: true, fill_message: "fill_field", validate: true },
        city: { fill: true, fill_message: "fill_field", validate: true },
        iban: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_message_iban" },
    }
    const [withdrawError, setWithdrawError] = useState(errors_default)
    const [formState, setFormState] = useState({ 
        amount: min_amount, 
        currency: 'USD', 
        name: '', 
        phone: '', 
        email: '', 
        country: '',
        city: '',
        iban: '',
    })
    const [countries, setCountries] = useState([])
    const [cities, setCities] = useState([])
    const [filteredCountries, setFilteredCountries] = useState([])
    const [filteredCountry, setFilteredCountry] = useState("")
    const [filteredCities, setFilteredCities] = useState([])
    const [filteredCity, setFilteredCity] = useState("")

    useEffect(() => {
        const countryNames = Object.keys(countriesData)
        setCountries(countryNames)
        setFilteredCountries(countryNames)
    }, [])

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    function handleInputChange(e) {
        const { name, value } = e.target
        setFormState({...formState, [name]: value})
    }

    function changeCurrency(e) {
        setFormState({...formState, currency: e})
    }

    function updateAmount(e){
        setFormState({...formState, amount: e})
    }

    function handleCountryChange(value){
        const selectedCountry = value
        setFormState({...formState, country: selectedCountry, city: ""})
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
        setFormState({...formState, city: value})
    }

    function handleFilterCities(e){        
        const filtered = cities.filter(city => city.toLowerCase().includes(e.toLowerCase()))
        setFilteredCities(filtered)
        setFilteredCity(e)
    }

    function validateForm() {
        const { name, phone, email, country, city, iban } = formState        
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
        if (isEmpty(iban)) {
            errors.iban.fill = false
        }

        if(!validateInput(name, "name")){
            errors.name.validate = false
        }
        if(!validateInput(email, "email")){
            errors.email.validate = false
        }            
        if(!validateInput(phone, "phone")){
            errors.phone.validate = false
        }
        if (!validateInput(iban, "iban")) {
            errors.iban.validate = false
        }

        setWithdrawError(errors)
        let problem = Object.values(errors).some(error => !error.fill || !error.validate)

        return problem
    }

    function handleSubmit() {  
        // let payload = {...formState, uuid: user.uuid}
        // dispatch(sendWithdrawRequest(payload))      
        if(!validateForm()){
            dispatch(sendWithdrawRequest(formState))
        }
    }    

    return <div className="content_wrap">
        <Header template="terms_cond" title={translate({lang: lang, info: "withdraw"})} />
        <div className="page_content">
            {processWithdraw ?  <div className="page_content_loader">
                <Loader text={translate({lang: lang, info: "processing"})}/>
            </div> : <Row>
                <Col lg={2} />
                <Col lg={8}>
                    <WithdrawFormStripe
                        {...props} 
                        money={money}
                        allowedCurrencies={allowedCurrencies}
                        withdrawError={withdrawError}
                        formState={formState}
                        filteredCountries={filteredCountries}
                        filteredCountry={filteredCountry}
                        filteredCities={filteredCities}
                        filteredCity={filteredCity}
                        handleInputChange={(e)=>handleInputChange(e)}
                        changeCurrency={(e)=>changeCurrency(e)}
                        updateAmount={(e)=>updateAmount(e)}
                        handleSubmit={(e)=>handleSubmit(e)}
                        handleCountryChange={(e)=>handleCountryChange(e)}
                        handleFilterCountries={(e)=>handleFilterCountries(e)}
                        handleCityChange={(e)=>handleCityChange(e)}
                        handleFilterCities={(e)=>handleFilterCities(e)}
                        handleBack={()=>handleBack()}
                    />
                </Col>
                <Col lg={2} />
            </Row>}            
        </div>
    </div>
}
export default Withdraw