import React, {useState} from "react"
import { useSelector, useDispatch } from 'react-redux'
import { Modal} from "react-bootstrap"

import { changePopup } from "../../reducers/popup"
import { changeIsMinor } from "../../reducers/auth"
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
import { changeGamePage, changePage, changeGame } from "../../reducers/page"
import SlotsPrizeTable from "./slotsPrizeTable"

function Popup(props){    
    const {lang, date, currency, socket, home} = props
    let open = useSelector(state => state.popup.open)
    let popup_title = useSelector(state => state.popup.title)
    let template = useSelector(state => state.popup.template)
    let data = useSelector(state => state.popup.data)
    let size = useSelector(state => state.popup.size)
    let sticky = useSelector(state => state.popup.sticky)
    let dispatch = useDispatch()
    const [forgotPasswordResult, setForgotPasswordResult] = useState('')
    let currencies = home.currencies
    let title = translate({lang: lang, info: popup_title})

  	function closeModal(){
        if(template !== "isMinor"){ //prevents modal from closing without making a choice
            dispatch(changePopup(false))
        }
	}

    function isMinorClick(e){
        dispatch(changePopup(false))
        dispatch(changeIsMinor(e))
    }

    function forgotPasswordClick(e){
        if(validateInput(e, "email")){
            socket.emit('forgotPassword_send', {lang: lang, email: e})   
        } else {
            setForgotPasswordResult(translate({lang: lang, info: "error"}))
        }
    }

    function dashboardChanges(x){
        socket.emit('dashboardChanges_send', x)
        closeModal()
    }

    function handleWhackARabbit(){
        dispatch(changePage('Salon'))
        dispatch(changeGamePage(null))
        dispatch(changeGame({table_name: "whack_a_rabbit"}))
        closeModal()
    }

    socket.on('forgotPassword_read', function(res){
        setForgotPasswordResult(translate({lang: lang, info: res.send}))      
    })

    return <>
        {template !== "welcome" ? <Modal id="myModal" className={"mymodal " + template} show={open} onHide={closeModal} size={size} centered> 
            {title !== "" ? <Modal.Header>
                {!sticky ? <div className="closeButton closeButtonHeader" onClick={closeModal}>
                    <span>X</span>
                </div> : null}                
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header> : null}  
            <Modal.Body>
                {title === "" && !sticky ? <div className="closeButton" onClick={closeModal}>
                    <span>X</span>
                </div> : null}
                {(() => {					
                    switch (template) {                        
                        case "forgotPassword":
                            return <ForgotPassword 
                                lang={lang} 
                                text={data} 
                                forgotPasswordClick={(e)=>forgotPasswordClick(e)} 
                                forgotPasswordResult={forgotPasswordResult}
                            ></ForgotPassword>
                        case "isMinor":
                            return <IsMinor lang={lang} text={data} isMinorClick={(e)=>isMinorClick(e)} />
                        case "settings":
                            return <Settings lang={lang} date={date} currency={currency} currencies={currencies} />
                        case "change_pic":
                            return <ChangeProfilePic lang={lang} profiles={data} choosePic={(e)=>dashboardChanges(e)} />
                        case "change_username":
                            return <ChangeUsername lang={lang} changeUsername={(e)=>dashboardChanges(e)} />
                        case "change_password":
                            return <ChangePassword lang={lang} changePassword={(e)=>dashboardChanges(e)} />
                        case "slots_prizes":
                            return <SlotsPrizeTable lang={lang} slotsPrizes={data}/>
                        case "keno_prizes":
                            return <KenoPrizeTable lang={lang} kenoPrizes={data} />
                        case "game_results":
                            return <GameResults lang={lang} results={data} />
                        case "streak":
                            return <Streak lang={lang} data={data} />
                        case "whack_a_rabbit":
                            return <WhackARabbit lang={lang} handleClick={()=>handleWhackARabbit()} />
                        case "error":
                        default:
                            return <>{typeof data === "string" ? <Default lang={lang} text={data} /> : null}</>                            
                    }
                })()}
            </Modal.Body>
            {(() => {
                if((template === "game_results" && data.status === "win") || (template === "streak" && data > 0)){
                    return <div className="firework"></div>
                } else {
                    return null
                }
            })()}
        </Modal> : <Modal id="myModal_gift" className={"mymodal " + template} show={open} onHide={closeModal} size={size} centered> 
            <Modal.Body>
                <Welcome lang={lang} />
            </Modal.Body>
        </Modal>}
    </>
}
export default Popup