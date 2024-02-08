import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { changePage } from '../../reducers/page'
import { changePopup } from '../../reducers/popup'
import { translate } from '../../translations/translate'
import PolicyPrivacy from '../pages/policyPrivacy/policyPrivacy'
import TermsConditions from '../pages/termsConditions/termsConditions'
import Header from '../partials/header'
import Language from '../settings/language'
import SignIn from './signIn'
import SignUp from './signUp'
import { changeUser } from '../../reducers/auth'
import { isEmpty, setCookie } from '../../utils/utils'
import Loader from '../partials/loader'

function Sign(props) {
    let dispatch = useDispatch()
    let page = useSelector(state => state.page.page)    
    let isMinor = useSelector(state => state.auth.isMinor)
    const [visible, setVisible] = useState('signIn')
    const [errorEmail, setErrorEmail] = useState(false)
    const [errorUser, setErrorUser] = useState(false)
    const [errorPass, setErrorPass] = useState(false)
    const [errorAgree, setErrorAgree] = useState(false)
    const [signIn, setSignIn] = useState('active')
    const [signUp, setSignUp] = useState('')
    const [checkboxOne, setCheckboxOne] = useState(false)
    const [loaded, setLoaded] = useState(true)

    function handleClick(choice){
        setErrorEmail(false)
        setErrorUser(false)
        setErrorPass(false)
        setErrorAgree(false)
        setVisible(choice)    
        if(choice === "signIn"){
			setSignIn('active')
			setSignUp('')
		} else if(choice === "signUp"){
			setSignIn('')
			setSignUp('active')
		}
    }

    function signSubmit(data){
        setErrorEmail(false)
        setErrorUser(false)
        setErrorPass(false)
        setErrorAgree(false)
        if(!checkPayload(data.payload)){
            setLoaded(false)
            props.socket.emit(data.emit, data.payload)
        }
    }

    function checkPayload(data){        
        let error = false
        if(typeof data.user != "undefined" && (data.user === "")){
            error = true
            setErrorUser(true)
        }
        if(typeof data.pass != "undefined" && (data.pass === "")){
            error = true
            setErrorPass(true)
        }
        if(visible === "signUp"){
            //besides user and pass, we also check the email and the checkbox
            if(typeof data.email != "undefined" && (data.email === "")){
                error = true
                setErrorEmail(true)
            }            
            if(!checkboxOne){
                error = true
                setErrorAgree(true)
            }
        }
        return error
    }

    function handleForgotPassword(){
        let payload = {
            open: true,
            template: "forgotPassword",
            title: "forgot_password_title",
            data: translate({lang: props.lang, info: "forgot_password_text"}),
            // size: 'lg',
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
        const handleSignInRead = function(data) {
            setLoaded(true)
            if(data && data.exists && data.obj && Object.keys(data.obj).length>0){
                dispatch(changeUser(data.obj))
                if(typeof data.obj.logs !== "undefined" && data.obj.logs !== "null" && data.obj.logs !== null && data.obj.logs === 0){
                    let payload = {
                        open: true,
                        template: "whack_a_rabbit",
                    }
                    dispatch(changePopup(payload))
                }
            } else {
                dispatch(changePopup({
                    open: true, 
                    template: "error", 
                    data: translate({lang: props.lang, info: "signin_error"})
                }))
            } 
        }
        const handleSignUpRead = function(data) {
            setLoaded(true)
            if(data && !data.exists && data.obj && Object.keys(data.obj).length>0){
                dispatch(changeUser(data.obj))
                if(!isEmpty(data.obj.uuid)){
                    setCookie("casino_uuid", data.obj.uuid)
                }
                //first time sign up - you get a popup gift
                let payload = {
                    open: true,
                    template: "welcome",
                    title: "welcome",
                    size: 'lg',
                }
                dispatch(changePopup(payload))
            } else {
                let payload = {
                    open: true,
                    template: "signup",
                    title: "error",
                    data: translate({lang: props.lang, info: "signup_error"})
                }
                dispatch(changePopup(payload))
            }
        }
		props.socket.on('signin_read', handleSignInRead)
        props.socket.on('signup_read', handleSignUpRead)
		return () => {
            props.socket.off('signin_read', handleSignInRead)
            props.socket.off('signup_read', handleSignUpRead)
        }
    }, [props.socket])  

    return <>
        {(() => {
            switch (page) {
                case "terms_cond":
                    return <TermsConditions lang={props.lang}></TermsConditions>
                case "policy_privacy":
                    return <PolicyPrivacy lang={props.lang}></PolicyPrivacy>                
                case "Salon":
                default:
                    return <>
                        {loaded ? <>
                            <Language title={props.lang}></Language>
                            <div className="sign_container">
                                <div className="sign_container_box">
                                    <div className="deco">      
                                        {isMinor === "true" ? <div className="sign_box isMinor_sign">
                                            <p>{translate({lang: props.lang, info: "isMinor_sign"})}</p>
                                        </div> : <>
                                            <Header template="sign" lang={props.lang}></Header>
                                            <div className="sign_box">
                                                <ul>
                                                    <li id="signin_tab" className={signIn} onClick={()=>{handleClick('signIn')}}><span>{translate({lang: props.lang, info: "sign_in"})}</span></li>
                                                    <li id="signup_tab" className={signUp} onClick={()=>{handleClick('signUp')}}><span>{translate({lang: props.lang, info: "sign_up"})}</span></li>
                                                </ul>
                                                {visible === "signIn" ? <SignIn signSubmit={(e)=>{signSubmit(e)}} lang={props.lang} socket={props.socket}></SignIn> : 
                                                <SignUp signSubmit={(e)=>{signSubmit(e)}} lang={props.lang} socket={props.socket}></SignUp>}
                                            </div>  
                                            <div className="sign_extra_info">
                                                {visible === "signIn" ? <p onClick={()=>handleForgotPassword()}>{translate({lang: props.lang, info: "signin_forgot_password"})}</p> : <>
                                                <div className="checkbox_radio_container">
                                                    <label>
                                                        <input className="input_light" type="checkbox" name="checkbox1" checked={checkboxOne} onChange={()=>{handleChangeCheck("checkbox1")}}/>
                                                        <h6>
                                                            {translate({lang: props.lang, info: "i_agree_to"})}&nbsp;
                                                            <span onClick={()=>handleLink("terms_cond")}>
                                                                {translate({lang: props.lang, info: "terms_cond"})}
                                                            </span>
                                                            &nbsp;{translate({lang: props.lang, info: "and"})}&nbsp;
                                                            <span onClick={()=>handleLink("policy_privacy")}>
                                                                {translate({lang: props.lang, info: "policy_privacy"})}
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
                                    if(errorEmail || errorUser || errorPass || errorAgree){
                                        return <div className="alert alert-danger">
                                            {errorEmail ? <p className="text_red">{translate({lang: props.lang, info: "incorrect_email"})}</p> : null}
                                            {errorUser ? <p className="text_red">{translate({lang: props.lang, info: "empty_input_subject"})}</p> : null}
                                            {errorPass ? <p className="text_red">{translate({lang: props.lang, info: "empty_input_message"})}</p> : null}  
                                            {errorAgree ? <p className="text_red">{translate({lang: props.lang, info: "empty_input_agree"})}</p> : null}  
                                        </div>
                                    }
                                })()}                           
                            </div>   
                        </> : <Loader></Loader>}
                    </>
            }
        })()}
    </>
}

export default Sign