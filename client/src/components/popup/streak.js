import { translate } from "../../translations/translate"
import carrot_img from '../../img/icons/carrot_icon_black.png'

function Streak(props){    
    const {lang, data} = props
    let streak = data.streak
    let prize = data.prize
    let streakPeriod = Array.from({length: 100}, (_, i) => i + 1) // an array with 100 numbers starting from 1

    return <div id="streak" className="streak">
        <div className="progress_bubble_container">
            {streakPeriod.map(function(item, i){
                let active = ""
                if(streak >= item){
                    active = "active"
                }
                return <div key={i} className={"bubble "+active}>{item}</div>
            })}     
        </div>
        <div className="streak_text">
            {prize>0 ? <p>{translate({lang: lang, info: "prize"})}: <span>{prize}</span><img alt="carrot_img" className="currency_img" src={carrot_img}/></p> : null}
        </div> 
  </div>
}
export default Streak