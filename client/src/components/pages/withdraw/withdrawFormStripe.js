import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillTransfer, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Row, Col, Dropdown, DropdownButton, Button } from 'react-bootstrap'
import { translate } from '../../../translations/translate'

function WithdrawFormStripe(props){
    const {lang} = props
    const [formState, setFormState] = useState({amount: '', currency: 'usd'})
    const allowedCurrencies = ['USD', 'EUR', 'GBP', 'CHF', 'RON']
    const [currency, setCurrency] = useState('USD')
    const [withdrawError, setWithdrawError] = useState({
        amount: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_amount_name" },
        destination: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_destination_name" }
    })

    function handleInputChange(e){
        const { name, value } = e.target
        setFormState({
            ...formState,
            [name]: value
        })
    }

    function validateForm() {
        const { amount, destination } = formState
        let errors = {
            amount: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_amount_name" },
            destination: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_destination_name" }
        }

        if (!amount) {
            errors.amount.fill = false
        } else if (isNaN(amount) || amount <= 0) {
            errors.amount.validate = false
        }

        if (!destination) {
            errors.destination.fill = false
        }

        setWithdrawError(errors)

        return errors.amount.fill && errors.amount.validate && errors.destination.fill && errors.destination.validate
    }


    function handleSubmit(){
        if(validateForm() && typeof props.handleSubmit === "function"){
            props.handleSubmit({formState, ...currency})
        }
    }
    function handleBack(){
        if(typeof props.handleBack === "function"){
            props.handleBack()
        }
    }

    function changeCurrency(e){
        setCurrency(e)
    }

    return <form id="withdraw_form">
        <p>{translate({lang: lang, info: "under_construction"})}</p>
        <Row>
            <Col sm={6}>
                <label htmlFor="amount">{translate({lang: lang, info: "amount"})} *</label>
                <input
                    value={formState.amount}
                    onChange={handleInputChange}
                    className="input_light shadow_concav"
                    type="text"
                    placeholder={translate({ lang: lang, info: "amount" })}
                    id="amount"
                    name="amount"
                />
                {!withdrawError.amount.fill ? <div className="alert alert-danger">
                    <p className="text_red">
                        {translate({lang: lang, info: withdrawError.amount.fill_message})}
                    </p>
                </div> : <>
                    {!withdrawError.amount.validate ? <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({lang: lang, info: withdrawError.amount.validate_message})}
                        </p>
                    </div> : null}
                </>}
            </Col>            
            <Col sm={6}>
                <label htmlFor="currency">{translate({lang: lang, info: "currency"})} *</label>
                <DropdownButton title={currency} onSelect={(e)=>changeCurrency(e)} className="shadow_concav">
                    {allowedCurrencies.map((x, i)=>{
                        return <Dropdown.Item key={i} eventKey={x}>{x}</Dropdown.Item>
                    })}
                </DropdownButton>
            </Col>
        </Row>
        <Row>
            <Col sm={12}>
                <label htmlFor="destination">{translate({lang: lang, info: "destination"})} *</label>
                <input
                    value={formState.destination}
                    onChange={handleInputChange}
                    className="input_light shadow_concav"
                    type="text"
                    placeholder={translate({ lang: lang, info: "destination" })}
                    id="destination"
                    name="destination"
                />
                {!withdrawError.destination.fill ? <div className="alert alert-danger">
                    <p className="text_red">
                        {translate({lang: lang, info: withdrawError.destination.fill_message})}
                    </p>
                </div> : <>
                    {!withdrawError.destination.validate ? <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({lang: lang, info: withdrawError.destination.validate_message})}
                        </p>
                    </div> : null}
                </>}
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