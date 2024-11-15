import React, {useEffect, useState} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { getCookie, handleChangeTheme, isEmpty, postData, setCookie } from '../../utils/utils'
import Popup from '../popup/popup'
import Sign from '../sign/sign'
import { bringPayload } from '../../reducers/home'
import Splash from '../partials/splashScreen'
import Loader from '../partials/loader'
import {randomIntFromInterval} from '../../utils/utils'
import { checkWinterMonths, checkOccasion } from '../../utils/special_occasions'
import Snowflakes from '../partials/special_occasions/winter/snowflakes'
import Lights from '../partials/special_occasions/christmas/lights'
import RouterComponent from './routes/router'
import VerifyEmail from './routes/verifyEmail'

function Page(props) {    
    let home = useSelector(state => state.home)
    let user = useSelector(state => state.auth.user)
    let page = useSelector(state => state.page)
    let settings = useSelector(state => state.settings)

    const [loaded, setLoaded] = useState(false)
    const [progressNumber, setProgressNumber] = useState(0)     
    const [showWinter, setShowWinter] = useState(false)
	const [showChristmas, setShowChristmas] = useState(false)
    const [exchangeRates, setExchangeRates] = useState(null)
    const [verifyEmail, setVerifyEmail] = useState(1)
    const verifyEmailTexts = {
        1: "verifying",
        2: "no_token",
        3: "error_during_verification",
        4: "invalid_expired_token",
        5: "email_verify_success",
        6: "email_already_verified"
    }

    let uuid = user.uuid ? user.uuid : ''
    let dispatch = useDispatch()

    useEffect(() => {
		dispatch(bringPayload())	
        if(isEmpty(uuid)){
            splash_screen()
        }

        // special occasions
        let winter = checkWinterMonths()
		let christmas = checkOccasion('christmas')
		if(winter){ // will appear only on winter months
			setShowWinter(true)
		}
		if(christmas){ // will appear only one week before and after christmas
			setShowChristmas(true)
		}
	}, [])

    function splash_screen(){	
		setTimeout(()=>{
			progress_move(200, 1000)
		}, 500)
	}

    function progress_move(progress_frame, progress_timeout){
        let width = 0
		let id = setInterval(frame, progress_frame)
		function frame() {
            let random = randomIntFromInterval(1, 20)	
            width = width + random
            if (width >= 100){
                setProgressNumber(100)
                clearInterval(id)
                setTimeout(()=>{
                    setLoaded(true) //comment this to observe the splash screen
                }, progress_timeout)
            } else {
                setProgressNumber(width)
            }
        }
    }

    useEffect(() => {  
        let theme = settings.theme
        handleChangeTheme(theme)
    }, [settings.theme])

    useEffect(() => {  
        getExchangeRates()
    }, [])

    function getExchangeRates(){
        //the exchange rates will be updated once per day when the user logs in the morning, for the rest we will use cookies
        try {
            let exchange_rates = getCookie("casino_exchange_rates")            
            if (isEmpty(exchange_rates)){
                try {
                    postData('/api/exchange_rates', {}).then((res)=>{
                        const jsonString = JSON.stringify(res.conversion_rates)
                        setCookie('casino_exchange_rates', jsonString)
                        setExchangeRates(JSON.parse(jsonString))
                    })                    
                } catch (error) {
                    console.error("exchange_rates-error01", error)
                }
            } else {
                try {
                    setExchangeRates(JSON.parse(exchange_rates))
                } catch (error) {
                    console.error("exchange_rates-error02", exchange_rates, error)
                }
            }
        } catch (error) {
            console.error("exchange_rates-error03", error)
        }
    }

    useEffect(() => {         
        checkVerifyEmail()
    }, [])

    const checkVerifyEmail = async () => {        
        //http://localhost:8088/verify-email?token=afc9eb21d1e9a37b77fee017c47924480e904d17    

        if(window.location.pathname.includes('/verify-email')){
            const url = new URL(window.location.href)
            let token = url.searchParams.get('token')             
            if(token){
                setVerifyEmail(1)
                postData('/api/verify-email', {token}).then((data)=>{
                    if(data && data.send){
                        setVerifyEmail(data.send)
                    } else {
                        setVerifyEmail(3)
                    }
                }).catch((error) => {
                    console.error('Error:', error)
                })
            } else {
                setVerifyEmail(0)
            }
        } else {
            setVerifyEmail(0)
        }       
    }

    return <>
        {(() => {
            if(verifyEmail > 0){
                return <VerifyEmail {...props} settings={settings} verifyEmail={verifyEmail} verifyEmailTexts={verifyEmailTexts}/>
            } else {
                if(isEmpty(uuid)){
                    if(loaded){
                        return <Sign {...props} settings={settings}/>
                    } else {
                        return <Splash {...props} settings={settings} progressNumber={progressNumber} />
                    }
                } else {
                    if(home.loaded){
                        return <RouterComponent 
                            {...props} 
                            home={home} 
                            page={page} 
                            user={user} 
                            settings={settings}
                            exchange_rates={exchangeRates} 
                        />
                    } else {
                        return <Loader lang={settings.lang} theme={settings.theme}/>
                    }
                }
            }
            
        })()} 
        {(() => {
            if((isEmpty(uuid) && loaded) || (!isEmpty(uuid) && home.loaded)){ //this is only for Sign or Home
                return <>
                    {showWinter ? <Snowflakes /> : null}
                    {showChristmas ? <Lights /> : null}
                </>
            } else {
                return null
            }
        })()} 
        <Popup {...props} home={home} settings={settings} exchange_rates={exchangeRates}/>
    </>
}

export default Page