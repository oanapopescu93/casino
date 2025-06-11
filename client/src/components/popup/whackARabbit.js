import { Button } from "react-bootstrap"
import { translate } from "../../translations/translate"
import whack_a_rabbit_icon_black from '../../img/whack_a_rabbit/whack_a_rabbit_icon_black.png'

function WhackARabbit(props){
    const {settings} = props
    const {lang} = settings   
    return <div className="whack_a_rabbit_popup">
        <img id="whack_a_rabbit_icon" alt="whack_a_rabbit_icon" src={whack_a_rabbit_icon_black} />
        <p>{translate({lang, info: "play_whack_a_rabbit"})}</p>
        <Button 
            type="button" 
            className="mybutton round button_fullcolor_dark shadow_convex"
            onClick={()=>{props.handleClick()}}
        >{translate({lang, info: "play"})}</Button> 
    </div>
}
export default WhackARabbit