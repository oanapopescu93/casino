import React, {useState, useEffect} from "react"
import { useSelector, useDispatch } from 'react-redux'
import { Modal} from "react-bootstrap"

import { changePopup } from "../../reducers/popup"
import { changeIsMinor, changeUser } from "../../reducers/auth"
import { validateInput } from "../../utils/validate"
import { translate } from "../../translations/translate"

import Default from "./default"
import IsMinor from "./isMinor"
import ForgotPassword from "./forgotPassword"
import Settings from "./settings"
import ChangeProfilePic from "./changeProfilePic"
import ChangeUsername from "./changeUsername"
import ChangePassword from "./changePassword"
import KenoPrizeTable from "./kenoPrizeTable"
import GameResults from "./gameResults"
import Welcome from "./welcome"
import Streak from "./streak"
import WhackARabbit from "./whackARabbit"
import SlotsPrizeTable from "./slotsPrizeTable"
import PaymentSuccess from "./paymentSuccess"
import { changeGamePage, changePage, changeGame } from "../../reducers/page"
import OrderDetails from "./orderDetails"
import ChatBot from "./chatbot"
import ApplyJob from "./applyJob"
import { postData } from "../../utils/utils"
import VerificationSendSuccess from "./verificationSendSuccess"
import WarningGambling from "./warningGambling"

function Popup(props){
    const {socket, home, settings} = props
    const {lang} = settings

    let open = useSelector(state => state.popup.open)
    let popup_title = useSelector(state => state.popup.title)
    let template = useSelector(state => state.popup.template)
    let data = useSelector(state => state.popup.data)
    let size = useSelector(state => state.popup.size)
    let sticky = useSelector(state => state.popup.sticky)
    let icon = useSelector(state => state.popup.icon)
    let user = useSelector(state => state.auth.user)

    let dispatch = useDispatch()    

    const [forgotPasswordResult, setForgotPasswordResult] = useState('')
    const [sending, setSending] = useState(false)
    const [applyJobSending, setApplyJobSending] = useState(null)
    const [resendVerificationResult, setResendVerificationResult] = useState('')

    let title = popup_title ? translate({lang: lang, info: popup_title}) : ""
    let style = template
    if(template === "paymentSuccess" || template === "verificationSendSuccess"){
        style = "success"
    }
    if(template === "gambling_warning"){
        style = "error"
    }

  	function closeModal(){
        if(template !== "isMinor"){ //prevents modal from closing without making a choice
            dispatch(changePopup(false))
        }
        setForgotPasswordResult('')
	}

    function isMinorClick(e){
        dispatch(changePopup(false))
        dispatch(changeIsMinor(e))
    }

    function forgotPasswordClick(email){
        if(validateInput(email, "email")){
            setSending(true)
            socket.emit('forgotPassword_send', {lang: lang, email})
        } else {
            setForgotPasswordResult(translate({lang: lang, info: "error"}))
        }
    }

    function dashboardChanges(e){
        if(e.type && e.value){
            socket.emit('dashboardChanges_send', e)
            switch(e.type){
                case "user":
                    dispatch(changeUser({user: e.value}))                    
                    break
                default:
                    break
            }
        }
        closeModal()
    }

    function handleWhackARabbit(){
        dispatch(changePage('Salon'))
        dispatch(changeGamePage(null))
        dispatch(changeGame({table_name: "whack_a_rabbit"}))
        closeModal()
    }

    useEffect(() => {
        socket.on('forgotPassword_read', (res)=>{
            setForgotPasswordResult(res.send)
            setSending(false)
            setTimeout(function(){
                setForgotPasswordResult('')
                closeModal()
           }, 2000)
        })
        socket.on('signup_verification_read', (res)=>{
            setSending(false)            
            setResendVerificationResult(res.details)
            setTimeout(function(){
                setResendVerificationResult('')
           }, 2000)
        })
    }, [socket])

    function handleApplyJob(payload){
        setApplyJobSending("sending")
        postData('/api/apply_job', payload).then((res)=>{
            setApplyJobSending(res.send)
            setTimeout(function(){
                setApplyJobSending(null)
                closeModal()
           }, 2000)
        }) 
    }

    function handleResendVerification(email){
        setSending(true)
        socket.emit('signup_verification_send', {lang: lang, email})
    }

    return <>
        {template !== "welcome" ? <Modal id="myModal" className={"mymodal " + style} show={open} onHide={closeModal} size={size} centered> 
            {title === "" && !icon ? null : <Modal.Header>
                {!sticky ? <div className="closeButton closeButtonHeader" onClick={closeModal}>
                    <span>X</span>
                </div> : null}
                <Modal.Title>{icon ? icon : null} {title}</Modal.Title>
            </Modal.Header>}
            <Modal.Body>
                {title === "" && !icon && !sticky ? <div className="closeButton" onClick={closeModal}>
                    <span>X</span>
                </div> : null}
                {(() => {			
                    switch (template) {
                        case "forgotPassword":
                            return <ForgotPassword 
                                settings={settings} 
                                text={data} 
                                forgotPasswordClick={(e)=>forgotPasswordClick(e)} 
                                forgotPasswordResult={forgotPasswordResult}
                                sending={sending}
                            />
                        case "isMinor":
                            return <IsMinor settings={settings} text={data} isMinorClick={(e)=>isMinorClick(e)} />
                        case "settings":
                            return <Settings settings={settings} home={home} />
                        case "change_pic":
                            return <ChangeProfilePic settings={settings} profiles={data} home={home} user={user} choosePic={(e)=>dashboardChanges(e)} />
                        case "change_username":
                            return <ChangeUsername settings={settings} user={user} changeUsername={(e)=>dashboardChanges(e)} />
                        case "change_password":
                            return <ChangePassword settings={settings} user={user} changePassword={(e)=>dashboardChanges(e)} />
                        case "slots_prizes":
                            return <SlotsPrizeTable settings={settings} slotsPrizes={data}/>
                        case "keno_prizes":
                            return <KenoPrizeTable settings={settings} kenoPrizes={data} />
                        case "game_results":
                            return <GameResults settings={settings} results={data} />
                        case "streak":
                            return <Streak settings={settings} data={data} />
                        case "whack_a_rabbit":
                            return <WhackARabbit settings={settings} handleClick={()=>handleWhackARabbit()} />
                        case "paymentSuccess":
                            return <PaymentSuccess settings={settings} data={data} />
                        case "verificationSendSuccess":
                            return <VerificationSendSuccess 
                            settings={settings} 
                            data={data} 
                            resendVerificationResult={resendVerificationResult} 
                            sending={sending}
                            handleResendVerification={(e)=>handleResendVerification(e)}
                        />
                        case "orderDetails":
                            return <OrderDetails settings={settings} data={data} />
                        case "chatbot":
                            return <ChatBot settings={settings} user={user} />
                        case "apply_job":
                            return <ApplyJob settings={settings} home={home} user={user} data={data} applyJobSending={applyJobSending} handleApplyJob={(e)=>handleApplyJob(e)} />
                        case "gambling_warning":
                            return <WarningGambling settings={settings} />
                        case "error":
                        default:
                            return <>{typeof data === "string" ? <Default settings={settings} text={data} /> : null}</>
                    }
                })()}
            </Modal.Body>
            {(template === "game_results" && data.status === "win") || (template === "streak" && data > 0) ? <div className="firework"></div> : null}
        </Modal> : <Modal id="myModal_gift" className={"mymodal " + template} show={open} onHide={closeModal} size={size} centered> 
            <Modal.Body>
                <Welcome settings={settings} />
            </Modal.Body>
        </Modal>}
    </>
}
export default Popup