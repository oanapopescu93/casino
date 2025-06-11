import React from 'react'
import { translate } from "../../translations/translate"
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCarrot } from '@fortawesome/free-solid-svg-icons'
import Spinner from '../partials/spinner'

function Streak(props){    
    const {settings, data, user, sending, streakClainPrize} = props
    const {lang} = settings
    let streak = data.streak
    let prize = data.prize
    let streakPeriod = Array.from({length: 10}, (_, i) => i + 1)

    return <div id="streak" className="streak">
        {prize > 0 ? <>
            <h3>{translate({lang, info: "prize"})}: <span>{prize}</span> <FontAwesomeIcon icon={faCarrot} /></h3>
            <Button type="button" id="streak_clain_prize" className="mybutton button_fullcolor_dark" onClick={()=>streakClainPrize({prize, uuid: user.uuid})}>
                {translate({lang, info: "send"})}
            </Button>
            {sending ? <div className="streakResult"><Spinner size="small" color="black"/></div> : null}
        </> : <>
            <div className="streak_text">
                {translate({lang, info: "streak_prize_text"})}
            </div> 
            <div className="progress_bubble_container">
                {streakPeriod.map((item, i)=>{
                    let active = ""
                    if(streak >= item){
                        active = "active"
                    }
                    return <div key={i} className={"bubble "+active}>{item}</div>
                })}
            </div>
        </>}       
    </div>
}
export default Streak