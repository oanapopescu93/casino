import React, {useState} from 'react'
import Cart from './cart'
import Orders from './orders'
import { translate } from '../../../../../translations/translate'

function DashboardRight(props){
    const [choice, setChoice] = useState("cart")
    function handleClick(e){
        setChoice(e)
    }
    return <>
        <div className="dashboard_right_buttons">
            <div className={`dashboard_right_button ${choice === "cart" ? "active" : ""}`}  onClick={()=>handleClick("cart")}>
                {translate({lang: props.lang, info: "cart"})}
            </div>
            <div className={`dashboard_right_button ${choice === "orders" ? "active" : ""}`}  onClick={()=>handleClick("orders")}>
                {translate({lang: props.lang, info: "orders"})}
            </div>
        </div>
        {(() => {
            switch (choice) {
                case "orders":
                    return <div id="dashboard_right_orders" className="dashboard_box shadow_concav">								
                        <Orders {...props} />
                    </div>                
                case "cart":
                default:
                    return <div id="dashboard_right_cart" className="dashboard_box shadow_concav">								
                        <Cart {...props} />
                    </div>
            }
        })()}
    </>
}
export default DashboardRight