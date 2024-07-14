import React, { useState, useEffect } from 'react'
import { translate } from '../../../../../translations/translate'
import { useDispatch } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../../../reducers/page'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faListUl, faStore, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons'
import { getWindowDimensions } from '../../../../../utils/utils'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import Cart from './cart'
import Orders from './orders'
import Withdrawals from './withdrawals'

function DashboardRight(props){
    const {settings} = props
    const {lang} = settings
    const [choice, setChoice] = useState("cart")
    const [width, setWidth] = useState(getWindowDimensions().width)
    const [title, setTitle] = useState("cart")
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

    function handleResize() {
        setWidth(getWindowDimensions().width)
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize)
            handleResize()
            return () => window.removeEventListener("resize", handleResize)
        }
    }, [])

    function handleSelectChange(e){
        setTitle(e)
        setChoice(e)
    }

    return <>
        {width > 1200 ? <div className="dashboard_right_buttons">
            <div className="dashboard_right_list">
                <div className={`dashboard_right_button ${choice === "cart" ? "active" : ""}`} onClick={()=>handleClick("cart")}>
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>{translate({lang: lang, info: "cart"})}</span>                    
                </div>
                <div className={`dashboard_right_button ${choice === "orders" ? "active" : ""}`} onClick={()=>handleClick("orders")}>
                    <FontAwesomeIcon icon={faListUl} />
                    <span>{translate({lang: lang, info: "orders"})}</span>                    
                </div>
                <div className={`dashboard_right_button ${choice === "withdraw" ? "active" : ""}`} onClick={()=>handleClick("withdraw")}>
                    <FontAwesomeIcon icon={faMoneyBillTransfer} />
                    <span>{translate({lang: lang, info: "withdraw"})}</span>                    
                </div>
            </div>
            <div className="dashboard_right_market" onClick={()=>handleClick("market")} >
                <FontAwesomeIcon icon={faStore} />
                <span>{translate({lang: lang, info: "market"})}</span>                
            </div>
        </div> : <div className="dashboard_right_buttons">
            <div className="dashboard_right_list">
                <DropdownButton title={translate({lang: lang, info: title})} className="shadow_convex" onSelect={handleSelectChange}>
                    <Dropdown.Item eventKey={"cart"}><span>{translate({lang: lang, info: "cart"})}</span></Dropdown.Item>
                    <Dropdown.Item eventKey={"orders"}><span>{translate({lang: lang, info: "orders"})}</span></Dropdown.Item>
                    <Dropdown.Item eventKey={"withdraw"}><span>{translate({lang: lang, info: "withdraw"})}</span></Dropdown.Item>
                </DropdownButton>
            </div>
            <div className="dashboard_right_market" onClick={()=>handleClick("market")} >
                <FontAwesomeIcon icon={faStore} />
                <span>{translate({lang: lang, info: "market"})}</span>                
            </div>            
        </div>}        
        {(() => {
            switch (choice) {
                case "orders":
                    return <div id="dashboard_right_orders" className="dashboard_box shadow_concav">								
                        <Orders {...props} />
                    </div>  
                case "withdraw":
                    return <div id="dashboard_right_orders" className="dashboard_box shadow_concav">								
                        <Withdrawals {...props} />
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