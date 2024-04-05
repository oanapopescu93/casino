import React, {useState, useEffect} from 'react'
import { translate } from '../../translations/translate'
import logo_icon from '../../img/logo.png'
import { capitalizeFirstLetter, isEmpty } from '../../utils/utils'
import TransparentText from './transparentText'
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
                                <EasterEgg></EasterEgg>
                                <EasterEgg></EasterEgg>
                            </div> : null}
                            {showHalloween ? <div className="halloween_container halloween_container_salon">
                                <Ghost></Ghost>
                                <Ghost></Ghost>
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
                                <TransparentText text={title}></TransparentText>
                            </div>
                        } else {
                            return <div id="header" className="header">
                                <TransparentText text={title}></TransparentText>                             
                            </div>
                        }
                    case "panel_user":                        
                        if(details && details.game){
                            if(details.game_page){
                                //ex: dashboard, market
                                return <TransparentText text={translate({lang: lang, info: details.game_page})}></TransparentText>
                            } else {
                                //game
                                let table_name = details.game.table_name
                                let table_id = details.game.table_id
                                let title = capitalizeFirstLetter(table_name) + ' ' + table_id
                                return <h3 id="user_title">
                                    <TransparentText text={title}></TransparentText>
                                </h3>
                            }
                        } else {
                            //salon panel
                            return
                        }
                    case "sign":
                        return <div id="header_sign" className="header">
                            <img id="logo_icon" alt="logo_icon" src={logo_icon} />
                            <h1>{title}</h1>
                            <h3>{translate({lang: lang, info: "subtitle"})}</h3>                                    
                        </div>          
                    default:
                        let style = ""
                        if(template === "donation"){
                            style = " easter_eggs_salon"
                        }
                        return <div className="header">
                            <h1 className="title">{title}</h1>
                            {showEaster ? <div className={"easter_eggs" + style}>
                                <EasterEgg></EasterEgg>
                                <EasterEgg></EasterEgg>
                            </div> : null}
                            {showHalloween ? <div className="halloween_container halloween_container_salon">
                                <Ghost></Ghost>
                                <Ghost></Ghost>
                            </div> : null}
                        </div>
                }
            }            
        })()}
    </div>
}
export default Header