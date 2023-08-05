import React, {useEffect, useState} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { isEmpty } from '../../utils/utils'
import Popup from '../popup/popup'
import Sign from '../sign/sign'
import Home from './home'
import { bringPayload } from '../../reducers/home'
import Splash from '../partials/splashScreen'
import Loader from '../partials/loader'
import {randomIntFromInterval} from '../../utils/utils'
import { checkWinterMonths, checkOccasion } from '../../utils/special_occasions'
import Snowflakes from '../partials/special_occasions/winter/snowflakes'
import Lights from '../partials/special_occasions/christmas/lights'

function Page(props) {
    let home = useSelector(state => state.home)
    let user = useSelector(state => state.auth.user)
    let page = useSelector(state => state.page)
    let cookies = useSelector(state => state.settings.cookies)
    let uuid = user.uuid ? user.uuid : ''
    const [loaded, setLoaded] = useState(false)
    const [progressNumber, setProgressNumber] = useState(0)
    let dispatch = useDispatch() 
    const [showWinter, setShowWinter] = useState(false)
	const [showChristmas, setShowChristmas] = useState(false)   

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
		setTimeout(function(){
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
                setTimeout(function(){
                    setLoaded(true) //comment this to observe the splash screen
                }, progress_timeout)
            } else {
                setProgressNumber(width)
            }
        }
    }   

    return <>
        {(() => {
            if(isEmpty(uuid)){
                if(loaded){
                    return <Sign {...props}></Sign>
                } else {
                    return <Splash {...props} progressNumber={progressNumber}></Splash>
                }                
            } else {
                if(home.loaded){              
                    return <Home {...props} home={home} page={page} user={user} cookies={cookies}></Home>
                } else {
                    return <Loader></Loader>
                }
            }
        })()} 
        {(() => {
            if((isEmpty(uuid) && loaded) || (!isEmpty(uuid) && home.loaded)){ //this is only for Sign or Home
                return <>
                    {showWinter ? <Snowflakes></Snowflakes> : null}
                    {showChristmas ? <Lights></Lights> : null}
                </>
            } else {
                return null
            }
        })()} 
        <Popup {...props} home={home}></Popup>
    </>
}

export default Page