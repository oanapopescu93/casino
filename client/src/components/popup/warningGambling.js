import { translate } from "../../translations/translate"
import warning_gambling_01 from "../../img/warningGambling/debt.png"
import warning_gambling_02 from "../../img/warningGambling/self-deception.png"
import warning_gambling_03 from "../../img/warningGambling/bill.png"
import warning_gambling_04 from "../../img/warningGambling/hourglass.png"
import warning_gambling_05 from "../../img/warningGambling/angry.png"
import warning_gambling_06 from "../../img/warningGambling/scale.png"

function WarningGambling(props){
    const { settings } = props
    const { lang } = settings

    return <div className="warningGambling_container">        
        <div className="warningGambling">
            <div className="warningGambling_box">                
                <img src={warning_gambling_01}  alt="warning_gambling_01" />
                <p>{translate({lang, info: "warning_gambling_01"})}</p>
            </div>
            <div className="warningGambling_box">                
                <img src={warning_gambling_02}  alt="warning_gambling_02" />
                <p>{translate({lang, info: "warning_gambling_02"})}</p>
            </div>
            <div className="warningGambling_box">                
                <img src={warning_gambling_03}  alt="warning_gambling_03" />
                <p>{translate({lang, info: "warning_gambling_03"})}</p>
            </div>
            <div className="warningGambling_box">                
                <img src={warning_gambling_04}  alt="warning_gambling_04" />
                <p>{translate({lang, info: "warning_gambling_04"})}</p>
            </div>
            <div className="warningGambling_box">                
                <img src={warning_gambling_05}  alt="warning_gambling_05" />
                <p>{translate({lang, info: "warning_gambling_05"})}</p>
            </div>
            <div className="warningGambling_box">                
                <img src={warning_gambling_06}  alt="warning_gambling_06" />
                <p>{translate({lang, info: "warning_gambling_06"})}</p>
            </div>
        </div>
        <h4><b>{translate({lang, info: "responsible_gamble_request"})}</b></h4>
    </div>
}
export default WarningGambling