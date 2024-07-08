import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import Footer from '../../partials/footer'
import Salon from '../../salon/salon'
import Cookies from '../../partials/cookies'
import { changeCookies } from '../../../reducers/settings'
import Market from '../../games/pages/market/market'
import Dashboard from '../../games/pages/dashboard/dashboard'
import Panel from '../../games/sidebar/panel'
import OtherPages from '../otherPages'
import ButtonDonation from '../donation/buttonDonation'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import Header from '../../partials/header'
import { getData, postData } from '../../../utils/utils'
import { translate } from '../../../translations/translate'
import { changePopup } from '../../../reducers/popup'
import { orderAdd } from '../../../reducers/order'
import { cartRemoveAll } from '../../../reducers/cart'

function Home(props) {
    const {home, page, user, cookies, currency, exchange_rates} = props
    let dispatch = useDispatch()
    
    function handleCookiesClick(){
        dispatch(changeCookies())
    }
    function handleDonationClick(){
        dispatch(changePage('Donation'))
    } 

    function handleExit(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    useEffect(() => {  
        checkPaypalPaymentSuccess()
        checkPaypalPaymentCancel()
    }, [])

    const checkPaypalPaymentSuccess = async () => {
        const url = new URL(window.location.href)
        let paymentId = url.searchParams.get('paymentId')
        let payerId = url.searchParams.get('PayerID')

        if(paymentId && payerId){
            postData('/api/paypal/success', {paymentId, payerId}).then((data)=>{
                if(data.payload && data.result === "success"){
                    let details = {
                        method: "paypal",
                        user_uid: user.uuid,
                        payment_id: data.payload.id,
                        customer_id: data.payload.payer.payer_info.payer_id,
                        order_date: data.payload.create_time,
                        amount: parseFloat(data.payload.transactions[0].amount.total),  
                        payment_method: data.payload.payer.payment_method,
                        status: data.payload.state,
                        country: data.payload.payer.payer_info.country_code,
                        email: data.payload.payer.payer_info.email,
                        description: data.payload.transactions[0].description,
                        currency: data.payload.transactions[0].amount.currency,
                        currencyExchange: currency,
                        items: data.payload.transactions[0].item_list.items,
                        exchange_rates: exchange_rates             
                    }
                    let payload = {
                        open: true,
                        template: "paymentSuccess",
                        title: translate({lang: props.lang, info: "payment_success"}),
                        data: details,
                        size: 'md',
                    }
                    dispatch(changePopup(payload)) //show success popup
                    dispatch(cartRemoveAll()) //remove all from cart
                    dispatch(orderAdd(details)) // add payment to order list
                } else {
                    showError(data)
                }
            })
        }
    }
    const checkPaypalPaymentCancel = async () => {
        const url = new URL(window.location.href)
        let token = url.searchParams.get('token')

        postData('/api/paypal/cancel', {token}).then((data)=>{
            if(data && data.result === "cancel"){
                let payload = {
                    open: true,
                    template: "paymentCancel",
                    title: translate({lang: props.lang, info: "payment_cancel"}),
                    data: translate({lang: props.lang, info: "payment_cancel_text"}),
                    size: 'sm',
                }
                dispatch(changePopup(payload))
            }
        })
    }

    function showError(data={}){
        let payload = {
            open: true,
            template: "error",
            title: translate({lang: props.lang, info: "error"}),
            data: translate({lang: props.lang, info: typeof data.payload === "string" ? data.payload : "error_charge"}),
            size: 'sm',
        }
        dispatch(changePopup(payload))
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
                                    <Header template="page" details={page} lang={props.lang} />
                                    <Dashboard {...props} handleHandleExit={()=>handleExit()}/>
                                </div>
                                <Panel {...props} />
                            </>
                        case "market":
                            return <>
                                <div className="content_wrap">
                                    <Header template="page" details={page} lang={props.lang} />
                                    <Market {...props} handleHandleExit={()=>handleExit()}/>
                                </div>
                                <Panel {...props} />
                            </>
                        default:
                            return <Salon {...props} user={user} home={home} page={page} />
                    }
                default:
                    return <Salon {...props} user={user} home={home} page={page} />
            }
        })()}
        {cookies !== '1' ? <Cookies lang={props.lang} cookiesClick={()=>handleCookiesClick()} /> : null}
        <ButtonDonation handleDonationClick={()=>handleDonationClick()}/>
        <Footer lang={props.lang} />
    </div>
}

export default Home