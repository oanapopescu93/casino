import React, {useState, useEffect} from 'react'
import { translate } from '../../translations/translate'
import logo_icon_yellow from '../../img/logo/logo_yellow.png'
import logo_icon_pink from '../../img/logo/logo_pink.png'
import logo_icon_green from '../../img/logo/logo_green.png'
import logo_icon_orange from '../../img/logo/logo_orange.png'
import { capitalizeFirstLetter, isEmpty } from '../../utils/utils'
import { checkEaster, checkOccasion } from '../../utils/special_occasions'
import EasterEgg from './special_occasions/easter/egg'
import Ghost from './special_occasions/halloween/ghost'

function SpecialEvent(props){
    const {template, showEaster, showHalloween} = props
    let easterShow = " easter_eggs_page"
    let halloweenShow = " halloween_container_page"

    if(template === "salon"){
        easterShow = " easter_eggs_salon"
        halloweenShow = " halloween_container_salon"
    }
    if(template === "market"){
        halloweenShow = " halloween_container_market"
    }

    return <>
        {showEaster ? <div className={"easter_eggs" + easterShow}>
            <EasterEgg />
            <EasterEgg />
        </div> : null}
        {showHalloween ? <div className={"halloween_container" + halloweenShow}>
            <Ghost />
            <Ghost />
        </div> : null}
    </>
}

function Header(props){
    const {lang, template, details, theme} = props
    let title = props.title ? props.title : "BunnyBet"  
    const [showEaster, setShowEaster] = useState(false)
	const [showHalloween, setShowHalloween] = useState(false)
    const [style, setStyle] = useState("")

    useEffect(() => {      
        //special occasions
        let easter = checkEaster()
		let halloween = checkOccasion('halloween')
		if(easter){ // will appear only if Easter is close
			setShowEaster(true)
            setStyle("special_occasions")
		}
		if(halloween){ // will appear only on Halloween
			setShowHalloween(true)
            setStyle("special_occasions")
		}
	}, [])

    function chooseLogo(){
        switch (theme) {
            case 'purple':
              return logo_icon_pink
            case 'black':
              return logo_icon_green
            case 'blue':
              return logo_icon_orange
            default:
              return logo_icon_yellow
        }
    }

	return <div className={"header_container "+template}>
        {(() => {            
            if(isEmpty(template)){
                return <div className="header"><h2 className="title">{title}</h2></div>
            } else {
                switch (template) {
                    case "salon":                        
                        return <div id="header_salon" className={"header " + style}>
                            <img id="logo_icon" alt="logo_icon" src={chooseLogo()} />
                            <h1>{title}</h1>
                            <h3>{translate({lang, info: "salon_subtitle"})}</h3> 
                            <SpecialEvent template={template} showEaster={showEaster} showHalloween={showHalloween} />
                        </div> 
                    case "game":
                        if(typeof details === 'object' && details !== null){ // it means it's a game
                            let table_name = ""
                            if(details.game.table_name !== "poker"){
                                table_name = details.game.table_name
                            }
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
                                    <h1 className="title">{translate({lang, info: details.game_page})}</h1>
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
                            return <div id={"panel_user_"+details.game_page} className={"header " + style}>
                                <h1 className="title">{translate({lang, info: details.game_page})}</h1>
                                <SpecialEvent template={details.game_page} showEaster={showEaster} showHalloween={showHalloween} />
                            </div>
                        } else {
                            //just a normal page
                            return <div className="header">
                                <h1 className="title">{translate({lang, info: details})}</h1>
                            </div>
                        }                        
                    case "sign":
                        return <div id="header_sign" className="header">
                            <img id="logo_icon" alt="logo_icon" src={chooseLogo()} />
                            <h1>{title}</h1>
                            <h3>{translate({lang, info: "subtitle"})}</h3>
                        </div>
                    default:
                        return <div className={"header " + style}>
                            <h1 className="title">{title}</h1>
                            <SpecialEvent template={template} showEaster={showEaster} showHalloween={showHalloween} />
                        </div>
                }
            }
        })()}
    </div>
}
export default Header