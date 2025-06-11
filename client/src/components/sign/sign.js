import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { changePage } from '../../reducers/page'
import { changePopup } from '../../reducers/popup'
import { translate } from '../../translations/translate'
import PolicyPrivacy from '../pages/policyPrivacy/policyPrivacy'
import TermsConditions from '../pages/termsConditions/termsConditions'
import Contact from '../pages/contact/contact'
import Header from '../partials/header'
import Language from '../settings/language'
import SignIn from './signIn'
import SignUp from './signUp'
import { changeUser, updateMoney } from '../../reducers/auth'
import { isEmpty, setCookie } from '../../utils/utils'
import Loader from '../partials/loader'
import { validateInput } from '../../utils/validate'

function Sign(props) {
    const {settings, socket} = props
    const {lang, theme} = settings
    let dispatch = useDispatch()

    let page = useSelector(state => state.page.page)
    let home = useSelector(state => state.home)
    let isMinor = useSelector(state => state.auth.isMinor)

    const [visible, setVisible] = useState('signIn')
    const errors_default = {
        email: { fill: true, fill_message: "fill_field_email", validate: true, validate_message: "validate_message_email" },
        phone: { fill: true, fill_message: "fill_field_phone", validate: true, validate_message: "validate_message_phone" },
        user: { fill: true, fill_message: "fill_field_user", validate: true },
        pass: { fill: true, fill_message: "fill_field_pass", validate: true },
        checkboxOne: { fill: true, fill_message: "fill_field_checkboxOne", validate: true },
    }
    const [signError, setSignError] = useState(errors_default)
    const [signIn, setSignIn] = useState('active')
    const [signUp, setSignUp] = useState('')
    const [checkboxOne, setCheckboxOne] = useState(false)
    const [loaded, setLoaded] = useState(true)
    const [date, setDate] = useState('')

    function handleClick(choice){
        setVisible(choice)
        setSignError(errors_default)
        if(choice === "signIn"){
			setSignIn('active')
			setSignUp('')
		} else if(choice === "signUp"){
			setSignIn('')
			setSignUp('active')
		}
    }

    function signSubmit(data){
        if(!validateForm(data.payload)){
            let rememberMe = data.payload.rememberMe
            if (rememberMe) {
                localStorage.setItem('email', data.payload.email)
                localStorage.setItem('pass', data.payload.pass)
            } else {
                localStorage.removeItem('email')
                localStorage.removeItem('pass')
            }
            setLoaded(false)
            socket.emit(data.emit, data.payload)
        }
    }

    function validateForm(payload) {
        const { email, phone, user, pass } = payload
        let errors = errors_default

        if (isEmpty(email)) {
            errors.email.fill = false
        } 
        if (isEmpty(pass)) {
            errors.pass.fill = false
        }
        if(!validateInput(email, "email")){
            errors.email.validate = false
        } 

        if(visible === "signUp"){
            if (isEmpty(phone)) {
                errors.phone.fill = false
            }
            if (isEmpty(user)) {
                errors.user.fill = false
            }            
            if(!validateInput(phone, "phone")){
                errors.phone.validate = false
            }    
            if(!checkboxOne){
                errors.checkboxOne.fill = false
            }
        }

        setSignError(errors)
        let problem = Object.values(errors).some(error => !error.fill || !error.validate)

        return problem
    }

    function handleForgotPassword(){
        let payload = {
            open: true,
            template: "forgotPassword",
            title: "forgot_password_title",
            data: translate({lang, info: "forgot_password_text"}),
            size: 'sm',
        }
        dispatch(changePopup(payload))
    }

    function handleLink(link){
        dispatch(changePage(link))
    }

    function handleChangeCheck(x){
        if(page === "Salon"){
            switch(x){
                case "checkbox1":
                    setCheckboxOne(!checkboxOne)
                    break
                default:
                    break
            }
        }
    }

    useEffect(() => {
        const handleSignInRead = (data)=>{
            setLoaded(true)
            
            if(data){
                if(!data.success){
                    if(!data.exists){ // no user was found
                        handleErrors("error", data.details ? data.details : "error")
                        return
                    }
                    // the user was registered but the account was not verified
                    handleErrors("verificationSendError", data.obj ? data.obj : "error", "lg")
                    return
                }
                if(data.is_verified){
                    dispatch(changeUser(data.obj))
                    dispatch(updateMoney(data.obj.money))
                    setCookie("casino_uuid", data.obj.uuid)
                    if(data.obj.logsTotal === 0){
                        handleWelcome() //first time sign up - you get a popup gift
                    }
                } else {
                    handleErrors("error", "signup_error_email_verification")
                }
            } else {
                handleErrors("error", "signup_error")
            }
        }
        const handleSignUpRead = (data) => {
            setLoaded(false)
        
            if (!data) {
                setLoaded(true)
                handleErrors("error", "signup_error")
                return
            }
        
            const { success_mail, details } = data
        
            if(success_mail){
                let payload = {
                    open: true,
                    template: "verificationSendSuccess",
                    title: translate({lang, info: "email_send_validation_title"}),
                    data,
                    size: "md",
                }
                dispatch(changePopup(payload))
            } else {
                handleErrors("error", details ? details : "signup_error")
            }
        }
		socket.on('signin_read', handleSignInRead)
        socket.on('signup_read', handleSignUpRead)
		return () => {
            socket.off('signin_read', handleSignInRead)
            socket.off('signup_read', handleSignUpRead)
        }
    }, [socket])

    function handleWelcome(){
        //first time sign up - you get a popup gift
        let payload = {
            open: true,
            template: "welcome",
            title: "welcome",
            size: 'lg',
        }
        dispatch(changePopup(payload))
    }

    function handleErrors(template="error", error, size="sm"){
        let payload = {
            open: true,
            template,
            title: "error",
            data: translate({lang, info: error}),
            size,
        }
        dispatch(changePopup(payload))
    }
    
    function handleDate(){
        let my_date = new Date()
		my_date = my_date.getFullYear()
        setDate(my_date)
    }
    
    function handleSignProblem(){
        let payload = {
            open: true,
            template: "sign_problem",
            title: translate({lang, info: "sign_problem"}),
            size: 'sm',
        }
        dispatch(changePopup(payload))
    }

    useEffect(() => {
        handleDate()
    }, [])

    return <>
        <Language title={lang} />
        {(() => {
            switch (page) {
                case "terms_cond":
                    return <TermsConditions {...props} />
                case "policy_privacy":
                    return <PolicyPrivacy {...props} />
                case "Contact":
                    return <Contact {...props} home={home}/>
                case "Salon":
                default:
                    return <>
                        {loaded ? <>
                            <div className="sign_container">
                                <div className="sign_container_box">
                                    <div className="deco">
                                        {isMinor === "true" ? <div className="sign_box isMinor_sign">
                                            <p>{translate({lang, info: "isMinor_sign"})}</p>
                                        </div> : <>
                                            <Header template="sign" lang={lang} theme={theme} />
                                            <div className="sign_box">
                                                <ul>
                                                    <li id="signin_tab" className={signIn} onClick={()=>{handleClick('signIn')}}><span>{translate({lang, info: "sign_in"})}</span></li>
                                                    <li id="signup_tab" className={signUp} onClick={()=>{handleClick('signUp')}}><span>{translate({lang, info: "sign_up"})}</span></li>
                                                </ul>
                                                {visible === "signIn" ? <SignIn signSubmit={(e)=>{signSubmit(e)}} lang={lang} socket={socket} /> : 
                                                <SignUp signSubmit={(e)=>{signSubmit(e)}} lang={lang} socket={socket} />}
                                            </div>
                                            <div className="sign_extra_info">
                                                {visible === "signIn" ? <p onClick={()=>handleForgotPassword()}>{translate({lang, info: "signin_forgot_password"})}</p> : <>
                                                <div className="checkbox_radio_container">
                                                    <label>
                                                        <input className="input_light" type="checkbox" name="checkbox1" checked={checkboxOne} onChange={()=>{handleChangeCheck("checkbox1")}}/>
                                                        <h6>
                                                            {translate({lang, info: "i_agree_to"})}&nbsp;
                                                            <span onClick={()=>handleLink("terms_cond")}>
                                                                {translate({lang, info: "terms_cond"})}
                                                            </span>
                                                            &nbsp;{translate({lang, info: "and"})}&nbsp;
                                                            <span onClick={()=>handleLink("policy_privacy")}>
                                                                {translate({lang, info: "policy_privacy"})}
                                                            </span>
                                                        </h6>
                                                    </label>
                                                </div>
                                                </>}
                                            </div>
                                        </>}
                                    </div>
                                </div> 
                                {(() => {
                                    let problem = Object.values(signError).some(error => !error.fill || !error.validate)
                                    return <>
                                        {problem ? <div className="alert alert-danger">
                                            {!signError.email.fill ? <p className="text_red">
                                                {translate({ lang, info: signError.email.fill_message })}
                                            </p> : <>
                                                {!signError.email.validate ? <p className="text_red">
                                                    {translate({ lang, info: signError.email.validate_message })}
                                                </p> : null}
                                            </>}

                                            {!signError.phone.fill ? <p className="text_red">
                                                {translate({ lang, info: signError.phone.fill_message })}
                                            </p> : <>
                                                {!signError.phone.validate ? <p className="text_red">
                                                    {translate({ lang, info: signError.phone.validate_message })}
                                                </p> : null}
                                            </>}

                                            {!signError.user.fill ? <p className="text_red">
                                                {translate({ lang, info: signError.user.fill_message })}
                                            </p> : null}

                                            {!signError.pass.fill ? <p className="text_red">
                                                {translate({ lang, info: signError.pass.fill_message })}
                                            </p> : null}

                                            {!signError.checkboxOne.fill ? <p className="text_red">
                                                {translate({ lang, info: signError.checkboxOne.fill_message })}
                                            </p> : null}
                                        </div> : null}
                                    </>
                                })()}
                                <div className="sign_problem" onClick={()=>handleSignProblem()}>
                                    <h6>{translate({lang, info: "sign_problem"})}</h6>
                                </div>
                            </div>
                            <div className="sign_footer">
                                <h6>Copyright © <span id="copyright_year">{date}</span> Oana Popescu. {translate({lang, info: "all_rights_reserved"})}.</h6>
                            </div>
                        </> : <Loader lang={lang} theme={theme}/>}
                    </>
            }
        })()}
    </>
}

export default Sign