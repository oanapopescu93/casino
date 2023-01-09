import React, { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Route, Switch, BrowserRouter} from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import { getCookie, setCookie} from '../utils'
import HomePage from './homePage'
import NotFound from './other_pages/not_found'
import Language from './partials/language'
import Cookies from './partials/cookies_modal'
import Footer from './partials/footer'
import Popup from './partials/popup'
import Donate from './money/donate'
import socketIOClient from "socket.io-client/dist/socket.io"
import '../css/style.css'
import { popup_info } from '../actions/actions'

const socket = socketIOClient("/")

function Home(props){
	const [cookies, setCookies] = useState(false)
	const [lang, setLang] = useState(getCookie("casino_lang"))
	const [donationInfo, setDonationInfo] = useState(null)
	const dispatch = useDispatch()
	let popupInfo = useSelector(state => state.popup)
	let page = props.page
	let show_loader = props.show
	let open = "open"
    if(show_loader){
        open = ""
    }

	useEffect(() => {
		let casino_cookies = getCookie("casino_cookies")
		if(casino_cookies !== ""){
			setCookies(true)
		}
		if(lang === ''){
			setLang('eng')
		}
		setInterval(function () {		  
			socket.emit('heartbeat', { data: "ping" })
		}, 15000)
		socket.on('server_error', function (text) {
			dispatch(popup_info({title: "Error", text: text, width: 300, fireworks: false}))
			console.log('server_error ', text)
		})
	}, [])

	function lang_change(text){
		setLang(text)
	}	

	function casino_cookies(){
		setCookie("casino_cookies", true)
		setCookies(true)
	}

	function my_donation(donations){
		setDonationInfo(donations)
	}
	
	return (
		<>	
			<div className={"full-height "+open} id={page}>
				<div className="full-height-content">
                    <Container>		
                        <BrowserRouter>					
                            <Switch>
                                <Route exact path="/">
                                    <HomePage lang={lang} socket={socket} donationInfo={donationInfo}></HomePage>
                                </Route>
                                <Route path="*">
                                    <NotFound lang={lang}></NotFound>
                                </Route>
                            </Switch>			
                        </BrowserRouter>
                    </Container>					
				</div>			
			</div>
			{!cookies ? <Cookies casino_cookies={casino_cookies} lang={lang}></Cookies>  : null}
			<Language lang_change={lang_change}></Language>
			<Donate my_donation={my_donation} info={donationInfo} socket={socket}></Donate>
			{popupInfo ? <Popup lang={lang} data={popupInfo}></Popup> : null}
			<Footer lang={lang} socket={socket}></Footer>
		</>
	)
}

export default Home