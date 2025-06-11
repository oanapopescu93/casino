import React from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPlay, faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'
import { translate } from '../../../../translations/translate'

function PokerButtons(props){
    const {settings, choice, startGame, handleHandleExit } = props
    const {lang} = settings

    return <div className="button_action_group poker_buttons_container">
        {!startGame ? <div className="tooltip">
            <Button 
                type="button"
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>choice({action: 'start', stage: 'start'})}
            ><FontAwesomeIcon icon={faPlay} /></Button>
            <span className="tooltiptext">{translate({lang, info: "start"})}</span>
        </div> : null}        
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

export default PokerButtons