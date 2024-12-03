import React from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { translate } from '../../../../translations/translate'

function BlackjackButtons(props){
	const {settings, handleBack} = props
	const {lang} = settings	

    return <div className="button_action_group blackjack_buttons_container">
        <div className="tooltip">
            <Button 
                type="button"
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>handleBack()}
            ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
            <span className="tooltiptext">{translate({lang: lang, info: "back"})}</span>
        </div>
    </div>
}

export default BlackjackButtons