import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { changePopup } from '../../../reducers/popup'
import { translate } from '../../../translations/translate'
import { decryptData } from '../../../utils/crypto'
import Header from '../../partials/header'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser, faStore, faHouse, faCartShopping, faGear, faPaperPlane, faPowerOff, faCircleQuestion, faCalendarDays, faCarrot} from '@fortawesome/free-solid-svg-icons'
import { isEmpty, setCookie } from '../../../utils/utils'

function User(props){    
    const {page, user, settings, streak} = props
    const {lang, theme} = settings
    let dispatch = useDispatch()
    const [buttonUser, setButtonUser] = useState('active')
    const [buttonMarket, setButtonMarket] = useState('')

    let moneyEncrypted = useSelector(state => state.auth.money)
    let money = moneyEncrypted ? decryptData(moneyEncrypted) : 0

    function handleChange(choice){
        switch(choice){
			case "dashboard":
			case "market":
                dispatch(changePage('Salon'))
                dispatch(changeGame(null))
                dispatch(changeGamePage(choice))
				break
            case "salon":
                dispatch(changePage('Salon'))
                dispatch(changeGame(null))
                dispatch(changeGamePage(null))
                break
            case "cart":
                dispatch(changePage('Cart'))
                dispatch(changeGame(null))
                dispatch(changeGamePage(null))
                break
            case "settings":
                let payload = {
                    open: true,
                    template: "settings",
                    title: "settings",
                    size: "sm"
                }
                dispatch(changePopup(payload))
				break
            case "how_to_play":
                dispatch(changePage(choice))
                dispatch(changeGame(null))
                dispatch(changeGamePage(null))
				break
            case "Contact":
                dispatch(changePage(choice))
                dispatch(changeGame(null))
                dispatch(changeGamePage(null))
				break
            case "logout":
                setCookie('casino_uuid', '')
                window.location.reload(false)
				break
            default:
                break
		}
    }

    useEffect(() => {	
        if(page && page.game_page){
            if(page.game_page === 'dashboard'){
                setButtonUser('active')
                setButtonMarket('')
            } else if(page.game_page === 'market'){
                setButtonUser('')
                setButtonMarket('active')
            }
        }
	}, [page.game_page])

    return <>
        <Header template="panel_user" details={page} lang={lang} theme={theme}/>
        <div id="user_subtitle">
            <div className="user_subtitle_left">
                <span id="user_name">{user.user ? decryptData(user.user) : "-"}</span>
            </div>
            <div className="user_subtitle_right">
                <span id="user_money">
                    <span>{money}</span> <FontAwesomeIcon icon={faCarrot} />
                </span>
                {!isEmpty(streak) ? <span id="user_streak">
                    <span>{streak}</span>
                    <div className="my_tooltip">
                        <FontAwesomeIcon icon={faCalendarDays} />
                        <span className="my_tooltiptext">
                            <p><b>Streak</b></p>
                            <p>{translate({lang, info: "your_streak"})}</p>
                        </span>
                    </div>
                </span> : null}
            </div>
         </div>
        <div id="user_tags">
            <div className={"user_list_button " + buttonUser} onClick={()=>{handleChange('dashboard')}}>
                <span><FontAwesomeIcon icon={faUser} />{translate({lang, info: "user"})}</span>
            </div>
            <div className={"user_list_button " + buttonMarket} onClick={()=>{handleChange('market')}}>
                <span><FontAwesomeIcon icon={faStore} />{translate({lang, info: "market"})}</span>
            </div>
        </div>
        <ul id="user_list">
            {page.game || page.game_page ? <li onClick={()=>{handleChange('salon')}}>
                <span><FontAwesomeIcon icon={faHouse} />{translate({lang, info: "salon"})}</span>
            </li> : null}
            <li onClick={()=>{handleChange('cart')}}>
                <span><FontAwesomeIcon icon={faCartShopping} />{translate({lang, info: "cart"})}</span>
            </li>
            <li onClick={()=>{handleChange('settings')}}>
                <span><FontAwesomeIcon icon={faGear} />{translate({lang, info: "settings"})}</span>
            </li>
            <li onClick={()=>{handleChange('how_to_play')}}>
                <span><FontAwesomeIcon icon={faCircleQuestion} />{translate({lang, info: "how_to_play"})}</span>
            </li>
            <li onClick={()=>{handleChange('Contact')}}>
                <span><FontAwesomeIcon icon={faPaperPlane} />{translate({lang, info: "contact"})}</span>
            </li>
            <li onClick={()=>{handleChange('logout')}}>
                <span><FontAwesomeIcon icon={faPowerOff} />{translate({lang, info: "logout"})}</span>
            </li>
        </ul>
    </>
}
export default User