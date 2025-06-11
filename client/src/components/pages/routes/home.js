import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'

import { changeCookies } from '../../../reducers/settings'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { changePopup } from '../../../reducers/popup'
import { orderAdd } from '../../../reducers/order'
import { cartRemoveAll } from '../../../reducers/cart'

import Salon from '../../salon/salon'
import Withdraw from '../withdraw/withdraw'
import Header from '../../partials/header'
import Cookies from '../../partials/cookies'
import Footer from '../../partials/footer'
import Market from '../../games/pages/market/market'
import Dashboard from '../../games/pages/dashboard/dashboard'
import Panel from '../../games/sidebar/panel'
import OtherPages from '../otherPages'
import ButtonDonation from '../donation/buttonDonation'

import { getCarrotsFromProducts, isEmpty, postData } from '../../../utils/utils'
import { translate } from '../../../translations/translate'
import { updateMoney } from '../../../reducers/auth'

function Home(props) {
    const {home, page, user, settings, exchange_rates, socket} = props
    const {lang, currency, theme, cookies} = settings
    let dispatch = useDispatch()
    
    function handleCookiesClick(){
        dispatch(changeCookies())
        handleWhackARabbit()
    }
    function handleWhackARabbit(){
        if(!isEmpty(user.logs) && parseInt(user.logs) == 0){            
            let payload = {
                open: true,
                template: "whack_a_rabbit",
                title: null,
                size: 'sm',
            }
            dispatch(changePopup(payload))
        }
    }
    function handleDonationClick(){
        dispatch(changePage('Donation'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    } 

    function handleExit(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    useEffect(() => { 
        // handleWhackARabbit() //test Whack a Rabbit
        checkPaypalPaymentSuccess()
        checkPaypalPaymentCancel()
    }, [])

    const checkPaypalPaymentSuccess = async () => {        
        if(window.location.pathname.includes('/api/paypal/success')){
            const url = new URL(window.location.href)
            let paymentId = url.searchParams.get('paymentId')
            let payerId = url.searchParams.get('PayerID')            
            if(paymentId && payerId){
                postData('/api/paypal/success', {paymentId, payerId}).then((data)=>{
                    if(data.payload && data.result === "success"){
                        let details = {
                            method: "paypal",
                            uuid: user.uuid,
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
                            // items: data.payload.transactions[0].item_list.items,
                            items: data.payload.payment_details.products,
                            exchange_rates: exchange_rates,
                            carrots_update: getCarrotsFromProducts(data.payload.payment_details.products)          
                        }
                        socket.emit('order_send', details)
                    } else {
                        showError(data)
                    }
                }).catch((error) => {
                    console.error('Error:', error)
                })
            }
        }        
    }
    const checkPaypalPaymentCancel = async () => {
        if(window.location.pathname.includes('/api/paypal/cancel')){
            postData('/api/paypal/cancel', {}).then((data)=>{
                if(data && data.result === "cancel"){
                    let payload = {
                        open: true,
                        template: "paymentCancel",
                        title: translate({lang, info: "payment_cancel"}),
                        data: translate({lang, info: "payment_cancel_text"}),
                        size: 'sm',
                    }
                    dispatch(changePopup(payload))
                }
            })
        }        
    }

    useEffect(() => {
		const handleOrderRead = (details)=>{
            if(details && details.error){
                console.error(details)
                return
            }
            
            let payload = {
                open: true,
                template: "paymentSuccess",
                title: translate({lang, info: "payment_success"}),
                data: details,
                size: 'md',
            } 

            //go back to Salon
            dispatch(changePage('Salon'))
            dispatch(changeGame(null))
            dispatch(changeGamePage(null))

            dispatch(changePopup(payload)) //show success popup
            dispatch(cartRemoveAll()) //remove all from cart
            dispatch(orderAdd(details)) // add payment to order list

            // // update redux money
            dispatch(updateMoney(details.money))
        }
		socket.on('order_read', handleOrderRead)
		return () => {
            socket.off('order_read', handleOrderRead)
        }
    }, [socket])

    function showError(data={}){
        let payload = {
            open: true,
            template: "error",
            title: translate({lang, info: "error"}),
            data: translate({lang, info: typeof data.payload === "string" ? data.payload : "error_charge"}),
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
                case "gdpr":  
                    return <OtherPages {...props}/>
                case "Withdraw":
                    return <Withdraw {...props}/>
                case "Salon":
                    switch (page.game_page) {
                        case "dashboard":
                            return <>
                                <div className="content_wrap">
                                    <Header template="page" details={page} lang={lang} theme={theme}/>
                                    <Dashboard {...props} handleHandleExit={()=>handleExit()}/>
                                </div>
                                <Panel {...props} />
                            </>
                        case "market":
                            return <>
                                <div className="content_wrap">
                                    <Header template="page" details={page} lang={lang} theme={theme}/>
                                    <Market {...props} handleHandleExit={()=>handleExit()}/>
                                </div>
                                <Panel {...props} />
                            </>
                        default:
                            return <Salon {...props} user={user} home={home} page={page} settings={settings}/>
                    }
                default:
                    return <Salon {...props} user={user} home={home} page={page} settings={settings}/>
            }
        })()}
        {cookies !== '1' ? <Cookies lang={lang} cookiesClick={()=>handleCookiesClick()} /> : null}
        {!page.game ? <>
            <ButtonDonation handleDonationClick={()=>handleDonationClick()}/>
            <Footer {...props} settings={settings} />
        </> : null}
    </div>
}

export default Home