import React, { useState, useEffect } from 'react'
import { translate } from '../../translations/translate'
import { Form, Button, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

function SignIn(props) {
    const {lang, signSubmit} = props
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [visible, setVisible] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    useEffect(() => {
        // Load saved email and password from localStorage if "Remember Me" was checked
        const savedEmail = localStorage.getItem('email')
        const savedPass = localStorage.getItem('pass')
        if (savedEmail && savedPass) {
            setEmail(savedEmail)
            setPass(savedPass)
            setRememberMe(true)
        }
    }, [])

    function handleChange(type, e){
        switch(type) {
            case "email":
                setEmail(e.target.value)
                break
            case "pass":
                setPass(e.target.value)
                break
            case "rememberMe":
                setRememberMe(e.target.checked)
                break
            default:
        }
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                handleSubmit(e)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [email, pass])

    function handleSubmit(e){
        e.preventDefault()
        signSubmit({emit: 'signin_send', payload: {email, pass, rememberMe, lang}})
    }

    function handleVisible(){
        setVisible(!visible)
    }

    return <div className="sign_in_container">
        <Form>
            <Row>
                <Col sm={4} className="label_container d-none d-sm-block">
                    <div className="label">{translate({lang, info: "email"})}</div>
                </Col>
                <Col sm={8} className="input_container">
                    <input placeholder={translate({lang, info: "email"})} className="input_light" type="text" value={email} onChange={(e)=>{handleChange('email', e)}}/>
                </Col>
            </Row>
            <Row>
                <Col sm={4} className="label_container d-none d-sm-block">
                    <div className="label">{translate({lang, info: "password"})}</div>
                </Col>
                <Col sm={8} className="input_container">
                    <input placeholder={translate({lang, info: "password"})} className="input_light" type={visible ? "text" : "password"} value={pass} onChange={(e)=>{handleChange('pass', e)}}/>
                    <div className="input_eye" onClick={()=>handleVisible()}>
                        {visible ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <div className="checkbox_radio_container">
                        <label>
                            <input className="input_light" type="checkbox" name="checkbox1" checked={rememberMe} onChange={(e) => handleChange('rememberMe', e)}/>
                            <h6>{translate({ lang, info: "remember_me" })}</h6>
                        </label>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Button type="button" onClick={(e)=>handleSubmit(e)} className="mybutton button_fullcolor">
                        {translate({lang, info: "sign_in"})}
                    </Button>
                </Col>
            </Row>
        </Form>
    </div>
}

export default SignIn