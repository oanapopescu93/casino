import { Button } from "react-bootstrap"
import { translate } from "../../translations/translate"
import whach_a_rabbit_icon from '../../img/whack_a_rabbit/whach_01_black.png'

function WhackARabbit(props){
    const {settings} = props
    const {lang} = settings   
    return <div className="whack_a_rabbit_popup">
        <img id="whach_a_rabbit_icon" alt="whach_a_rabbit_icon" src={whach_a_rabbit_icon} />
        <p>{translate({lang: lang, info: "play_whack_a_rabbit"})}</p>
        <Button 
            type="button" 
            className="mybutton round button_fullcolor_dark shadow_convex"
            onClick={()=>{props.handleClick()}}
        >{translate({lang: lang, info: "play"})}</Button> 
    </div>
}
export default WhackARabbit