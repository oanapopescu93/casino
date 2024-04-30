import React, {useEffect} from "react"
import {useSelector} from 'react-redux'

import * as io from 'socket.io-client'

import 'bootstrap/dist/css/bootstrap.min.css'
import "./css/fonts.css"
import "./css/special_occasions.css"
import "./css/style.css"

import Page from "./components/pages/page"

const socket = io()

function App() {
	//settings
	let lang = useSelector(state => state.settings.lang)
	let date = useSelector(state => state.settings.date)
	let currency = useSelector(state => state.settings.currency)

  	let my_console = function(){
		let oldConsole = null
		let me = {}
	
		me.enable =  function enable(){
			if(oldConsole == null) return
			window['console']['log'] = oldConsole
			window['console']['warn'] = oldConsole
			window['console']['error'] = oldConsole
		}
	
		me.disable = function disable(){
			oldConsole = console.log
			window['console']['log'] = function() {}
			window['console']['warn'] = function() {}
			window['console']['error'] = function() {}
		}
	
		return me
	}()

  	useEffect(() => {
		//my_console.disable()
		socket.connect()		
		return () => {
			socket.disconnect()
		}  
	}, []) 

  	setInterval(function () {		  
    	socket.emit('heartbeat', { data: "ping" })
  	}, 15000)

	return <Page socket={socket} lang={lang} date={date} currency={currency}></Page>
}

export default App