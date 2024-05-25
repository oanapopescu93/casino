import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import Footer from '../partials/footer'
import Salon from '../salon/salon'
import Cookies from '../partials/cookies'
import { changeCookies } from '../../reducers/settings'
import { ReactComponent as Bitcoin } from '../../img/icons/bitcoin-love-heart.svg'
import { changePage } from '../../reducers/page'
import Market from '../games/pages/market/market'
import Dashboard from '../games/pages/dashboard/dashboard'
import Panel from '../games/sidebar/panel'
import OtherPages from './otherPages'

function Home(props) {
    const {home, page, user, cookies} = props
    let dispatch = useDispatch()
    
    function handleCookiesClick(){
        dispatch(changeCookies())
    }    

    return <div id="page-container">        
        {(() => {
            switch (page.page) {
                case "About":                    
                case "terms_cond":                    
                case "policy_privacy":                         
                case "Career":
                case "Questions":                    
                case "Contact":                    
                case "Donation":
                case "Cart":                    
                case "Checkout":                    
                case "Order":                    
                case "BuyCarrots":                    
                case "how_to_play":  
                    return <OtherPages {...props}/>                   
                case "Salon":
                    switch (page.game_page) {
                        case "dashboard":
                            return <>
                                <div className="content_wrap">
                                    <Dashboard {...props}></Dashboard>
                                </div>
                                <Panel {...props}></Panel>
                            </>
                        case "market":
                            return <>
                                <div className="content_wrap">
                                    <Market {...props}></Market>
                                </div>
                                <Panel {...props}></Panel>
                            </>
                        default:
                            return <Salon {...props} user={user} home={home} page={page}></Salon>
                    }                    
                default:
                    return <Salon {...props} user={user} home={home} page={page}></Salon>
            }
        })()}        
        {cookies !== '1' ? <Cookies lang={props.lang} cookiesClick={()=>handleCookiesClick()}></Cookies> : null}
        <Donate lang={props.lang}></Donate>
        <Footer lang={props.lang}></Footer>
    </div>
}

function Donate(){
    const dispatch = useDispatch()
    const [open, setOpen] = useState("")

    useEffect(() => {
        setTimeout(function(){
            setOpen("open")
        }, 500)
	}, [])
    
    function handleClick(){        
        dispatch(changePage('Donation'))
    }

	return <div id="donate" className={open} onClick={()=>handleClick()}>
        <Bitcoin></Bitcoin>
    </div>
}

export default Home