import React, {useState} from 'react'
import { translate } from '../../translations/translate'
import { Form, Button, Col, Row } from 'react-bootstrap';

function SignIn(props) {
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')

    function handleChange(type, e){
        switch(type) {
            case "user":
                setUser(e.target.value)
                break
            case "pass":
                setPass(e.target.value)
                break
            default:              
        }
    }

    function handleSubmit(e){
        e.preventDefault()
        props.signSubmit({emit: 'signin_send', payload: {user, pass}})
    }

    return <div className="sign_in_container">
        <Form>
            <Row>
                <Col sm={4} className="label_container">
                    <div className="label">{translate({lang: props.lang, info: "user"})}</div>
                </Col>
                <Col sm={8}>
                    <input className="input_light" type="text" value={user} onChange={(e)=>{handleChange('user', e)}}/>
                </Col>
            </Row>
            <Row>
                <Col sm={4} className="label_container">
                    <div className="label">{translate({lang: props.lang, info: "password"})}</div>
                </Col>
                <Col sm={8}>
                    <input className="input_light" type="password" value={pass} onChange={(e)=>{handleChange('pass', e)}}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button type="button" onClick={(e)=>handleSubmit(e)} className="mybutton button_fullcolor">
                        {translate({lang: props.lang, info: "sign_in"})}
                    </Button>
                </Col>
            </Row>
        </Form>
    </div>
}

export default SignIn