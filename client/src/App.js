import React, {useEffect} from "react"

import { io } from 'socket.io-client'

import 'bootstrap/dist/css/bootstrap.min.css'
import "./css/fonts.css"
import "./css/special_occasions.css"
import "./css/style.css"

import Page from "./components/pages/page"

const socket = io()

function App(){
  	let my_console = function(){
		let oldConsole = null	
		function enable(){
			if(oldConsole == null) return
			window['console']['log'] = oldConsole
			window['console']['warn'] = oldConsole
			// window['console']['error'] = oldConsole
		}	
		function disable(){
			oldConsole = console.log
			window['console']['log'] = ()=>{}
			window['console']['warn'] = ()=>{}
			// window['console']['error'] = ()=>{}
		}	
		return {enable, disable}
	}()

  	useEffect(() => {
		my_console.disable()
		socket.connect()		
		return () => {
			socket.disconnect()
		}
	}, [])

  	setInterval(()=>{
    	socket.emit('heartbeat', { data: "ping" })
  	}, 15000)

	return <Page socket={socket}/>
}

export default App