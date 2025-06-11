import React from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft, faPlay } from '@fortawesome/free-solid-svg-icons'
import { translate } from '../../../../translations/translate'

function BlackjackButtons(props){
	const {settings, gameData, handleReset, handleBack} = props
	const {lang} = settings
    let game_end = gameData?.game_end

    return <>
        {!gameData || !game_end ? <div className="button_action_group blackjack_buttons_container">
            <div className="tooltip">
                <Button 
                    type="button"
                    className="mybutton round button_transparent shadow_convex"
                    onClick={()=>handleBack()}
                ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
                <span className="tooltiptext">{translate({lang, info: "back"})}</span>
            </div>
        </div> : <div className="button_action_group blackjack_buttons_container">
            <div className="tooltip">
                <Button 
                    type="button"
                    className="mybutton round button_transparent shadow_convex"
                    onClick={()=>handleReset()}
                ><FontAwesomeIcon icon={faPlay} /></Button>
                <span className="tooltiptext">{translate({lang, info: "start"})}</span>
            </div>
            <div className="tooltip">
                <Button 
                    type="button"
                    className="mybutton round button_transparent shadow_convex"
                    onClick={()=>handleBack()}
                ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
                <span className="tooltiptext">{translate({lang, info: "back"})}</span>
            </div>
        </div>}
    </>
}

export default BlackjackButtons