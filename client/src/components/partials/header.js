import React, {useState, useEffect} from 'react'
import { translate } from '../../translations/translate'
import logo_icon from '../../img/logo.png'
import { capitalizeFirstLetter, isEmpty } from '../../utils/utils'
import { checkEaster, checkOccasion } from '../../utils/special_occasions'
import EasterEgg from './special_occasions/easter/egg'
import Ghost from './special_occasions/halloween/ghost'

function Header(props){
    const {lang, template, details} = props
    let title = props.title ? props.title : "BunnyBet"  
    const [showEaster, setShowEaster] = useState(false)
	const [showHalloween, setShowHalloween] = useState(false)

    useEffect(() => {
        // special occasions
        let easter = checkEaster()
		let halloween = checkOccasion('halloween')
		if(easter){ // will appear only if Easter is close
			setShowEaster(true)
		}
		if(halloween){ // will appear only on Halloween
			setShowHalloween(true)
		}
	}, [])

	return <div className={"header_container "+template}>
        {(() => {
            let easter_eggs_salon = ""
            if(isEmpty(template)){
                return <div className="header"><h2 className="title">{title}</h2></div>
            } else {
                switch (template) {
                    case "salon":
                        return <div id="header_salon" className="header">
                            <img id="logo_icon" alt="logo_icon" src={logo_icon} />
                            <h1>{title}</h1>
                            <h3>{translate({lang: lang, info: "salon_subtitle"})}</h3> 
                            {showEaster ? <div className="easter_eggs easter_eggs_salon">
                                <EasterEgg />
                                <EasterEgg />
                            </div> : null}
                            {showHalloween ? <div className="halloween_container halloween_container_salon">
                                <Ghost />
                                <Ghost />
                            </div> : null}
                        </div> 
                    case "game":
                        if(typeof details === 'object' && details !== null){ // it means it's a game
                            let table_name = details.game.table_name
                            let table_type = details.game.table_type
                            let table_id = details.game.table_id
                            let title = capitalizeFirstLetter(table_name).split('_').join(' ')
                            if(table_type){
                                title = title  + ' ' + capitalizeFirstLetter(table_type).split('_').join(' ')
                            } 
                            if(table_id){
                                title = title + ' ' + table_id
                            }
                            return <div id="header_game" className="header">
                                <h1>{title}</h1>
                            </div>
                        } else {
                            return
                        }
                    case "panel_user":                     
                        if(details && details.game){
                            if(details.game_page){
                                //ex: dashboard, market
                                return <div id={"panel_user_"+details.game_page} className="header">
                                    <h1 className="title">{translate({lang: lang, info: details.game_page})}</h1>
                                </div>
                            } else {
                                //game                                
                                let title = capitalizeFirstLetter(details.game.table_name)
                                if(details.game.table_id){
                                    title = title + ' ' + details.game.table_id
                                }
                                return <div id="user_title">
                                    <h3>{title}</h3>
                                </div>
                            }
                        } else {
                            //salon panel
                            return
                        }
                    case "page":
                        if(details.game_page){
                            //ex: dashboard, market
                            return <div id={"panel_user_"+details.game_page} className="header">
                                <h1 className="title">{translate({lang: lang, info: details.game_page})}</h1>
                            </div>
                        } else {
                            //just a normal page
                            return <div className="header">
                                <h1 className="title">{translate({lang: lang, info: details})}</h1>
                            </div>
                        }                        
                    case "sign":
                        return <div id="header_sign" className="header">
                            <img id="logo_icon" alt="logo_icon" src={logo_icon} />
                            <h1>{title}</h1>
                            <h3>{translate({lang: lang, info: "subtitle"})}</h3>
                        </div>
                    default:
                        if(template === "donation"){
                            easter_eggs_salon = " easter_eggs_salon"
                        }
                        return <div className="header">
                            <h1 className="title">{title}</h1>
                            {showEaster ? <div className={"easter_eggs" + easter_eggs_salon}>
                                <EasterEgg />
                                <EasterEgg />
                            </div> : null}
                            {showHalloween ? <div className="halloween_container halloween_container_salon">
                                <Ghost />
                                <Ghost />
                            </div> : null}
                        </div>
                }
            }
        })()}
    </div>
}
export default Header