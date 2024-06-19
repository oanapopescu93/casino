import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import Footer from '../partials/footer'
import Salon from '../salon/salon'
import Cookies from '../partials/cookies'
import { changeCookies } from '../../reducers/settings'
import Market from '../games/pages/market/market'
import Dashboard from '../games/pages/dashboard/dashboard'
import Panel from '../games/sidebar/panel'
import OtherPages from './otherPages'
import ButtonDonation from './donation/buttonDonation'
import { changePage } from '../../reducers/page'
import { postData } from '../../utils/utils'
import { translate } from '../../translations/translate'
import { changePopup } from '../../reducers/popup'

function Home(props) {
    const {home, page, user, cookies} = props
    let dispatch = useDispatch()
    
    function handleCookiesClick(){
        dispatch(changeCookies())
    }
    function handleDonationClick(){        
        dispatch(changePage('Donation'))
    } 
    
    useEffect(() => {  
        checkPaypalPaymentStatus()
    }, [])

    const checkPaypalPaymentStatus = async () => {
        const url = new URL(window.location.href)
        let paymentId = url.searchParams.get('paymentId')
        let payerId = url.searchParams.get('PayerID')

        if(paymentId && payerId){
            postData('/api/paypal/success', {paymentId, payerId}).then((data)=>{ //test --> /api/paypal/success?paymentId=oaie&PayerID=porc
                if (data) {                
                    if (data.result === "error") {
                        console.error('checkPaypalPaymentStatus--> ', data)
                        let payload = {
                            open: true,
                            template: "error",
                            title: translate({lang: props.lang, info: "error"}),
                            data: translate({lang: props.lang, info: "error_charge"})
                        }
                        dispatch(changePopup(payload))
                    } else {                    
                        console.log('checkPaypalPaymentStatus--> ', data)
                        let payload = {
                            open: true,
                            template: "success",
                            title: translate({lang: props.lang, info: "payment_success"}),
                            data: translate({lang: props.lang, info: "payment_success_text"})
                        }
                        dispatch(changePopup(payload))
                    }
                }
            })
        }        
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
        <ButtonDonation handleDonationClick={()=>handleDonationClick()}/>
        <Footer lang={props.lang}></Footer>
    </div>
}

export default Home