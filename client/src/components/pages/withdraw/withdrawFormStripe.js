import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillTransfer, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Row, Col, Dropdown, DropdownButton, Button } from 'react-bootstrap'
import { translate } from '../../../translations/translate'
import { isEmpty } from '../../../utils/utils'
import { validateInput } from '../../../utils/validate'
import Counter from '../../partials/counter'

function WithdrawFormStripe(props) {    
    const { home, settings, handleBack } = props
    const { lang } = settings
    const { finances } = home
    const { min_amount_withdraw, convert_carrots_rate } = finances
    let min_amount = min_amount_withdraw/convert_carrots_rate
    let max_amount = 3 * min_amount    

    const [formState, setFormState] = useState({ amount: min_amount, currency: 'USD', iban: '' })
    const allowedCurrencies = ['USD', 'EUR', 'GBP', 'CHF', 'RON']
    const [withdrawError, setWithdrawError] = useState({        
        iban: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_iban_name" }
    })

    function handleInputChange(e) {
        const { name, value } = e.target
        setFormState({...formState, [name]: value})
    }

    function validateForm() {
        const { iban } = formState
        let errors = {            
            iban: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_iban_name" }
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
        if (validateForm()) {
            props.handleSubmit(formState)
        }
    }

    function changeCurrency(e) {
        setFormState({...formState, currency: e})
    }

    function updateAmount(e){
        setFormState({...formState, amount: e})
    }

    return <form id="withdraw_form">
        <p>{translate({lang: lang, info: "under_construction"})}</p>
        <Row>
            <Col sm={12}>
                <p>{translate({lang: lang, info: "withdraw_info"})}</p>
            </Col>
        </Row>   
        <Row>
            <Col sm={6} className="withdraw_form_amount">
                <label htmlFor="amount">{translate({ lang: lang, info: "amount" })} *</label>
                <Counter min={min_amount} num={formState.amount} max={max_amount} update={(e)=>updateAmount(e)} />                
            </Col>            
            <Col sm={6} className="withdraw_form_currency">
                <label htmlFor="currency">{translate({ lang: lang, info: "currency" })} *</label>
                <DropdownButton title={formState.currency} onSelect={changeCurrency} className="shadow_concav">
                    {allowedCurrencies.map((x, i) => (
                        <Dropdown.Item key={i} eventKey={x}>{x}</Dropdown.Item>
                    ))}
                </DropdownButton>
            </Col>
        </Row>
        <Row>
            <Col sm={12} className="withdraw_form_iban">
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
                            {translate({ lang: lang, info: withdrawError.iban.fill_message })}
                        </p>
                    </div>
                ) : !withdrawError.iban.validate ? (
                    <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({ lang: lang, info: withdrawError.iban.validate_message })}
                        </p>
                    </div>
                ) : null}
            </Col>
        </Row>        
        <div className="button_action_group">
            <Button type="button" onClick={handleSubmit} className="mybutton round button_transparent shadow_convex">
                <FontAwesomeIcon icon={faMoneyBillTransfer} />
            </Button>
            <Button type="button" onClick={handleBack} className="mybutton round button_transparent shadow_convex">
                <FontAwesomeIcon icon={faArrowRotateLeft} />
            </Button>
        </div>
    </form>
}

export default WithdrawFormStripe