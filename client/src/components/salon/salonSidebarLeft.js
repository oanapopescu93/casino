import React, {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { translate } from '../../translations/translate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faFaceSmile, faFlagCheckered, faTicket } from '@fortawesome/free-solid-svg-icons'
import { changeGame, changeGamePage, changePage } from '../../reducers/page'
import { checkWinterMonths } from '../../utils/special_occasions'
import { getWindowDimensions } from '../../utils/utils'

function SalonSidebarLeft(props){
    const {lang} = props
    let dispatch = useDispatch()
    const [showWinter, setShowWinter] = useState(false)

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

    function handleResize(){
        // special occasions
        let winter = checkWinterMonths()
		if(winter && getWindowDimensions().width >= 960){ // will appear only on winter months and only if the width is more than 960
			setShowWinter(true)
		}
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize)
            handleResize()
            return () => window.removeEventListener("resize", handleResize)
        }
	}, [])

    return <div className="salon_button_container">
        <div className="salon_button_box">
            <div 
                id="salon_buton_games" 
                className={showWinter ? "salon_button shadow_convex snow_small" : "salon_button shadow_convex"} 
                onClick={()=>{handleChange('games')}}
            >
                <p>
                    <FontAwesomeIcon icon={faFaceSmile} />
                    <span className="salon_button_text">{translate({lang: lang, info: "games"})}</span>
                </p>										
            </div>
            <div 
                id="salon_buton_race" 
                className={showWinter ? "salon_button shadow_convex snow_small" : "salon_button shadow_convex"} 
                onClick={()=>{handleChange('race')}}
            >
                <p>
                    <FontAwesomeIcon icon={faFlagCheckered} />
                    <span className="salon_button_text">{translate({lang: lang, info: "race"})}</span>
                </p>
            </div>
            <div 
                id="salon_buton_keno" 
                className={showWinter ? "salon_button shadow_convex snow_small" : "salon_button shadow_convex"} 
                onClick={()=>{handleChange('keno')}}
            >
                <p>
                    <FontAwesomeIcon icon={faTicket} />
                    <span className="salon_button_text">{translate({lang: lang, info: "keno"})}</span>
                </p>	
            </div>
        </div>
    </div>
}

export default SalonSidebarLeft