import React from 'react'
import { useDispatch } from 'react-redux'
import { translate } from '../../translations/translate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faFaceSmile, faFlagCheckered, faTicket } from '@fortawesome/free-solid-svg-icons'
import { changeGame, changeGamePage, changePage } from '../../reducers/page'

function SalonSidebarLeft(props){
    const {lang} = props
    let dispatch = useDispatch()

    function handleChange(x){
        dispatch(changePage('Salon'))
        dispatch(changeGamePage(null))
        switch(x){
            case "race":
            case "keno":
                dispatch(changeGame({table_name: x}))
                break
            case "game":
            default:
                dispatch(changeGame(null))
                break
        }
    }

    return <div className="salon_button_container">
        <div className="salon_button_box">
            <div id="salon_buton_games" className="salon_button shadow_convex" onClick={()=>{handleChange('games')}}>
                <p>
                    <FontAwesomeIcon icon={faFaceSmile} />
                    <span className="salon_button_text">{translate({lang: lang, info: "games"})}</span>
                </p>										
            </div>            
            <div id="salon_buton_race" className="salon_button shadow_convex" onClick={()=>{handleChange('race')}}>
                <p>
                    <FontAwesomeIcon icon={faFlagCheckered} />
                    <span className="salon_button_text">{translate({lang: lang, info: "race"})}</span>
                </p>
            </div>
            <div id="salon_buton_keno" className="salon_button shadow_convex" onClick={()=>{handleChange('keno')}}>
                <p>
                    <FontAwesomeIcon icon={faTicket} />
                    <span className="salon_button_text">{translate({lang: lang, info: "keno"})}</span>
                </p>	
            </div>
        </div>
    </div>
}

export default SalonSidebarLeft