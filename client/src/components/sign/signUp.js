import React, {useState, useEffect} from 'react'
import { translate } from '../../translations/translate'
import { useDispatch, useSelector } from 'react-redux'
import { changePopup } from '../../reducers/popup';
import { isEmpty } from '../../utils/utils';
import { Form, Button, Col, Row } from 'react-bootstrap';

function SignUp(props) {
    let isMinor = useSelector(state => state.auth.isMinor)
    const [email, setEmail] = useState('')
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    let dispatch = useDispatch()    

    function handleChange(type, e){
        switch(type) {
            case "email":
                setEmail(e.target.value)
                break
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
        props.signSubmit({emit: 'signup_send', payload: {email, user, pass}})
    }

    useEffect(() => {
        if(isEmpty(isMinor)){
            // first time check
            let payload = {
                open: true,
                template: "isMinor",
                title: "isMinor_title",
                data: translate({lang: props.lang, info: "isMinor_text"}),
                sticky: true
            }
            dispatch(changePopup(payload))
        }
	}, [isMinor]) 

    return <div className="sign_up_container">
        <Form>
            <Row>
                <Col sm={4} className="label_container">
                    <div className="label">{translate({lang: props.lang, info: "email"})}</div>
                </Col>
                <Col sm={8}>
                    <input className="input_light" type="text" value={email} onChange={(e)=>{handleChange('email', e)}}/>
                </Col>
            </Row>
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
            {!isMinor ? null : <Row>
                <Col>
                    <Button type="button" onClick={(e)=>handleSubmit(e)} className="mybutton button_fullcolor">
                        {translate({lang: props.lang, info: "sign_up"})}
                    </Button>
                </Col>
            </Row>}                        
        </Form>
    </div>
}

export default SignUp