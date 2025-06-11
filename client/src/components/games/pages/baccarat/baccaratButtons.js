import React from 'react'
import { translate } from '../../../../translations/translate'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPlay, faTrashCan, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'

function BaccaratButtons(props){
    const {settings, startGame, resetGame, gameResults, handleHandleExit} = props
	const {lang} = settings
    
    return <>
        {!gameResults ? <div className="button_action_group baccarat_table_buttons_container">
            <div className="tooltip">
                <Button 
                    type="button"
                    className="mybutton round button_transparent shadow_convex"
                    onClick={()=>startGame()}
                ><FontAwesomeIcon icon={faPlay} /></Button>
                <span className="tooltiptext">{translate({lang, info: "start"})}</span>
            </div>
            <div className="tooltip">
                <Button 
                    type="button"
                    className="mybutton round button_transparent shadow_convex"
                    onClick={()=>resetGame()}
                ><FontAwesomeIcon icon={faTrashCan} /></Button>
                <span className="tooltiptext">{translate({lang, info: "reset"})}</span>
            </div>
            <div className="tooltip">
                <Button 
                    type="button"
                    className="mybutton round button_transparent shadow_convex"
                    onClick={()=>handleHandleExit()}
                ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
                <span className="tooltiptext">{translate({lang, info: "back"})}</span>
            </div>
        </div> : <div className="button_action_group baccarat_game_buttons_container">
            <div className="tooltip">
                <Button 
                    type="button"
                    className="mybutton round button_transparent shadow_convex"
                    onClick={()=>resetGame()}
                ><FontAwesomeIcon icon={faPlay} /></Button>
                <span className="tooltiptext">{translate({lang, info: "start"})}</span>
            </div>
            <div className="tooltip">
                <Button 
                    type="button"
                    className="mybutton round button_transparent shadow_convex"
                    onClick={()=>handleHandleExit()}
                ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
                <span className="tooltiptext">{translate({lang, info: "back"})}</span>
            </div>
        </div>}
    </>
}

export default BaccaratButtons