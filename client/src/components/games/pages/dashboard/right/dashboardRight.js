import React, {useState} from 'react'
import Cart from './cart'
import Orders from './orders'
import { translate } from '../../../../../translations/translate'
import { useDispatch } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../../../reducers/page'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faCartShopping, faListUl, faStore } from '@fortawesome/free-solid-svg-icons'

function DashboardRight(props){
    const [choice, setChoice] = useState("cart")
    let dispatch = useDispatch()

    function handleClick(e){
        if(e === "market"){
            dispatch(changePage('Salon'))
            dispatch(changeGame(null))
            dispatch(changeGamePage('market'))
        } else {
            setChoice(e)
        }
    }

    return <>
        <div className="dashboard_right_buttons">
            <div className="dashboard_right_list">
                <div className={`dashboard_right_button ${choice === "cart" ? "active" : ""}`} onClick={()=>handleClick("cart")}>
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>{translate({lang: props.lang, info: "cart"})}</span>                    
                </div>
                <div className={`dashboard_right_button ${choice === "orders" ? "active" : ""}`} onClick={()=>handleClick("orders")}>
                    <FontAwesomeIcon icon={faListUl} />
                    <span>{translate({lang: props.lang, info: "orders"})}</span>                    
                </div>
            </div>
            <div className="dashboard_right_market" onClick={()=>handleClick("market")} >
                <FontAwesomeIcon icon={faStore} />
                <span>{translate({lang: props.lang, info: "market"})}</span>                
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