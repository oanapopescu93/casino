import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import Header from '../../partials/header'
import WithdrawFormStripe from './withdrawFormStripe'
import { decryptData } from '../../../utils/crypto'
import { isEmpty } from '../../../utils/utils'
import { validateInput } from '../../../utils/validate'

function Withdraw(props){
    const {lang, user, home} = props
    let money = user.money ? decryptData(user.money) : 0
    let dispatch = useDispatch()

    const allowedCurrencies = ['USD', 'EUR', 'GBP', 'CHF', 'RON']
    const { finances } = home
    const { min_amount_withdraw, convert_carrots_rate } = finances
    let min_amount = min_amount_withdraw/convert_carrots_rate
    const erros_default = {
        name: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_name_name" },
        phone: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_phone_name" },
        email: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_email_name" },
        country: { fill: true, fill_message: "fill_field" },
        city: { fill: true, fill_message: "fill_field" },
        iban: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_iban_name" },
    }
    const [withdrawError, setWithdrawError] = useState(erros_default)
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

    function validateForm() {
        const { name, phone, email, country, city, iban } = formState
        let errors = erros_default

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
        if (!validateInput(iban, "iban")) {
            errors.iban.validate = false
        }

        setWithdrawError(errors)

        return errors.iban.fill && errors.iban.validate
    }

    function handleSubmit() {
        console.log('handleSubmit ', formState, validateForm())
        if(validateForm()){
            console.log('handleSubmit000 ', formState)
        }
    }

    return <div className="content_wrap">
        <Header template="terms_cond" title={translate({lang: lang, info: "withdraw"})} />
        <div className="page_content">
            <Row>
                <Col lg={2} />
                <Col lg={8}>
                    <WithdrawFormStripe
                        {...props} 
                        money={money}
                        allowedCurrencies={allowedCurrencies}
                        withdrawError={withdrawError}
                        formState={formState}
                        handleInputChange={(e)=>handleInputChange(e)}
                        changeCurrency={(e)=>changeCurrency(e)}
                        updateAmount={(e)=>updateAmount(e)}
                        handleSubmit={(e)=>handleSubmit(e)}
                        handleBack={()=>handleBack()}
                    />
                </Col>
                <Col lg={2} />
            </Row>
        </div>
    </div>
}
export default Withdraw