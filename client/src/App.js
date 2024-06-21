import React, {useEffect} from "react"
import {useSelector} from 'react-redux'

import { io } from 'socket.io-client'

import 'bootstrap/dist/css/bootstrap.min.css'
import "./css/fonts.css"
import "./css/special_occasions.css"
import "./css/style.css"

import Page from "./components/pages/page"

const socket = io()

function App(){
	let lang = useSelector(state => state.settings.lang)
	let date = useSelector(state => state.settings.date)
	let currency = useSelector(state => state.settings.currency)

  	let my_console = function(){
		let oldConsole = null	
		function enable(){
			if(oldConsole == null) return
			window['console']['log'] = oldConsole
			window['console']['warn'] = oldConsole
			window['console']['error'] = oldConsole
		}	
		function disable(){
			oldConsole = console.log
			window['console']['log'] = function(){}
			window['console']['warn'] = function(){}
			window['console']['error'] = function(){}
		}	
		return {enable, disable}
	}()

  	useEffect(() => {
		//my_console.disable()
		socket.connect()		
		return () => {
			socket.disconnect()
		}
	}, [])

  	setInterval(function(){		  
    	socket.emit('heartbeat', { data: "ping" })
  	}, 15000)

	return <Page socket={socket} lang={lang} date={date} currency={currency} />
}

export default App