import React from 'react'
import { translate } from '../../../../translations/translate'
import { Button } from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlay, faCarrot, faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

function RouletteButtons(props){ 
    const {settings, gameStart, openTable, handleHandleExit} = props
    const {lang} = settings
    
    return <div className="button_action_group roulette_buttons_container">
        <div className="tooltip">
            <Button 
                type="button"  
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>gameStart()}
            ><FontAwesomeIcon icon={faPlay} /></Button>
            <span className="tooltiptext">{translate({lang, info: "start"})}</span>
        </div>
        <div className="tooltip">
            <Button 
                type="button"  
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>openTable()}
            ><FontAwesomeIcon icon={faCarrot} /></Button>
            <span className="tooltiptext">{translate({lang, info: "settings"})}</span>
        </div>
        <div className="tooltip">
            <Button 
                type="button" 
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>handleHandleExit()} 					
            ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>	
            <span className="tooltiptext">{translate({lang, info: "back"})}</span>
        </div>	
    </div> 
}

export default RouletteButtons