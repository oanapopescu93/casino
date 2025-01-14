import React, {useState, useEffect} from 'react'
import { translate } from '../../translations/translate'
import { useDispatch, useSelector } from 'react-redux'
import { changePopup } from '../../reducers/popup'
import { isEmpty } from '../../utils/utils'
import { Form, Button, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

function SignUp(props) {
    const {lang} = props
    let isMinor = useSelector(state => state.auth.isMinor)
    const [email, setEmail] = useState('')
    const [user, setUser] = useState('')
    const [phone, setPhone] = useState('')
    const [pass, setPass] = useState('')
    const [visible, setVisible] = useState(false)
    let dispatch = useDispatch()

    function handleChange(type, e){
        switch(type) {
            case "email":
                setEmail(e.target.value)
                break
            case "user":
                setUser(e.target.value)
                break
            case "phone":
                setPhone(e.target.value)
                break
            case "pass":
                setPass(e.target.value)
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
    }, [user, pass])

    function handleSubmit(e){
        e.preventDefault()
        props.signSubmit({emit: 'signup_send', payload: {email, phone, user, pass, lang}})
    }

    useEffect(() => {
        if(isEmpty(isMinor)){
            // first time check
            let payload = {
                open: true,
                template: "isMinor",
                title: "isMinor_title",
                data: translate({lang, info: "isMinor_text"}),
                sticky: true,
                size: "sm",
            }
            dispatch(changePopup(payload))
        }
	}, [isMinor]) 

    function handleVisible(){
        setVisible(!visible)
    }

    return <div className="sign_up_container">
        <Form>
            <Row>
                <Col sm={12}>
                    <div className="sign_up_info">
                        <h6>{translate({lang, info: "sign_up_info"})}</h6>
                    </div>
                </Col>
            </Row>
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
                    <div className="label">{translate({lang, info: "phone"})}</div>
                </Col>
                <Col sm={8} className="input_container">
                    <input placeholder={translate({lang, info: "phone"})} className="input_light" type="text" value={phone} onChange={(e)=>{handleChange('phone', e)}}/>
                </Col>
            </Row>
            <Row>
                <Col sm={4} className="label_container d-none d-sm-block">
                    <div className="label">{translate({lang, info: "user"})}</div>
                </Col>
                <Col sm={8} className="input_container">
                    <input placeholder={translate({lang, info: "user"})} className="input_light" type="text" value={user} onChange={(e)=>{handleChange('user', e)}}/>
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
            {(() => {
                if(isMinor === "false" || isMinor === false) {
                    return <Row>
                        <Col>
                            <Button type="button" onClick={(e)=>handleSubmit(e)} className="mybutton button_fullcolor">
                                {translate({lang, info: "sign_up"})}
                            </Button>
                        </Col>
                    </Row>
                } else {
                    return null
                }	
            })()}
        </Form>
    </div>
}

export default SignUp