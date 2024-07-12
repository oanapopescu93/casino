import { translate } from "../../translations/translate"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCarrot } from '@fortawesome/free-solid-svg-icons'

function Streak(props){    
    const {settings, data} = props
    const {lang} = settings
    let streak = data.streak
    let prize = data.prize
    let streakPeriod = Array.from({length: 100}, (_, i) => i + 1) // an array with 100 numbers starting from 1

    return <div id="streak" className="streak">
        <div className="progress_bubble_container">
            {streakPeriod.map((item, i)=>{
                let active = ""
                if(streak >= item){
                    active = "active"
                }
                return <div key={i} className={"bubble "+active}>{item}</div>
            })}
        </div>
        <div className="streak_text">
            {prize>0 ? <p>{translate({lang: lang, info: "prize"})}: <span>{prize}</span> <FontAwesomeIcon icon={faCarrot} /></p> : null}
        </div> 
  </div>
}
export default Streak